#!/usr/bin/env python3
"""
SafeBite AI - Dataset Quality Validator
Non-destructively audits datasets for duplicate files, duplicate records,
missing values, numerical anomalies, and generates standard lower_snake_case schema mappings.
Saves validation report metadata to datasets/metadata/validation_results.json.
"""

import os
import sys
import json
import hashlib
import re
import logging
import argparse
import pandas as pd
import numpy as np
from pathlib import Path

LOG_FORMAT = "%(asctime)s [%(levelname)s] %(name)s - %(message)s"

def setup_logging(log_file=None):
    logger = logging.getLogger("SafeBite.Validator")
    logger.setLevel(logging.INFO)
    logger.handlers.clear()
    
    c_handler = logging.StreamHandler(sys.stdout)
    c_handler.setFormatter(logging.Formatter(LOG_FORMAT))
    logger.addHandler(c_handler)
    
    if log_file:
        f_handler = logging.FileHandler(log_file, encoding='utf-8')
        f_handler.setFormatter(logging.Formatter(LOG_FORMAT))
        logger.addHandler(f_handler)
        
    return logger

def compute_file_hash(file_path: Path) -> str:
    """Calculates MD5 hash of a file for duplicate dataset detection."""
    hasher = hashlib.md5()
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(65536), b""):
            hasher.update(chunk)
    return hasher.hexdigest()

def sanitize_column_name(col_name: str) -> str:
    """Converts raw column header to standard lower_snake_case."""
    s = str(col_name).strip()
    s = re.sub(r'[^\w\s]', '_', s) # replace non-alphanumeric with underscore
    s = re.sub(r'\s+', '_', s)     # replace spaces with underscore
    s = re.sub(r'_+', '_', s)     # collapse multiple underscores
    return s.lower().strip('_')

def validate_dataset_file(item: dict, logger: logging.Logger) -> dict:
    file_path = Path(item["absolute_path"])
    encoding = item.get("encoding", "utf-8")
    delimiter = item.get("delimiter", ",")
    
    md5_hash = compute_file_hash(file_path)
    
    val_result = {
        "dataset_id": item["dataset_id"],
        "file_name": item["file_name"],
        "relative_path": item["relative_path"],
        "file_hash_md5": md5_hash,
        "total_rows": item["total_rows"],
        "total_columns": item["total_columns"],
        "duplicate_rows_count": 0,
        "duplicate_rows_pct": 0.0,
        "missing_values_total": 0,
        "empty_columns": [],
        "invalid_value_alerts": [],
        "column_name_standardization": {},
        "quality_score_pct": 100.0
    }
    
    try:
        df = pd.read_csv(file_path, encoding=encoding, sep=delimiter, on_bad_lines='skip', low_memory=False)
        total_records = len(df)
        
        # 1. Duplicate Records
        dup_count = int(df.duplicated().sum())
        dup_pct = round((dup_count / total_records * 100), 2) if total_records > 0 else 0.0
        val_result["duplicate_rows_count"] = dup_count
        val_result["duplicate_rows_pct"] = dup_pct
        
        # 2. Missing Values
        total_cells = df.size
        missing_count = int(df.isnull().sum().sum())
        val_result["missing_values_total"] = missing_count
        val_result["missing_values_pct"] = round((missing_count / total_cells * 100), 2) if total_cells > 0 else 0.0
        
        empty_cols = [col for col in df.columns if df[col].isnull().all()]
        val_result["empty_columns"] = empty_cols
        
        # 3. Invalid Value Alerts & Range Checks
        alerts = []
        for col in df.columns:
            col_lower = col.lower()
            series = df[col]
            
            # Unnamed columns
            if "unnamed" in col_lower:
                alerts.append(f"Column '{col}' is unnamed / index column.")
                
            if pd.api.types.is_numeric_dtype(series):
                # Gas values out of bound check (analog 0-1023 or negative check)
                if any(k in col_lower for k in ["gas", "methane", "mq", "sensor", "raw", "nh3", "co2", "voc"]):
                    neg_count = int((series < 0).sum())
                    if neg_count > 0:
                        alerts.append(f"Gas sensor column '{col}' contains {neg_count} negative value(s).")
                    
                    high_count = int((series > 4096).sum())
                    if high_count > 0:
                        alerts.append(f"Gas sensor column '{col}' contains {high_count} value(s) > 4096 (potential overflow/outlier).")
                        
                # Storage days check
                if any(k in col_lower for k in ["day", "hour", "storage", "time"]):
                    neg_days = int((series < 0).sum())
                    if neg_days > 0:
                        alerts.append(f"Time/Storage column '{col}' contains {neg_days} negative value(s).")
                        
        val_result["invalid_value_alerts"] = alerts
        
        # 4. Standardized Column Names Mapping
        col_map = {}
        for col in df.columns:
            std = sanitize_column_name(col)
            col_map[col] = std
        val_result["column_name_standardization"] = col_map
        
        # 5. Quality Score Penalty Calculation
        penalty = 0.0
        penalty += min(20.0, dup_pct * 0.5)
        penalty += min(30.0, val_result["missing_values_pct"])
        penalty += len(empty_cols) * 10.0
        penalty += len(alerts) * 5.0
        
        val_result["quality_score_pct"] = max(0.0, round(100.0 - penalty, 2))
        
    except Exception as e:
        logger.error(f"Error validating dataset {file_path}: {e}")
        val_result["error"] = str(e)
        val_result["quality_score_pct"] = 0.0
        
    return val_result

