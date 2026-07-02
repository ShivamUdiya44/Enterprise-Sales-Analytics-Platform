import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import pandas as pd
from database import sales_collection

# Read CSV
df = pd.read_csv("data/sales.csv")

# Convert DataFrame to list of dictionaries
records = df.to_dict(orient="records")

# Clear existing data
sales_collection.delete_many({})

# Insert all records
sales_collection.insert_many(records)

print(f"✅ Imported {len(records)} sales records into MongoDB")