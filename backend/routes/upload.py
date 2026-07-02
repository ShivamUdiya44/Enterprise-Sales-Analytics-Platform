from fastapi import APIRouter, UploadFile, File
import pandas as pd
from io import BytesIO

router = APIRouter(prefix="/upload", tags=["Upload"])


@router.post("/csv")
async def upload_csv(file: UploadFile = File(...)):
    contents = await file.read()

    df = pd.read_csv(BytesIO(contents))

    return {
        "rows": len(df),
        "columns": list(df.columns),
        "preview": df.head(5).to_dict(orient="records"),
    }