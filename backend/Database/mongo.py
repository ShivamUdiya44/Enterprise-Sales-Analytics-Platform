import os
from dotenv import load_dotenv
from pymongo import MongoClient
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

db = client["sales_dashboard"]

sales_collection = db["sales"]