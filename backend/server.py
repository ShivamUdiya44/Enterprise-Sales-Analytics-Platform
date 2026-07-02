from fastapi import FastAPI, APIRouter, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from routes.dashboard import router as dashboard_router
from routes.upload import router as upload_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')


app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ---------------- Routes ----------------

@api_router.get("/")
async def root():
    return {"message": "Sales Dashboard API"}

api_router.include_router(dashboard_router)
app.include_router(api_router)
api_router.include_router(upload_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)




