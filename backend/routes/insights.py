from fastapi import APIRouter
from services.insights_service import generate_insights

router = APIRouter(prefix="/insights", tags=["Insights"])


@router.get("")
async def insights(
    region: str | None = None,
    category: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
):
    return generate_insights(region, category, start_date, end_date)
