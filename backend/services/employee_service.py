from collections import defaultdict

from Database.mongo import employees_collection, candidates_collection
from services.common import bucket_key

# --- Performance analytics -------------------------------------------------

# Weighted composite used purely for ranking active staff within a filtered
# set (min-max normalized against the group), not for hiring decisions.
PRODUCTIVITY_WEIGHTS = {"revenue": 0.6, "orders": 0.2, "tasks": 0.2}


def _query_employees(department=None, region=None, start_date=None, end_date=None, status="active"):
    query = {}

    if status:
        query["status"] = status

    if department and department != "All":
        query["department"] = department

    if region and region != "All":
        query["region"] = region

    if start_date or end_date:
        query["period"] = {}
        if start_date:
            query["period"]["$gte"] = start_date
        if end_date:
            query["period"]["$lte"] = end_date

    return list(employees_collection.find(query, {"_id": 0}))


def get_employee_performance(department=None, region=None, start_date=None, end_date=None):
    rows = _query_employees(department, region, start_date, end_date)

    agg = defaultdict(lambda: {
        "name": "", "department": "", "region": None,
        "revenue_generated": 0.0, "units_sold": 0,
        "orders_handled": 0, "tasks_completed": 0, "periods": 0,
    })

    for row in rows:
        entry = agg[row["employee_id"]]
        entry["name"] = row["name"]
        entry["department"] = row["department"]
        entry["region"] = row.get("region")
        entry["revenue_generated"] += float(row.get("revenue_generated") or 0)
        entry["units_sold"] += int(row.get("units_sold") or 0)
        entry["orders_handled"] += int(row.get("orders_handled") or 0)
        entry["tasks_completed"] += int(row.get("tasks_completed") or 0)
        entry["periods"] += 1

    items = [{"employee_id": key, **value} for key, value in agg.items()]

    max_revenue = max((i["revenue_generated"] for i in items), default=0) or 1
    max_orders = max((i["orders_handled"] for i in items), default=0) or 1
    max_tasks = max((i["tasks_completed"] for i in items), default=0) or 1

    for item in items:
        score = (
            PRODUCTIVITY_WEIGHTS["revenue"] * (item["revenue_generated"] / max_revenue)
            + PRODUCTIVITY_WEIGHTS["orders"] * (item["orders_handled"] / max_orders)
            + PRODUCTIVITY_WEIGHTS["tasks"] * (item["tasks_completed"] / max_tasks)
        )
        item["revenue_generated"] = round(item["revenue_generated"], 2)
        item["productivity_score"] = round(score * 100, 1)

    items.sort(key=lambda x: x["productivity_score"], reverse=True)
    for idx, item in enumerate(items):
        item["rank"] = idx + 1

    return {
        "items": items,
        "top_performers": items[:5],
        "bottom_performers": list(reversed(items[-5:])),
    }


def get_employee_trend(employee_id, granularity="monthly"):
    rows = list(employees_collection.find({"employee_id": employee_id}, {"_id": 0}))

    buckets = defaultdict(lambda: {"revenue_generated": 0.0, "units_sold": 0, "tasks_completed": 0})

    for row in rows:
        key = bucket_key(row["period"], granularity)
        buckets[key]["revenue_generated"] += float(row.get("revenue_generated") or 0)
        buckets[key]["units_sold"] += int(row.get("units_sold") or 0)
        buckets[key]["tasks_completed"] += int(row.get("tasks_completed") or 0)

    series = [
        {"period": key, **{k: (round(v, 2) if isinstance(v, float) else v) for k, v in value.items()}}
        for key, value in sorted(buckets.items())
    ]

    return {"employee_id": employee_id, "granularity": granularity, "series": series}


def get_department_performance(start_date=None, end_date=None):
    rows = _query_employees(start_date=start_date, end_date=end_date)

    agg = defaultdict(lambda: {"revenue": 0.0, "employee_ids": set()})

    for row in rows:
        entry = agg[row["department"]]
        entry["revenue"] += float(row.get("revenue_generated") or 0)
        entry["employee_ids"].add(row["employee_id"])

    items = []
    for department, value in agg.items():
        headcount = len(value["employee_ids"])
        items.append({
            "department": department,
            "headcount": headcount,
            "total_revenue": round(value["revenue"], 2),
            "revenue_per_employee": round(value["revenue"] / headcount, 2) if headcount else 0,
        })

    items.sort(key=lambda x: x["total_revenue"], reverse=True)

    return {"items": items}


# --- Hiring / candidate scoring ---------------------------------------------
# Transparent weighted rubric — deterministic, not ML/AI. Weights and
# thresholds are module-level constants so they're easy to review and tune.

CANDIDATE_SCORE_WEIGHTS = {
    "experience": 0.30,
    "skill_match": 0.35,
    "test_score": 0.25,
    "education": 0.10,
}
EXPERIENCE_CAP_YEARS = 8
EDUCATION_SCORES = {"masters": 1.0, "bachelors": 0.7, "diploma": 0.4, "none": 0.0}
RECOMMENDATION_THRESHOLDS = {"strong_match": 80, "consider": 60}


def score_candidate(candidate):
    experience = min((candidate.get("years_experience") or 0) / EXPERIENCE_CAP_YEARS, 1.0)

    required = candidate.get("required_skill_tags") or []
    skills = {s.lower() for s in (candidate.get("skill_tags") or [])}
    if required:
        required_set = {s.lower() for s in required}
        skill_match = len(skills & required_set) / len(required_set)
    else:
        skill_match = 0.0

    test_score = (candidate.get("test_score") or 0) / 100

    education = EDUCATION_SCORES.get((candidate.get("education_level") or "").strip().lower(), 0.0)

    sub_scores = {
        "experience": round(experience, 3),
        "skill_match": round(skill_match, 3),
        "test_score": round(test_score, 3),
        "education": round(education, 3),
    }

    composite = sum(sub_scores[k] * CANDIDATE_SCORE_WEIGHTS[k] for k in CANDIDATE_SCORE_WEIGHTS) * 100

    return {
        "candidate_id": candidate["candidate_id"],
        "name": candidate["name"],
        "applied_role": candidate["applied_role"],
        "department": candidate.get("department"),
        "years_experience": candidate.get("years_experience"),
        "sub_scores": sub_scores,
        "composite_score": round(composite, 1),
        "weights": CANDIDATE_SCORE_WEIGHTS,
    }


def _recommendation(score):
    if score >= RECOMMENDATION_THRESHOLDS["strong_match"]:
        return "Strong Match"
    if score >= RECOMMENDATION_THRESHOLDS["consider"]:
        return "Consider"
    return "Not Recommended"


def get_candidate_rankings(applied_role=None, department=None, min_score=None):
    query = {"status": {"$in": ["applied", "shortlisted"]}}

    if applied_role and applied_role != "All":
        query["applied_role"] = applied_role

    if department and department != "All":
        query["department"] = department

    candidates = list(candidates_collection.find(query, {"_id": 0}))

    items = []
    for candidate in candidates:
        scored = score_candidate(candidate)
        scored["recommendation"] = _recommendation(scored["composite_score"])
        items.append(scored)

    if min_score is not None:
        items = [item for item in items if item["composite_score"] >= min_score]

    items.sort(key=lambda x: x["composite_score"], reverse=True)
    for idx, item in enumerate(items):
        item["rank"] = idx + 1

    return {"items": items}
