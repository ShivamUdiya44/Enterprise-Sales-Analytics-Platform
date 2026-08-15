from datetime import datetime, timezone, timedelta


def bucket_key(date_iso, granularity):
    dt = datetime.fromisoformat(date_iso)

    if granularity == "daily":
        return dt.strftime("%Y-%m-%d")

    if granularity == "weekly":
        monday = dt - timedelta(days=dt.weekday())
        return monday.strftime("%Y-W%V (%b %d)")

    if granularity == "monthly":
        return dt.strftime("%Y-%m")

    return dt.strftime("%Y-%m-%d")


def growth_pct(current, previous):
    if not previous:
        return 0
    return ((current - previous) / previous) * 100


def build_date_query(start_date=None, end_date=None):
    query = {}

    if start_date or end_date:
        query["date"] = {}

        if start_date:
            query["date"]["$gte"] = start_date

        if end_date:
            query["date"]["$lte"] = end_date

    return query


def filter_collection(collection, region=None, category=None, product=None, department=None,
                       start_date=None, end_date=None, extra=None):
    query = build_date_query(start_date, end_date)

    if region and region != "All":
        query["region"] = region

    if category and category != "All":
        query["category"] = category

    if product and product != "All":
        query["product"] = product

    if department and department != "All":
        query["department"] = department

    if extra:
        query.update(extra)

    docs = list(collection.find(query, {"_id": 0}))
    return docs


def prior_window(start_date=None, end_date=None, default_days=30):
    """Returns (prev_start_iso, prev_end_iso) for the window immediately
    preceding [start_date, end_date], same length. Falls back to a
    default_days-long window ending now when no dates are supplied."""
    end_dt = datetime.fromisoformat(end_date) if end_date else datetime.now(timezone.utc)
    start_dt = datetime.fromisoformat(start_date) if start_date else end_dt - timedelta(days=default_days)

    delta = end_dt - start_dt
    prev_end_dt = start_dt
    prev_start_dt = start_dt - delta

    return prev_start_dt.isoformat(), prev_end_dt.isoformat()
