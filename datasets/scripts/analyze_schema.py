#!/usr/bin/env python3
"""
SafeBite AI - Schema Analysis & Comparison Script
Reads datasets from metadata/inventory.json, analyzes data types and stats per column,
exports JSON schemas to datasets/schemas/, and compares column structures across datasets.
"""

import os
import sys
import json
import logging
import argparse
import pandas as pd
import numpy as np
from pathlib import Path

LOG_FORMAT = "%(asctime)s [%(levelname)s] %(name)s - %(message)s"

def setup_logging(log_file=None):
    logger = logging.getLogger("SafeBite.AnalyzeSchema")
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

def infer_column_type(series: pd.Series) -> str:
    """Infers high-level semantic data type for a Pandas series."""
    if pd.api.types.is_numeric_dtype(series):
        if pd.api.types.is_integer_dtype(series):
            if series.nunique() == 2 and set(series.dropna().unique()).issubset({0, 1}):
                return "binary_indicator"
            return "integer"
        return "float"
    elif pd.api.types.is_bool_dtype(series):
        return "boolean"
    elif pd.api.types.is_datetime64_any_dtype(series):
        return "datetime"
    else:
        # Check string heuristics
        non_nulls = series.dropna().astype(str)
        if len(non_nulls) > 0:
            if series.nunique() < 15:
                return "categorical"
        return "string_text"

def analyze_single_dataset(dataset_info: dict, logger: logging.Logger) -> dict:
    """Analyzes schema and column metrics for a single dataset."""
    file_path = Path(dataset_info["absolute_path"])
    encoding = dataset_info.get("encoding", "utf-8")
    delimiter = dataset_info.get("delimiter", ",")
    
    schema_details = {
        "dataset_id": dataset_info["dataset_id"],
        "file_name": dataset_info["file_name"],
        "relative_path": dataset_info["relative_path"],
        "total_rows": dataset_info["total_rows"],
        "total_columns": dataset_info["total_columns"],
        "columns": {}
    }
    
    try:
        df = pd.read_csv(file_path, encoding=encoding, sep=delimiter, on_bad_lines='skip', low_memory=False)
        schema_details["actual_loaded_rows"] = len(df)
        schema_details["actual_loaded_cols"] = len(df.columns)
        
        for col in df.columns:
            series = df[col]
            inferred_type = infer_column_type(series)
            null_count = int(series.isnull().sum())
            total_count = len(series)
            null_pct = round((null_count / total_count * 100), 2) if total_count > 0 else 0.0
            unique_count = int(series.nunique(dropna=True))
            
            # Sample values
            sample_vals = series.dropna().unique()[:5].tolist()
            # Convert non-serializable types to standard python
            sample_vals = [int(v) if isinstance(v, (np.integer, bool)) else float(v) if isinstance(v, np.floating) else str(v) for v in sample_vals]
            
            col_meta = {
                "inferred_type": inferred_type,
                "pandas_dtype": str(series.dtype),
                "null_count": null_count,
                "null_percentage": null_pct,
                "unique_values": unique_count,
                "sample_values": sample_vals
            }
            
            if pd.api.types.is_numeric_dtype(series) and not series.dropna().empty:
                col_meta["min"] = float(series.min()) if pd.notnull(series.min()) else None
                col_meta["max"] = float(series.max()) if pd.notnull(series.max()) else None
                col_meta["mean"] = round(float(series.mean()), 4) if pd.notnull(series.mean()) else None
                col_meta["std"] = round(float(series.std()), 4) if pd.notnull(series.std()) else None
                
            schema_details["columns"][col] = col_meta
            
    except Exception as e:
        logger.error(f"Error loading CSV for schema analysis {file_path}: {e}")
        schema_details["error"] = str(e)
        
    return schema_details

