"""
SafeBite ML Training Pipeline
Harmonized 3-Feature Schema: [gas_value, presence, storageDays]
"""
import os
import pickle
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer

def train():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(script_dir, 'dataset', 'food.csv')
    
    print(f"Loading dataset from: {csv_path}")
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at {csv_path}")
        
    df = pd.read_csv(csv_path)
    
    # Feature columns verified
    features = ['gas_value', 'presence', 'storageDays']
    X = df[features]
    y = df['status']
    
    print("Fitting SimpleImputer...")
    imputer = SimpleImputer(strategy='mean')
    X_imputed = imputer.fit_transform(X)
    
    print("Training Random Forest Classifier...")
    clf = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
    clf.fit(X_imputed, y)
    
    model_path = os.path.join(script_dir, 'model.pkl')
    imputer_path = os.path.join(script_dir, 'imputer.pkl')
    
    # Backup existing models if present
    if os.path.exists(model_path):
        backup_model = os.path.join(script_dir, 'model_backup.pkl')
        try:
            with open(model_path, 'rb') as src, open(backup_model, 'wb') as dst:
                dst.write(src.read())
        except Exception:
            pass
            
    with open(model_path, 'wb') as f:
        pickle.dump(clf, f)
        
    with open(imputer_path, 'wb') as f:
        pickle.dump(imputer, f)
        
    print(f"SUCCESS: Model saved to {model_path} and imputer to {imputer_path}")
    print(f"Classes: {clf.classes_}")

if __name__ == '__main__':
    train()
