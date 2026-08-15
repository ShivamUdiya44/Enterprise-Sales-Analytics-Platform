import os
from dotenv import load_dotenv
from pymongo import MongoClient
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DATABASE_NAME", "sales_dashboard")

client = MongoClient(MONGO_URI)

db = client[DB_NAME]

sales_collection = db["sales"]
expenses_collection = db["expenses"]
employees_collection = db["employees"]
candidates_collection = db["candidates"]