from fastapi import APIRouter
from services.dashboard_service import (
    get_filter_options,
    get_kpis,
    get_revenue_trend,
    get_categories,
    get_regions,
    get_top_products,
    get_recent_orders,
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/filters")
async def filters():
    return get_filter_options()


@router.get("/kpis")
async def kpis(
    region: str | None = None,
    category: str | None = None,
    product: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
):
    return get_kpis(
        region,
        category,
        product,
        start_date,
        end_date,
    )

@router.get("/revenue-trend")
async def revenue_trend(
    granularity: str = "daily",
    region: str | None = None,
    category: str | None = None,
    product: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
):
    return get_revenue_trend(
        granularity,
        region,
        category,
        product,
        start_date,
        end_date,
    )

@router.get("/categories")
async def categories(
    region: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
):
    return get_categories(
        region,
        start_date,
        end_date,
    )

@router.get("/regions")
async def regions(
    category: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
):
    return get_regions(
        category,
        start_date,
        end_date,
    )

@router.get("/top-products")
async def top_products(
    limit: int = 8,
    region: str | None = None,
    category: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
):
    return get_top_products(
        limit,
        region,
        category,
        start_date,
        end_date,
    )

@router.get("/recent-orders")
async def recent_orders(
    limit: int = 15,
    region: str | None = None,
    category: str | None = None,
    product: str | None = None,
    start_date: str |None = None,
    end_date: str | None = None,
):
    return get_recent_orders(
        limit,
        region,
        category,
        product,
        start_date,
        end_date,
    )