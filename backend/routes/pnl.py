from fastapi import APIRouter
from services.pnl_service import (
    get_pnl_summary,
    get_pnl_trend,
    get_expense_breakdown,
    get_profitability_by_dimension,
)

router = APIRouter(prefix="/pnl", tags=["P&L"])


@router.get("/summary")
async def summary(
    region: str | None = None,
    category: str | None = None,
    department: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
):
    return get_pnl_summary(region, category, department, start_date, end_date)


@router.get("/trend")
async def trend(
    granularity: str = "monthly",
    region: str | None = None,
    category: str | None = None,
    department: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
):
    return get_pnl_trend(granularity, region, category, department, start_date, end_date)


@router.get("/expense-breakdown")
async def expense_breakdown(
    region: str | None = None,
    department: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
):
    return get_expense_breakdown(region, department, start_date, end_date)


@router.get("/profitability")
async def profitability(
    dimension: str = "region",
    start_date: str | None = None,
    end_date: str | None = None,
):
    return get_profitability_by_dimension(dimension, start_date, end_date)
