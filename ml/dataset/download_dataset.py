import kagglehub

print("=" * 60)
print("Downloading: Chicken Meat Freshness Dataset")
print("=" * 60)

path = kagglehub.dataset_download(
    "ziya07/chicken-meat-freshness-dataset"
)

print("\n✅ Download Successful!")
print("📂 Dataset Location:")
print(path)