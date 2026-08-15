import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import pandas as pd

from Database.mongo import sales_collection, expenses_collection, employees_collection, candidates_collection
from services.ingestion_service import ingest_workbook

WORKBOOK_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "sample_business_data.xlsx")


def seed_from_workbook(path=WORKBOOK_PATH):
    if not os.path.exists(path):
        raise SystemExit(
            f"{path} not found — run generate_sample_workbook.py first."
        )

    for collection in (sales_collection, expenses_collection, employees_collection, candidates_collection):
        collection.delete_many({})

    sheets = pd.read_excel(path, sheet_name=None, engine="openpyxl")
    result = ingest_workbook(sheets, dry_run=False)

    for sheet in result["sheets"]:
        print(f"  {sheet['sheet_key']}: inserted {sheet['rows_inserted']} / {sheet['rows_total']} rows"
              f" ({len(sheet['errors'])} errors, {len(sheet['warnings'])} warnings)")
        for err in sheet["errors"][:5]:
            print(f"    ! {err}")

    if result["unmapped_sheets"]:
        print(f"  Unmapped sheets ignored: {result['unmapped_sheets']}")

    print("Seed complete.")


if __name__ == "__main__":
    seed_from_workbook()