def compare_schemas(schemas: list, logger: logging.Logger) -> dict:
    """Compares column definitions across all datasets to highlight overlaps and variations."""
    comparison = {
        "total_datasets_analyzed": len(schemas),
        "column_frequency": {},
        "shared_columns": [],
        "unique_columns_per_dataset": {},
        "similarity_pairs": []
    }
    
    dataset_cols_map = {}
    
    for s in schemas:
        ds_name = s["file_name"]
        cols = set(s["columns"].keys())
        dataset_cols_map[ds_name] = cols
        comparison["unique_columns_per_dataset"][ds_name] = len(cols)
        
        for c in cols:
            c_clean = c.strip().lower()
            comparison["column_frequency"][c_clean] = comparison["column_frequency"].get(c_clean, 0) + 1
            
    # Shared columns (present in > 1 dataset)
    comparison["shared_columns"] = [col for col, freq in comparison["column_frequency"].items() if freq > 1]
    
    # Compute pairwise Jaccard similarity of column names
    ds_names = list(dataset_cols_map.keys())
    for i in range(len(ds_names)):
        for j in range(i + 1, len(ds_names)):
            ds1, ds2 = ds_names[i], ds_names[j]
            cols1, cols2 = dataset_cols_map[ds1], dataset_cols_map[ds2]
            
            if cols1 and cols2:
                intersection = cols1.intersection(cols2)
                union = cols1.union(cols2)
                sim = round(len(intersection) / len(union), 4) if union else 0.0
                comparison["similarity_pairs"].append({
                    "dataset_1": ds1,
                    "dataset_2": ds2,
                    "shared_column_count": len(intersection),
                    "jaccard_similarity": sim,
                    "shared_column_names": list(intersection)
                })
                
    return comparison

def analyze_and_export_schemas(metadata_dir: Path, schemas_dir: Path, logger: logging.Logger = None) -> list:
    if logger is None:
        logger = setup_logging()
        
    metadata_dir = Path(metadata_dir).resolve()
    schemas_dir = Path(schemas_dir).resolve()
    schemas_dir.mkdir(parents=True, exist_ok=True)
    
    inventory_file = metadata_dir / "inventory.json"
    if not inventory_file.exists():
        logger.error(f"Inventory file not found at {inventory_file}. Run discover_datasets.py first!")
        return []
        
    with open(inventory_file, "r", encoding="utf-8") as f:
        inventory = json.load(f)
        
    logger.info(f"Loaded {len(inventory)} dataset entry/entries from inventory.")
    
    all_schemas = []
    
    for item in inventory:
        ds_id = item["dataset_id"]
        logger.info(f"Analyzing schema for: {item['file_name']}")
        schema = analyze_single_dataset(item, logger)
        all_schemas.append(schema)
        
        # Save individual schema file
        schema_file = schemas_dir / f"{ds_id}_schema.json"
        with open(schema_file, "w", encoding="utf-8") as f:
            json.dump(schema, f, indent=2)
        logger.info(f"Saved schema file: {schema_file.name}")
        
    # Generate schema comparison summary
    comparison_summary = compare_schemas(all_schemas, logger)
    comp_file = schemas_dir / "schema_comparison.json"
    with open(comp_file, "w", encoding="utf-8") as f:
        json.dump(comparison_summary, f, indent=2)
    logger.info(f"Saved schema comparison matrix to {comp_file.name}")
    
    return all_schemas

def main():
    parser = argparse.ArgumentParser(description="SafeBite Schema Analyzer")
    parser.add_argument("--metadata-dir", default="datasets/metadata", help="Path to metadata directory")
    parser.add_argument("--schemas-dir", default="datasets/schemas", help="Path to schemas output directory")
    parser.add_argument("--log-file", default="datasets/metadata/pipeline.log", help="Path to log file")
    
    args = parser.parse_args()
    
    logger = setup_logging(args.log_file)
    logger.info("=== Starting Schema Analysis ===")
    
    analyze_and_export_schemas(args.metadata_dir, args.schemas_dir, logger=logger)

if __name__ == "__main__":
    main()
