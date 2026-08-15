import hashlib
import json
from dataclasses import dataclass, field
from typing import Any, Literal

import pandas as pd
from pymongo import UpdateOne

from Database.mongo import (
    sales_collection,
    expenses_collection,
    employees_collection,
    candidates_collection,
)

DType = Literal["str", "float", "int", "date", "list_str"]


@dataclass
class ColumnSpec:
    name: str
    aliases: list[str]
    required: bool
    dtype: DType
    default: Any = None


@dataclass
class SheetSpec:
    key: str
    aliases: list[str]
    columns: list[ColumnSpec]
    collection: Any
    key_field: str
    id_prefix: str
    # Fields Mongo upserts match on. Defaults to [key_field] when empty —
    # only needs overriding when no single column uniquely identifies a
    # row (e.g. employees is one row per employee PER PERIOD, so
    # employee_id alone would collide across periods and collapse them).
    dedupe_fields: list = field(default_factory=list)


@dataclass
class SheetValidationResult:
    sheet_key: str
    matched_sheet_name: str
    records: list[dict] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    rows_total: int = 0
    rows_valid: int = 0
    rows_skipped: int = 0


SHEET_SPECS: dict[str, SheetSpec] = {
    "sales": SheetSpec(
        key="sales",
        aliases=["sales", "orders"],
        key_field="order_id",
        id_prefix="ORD",
        collection=sales_collection,
        columns=[
            ColumnSpec("order_id", ["order_id", "orderid", "id"], False, "str"),
            ColumnSpec("date", ["date", "order_date"], True, "date"),
            ColumnSpec("product", ["product", "product_name"], True, "str"),
            ColumnSpec("category", ["category"], True, "str"),
            ColumnSpec("region", ["region"], True, "str"),
            ColumnSpec("qty", ["qty", "quantity", "units"], True, "int"),
            ColumnSpec("unit_price", ["unit_price", "price"], False, "float", 0.0),
            ColumnSpec("revenue", ["revenue", "amount", "total"], True, "float"),
        ],
    ),
    "expenses": SheetSpec(
        key="expenses",
        aliases=["expenses", "costs", "cost"],
        key_field="expense_id",
        id_prefix="EXP",
        collection=expenses_collection,
        columns=[
            ColumnSpec("expense_id", ["expense_id", "id"], False, "str"),
            ColumnSpec("date", ["date"], True, "date"),
            ColumnSpec("category", ["category", "expense_category"], True, "str"),
            ColumnSpec("department", ["department", "dept"], False, "str", None),
            ColumnSpec("region", ["region"], False, "str", None),
            ColumnSpec("description", ["description", "notes"], False, "str", None),
            ColumnSpec("amount", ["amount", "cost"], True, "float"),
        ],
    ),
    "employees": SheetSpec(
        key="employees",
        aliases=["employees", "staff", "performance"],
        key_field="employee_id",
        id_prefix="EMP",
        collection=employees_collection,
        columns=[
            ColumnSpec("employee_id", ["employee_id", "id"], False, "str"),
            ColumnSpec("name", ["name", "employee_name"], True, "str"),
            ColumnSpec("department", ["department", "dept"], True, "str"),
            ColumnSpec("region", ["region"], False, "str", None),
            ColumnSpec("role", ["role", "title"], False, "str", None),
            ColumnSpec("hire_date", ["hire_date"], False, "date", None),
            ColumnSpec("period", ["period", "month"], True, "date"),
            ColumnSpec("revenue_generated", ["revenue_generated", "revenue"], False, "float", 0.0),
            ColumnSpec("units_sold", ["units_sold"], False, "int", 0),
            ColumnSpec("orders_handled", ["orders_handled"], False, "int", 0),
            ColumnSpec("tasks_completed", ["tasks_completed"], False, "int", 0),
            ColumnSpec("status", ["status"], False, "str", "active"),
        ],
        dedupe_fields=["employee_id", "period"],
    ),
    "candidates": SheetSpec(
        key="candidates",
        aliases=["candidates", "applicants", "hiring"],
        key_field="candidate_id",
        id_prefix="CAN",
        collection=candidates_collection,
        columns=[
            ColumnSpec("candidate_id", ["candidate_id", "id"], False, "str"),
            ColumnSpec("name", ["name", "candidate_name"], True, "str"),
            ColumnSpec("applied_role", ["applied_role", "role"], True, "str"),
            ColumnSpec("department", ["department", "dept"], False, "str", None),
            ColumnSpec("years_experience", ["years_experience", "experience"], True, "float"),
            ColumnSpec("skill_tags", ["skill_tags", "skills"], False, "list_str", []),
            ColumnSpec("required_skill_tags", ["required_skill_tags", "required_skills"], False, "list_str", None),
            ColumnSpec("test_score", ["test_score", "score"], False, "float", None),
            ColumnSpec("education_level", ["education_level", "education"], False, "str", None),
            ColumnSpec("expected_salary", ["expected_salary", "salary"], False, "float", None),
            ColumnSpec("application_date", ["application_date"], False, "date", None),
            ColumnSpec("status", ["status"], False, "str", "applied"),
        ],
    ),
}


def _normalize_header(name):
    return str(name).strip().lower().replace(" ", "_").replace("-", "_")


