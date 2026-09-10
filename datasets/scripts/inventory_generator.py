#!/usr/bin/env python3
"""
SafeBite AI - Inventory Generator Script
Generates comprehensive tabular dataset inventory (datasets/metadata/dataset_inventory.csv)
and structural summary statistics (datasets/metadata/inventory_summary.json).
"""

import os
import sys
import json
import logging
import argparse
import pandas as pd
from pathlib import Path

LOG_FORMAT = "%(asctime)s [%(levelname)s] %(name)s - %(message)s"

def setup_logging(log_file=None):
    logger = logging.getLogger("SafeBite.Inventory")
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

def generate_inventory_artifacts(metadata_dir: Path, schemas_dir: Path, logger: logging.Logger = None):
    if logger is None:
        logger = setup_logging()
        
    metadata_dir = Path(metadata_dir).resolve()
    schemas_dir = Path(schemas_dir).resolve()
    
    inventory_json_path = metadata_dir / "inventory.json"
    if not inventory_json_path.exists():
        logger.error(f"Inventory JSON not found at {inventory_json_path}. Run discover_datasets.py first!")
        return
        
    with open(inventory_json_path, "r", encoding="utf-8") as f:
        inventory_items = json.load(f)
        
    logger.info(f"Generating inventory table for {len(inventory_items)} dataset(s)...")
    
    inventory_rows = []
    total_size_mb = 0.0
    total_cumulative_rows = 0
    all_unique_column_names = set()
    file_formats = {}
    
    for item in inventory_items:
        ds_id = item["dataset_id"]
        schema_file = schemas_dir / f"{ds_id}_schema.json"
        
        num_cols = 0
        cat_cols = 0
        null_cols = 0
        col_names_str = ""
        
        if schema_file.exists():
            with open(schema_file, "r", encoding="utf-8") as sf:
                schema_data = json.load(sf)
                cols_dict = schema_data.get("columns", {})
                
                for c_name, c_info in cols_dict.items():
                    all_unique_column_names.add(c_name.strip().lower())
                    itype = c_info.get("inferred_type", "")
                    if itype in ["integer", "float", "binary_indicator"]:
                        num_cols += 1
                    elif itype in ["categorical", "boolean", "string_text"]:
                        cat_cols += 1
                        
                    if c_info.get("null_count", 0) > 0:
                        null_cols += 1
                        
                col_names_str = ", ".join(list(cols_dict.keys()))
        else:
            col_names_str = ", ".join(item.get("columns", []))
            for col in item.get("columns", []):
                all_unique_column_names.add(col.strip().lower())
                
        file_mb = item.get("file_size_mb", 0.0)
        t_rows = item.get("total_rows", 0)
        ext = item.get("file_extension", ".csv")
        
        total_size_mb += file_mb
        if t_rows > 0:
            total_cumulative_rows += t_rows
            
        file_formats[ext] = file_formats.get(ext, 0) + 1
        
        inventory_rows.append({
            "dataset_id": ds_id,
            "file_name": item["file_name"],
            "relative_path": item["relative_path"],
            "parent_folder": item["parent_folder"],
            "file_size_mb": file_mb,
            "encoding": item.get("encoding", "utf-8"),
            "delimiter": item.get("delimiter", ","),
            "total_rows": t_rows,
            "total_columns": item.get("total_columns", 0),
            "numeric_columns_count": num_cols,
            "categorical_columns_count": cat_cols,
            "columns_with_nulls_count": null_cols,
            "column_names": col_names_str
        })
        
    # Save CSV Inventory
    inventory_df = pd.DataFrame(inventory_rows)
    inventory_csv_path = metadata_dir / "dataset_inventory.csv"
    inventory_df.to_csv(inventory_csv_path, index=False, encoding="utf-8")
    logger.info(f"Saved dataset inventory CSV to {inventory_csv_path.name}")
    
    # Save Summary JSON
    summary_data = {
        "total_datasets_indexed": len(inventory_items),
        "total_storage_mb": round(total_size_mb, 4),
        "total_cumulative_rows": total_cumulative_rows,
        "total_unique_columns_discovered": len(all_unique_column_names),
        "file_format_distribution": file_formats,
        "indexed_dataset_ids": [r["dataset_id"] for r in inventory_rows]
    }
    
    summary_json_path = metadata_dir / "inventory_summary.json"
    with open(summary_json_path, "w", encoding="utf-8") as f:
        json.dump(summary_data, f, indent=2)
    logger.info(f"Saved inventory summary JSON to {summary_json_path.name}")

def main():
    parser = argparse.ArgumentParser(description="SafeBite Inventory Generator")
    parser.add_argument("--metadata-dir", default="datasets/metadata", help="Path to metadata directory")
    parser.add_argument("--schemas-dir", default="datasets/schemas", help="Path to schemas directory")
    parser.add_argument("--log-file", default="datasets/metadata/pipeline.log", help="Path to log file")
    
    args = parser.parse_args()
    
    logger = setup_logging(args.log_file)
    logger.info("=== Starting Inventory Generation ===")
    
    generate_inventory_artifacts(args.metadata_dir, args.schemas_dir, logger=logger)

if __name__ == "__main__":
    main()
