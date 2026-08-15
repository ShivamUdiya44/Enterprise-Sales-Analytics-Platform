from dataclasses import dataclass, asdict
from typing import Literal, Optional

from services.dashboard_service import get_kpis, get_categories, get_regions
from services.pnl_service import get_pnl_summary, get_expense_breakdown
from services.employee_service import get_employee_performance, get_candidate_rankings

Severity = Literal["critical", "warning", "positive", "info"]
_SEVERITY_ORDER = {"critical": 0, "warning": 1, "positive": 2, "info": 3}


@dataclass
class Insight:
    severity: Severity
    title: str
    detail: str


# --- Rules -------------------------------------------------------------
# Each rule is a pure function: aggregate(s) in, Insight | None out.
# Thresholds are named constants so they're easy to tune/review.

REVENUE_DECLINE_THRESHOLD = -10
REVENUE_SURGE_THRESHOLD = 15
MARGIN_DROP_THRESHOLD_PTS = -5
MARGIN_GAIN_THRESHOLD_PTS = 5
LOW_REGION_SHARE_PCT = 5
CATEGORY_CONCENTRATION_PCT = 50
EXPENSE_CONCENTRATION_PCT = 40
AOV_SHIFT_THRESHOLD = 20
LOW_PRODUCTIVITY_SCORE = 30
WEAK_CANDIDATE_POOL_SCORE = 50
STRONG_CANDIDATE_SCORE = 90
ORDER_VOLUME_SHIFT_THRESHOLD = 25


def rule_revenue_growth(kpis) -> Optional[Insight]:
    growth = kpis.get("revenue_growth", 0)

    if growth <= REVENUE_DECLINE_THRESHOLD:
        return Insight("critical", "Revenue is declining",
                        f"Revenue fell {abs(growth):.1f}% vs the prior period — investigate the cause before it compounds.")

    if growth >= REVENUE_SURGE_THRESHOLD:
        return Insight("positive", "Revenue is accelerating",
                        f"Revenue grew {growth:.1f}% vs the prior period.")

    return None


def rule_margin_trend(pnl_summary) -> Optional[Insight]:
    delta = pnl_summary.get("margin_delta_pts", 0)

    if delta <= MARGIN_DROP_THRESHOLD_PTS:
        return Insight("critical", "Gross margin is shrinking",
                        f"Margin fell {abs(delta):.1f} pts vs the prior period — costs are outpacing revenue.")

    if delta >= MARGIN_GAIN_THRESHOLD_PTS:
        return Insight("positive", "Gross margin is improving",
                        f"Margin rose {delta:.1f} pts vs the prior period.")

    return None


def rule_top_region(regions) -> Optional[Insight]:
    items = regions.get("items", [])
    if not items:
        return None

    top = items[0]
    return Insight("info", "Top region identified",
                    f"{top['region']} is your top-performing region, contributing {top['share']:.1f}% of revenue.")


def rule_underperforming_region(regions) -> Optional[Insight]:
    items = regions.get("items", [])
    if not items:
        return None

    weakest = items[-1]
    if weakest["share"] < LOW_REGION_SHARE_PCT:
        return Insight("warning", "A region is underperforming",
                        f"{weakest['region']} contributes only {weakest['share']:.1f}% of revenue — worth reviewing.")

    return None


def rule_top_category(categories) -> Optional[Insight]:
    items = categories.get("items", [])
    if not items:
        return None

    total = sum(c["revenue"] for c in items) or 1
    top = items[0]
    share = (top["revenue"] / total) * 100

    return Insight("info", "Category mix is led by one product line",
                    f"{top['category']} leads the mix at {share:.1f}% of revenue.")


def rule_category_concentration(categories) -> Optional[Insight]:
    items = categories.get("items", [])
    if not items:
        return None

    total = sum(c["revenue"] for c in items) or 1
    top = items[0]
    share = (top["revenue"] / total) * 100

    if share > CATEGORY_CONCENTRATION_PCT:
        return Insight("warning", "Revenue is concentrated in one category",
                        f"{top['category']} accounts for {share:.1f}% of revenue — a concentration risk if demand shifts.")

    return None


