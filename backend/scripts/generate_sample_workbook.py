import random
import sys
import os
from datetime import datetime, timedelta

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import pandas as pd

random.seed(42)

ROOT = os.path.dirname(os.path.dirname(__file__))
SALES_CSV = os.path.join(ROOT, "data", "sales.csv")
OUT_PATH = os.path.join(ROOT, "data", "sample_business_data.xlsx")

REGIONS = ["Delhi", "Indore", "Bhopal", "Kharagpur"]
DEPARTMENTS = ["Sales", "Support", "Ops"]
EXPENSE_CATEGORIES = ["COGS", "Marketing", "Payroll", "Logistics", "Rent", "Other"]

FIRST_NAMES = ["Aarav", "Vihaan", "Ananya", "Diya", "Kabir", "Ishaan", "Meera",
               "Rohan", "Priya", "Aditya", "Sanya", "Karan", "Neha", "Arjun", "Tara"]
LAST_NAMES = ["Sharma", "Verma", "Gupta", "Iyer", "Nair", "Reddy", "Chauhan", "Malhotra"]

ROLES = ["Sales Executive", "Support Specialist", "Operations Analyst", "Regional Manager"]
ROLE_SKILLS = {
    "Sales Executive": ["negotiation", "crm", "cold_calling", "salesforce"],
    "Support Specialist": ["zendesk", "communication", "troubleshooting", "crm"],
    "Operations Analyst": ["excel", "sql", "logistics", "process_improvement"],
    "Regional Manager": ["leadership", "forecasting", "crm", "negotiation"],
}
EDUCATION_LEVELS = ["Masters", "Bachelors", "Diploma", "None"]


def _random_name(used):
    while True:
        name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
        if name not in used:
            used.add(name)
            return name


def build_sales_df():
    return pd.read_csv(SALES_CSV)


def _region_weights(sales_df, floor_share=0.08):
    revenue_by_region = sales_df.groupby("region")["revenue"].sum()
    weights = {r: revenue_by_region.get(r, 0.0) for r in REGIONS}
    total = sum(weights.values()) or 1
    floor = total * floor_share / len(REGIONS)
    return {r: max(v, floor) for r, v in weights.items()}


def _weighted_region(weights):
    regions = list(weights.keys())
    return random.choices(regions, weights=[weights[r] for r in regions], k=1)[0]


def build_expenses_df(start, end, total_revenue, region_weights):
    rows = []
    target_total = total_revenue * 0.68  # lands gross margin ~32%
    weights = {"COGS": 0.45, "Payroll": 0.25, "Marketing": 0.12, "Logistics": 0.1, "Rent": 0.06, "Other": 0.02}
    span_days = (end - start).days

    for category, weight in weights.items():
        category_total = target_total * weight
        n_rows = random.randint(8, 16)
        remaining = category_total

        for i in range(n_rows):
            amount = round(remaining / (n_rows - i) * random.uniform(0.6, 1.4), 2)
            amount = max(amount, 5.0)
            remaining -= amount
            date = start + timedelta(days=random.randint(0, span_days))

            rows.append({
                "date": date.isoformat(),
                "category": category,
                "department": random.choice(DEPARTMENTS),
                "region": _weighted_region(region_weights),
                "description": f"{category} expense",
                "amount": amount,
            })

    return pd.DataFrame(rows)


def build_employees_df(start, end, region_weights):
    used_names = set()
    rows = []
    n_employees = 16
    period_count = 4
    period_len = max((end - start).days // period_count, 7)

    for i in range(n_employees):
        employee_id = f"EMP-{i + 1:03d}"
        name = _random_name(used_names)
        department = random.choice(DEPARTMENTS)
        region = _weighted_region(region_weights)
        role = {"Sales": "Sales Executive", "Support": "Support Specialist", "Ops": "Operations Analyst"}[department]
        hire_date = (start - timedelta(days=random.randint(60, 900))).isoformat()

        base_revenue = random.uniform(2000, 12000) if department == "Sales" else 0
        base_tasks = random.randint(20, 60)

        for p in range(period_count):
            period_date = start + timedelta(days=p * period_len)
            drift = random.uniform(0.7, 1.3)

            rows.append({
                "employee_id": employee_id,
                "name": name,
                "department": department,
                "region": region,
                "role": role,
                "hire_date": hire_date,
                "period": period_date.isoformat(),
                "revenue_generated": round(base_revenue * drift, 2),
                "units_sold": random.randint(0, 40) if department == "Sales" else 0,
                "orders_handled": random.randint(5, 50),
                "tasks_completed": round(base_tasks * drift),
                "status": "active",
            })

    return pd.DataFrame(rows)


def build_candidates_df(start, end):
    used_names = set()
    rows = []

    for i in range(26):
        role = random.choice(ROLES)
        required = ROLE_SKILLS[role]
        # vary how many of the required skills each candidate actually has
        n_match = random.randint(0, len(required))
        skills = random.sample(required, n_match) + random.sample(
            [s for skills in ROLE_SKILLS.values() for s in skills if s not in required],
            k=random.randint(0, 2),
        )

        rows.append({
            "candidate_id": f"CAN-{i + 1:03d}",
            "name": _random_name(used_names),
            "applied_role": role,
            "department": {"Sales Executive": "Sales", "Support Specialist": "Support",
                            "Operations Analyst": "Ops", "Regional Manager": "Sales"}[role],
            "years_experience": round(random.uniform(0, 12), 1),
            "skill_tags": ", ".join(skills),
            "required_skill_tags": ", ".join(required),
            "test_score": round(random.uniform(35, 98), 1),
            "education_level": random.choice(EDUCATION_LEVELS),
            "expected_salary": random.randint(30000, 90000),
            "application_date": (start + timedelta(days=random.randint(0, (end - start).days))).isoformat(),
            "status": "applied",
        })

    return pd.DataFrame(rows)


def main():
    sales_df = build_sales_df()
    start = pd.to_datetime(sales_df["date"], utc=True).min().to_pydatetime()
    end = pd.to_datetime(sales_df["date"], utc=True).max().to_pydatetime()
    total_revenue = sales_df["revenue"].sum()
    region_weights = _region_weights(sales_df)

    expenses_df = build_expenses_df(start, end, total_revenue, region_weights)
    employees_df = build_employees_df(start, end, region_weights)
    candidates_df = build_candidates_df(start, end)

    with pd.ExcelWriter(OUT_PATH, engine="openpyxl") as writer:
        sales_df.to_excel(writer, sheet_name="Sales", index=False)
        expenses_df.to_excel(writer, sheet_name="Expenses", index=False)
        employees_df.to_excel(writer, sheet_name="Employees", index=False)
        candidates_df.to_excel(writer, sheet_name="Candidates", index=False)

    print(f"Wrote sample workbook to {OUT_PATH}")
    print(f"  Sales: {len(sales_df)} rows")
    print(f"  Expenses: {len(expenses_df)} rows")
    print(f"  Employees: {len(employees_df)} rows")
    print(f"  Candidates: {len(candidates_df)} rows")


if __name__ == "__main__":
    main()
