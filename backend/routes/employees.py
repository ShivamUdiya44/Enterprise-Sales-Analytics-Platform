from fastapi import APIRouter
from services.employee_service import (
    get_employee_performance,
    get_employee_trend,
    get_department_performance,
    get_candidate_rankings,
)

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get("/performance")
async def performance(
    department: str | None = None,
    region: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
):
    return get_employee_performance(department, region, start_date, end_date)


@router.get("/performance/{employee_id}/trend")
async def performance_trend(employee_id: str, granularity: str = "monthly"):
    return get_employee_trend(employee_id, granularity)


@router.get("/departments")
async def departments(
    start_date: str | None = None,
    end_date: str | None = None,
):
    return get_department_performance(start_date, end_date)


@router.get("/candidates/ranking")
async def candidate_ranking(
    applied_role: str | None = None,
    department: str | None = None,
    min_score: float | None = None,
):
    return get_candidate_rankings(applied_role, department, min_score)
