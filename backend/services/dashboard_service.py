from Database.mongo import sales_collection
from datetime import datetime, timezone, timedelta
from collections import defaultdict
from services.common import bucket_key, growth_pct

def get_filter_options():
    regions = sorted(sales_collection.distinct("region"))
    categories = sorted(sales_collection.distinct("category"))
    products = sorted(sales_collection.distinct("product"))

    return {
        "regions": ["All"] + regions,
        "categories": ["All"] + categories,
        "products": ["All"] + products,
    }





def filter_orders(region=None, category=None, product=None, start_date=None, end_date=None):
    query = {}

    if region and region != "All":
        query["region"] = region

    if category and category != "All":
        query["category"] = category

    if product and product != "All":
        query["product"] = product

    if start_date or end_date:
        query["date"] = {}

        if start_date:
            query["date"]["$gte"] = start_date

        if end_date:
            query["date"]["$lte"] = end_date

    orders = list(sales_collection.find(query, {"_id": 0}))

    # Normalize database fields for the frontend
    for order in orders:
        if "order_id" in order:
            order["id"] = order.pop("order_id")

    return orders

def get_kpis(
    region=None,
    category=None,
    product=None,
    start_date=None,
    end_date=None,
):
    orders = filter_orders(region, category, product, start_date, end_date)
    

    revenue = sum(float(o["revenue"]) for o in orders)
    n = len(orders)
    units = sum(int(o["qty"]) for o in orders)
    aov = (revenue / n) if n else 0.0

    today = datetime.now(timezone.utc)
    last_30_start = today - timedelta(days=30)
    prev_30_start = today - timedelta(days=60)

    last_30 = [
        o for o in orders
        if datetime.fromisoformat(o["date"]) >= last_30_start
    ]

    prev_30 = [
        o for o in orders
        if prev_30_start <= datetime.fromisoformat(o["date"]) < last_30_start
    ]

    last_rev = sum(float(o["revenue"]) for o in last_30)
    prev_rev = sum(float(o["revenue"]) for o in prev_30)

    rev_growth = growth_pct(last_rev, prev_rev)

    last_ord = len(last_30)
    prev_ord = len(prev_30)

    ord_growth = growth_pct(last_ord, prev_ord)

    return {
        "revenue": round(revenue, 2),
        "orders": n,
        "aov": round(aov, 2),
        "units_sold": units,
        "revenue_growth": round(rev_growth, 2),
        "orders_growth": round(ord_growth, 2),
    }





def get_revenue_trend(
    granularity="daily",
    region=None,
    category=None,
    product=None,
    start_date=None,
    end_date=None,
):
    orders = filter_orders(
        region,
        category,
        product,
        start_date,
        end_date,
    )

    buckets = defaultdict(lambda: {
        "revenue": 0.0,
        "orders": 0
    })

    for order in orders:
        key = bucket_key(order["date"], granularity)

        buckets[key]["revenue"] += float(order["revenue"])
        buckets[key]["orders"] += 1

    series = []

    for key, value in sorted(buckets.items()):
        series.append({
            "period": key,
            "revenue": round(value["revenue"], 2),
            "orders": value["orders"],
        })

    return {
        "granularity": granularity,
        "series": series,
    }


def get_categories(
    region=None,
    start_date=None,
    end_date=None,
):
    orders = filter_orders(
        region=region,
        start_date=start_date,
        end_date=end_date,
    )

    agg = defaultdict(lambda: {
        "revenue": 0.0,
        "orders": 0,
    })

    for order in orders:
        agg[order["category"]]["revenue"] += float(order["revenue"])
        agg[order["category"]]["orders"] += 1

    items = [
        {
            "category": key,
            "revenue": round(value["revenue"], 2),
            "orders": value["orders"],
        }
        for key, value in agg.items()
    ]

    items.sort(key=lambda x: x["revenue"], reverse=True)

    return {
        "items": items
    }


def get_regions(
    category=None,
    start_date=None,
    end_date=None,
):
    orders = filter_orders(
        category=category,
        start_date=start_date,
        end_date=end_date,
    )

    agg = defaultdict(lambda: {
        "revenue": 0.0,
        "orders": 0,
    })

    for order in orders:
        agg[order["region"]]["revenue"] += float(order["revenue"])
        agg[order["region"]]["orders"] += 1

    total = sum(v["revenue"] for v in agg.values()) or 1

    items = [
        {
            "region": key,
            "revenue": round(value["revenue"], 2),
            "orders": value["orders"],
            "share": round((value["revenue"] / total) * 100, 1),
        }
        for key, value in agg.items()
    ]

    items.sort(key=lambda x: x["revenue"], reverse=True)

    return {
        "items": items
    }

def get_top_products(
    limit=8,
    region=None,
    category=None,
    start_date=None,
    end_date=None,
):
    orders = filter_orders(
        region=region,
        category=category,
        start_date=start_date,
        end_date=end_date,
    )

    agg = defaultdict(lambda: {
        "revenue": 0.0,
        "units": 0,
        "category": "",
    })

    for order in orders:
        agg[order["product"]]["revenue"] += float(order["revenue"])
        agg[order["product"]]["units"] += int(order["qty"])
        agg[order["product"]]["category"] = order["category"]

    items = [
        {
            "product": key,
            "revenue": round(value["revenue"], 2),
            "units": value["units"],
            "category": value["category"],
        }
        for key, value in agg.items()
    ]

    items.sort(key=lambda x: x["revenue"], reverse=True)

    return {
        "items": items[:limit]
    }


def get_recent_orders(
    limit=15,
    region=None,
    category=None,
    product=None,
    start_date=None,
    end_date=None,
):
    orders = filter_orders(
        region=region,
        category=category,
        product=product,
        start_date=start_date,
        end_date=end_date,
    )

    orders.sort(
        key=lambda order: datetime.fromisoformat(order["date"]),
        reverse=True,
    )

    return {
        "items": orders[:limit]
    }