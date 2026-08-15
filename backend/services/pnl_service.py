from collections import defaultdict

from Database.mongo import sales_collection, expenses_collection
from services.common import bucket_key, growth_pct, filter_collection, prior_window

# Below this revenue, a margin % is dominated by noise (division by a
# near-zero denominator) rather than a meaningful profitability signal.
MIN_REVENUE_FOR_MARGIN = 1.0


def get_pnl_summary(region=None, category=None, department=None, start_date=None, end_date=None):
    orders = filter_collection(sales_collection, region=region, category=category,
                                start_date=start_date, end_date=end_date)
    expenses = filter_collection(expenses_collection, region=region, department=department,
                                  start_date=start_date, end_date=end_date)

    revenue = sum(float(o["revenue"]) for o in orders)
    expense_total = sum(float(e["amount"]) for e in expenses)
    gross_profit = revenue - expense_total
    margin_pct = (gross_profit / revenue * 100) if revenue else 0

    # A meaningful "prior period" comparison only makes sense when the
    # caller actually bounded the current window; an unbounded (all-time)
    # current query has no fixed length to mirror, so skip the comparison
    # rather than diffing it against an arbitrary default-length window.
    if not start_date and not end_date:
        return {
            "revenue": round(revenue, 2),
            "expenses": round(expense_total, 2),
            "gross_profit": round(gross_profit, 2),
            "margin_pct": round(margin_pct, 2),
            "revenue_growth": 0,
            "profit_growth": 0,
            "margin_delta_pts": 0,
        }

    prev_start, prev_end = prior_window(start_date, end_date)
    prev_orders = filter_collection(sales_collection, region=region, category=category,
                                     start_date=prev_start, end_date=prev_end)
    prev_expenses = filter_collection(expenses_collection, region=region, department=department,
                                       start_date=prev_start, end_date=prev_end)

    prev_revenue = sum(float(o["revenue"]) for o in prev_orders)
    prev_expense_total = sum(float(e["amount"]) for e in prev_expenses)
    prev_profit = prev_revenue - prev_expense_total
    prev_margin = (prev_profit / prev_revenue * 100) if prev_revenue else 0

    return {
        "revenue": round(revenue, 2),
        "expenses": round(expense_total, 2),
        "gross_profit": round(gross_profit, 2),
        "margin_pct": round(margin_pct, 2),
        "revenue_growth": round(growth_pct(revenue, prev_revenue), 2),
        "profit_growth": round(growth_pct(gross_profit, prev_profit), 2),
        "margin_delta_pts": round(margin_pct - prev_margin, 2),
    }


def get_pnl_trend(granularity="monthly", region=None, category=None, department=None,
                   start_date=None, end_date=None):
    orders = filter_collection(sales_collection, region=region, category=category,
                                start_date=start_date, end_date=end_date)
    expenses = filter_collection(expenses_collection, region=region, department=department,
                                  start_date=start_date, end_date=end_date)

    buckets = defaultdict(lambda: {"revenue": 0.0, "expenses": 0.0})

    for order in orders:
        buckets[bucket_key(order["date"], granularity)]["revenue"] += float(order["revenue"])

    for expense in expenses:
        buckets[bucket_key(expense["date"], granularity)]["expenses"] += float(expense["amount"])

    series = []
    for key, value in sorted(buckets.items()):
        profit = value["revenue"] - value["expenses"]
        margin = (profit / value["revenue"] * 100) if value["revenue"] >= MIN_REVENUE_FOR_MARGIN else None
        series.append({
            "period": key,
            "revenue": round(value["revenue"], 2),
            "expenses": round(value["expenses"], 2),
            "profit": round(profit, 2),
            "margin_pct": round(margin, 2) if margin is not None else None,
        })

    return {"granularity": granularity, "series": series}


def get_expense_breakdown(region=None, department=None, start_date=None, end_date=None):
    expenses = filter_collection(expenses_collection, region=region, department=department,
                                  start_date=start_date, end_date=end_date)

    agg = defaultdict(float)
    for expense in expenses:
        agg[expense["category"]] += float(expense["amount"])

    total = sum(agg.values()) or 1

    items = [
        {
            "expense_category": key,
            "amount": round(value, 2),
            "share_pct": round((value / total) * 100, 1),
        }
        for key, value in agg.items()
    ]

    items.sort(key=lambda x: x["amount"], reverse=True)

    return {"items": items}


def get_profitability_by_dimension(dimension="region", start_date=None, end_date=None):
    if dimension not in ("region", "department"):
        raise ValueError("dimension must be 'region' or 'department'")

    if dimension == "region":
        orders = filter_collection(sales_collection, start_date=start_date, end_date=end_date)
        expenses = filter_collection(expenses_collection, start_date=start_date, end_date=end_date)

        revenue_by_key = defaultdict(float)
        for order in orders:
            revenue_by_key[order["region"]] += float(order["revenue"])

        expense_by_key = defaultdict(float)
        for expense in expenses:
            if expense.get("region"):
                expense_by_key[expense["region"]] += float(expense["amount"])

        keys = set(revenue_by_key) | set(expense_by_key)
        items = []
        for key in keys:
            revenue = revenue_by_key.get(key, 0.0)
            expense_total = expense_by_key.get(key, 0.0)
            profit = revenue - expense_total
            margin = (profit / revenue * 100) if revenue >= MIN_REVENUE_FOR_MARGIN else None
            items.append({
                "key": key,
                "revenue": round(revenue, 2),
                "expenses": round(expense_total, 2),
                "profit": round(profit, 2),
                "margin_pct": round(margin, 2) if margin is not None else None,
            })

        items.sort(key=lambda x: x["profit"], reverse=True)
        return {"dimension": "region", "items": items}

    # department: sales has no department field, so this is expense
    # allocation only, not true revenue-minus-cost profitability.
    expenses = filter_collection(expenses_collection, start_date=start_date, end_date=end_date)
    expense_by_key = defaultdict(float)
    for expense in expenses:
        if expense.get("department"):
            expense_by_key[expense["department"]] += float(expense["amount"])

    items = [
        {"key": key, "revenue": None, "expenses": round(value, 2), "profit": None, "margin_pct": None}
        for key, value in expense_by_key.items()
    ]
    items.sort(key=lambda x: x["expenses"], reverse=True)

    return {"dimension": "department", "items": items}