def match_sheet(sheet_name, specs=None):
    specs = specs or list(SHEET_SPECS.values())
    normalized = _normalize_header(sheet_name)

    for spec in specs:
        if normalized in [_normalize_header(a) for a in spec.aliases]:
            return spec

    return None


def _coerce_value(raw, column: ColumnSpec):
    if raw is None or (isinstance(raw, float) and pd.isna(raw)) or raw == "":
        if column.required:
            raise ValueError(f"missing required field '{column.name}'")
        return column.default

    if column.dtype == "str":
        return str(raw).strip()

    if column.dtype == "float":
        return float(raw)

    if column.dtype == "int":
        return int(float(raw))

    if column.dtype == "date":
        ts = pd.to_datetime(raw, utc=True)
        return ts.isoformat()

    if column.dtype == "list_str":
        if isinstance(raw, list):
            return [str(v).strip() for v in raw]
        return [v.strip() for v in str(raw).split(",") if v.strip()]

    return raw


def validate_and_normalize_sheet(df: pd.DataFrame, spec: SheetSpec, matched_sheet_name: str) -> SheetValidationResult:
    result = SheetValidationResult(sheet_key=spec.key, matched_sheet_name=matched_sheet_name)
    result.rows_total = len(df)

    header_map = {}
    for col in df.columns:
        norm = _normalize_header(col)
        for column_spec in spec.columns:
            if norm in [_normalize_header(a) for a in column_spec.aliases]:
                header_map[col] = column_spec.name
                break

    mapped_names = set(header_map.values())
    for column_spec in spec.columns:
        if column_spec.required and column_spec.name not in mapped_names:
            result.errors.append(f"Missing required column '{column_spec.name}' (sheet skipped)")

    if result.errors:
        return result

    unmapped_columns = [c for c in df.columns if c not in header_map]
    for col in unmapped_columns:
        result.warnings.append(f"Unrecognized column '{col}' ignored")

    columns_by_name = {c.name: c for c in spec.columns}

    for idx, row in df.iterrows():
        record = {}
        row_error = None

        for source_col, canonical in header_map.items():
            column_spec = columns_by_name[canonical]
            try:
                record[canonical] = _coerce_value(row[source_col], column_spec)
            except (ValueError, TypeError) as exc:
                row_error = f"Row {idx + 2}: {exc}"
                break

        if row_error:
            result.errors.append(row_error)
            result.rows_skipped += 1
            continue

        for column_spec in spec.columns:
            if column_spec.name not in record:
                record[column_spec.name] = column_spec.default

        if not record.get(spec.key_field):
            # Deterministic, not random: identical row content re-uploaded
            # later must map to the same id so the upsert stays idempotent
            # instead of duplicating the row on every re-upload.
            content = {k: v for k, v in record.items() if k != spec.key_field}
            digest = hashlib.sha1(json.dumps(content, sort_keys=True, default=str).encode()).hexdigest()[:10]
            record[spec.key_field] = f"{spec.id_prefix}-{digest}"

        if "status" in record and not record.get("status"):
            record["status"] = columns_by_name["status"].default

        result.records.append(record)
        result.rows_valid += 1

    return result


def upsert_records(spec: SheetSpec, records: list[dict]) -> int:
    if not records:
        return 0

    dedupe_fields = spec.dedupe_fields or [spec.key_field]

    operations = [
        UpdateOne({field: rec[field] for field in dedupe_fields}, {"$set": rec}, upsert=True)
        for rec in records
    ]

    result = spec.collection.bulk_write(operations)
    return result.upserted_count + result.modified_count


def ingest_workbook(sheets: dict[str, pd.DataFrame], dry_run: bool = False) -> dict:
    specs = list(SHEET_SPECS.values())
    matched_keys = set()
    sheet_results = []

    for sheet_name, df in sheets.items():
        spec = match_sheet(sheet_name, specs)

        if spec is None:
            continue

        matched_keys.add(spec.key)
        validation = validate_and_normalize_sheet(df, spec, sheet_name)

        rows_inserted = 0
        if not dry_run and validation.records:
            rows_inserted = upsert_records(spec, validation.records)

        sheet_results.append({
            "sheet_key": validation.sheet_key,
            "matched_sheet_name": validation.matched_sheet_name,
            "rows_total": validation.rows_total,
            "rows_valid": validation.rows_valid,
            "rows_inserted": rows_inserted,
            "rows_skipped": validation.rows_skipped,
            "errors": validation.errors,
            "warnings": validation.warnings,
        })

    unmapped_sheets = [name for name in sheets.keys() if match_sheet(name, specs) is None]

    return {
        "workbook_valid": all(not r["errors"] for r in sheet_results) if sheet_results else False,
        "sheets": sheet_results,
        "unmapped_sheets": unmapped_sheets,
        "dry_run": dry_run,
    }


def get_schema_reference() -> dict:
    return {
        "sheets": [
            {
                "sheet_key": spec.key,
                "accepted_sheet_names": spec.aliases,
                "columns": [
                    {
                        "name": col.name,
                        "accepted_headers": col.aliases,
                        "required": col.required,
                        "type": col.dtype,
                    }
                    for col in spec.columns
                ],
            }
            for spec in SHEET_SPECS.values()
        ]
    }
