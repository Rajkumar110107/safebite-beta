#!/usr/bin/env python3
"""
SafeBite AI - Dataset Discovery Script
Recursively discovers CSV/TSV tabular datasets in datasets/raw/csv/,
filters out non-data files (images, docs, code), extracts file metadata,
and exports an inventory JSON to datasets/metadata/inventory.json.
"""

import os
import sys
import json
import csv
import logging
import argparse
from pathlib import Path

LOG_FORMAT = "%(asctime)s [%(levelname)s] %(name)s - %(message)s"

# File extensions to ignore
IGNORED_EXTENSIONS = {
    '.md', '.pdf', '.txt', '.doc', '.docx', '.rtf', '.html', '.htm',
    '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.tiff',
    '.py', '.js', '.json', '.xml', '.yaml', '.yml', '.sh', '.bat',
    '.zip', '.tar', '.gz', '.7z', '.rar', '.ipynb'
}

# Supported tabular extensions
TABULAR_EXTENSIONS = {'.csv', '.tsv', '.dat', '.txt_tabular'}

def setup_logging(log_file=None):
    logger = logging.getLogger("SafeBite.Discover")
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

def detect_encoding_and_delimiter(file_path: Path) -> tuple[str, str]:
    """Detects encoding and delimiter of a text tabular file."""
    encodings = ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252', 'iso-8859-1']
    detected_encoding = 'utf-8'
    detected_delimiter = ','
    
    sample_text = ""
    for enc in encodings:
        try:
            with open(file_path, 'r', encoding=enc) as f:
                sample_text = f.read(4096)
                detected_encoding = enc
                break
        except UnicodeDecodeError:
            continue
            
    if sample_text:
        try:
            sniffer = csv.Sniffer()
            dialect = sniffer.sniff(sample_text, delimiters=[',', ';', '\t', '|'])
            detected_delimiter = dialect.delimiter
        except Exception:
            # Fallback heuristic count
            counts = {
                ',': sample_text.count(','),
                ';': sample_text.count(';'),
                '\t': sample_text.count('\t'),
                '|': sample_text.count('|')
            }
            detected_delimiter = max(counts, key=counts.get) if any(counts.values()) else ','
            
    return detected_encoding, detected_delimiter

def inspect_tabular_file(file_path: Path, base_dir: Path) -> dict:
    """Inspects a single CSV/TSV file for row count, column count, and structure."""
    encoding, delimiter = detect_encoding_and_delimiter(file_path)
    file_size_bytes = file_path.stat().st_size
    file_size_mb = round(file_size_bytes / (1024 * 1024), 4)
    
    row_count = 0
    col_count = 0
    header = []
    
    try:
        with open(file_path, 'r', encoding=encoding, errors='replace') as f:
            reader = csv.reader(f, delimiter=delimiter)
            first_row = next(reader, None)
            if first_row is not None:
                header = [col.strip() for col in first_row]
                col_count = len(header)
                row_count = 1 + sum(1 for _ in reader) # includes header
            else:
                row_count = 0
                col_count = 0
    except Exception as e:
        header = []
        row_count = -1
        col_count = -1
        
    rel_path = file_path.relative_to(base_dir).as_posix()
    parent_folder = file_path.parent.name
    
    return {
        "dataset_id": file_path.stem.lower().replace(" ", "_").replace("-", "_"),
        "file_name": file_path.name,
        "relative_path": rel_path,
        "absolute_path": str(file_path.resolve()),
        "parent_folder": parent_folder,
        "file_extension": file_path.suffix.lower(),
        "file_size_bytes": file_size_bytes,
        "file_size_mb": file_size_mb,
        "encoding": encoding,
        "delimiter": delimiter,
        "total_rows": row_count,
        "total_columns": col_count,
        "columns": header
    }

def discover_datasets(raw_csv_dir: Path, metadata_dir: Path, logger: logging.Logger = None) -> list:
    """
    Recursively scans raw_csv_dir for CSV/TSV files, ignoring non-data files.
    """
    if logger is None:
        logger = setup_logging()
        
    raw_csv_dir = Path(raw_csv_dir).resolve()
    metadata_dir = Path(metadata_dir).resolve()
    metadata_dir.mkdir(parents=True, exist_ok=True)
    
    if not raw_csv_dir.exists():
        logger.warning(f"Raw CSV directory does not exist: {raw_csv_dir}")
        return []
        
    discovered_files = []
    ignored_files_count = 0
    
    logger.info(f"Scanning directory recursively: {raw_csv_dir}")
    
    for root, dirs, files in os.walk(raw_csv_dir):
        for file in files:
            file_path = Path(root) / file
            ext = file_path.suffix.lower()
            
            if ext in IGNORED_EXTENSIONS or (not ext and not file.endswith('_csv')):
                ignored_files_count += 1
                continue
                
            if ext in TABULAR_EXTENSIONS or ext == '.csv' or ext == '.tsv':
                logger.info(f"Discovered dataset: {file_path.name}")
                info = inspect_tabular_file(file_path, raw_csv_dir)
                discovered_files.append(info)
            else:
                ignored_files_count += 1
                
    logger.info(f"Discovery complete. Discovered {len(discovered_files)} tabular dataset file(s). Ignored {ignored_files_count} non-data file(s).")
    
    output_json = metadata_dir / "inventory.json"
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(discovered_files, f, indent=2)
        
    logger.info(f"Saved inventory index to {output_json}")
    return discovered_files

def main():
    parser = argparse.ArgumentParser(description="SafeBite Dataset Discoverer")
    parser.add_argument("--csv-dir", default="datasets/raw/csv", help="Path to raw CSV directory")
    parser.add_argument("--metadata-dir", default="datasets/metadata", help="Path to metadata output directory")
    parser.add_argument("--log-file", default="datasets/metadata/pipeline.log", help="Path to log file")
    
    args = parser.parse_args()
    
    logger = setup_logging(args.log_file)
    logger.info("=== Starting Dataset Discovery ===")
    
    discover_datasets(args.csv_dir, args.metadata_dir, logger=logger)

if __name__ == "__main__":
    main()
