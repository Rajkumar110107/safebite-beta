#!/usr/bin/env python3
"""
SafeBite AI - Dataset Extraction Script
Detects ZIP files in datasets/raw/zips/ and safely extracts them into datasets/raw/csv/.
"""

import os
import sys
import zipfile
import logging
import argparse
from pathlib import Path

# Configure logging
LOG_FORMAT = "%(asctime)s [%(levelname)s] %(name)s - %(message)s"

def setup_logging(log_file=None):
    logger = logging.getLogger("SafeBite.Extract")
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

def is_safe_path(base_dir: Path, target_path: Path) -> bool:
    """Guards against Zip Slip vulnerabilities by verifying path boundary."""
    try:
        target_path.resolve().relative_to(base_dir.resolve())
        return True
    except ValueError:
        return False

def extract_zips(raw_zips_dir: Path, raw_csv_dir: Path, force: bool = False, logger: logging.Logger = None) -> dict:
    """
    Detects and extracts ZIP files from raw_zips_dir into raw_csv_dir.
    
    Returns:
        dict: Mapping of zip file names to extraction status and file counts.
    """
    if logger is None:
        logger = setup_logging()
        
    raw_zips_dir = Path(raw_zips_dir).resolve()
    raw_csv_dir = Path(raw_csv_dir).resolve()
    
    if not raw_zips_dir.exists():
        logger.warning(f"Zip directory does not exist: {raw_zips_dir}")
        raw_zips_dir.mkdir(parents=True, exist_ok=True)
        
    raw_csv_dir.mkdir(parents=True, exist_ok=True)
    
    zip_files = list(raw_zips_dir.glob("*.zip")) + list(raw_zips_dir.glob("*.ZIP"))
    logger.info(f"Found {len(zip_files)} ZIP file(s) in {raw_zips_dir}")
    
    extraction_results = {}
    
    for zip_path in zip_files:
        dataset_name = zip_path.stem
        extract_target = raw_csv_dir / dataset_name
        
        logger.info(f"Processing archive: {zip_path.name}")
        
        if extract_target.exists() and any(extract_target.iterdir()) and not force:
            logger.info(f"Skipping {zip_path.name} — target folder '{extract_target.name}' already contains files. Use --force to re-extract.")
            extraction_results[zip_path.name] = {
                "status": "skipped",
                "extracted_to": str(extract_target),
                "reason": "already_exists"
            }
            continue
            
        try:
            extract_target.mkdir(parents=True, exist_ok=True)
            extracted_count = 0
            
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                for member in zip_ref.infolist():
                    # Construct destination path
                    target_file = extract_target / member.filename
                    
                    if not is_safe_path(extract_target, target_file):
                        logger.error(f"Security Alert: Unsafe Zip member path blocked: {member.filename}")
                        continue
                        
                    if member.is_dir():
                        target_file.mkdir(parents=True, exist_ok=True)
                    else:
                        target_file.parent.mkdir(parents=True, exist_ok=True)
                        with zip_ref.open(member) as source, open(target_file, "wb") as target:
                            target.write(source.read())
                        extracted_count += 1
                        
            logger.info(f"Successfully extracted {extracted_count} file(s) from {zip_path.name} -> {extract_target}")
            extraction_results[zip_path.name] = {
                "status": "success",
                "extracted_to": str(extract_target),
                "files_extracted": extracted_count
            }
            
        except zipfile.BadZipFile:
            logger.error(f"Corrupted or invalid ZIP file: {zip_path}")
            extraction_results[zip_path.name] = {
                "status": "failed",
                "error": "BadZipFile"
            }
        except Exception as e:
            logger.error(f"Error extracting {zip_path.name}: {str(e)}", exc_info=True)
            extraction_results[zip_path.name] = {
                "status": "failed",
                "error": str(e)
            }
            
    return extraction_results

def main():
    parser = argparse.ArgumentParser(description="SafeBite Dataset Extractor")
    parser.add_argument("--zips-dir", default="datasets/raw/zips", help="Path to raw ZIP directory")
    parser.add_argument("--csv-dir", default="datasets/raw/csv", help="Path to raw CSV extraction directory")
    parser.add_argument("--force", action="store_true", help="Force re-extraction of existing archives")
    parser.add_argument("--log-file", default="datasets/metadata/pipeline.log", help="Path to log file")
    
    args = parser.parse_args()
    
    os.makedirs(os.path.dirname(args.log_file), exist_ok=True)
    logger = setup_logging(args.log_file)
    logger.info("=== Starting Dataset Extraction ===")
    
    results = extract_zips(args.zips_dir, args.csv_dir, force=args.force, logger=logger)
    logger.info(f"Extraction complete. Summarized {len(results)} archives.")

if __name__ == "__main__":
    main()