def validate_datasets(metadata_dir: Path, logger: logging.Logger = None) -> dict:
    if logger is None:
        logger = setup_logging()
        
    metadata_dir = Path(metadata_dir).resolve()
    inventory_json_path = metadata_dir / "inventory.json"
    
    if not inventory_json_path.exists():
        logger.error(f"Inventory JSON not found at {inventory_json_path}. Run discover_datasets.py first!")
        return {}
        
    with open(inventory_json_path, "r", encoding="utf-8") as f:
        inventory_items = json.load(f)
        
    logger.info(f"Auditing quality for {len(inventory_items)} dataset(s)...")
    
    file_hashes = {}
    duplicate_datasets = []
    dataset_validations = []
    
    for item in inventory_items:
        logger.info(f"Validating dataset: {item['file_name']}")
        v_res = validate_dataset_file(item, logger)
        dataset_validations.append(v_res)
        
        f_hash = v_res["file_hash_md5"]
        if f_hash in file_hashes:
            duplicate_datasets.append({
                "original_file": file_hashes[f_hash]["file_name"],
                "duplicate_file": v_res["file_name"],
                "file_hash_md5": f_hash
            })
        else:
            file_hashes[f_hash] = v_res
            
    summary_validation = {
        "total_datasets_validated": len(inventory_items),
        "duplicate_datasets_count": len(duplicate_datasets),
        "duplicate_datasets": duplicate_datasets,
        "overall_average_quality_score": round(
            sum(v["quality_score_pct"] for v in dataset_validations) / len(dataset_validations), 2
        ) if dataset_validations else 0.0,
        "dataset_results": dataset_validations
    }
    
    val_out_path = metadata_dir / "validation_results.json"
    with open(val_out_path, "w", encoding="utf-8") as f:
        json.dump(summary_validation, f, indent=2)
        
    logger.info(f"Saved validation audit results to {val_out_path.name}")
    return summary_validation

def main():
    parser = argparse.ArgumentParser(description="SafeBite Dataset Quality Validator")
    parser.add_argument("--metadata-dir", default="datasets/metadata", help="Path to metadata directory")
    parser.add_argument("--log-file", default="datasets/metadata/pipeline.log", help="Path to log file")
    
    args = parser.parse_args()
    
    logger = setup_logging(args.log_file)
    logger.info("=== Starting Dataset Quality Audit ===")
    
    validate_datasets(args.metadata_dir, logger=logger)

if __name__ == "__main__":
    main()
