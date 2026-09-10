import sys
import json
import os
import pickle
import warnings
warnings.filterwarnings("ignore")

def main():
    try:
        if len(sys.argv) < 4:
            print(json.dumps({"error": "Missing inputs"}))
            sys.exit(0)
            
        gas_value = float(sys.argv[1])
        presence = float(sys.argv[2])
        days = float(sys.argv[3])
            
        if presence == 0:
            print(json.dumps({
                "status": "No Food Detected",
                "riskScore": 0.0,
                "timeRemaining": "N/A",
                "recommendation": "Place food sample"
            }))
            return
        
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(script_dir, 'model.pkl')
        imputer_path = os.path.join(script_dir, 'imputer.pkl')
        
        if not os.path.exists(model_path) or not os.path.exists(imputer_path):
            import pandas as pd
            from sklearn.ensemble import RandomForestClassifier
            from sklearn.impute import SimpleImputer
            
            csv_path = os.path.join(script_dir, 'dataset', 'food.csv')
            df = pd.read_csv(csv_path)
            
            df['gas_value'] = df['Methane']
            df['presence'] = 1.0
            df['storageDays'] = df['Storage_Days']
            
            df['status'] = df['Spoiled'].map({0: 'Fresh', 1: 'Consume Soon', 2: 'Spoiled'})
            
            features = ['gas_value', 'presence', 'storageDays']
            
            X = df[features]
            y = df['status']
            
            imputer = SimpleImputer(strategy='mean')
            X_imputed = imputer.fit_transform(X)
            
            clf = RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42)
            clf.fit(X_imputed, y)
            
            with open(model_path, 'wb') as f:
                pickle.dump(clf, f)
            with open(imputer_path, 'wb') as f:
                pickle.dump(imputer, f)
        else:
            with open(model_path, 'rb') as f:
                clf = pickle.load(f)
            with open(imputer_path, 'rb') as f:
                imputer = pickle.load(f)
        
        input_data = imputer.transform([[gas_value, presence, days]])
        pred_class = clf.predict(input_data)[0]
        probas = clf.predict_proba(input_data)[0]
        
        classes = list(clf.classes_)
        prob_spoiled = probas[classes.index('Spoiled')] if 'Spoiled' in classes else 0
        prob_consume_soon = probas[classes.index('Consume Soon')] if 'Consume Soon' in classes else 0
        risk_score = float(prob_spoiled + prob_consume_soon * 0.5) 
        
        if pred_class == 'Fresh':
            rem = f"{max(0, int(24 - days*2))} hours"
            rec = "Safe to consume"
        elif pred_class == 'Consume Soon':
            rem = "< 12 hours"
            rec = "Consume soon"
        else:
            rem = "0 hours"
            rec = "Do not consume"
            
        print(json.dumps({
            "status": pred_class,
            "riskScore": min(1.0, risk_score),
            "timeRemaining": rem,
            "recommendation": rec
        }))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == '__main__':
    main()
