import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
import pickle
import os

def train():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(script_dir, 'dataset', 'food.csv')
    
    print("Loading dataset...")
    df = pd.read_csv(csv_path)
    
    df['temperature'] = df['Temperature']
    df['humidity'] = df['Humidity']
    df['nh3'] = df['Methane']
    df['h2s'] = df['Methane'] * 0.1
    df['voc'] = df['CO2']
    df['storageDays'] = df['Storage_Days']
    df['status'] = df['Spoiled'].map({0: 'Fresh', 1: 'Consume Soon', 2: 'Spoiled'})
    
    features = ['temperature', 'humidity', 'nh3', 'h2s', 'voc', 'storageDays']
    X = df[features]
    y = df['status']
    
    print("Imputing...")
    imputer = SimpleImputer(strategy='mean')
    X_imputed = imputer.fit_transform(X)
    
    print("Training model...")
    clf = RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42)
    clf.fit(X_imputed, y)
    
    model_path = os.path.join(script_dir, 'model.pkl')
    imputer_path = os.path.join(script_dir, 'imputer.pkl')
    
    with open(model_path, 'wb') as f:
        pickle.dump(clf, f)
        
    with open(imputer_path, 'wb') as f:
        pickle.dump(imputer, f)
        
    print("Training complete! Model saved to model.pkl and imputer.pkl")

if __name__ == '__main__':
    train()
