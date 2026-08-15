from io import BytesIO

import pandas as pd
from fastapi import APIRouter, UploadFile, File, HTTPException

from services.ingestion_service import ingest_workbook, get_schema_reference

router = APIRouter(prefix="/upload", tags=["Upload"])


@router.get("/schema")
async def upload_schema():
    return get_schema_reference()


@router.post("/workbook")
async def upload_workbook(file: UploadFile = File(...), dry_run: bool = False):
    if not file.filename.lower().endswith((".xlsx", ".xlsm")):
        raise HTTPException(status_code=400, detail="File must be an .xlsx or .xlsm workbook")

    contents = await file.read()

    try:
        sheets = pd.read_excel(BytesIO(contents), sheet_name=None, engine="openpyxl")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Could not read workbook: {exc}")

    return ingest_workbook(sheets, dry_run=dry_run)
