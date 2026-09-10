# 🛡️ SafeBite AI - Data Engineering Pipeline

A professional, scalable, and reusable Data Engineering Pipeline designed to continuously ingest, discover, analyze, clean, standardize, and audit food freshness datasets.

---

## 📁 Directory Layout

```
datasets/
├── raw/
│   ├── zips/                   # Raw ZIP archives uploaded/downloaded
│   └── csv/                    # Safely extracted CSV/TSV raw files (unmodified)
├── processed/
│   ├── cleaned/                # Sanitized and cleaned versions of raw files
│   ├── merged/                 # Integrated cross-dataset tables
│   └── engineered/             # Machine Learning feature-engineered tables
├── master/                     # Production-ready master SafeBite datasets
├── metadata/                   # System inventory, validation results & logs
│   ├── inventory.json          # File discovery registry
│   ├── dataset_inventory.csv   # Tabular index of all datasets
│   ├── inventory_summary.json  # Overall dataset statistics
│   ├── validation_results.json # Quality score audit results
│   └── pipeline.log            # Execution log file
├── schemas/                    # Individual dataset schemas & comparison matrices
├── reports/                    # Generated Markdown & HTML reports
│   ├── 1_dataset_inventory.md
│   ├── 2_schema_comparison.md
│   ├── 3_data_quality_report.md
│   └── 4_dataset_summary.md
└── scripts/                    # Pipeline modular scripts
    ├── extract_datasets.py
    ├── discover_datasets.py
    ├── analyze_schema.py
    ├── inventory_generator.py
    ├── dataset_validator.py
    ├── report_generator.py
    └── run_pipeline.py         # Master orchestrator script
```

---

## ⚡ Quick Start: Running the Pipeline

### Execute the Full Pipeline End-to-End
To run all 6 processing stages automatically:

```bash
python datasets/scripts/run_pipeline.py
```

To force re-extraction of ZIP archives:

```bash
python datasets/scripts/run_pipeline.py --force-extract
```

---

## 🔬 Pipeline Stages & Modular Scripts

| Stage | Script | Purpose |
| :--- | :--- | :--- |
| **1. Extraction** | [`extract_datasets.py`](file:///c:/Users/subhi/OneDrive/Desktop/Safebite/datasets/scripts/extract_datasets.py) | Safely unpacks archives in `raw/zips/` into `raw/csv/<dataset_name>/` with path sanitization. |
| **2. Discovery** | [`discover_datasets.py`](file:///c:/Users/subhi/OneDrive/Desktop/Safebite/datasets/scripts/discover_datasets.py) | Recursively scans `raw/csv/`, ignores non-data files (images, docs, PDFs), and builds `inventory.json`. |
| **3. Schema Analysis** | [`analyze_schema.py`](file:///c:/Users/subhi/OneDrive/Desktop/Safebite/datasets/scripts/analyze_schema.py) | Infers column types, computes null/unique stats, exports JSON schemas, and computes schema similarity matrices. |
| **4. Inventory Index** | [`inventory_generator.py`](file:///c:/Users/subhi/OneDrive/Desktop/Safebite/datasets/scripts/inventory_generator.py) | Compiles file metadata into `dataset_inventory.csv` and `inventory_summary.json`. |
| **5. Quality Audit** | [`dataset_validator.py`](file:///c:/Users/subhi/OneDrive/Desktop/Safebite/datasets/scripts/dataset_validator.py) | Audits file MD5 hashes (duplicates), row duplicates, nulls, out-of-range sensor values, and snake-case mappings. |
| **6. Reporting** | [`report_generator.py`](file:///c:/Users/subhi/OneDrive/Desktop/Safebite/datasets/scripts/report_generator.py) | Generates 4 Markdown reports in `datasets/reports/`. |

---

## 📥 Instructions for Adding New Datasets

1. Drop any new ZIP archive containing food freshness data into:
   ```
   datasets/raw/zips/
   ```
2. Or drop extracted `.csv` files directly into a subfolder inside:
   ```
   datasets/raw/csv/<new_dataset_name>/
   ```
3. Execute the pipeline:
   ```bash
   python datasets/scripts/run_pipeline.py
   ```
4. View updated metrics in `datasets/reports/` and `datasets/metadata/`.

---

## 🛡️ Pipeline Guarantees & Non-Destructive Policy
- **Zero Raw File Mutation:** Raw ZIPs and extracted CSV files are treated as read-only.
- **Isolated Artifacts:** All metadata, schemas, and reports are saved to dedicated directories.
- **Deterministic Logging:** Detailed timestamps and progress traces are saved in `datasets/metadata/pipeline.log`.