def rule_expense_concentration(expense_breakdown) -> Optional[Insight]:
    items = expense_breakdown.get("items", [])
    if not items:
        return None

    top = items[0]
    if top["share_pct"] > EXPENSE_CONCENTRATION_PCT:
        return Insight("warning", "Costs are concentrated in one expense category",
                        f"{top['expense_category']} makes up {top['share_pct']:.1f}% of total expenses.")

    return None


def rule_aov_shift(kpis) -> Optional[Insight]:
    # Approximation: change in AOV growth ≈ revenue_growth - orders_growth.
    shift = kpis.get("revenue_growth", 0) - kpis.get("orders_growth", 0)

    if shift <= -AOV_SHIFT_THRESHOLD:
        return Insight("warning", "Average order value is slipping",
                        f"Order volume is outpacing revenue growth by ~{abs(shift):.1f} pts — orders are getting smaller.")

    if shift >= AOV_SHIFT_THRESHOLD:
        return Insight("positive", "Average order value is rising",
                        f"Revenue is outpacing order volume growth by ~{shift:.1f} pts — orders are getting bigger.")

    return None


def rule_order_volume_shift(kpis) -> Optional[Insight]:
    growth = kpis.get("orders_growth", 0)

    if growth <= -ORDER_VOLUME_SHIFT_THRESHOLD:
        return Insight("warning", "Order volume dropped sharply",
                        f"Orders fell {abs(growth):.1f}% vs the prior period.")

    if growth >= ORDER_VOLUME_SHIFT_THRESHOLD:
        return Insight("positive", "Order volume spiked",
                        f"Orders grew {growth:.1f}% vs the prior period.")

    return None


def rule_top_employee(employee_performance) -> Optional[Insight]:
    top = employee_performance.get("top_performers", [])
    if not top:
        return None

    best = top[0]
    return Insight("positive", "A standout performer this period",
                    f"{best['name']} ({best['department']}) is your top performer, with a productivity score of {best['productivity_score']}.")


def rule_bottom_employee(employee_performance) -> Optional[Insight]:
    bottom = employee_performance.get("bottom_performers", [])
    if not bottom:
        return None

    worst = bottom[0]
    if worst["productivity_score"] < LOW_PRODUCTIVITY_SCORE:
        return Insight("warning", "A team member may need support",
                        f"{worst['name']} ({worst['department']}) has a low productivity score of {worst['productivity_score']} this period.")

    return None


def rule_candidate_pool_quality(candidate_rankings) -> Optional[Insight]:
    items = candidate_rankings.get("items", [])
    if not items:
        return None

    scores = [c["composite_score"] for c in items]
    avg_score = sum(scores) / len(scores)

    if avg_score < WEAK_CANDIDATE_POOL_SCORE:
        return Insight("warning", "Candidate pool needs strengthening",
                        f"The average candidate match score is {avg_score:.1f}/100 — consider widening sourcing.")

    strongest = items[0]
    if strongest["composite_score"] >= STRONG_CANDIDATE_SCORE:
        return Insight("positive", "A strong hiring candidate stands out",
                        f"{strongest['name']} scores {strongest['composite_score']}/100 for {strongest['applied_role']} — a strong match.")

    return None


def generate_insights(region=None, category=None, start_date=None, end_date=None) -> dict:
    kpis = get_kpis(region, category, None, start_date, end_date)
    categories = get_categories(region, start_date, end_date)
    regions = get_regions(category, start_date, end_date)
    pnl_summary = get_pnl_summary(region, category, None, start_date, end_date)
    expense_breakdown = get_expense_breakdown(region, None, start_date, end_date)
    employee_performance = get_employee_performance(None, region, start_date, end_date)
    candidate_rankings = get_candidate_rankings(None, None, None)

    candidates = [
        rule_revenue_growth(kpis),
        rule_margin_trend(pnl_summary),
        rule_top_region(regions),
        rule_underperforming_region(regions),
        rule_top_category(categories),
        rule_category_concentration(categories),
        rule_expense_concentration(expense_breakdown),
        rule_aov_shift(kpis),
        rule_order_volume_shift(kpis),
        rule_top_employee(employee_performance),
        rule_bottom_employee(employee_performance),
        rule_candidate_pool_quality(candidate_rankings),
    ]

    insights = [i for i in candidates if i is not None]
    insights.sort(key=lambda i: _SEVERITY_ORDER[i.severity])

    return {"items": [asdict(i) for i in insights]}
