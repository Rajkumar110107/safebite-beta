#!/usr/bin/env python3
"""
SafeBite AI - Master Data Engineering Pipeline Orchestrator
Executes all 6 pipeline stages in sequential order:
1. Extract ZIPs -> raw/csv/
2. Discover Tabular CSV/TSVs
3. Analyze Column Schemas & Statistics
4. Generate Dataset Inventory Index
5. Validate Data Quality (Duplicates, Nulls, Anomalies)
6. Generate Markdown Reports in reports/
"""

import os
import sys
import time
import logging
import argparse
from pathlib import Path

# Add scripts directory to path for imports
SCRIPTS_DIR = Path(__file__).resolve().parent
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

import extract_datasets
import discover_datasets
import analyze_schema
import inventory_generator
import dataset_validator
import report_generator

LOG_FORMAT = "%(asctime)s [%(levelname)s] %(name)s - %(message)s"

def setup_logging(log_file):
    logger = logging.getLogger("SafeBite.MasterPipeline")
    logger.setLevel(logging.INFO)
    logger.handlers.clear()
    
    if hasattr(sys.stdout, 'reconfigure'):
        try:
            sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        except Exception:
            pass
            
    c_handler = logging.StreamHandler(sys.stdout)
    c_handler.setFormatter(logging.Formatter(LOG_FORMAT))
    logger.addHandler(c_handler)
    
    if log_file:
        os.makedirs(os.path.dirname(log_file), exist_ok=True)
        f_handler = logging.FileHandler(log_file, encoding='utf-8')
        f_handler.setFormatter(logging.Formatter(LOG_FORMAT))
        logger.addHandler(f_handler)
        
    return logger

def run_pipeline(base_datasets_dir: str = "datasets", force_extract: bool = False):
    base_dir = Path(base_datasets_dir).resolve()
    
    zips_dir = base_dir / "raw" / "zips"
    csv_dir = base_dir / "raw" / "csv"
    metadata_dir = base_dir / "metadata"
    schemas_dir = base_dir / "schemas"
    reports_dir = base_dir / "reports"
    log_file = metadata_dir / "pipeline.log"
    
    logger = setup_logging(log_file)
    logger.info("=========================================================")
    logger.info("  🚀 Starting SafeBite AI Data Engineering Pipeline")
    logger.info("=========================================================")
    
    start_time = time.time()
    
    # STAGE 1: Extract Datasets
    logger.info("\n--- [STAGE 1/6] Extracting Datasets from raw/zips/ ---")
    t0 = time.time()
    extract_datasets.extract_zips(zips_dir, csv_dir, force=force_extract, logger=logger)
    logger.info(f"Stage 1 completed in {time.time() - t0:.2f}s")
    
    # STAGE 2: Discover Datasets
    logger.info("\n--- [STAGE 2/6] Discovering Datasets in raw/csv/ ---")
    t0 = time.time()
    discover_datasets.discover_datasets(csv_dir, metadata_dir, logger=logger)
    logger.info(f"Stage 2 completed in {time.time() - t0:.2f}s")
    
    # STAGE 3: Analyze Schemas
    logger.info("\n--- [STAGE 3/6] Analyzing Schemas & Inferred Types ---")
    t0 = time.time()
    analyze_schema.analyze_and_export_schemas(metadata_dir, schemas_dir, logger=logger)
    logger.info(f"Stage 3 completed in {time.time() - t0:.2f}s")
    
    # STAGE 4: Generate Inventory
    logger.info("\n--- [STAGE 4/6] Generating Inventory Index & Summary ---")
    t0 = time.time()
    inventory_generator.generate_inventory_artifacts(metadata_dir, schemas_dir, logger=logger)
    logger.info(f"Stage 4 completed in {time.time() - t0:.2f}s")
    
    # STAGE 5: Validate Quality
    logger.info("\n--- [STAGE 5/6] Auditing Data Quality & Standardized Schema ---")
    t0 = time.time()
    dataset_validator.validate_datasets(metadata_dir, logger=logger)
    logger.info(f"Stage 5 completed in {time.time() - t0:.2f}s")
    
    # STAGE 6: Generate Reports
    logger.info("\n--- [STAGE 6/6] Compiling Markdown Reports in reports/ ---")
    t0 = time.time()
    report_generator.generate_all_reports(metadata_dir, schemas_dir, reports_dir, logger=logger)
    logger.info(f"Stage 6 completed in {time.time() - t0:.2f}s")
    
    total_time = time.time() - start_time
    logger.info("\n=========================================================")
    logger.info(f"  ✅ SafeBite Pipeline Completed Successfully in {total_time:.2f}s!")
    logger.info(f"  📄 Reports generated in: {reports_dir}")
    logger.info(f"  📝 Log file saved to: {log_file}")
    logger.info("=========================================================")

def main():
    parser = argparse.ArgumentParser(description="SafeBite AI Master Pipeline")
    parser.add_argument("--datasets-dir", default="datasets", help="Root datasets folder path")
    parser.add_argument("--force-extract", action="store_true", help="Force re-extraction of ZIP archives")
    
    args = parser.parse_args()
    run_pipeline(base_datasets_dir=args.datasets_dir, force_extract=args.force_extract)

if __name__ == "__main__":
    main()
