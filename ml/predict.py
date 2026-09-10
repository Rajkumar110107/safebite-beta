"""
SafeBite ML Inference Engine
Harmonized 3-Feature Schema: [gas_value, presence, storageDays]
"""
import sys
import json
import os
import pickle
import warnings
warnings.filterwarnings("ignore")

def main():
    try:
        if len(sys.argv) < 4:
            print(json.dumps({"error": "Missing inputs: expected [gas_value] [presence] [storageDays] [optional_category]"}))
            sys.exit(0)
            
        gas_value = float(sys.argv[1])
        presence = float(sys.argv[2])
        days = float(sys.argv[3])
        category = sys.argv[4] if len(sys.argv) > 4 else "General"
            
        if presence == 0:
            print(json.dumps({
                "status": "No Food Detected",
                "condition": "NO_SAMPLE",
                "riskScore": 0.0,
                "foodConditionScore": 100,
                "confidence": "100%",
                "timeRemaining": "N/A",
                "primaryIndicator": "IR sensor clear (no object detected)",
                "explainableFactors": [
                    {"factor": "IR Sensor", "observation": "Stage empty", "impact": "Neutral"}
                ],
                "recommendation": "Place food sample on sensor stage to initiate screening."
            }))
            return
        
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(script_dir, 'model.pkl')
        imputer_path = os.path.join(script_dir, 'imputer.pkl')
        
        if not os.path.exists(model_path) or not os.path.exists(imputer_path):
            from train import train
            train()
            
        with open(model_path, 'rb') as f:
            clf = pickle.load(f)
        with open(imputer_path, 'rb') as f:
            imputer = pickle.load(f)
        
        input_data = imputer.transform([[gas_value, presence, days]])
        pred_class = str(clf.predict(input_data)[0])
        probas = clf.predict_proba(input_data)[0]
        classes = list(clf.classes_)
        
        prob_spoiled = float(probas[classes.index('Spoiled')]) if 'Spoiled' in classes else 0.0
        prob_consume_soon = float(probas[classes.index('Consume Soon')]) if 'Consume Soon' in classes else 0.0
        prob_fresh = float(probas[classes.index('Fresh')]) if 'Fresh' in classes else 0.0
        
        risk_score = float(prob_spoiled + prob_consume_soon * 0.5)
        risk_score = max(0.0, min(1.0, risk_score))
        
        # Calculate Food Condition Score (0 to 100: 100 = Peak Freshness, 0 = Severe Spoilage)
        food_condition_score = int(round((1.0 - risk_score) * 100))
        
        # Model confidence estimate
        max_prob = max(prob_spoiled, prob_consume_soon, prob_fresh)
        confidence_str = f"{int(round(max_prob * 100))}%" if max_prob > 0.4 else "Estimated"
        
        # Primary indicator and explainable factors
        explainable = []
        if gas_value > 450:
            primary_ind = "Elevated volatile organic / ammonia gas emissions (MQ-135 reading high)"
            explainable.append({"factor": "Gas Emission Index", "observation": f"High ({int(gas_value)} RAW)", "impact": "Negative"})
        elif gas_value > 200:
            primary_ind = "Moderate VOC gas activity approaching sensory threshold"
            explainable.append({"factor": "Gas Emission Index", "observation": f"Moderate ({int(gas_value)} RAW)", "impact": "Warning"})
        else:
            primary_ind = "Baseline ambient VOC levels within fresh threshold"
            explainable.append({"factor": "Gas Emission Index", "observation": f"Optimal ({int(gas_value)} RAW)", "impact": "Positive"})
            
        if days >= 4:
            explainable.append({"factor": "Storage Duration", "observation": f"{int(days)} days logged", "impact": "Negative"})
        elif days >= 2:
            explainable.append({"factor": "Storage Duration", "observation": f"{int(days)} days logged", "impact": "Warning"})
        else:
            explainable.append({"factor": "Storage Duration", "observation": f"{int(days)} day(s) logged", "impact": "Positive"})
            
        # Category-aware recommendations
        if pred_class == 'Fresh':
            rem = f"{max(0, int(24 - days*2))} hours (Estimated)"
            rec = "Condition screening indicates optimal freshness. Safe to consume and store."
        elif pred_class == 'Consume Soon':
            rem = "< 12 hours (Estimated)"
            rec = "Approaching threshold. Prioritize consumption soon or process/refrigerate."
        else:
            rem = "0 hours (Estimated)"
            rec = "Screening indicates spoilage risk. Do not consume. Further inspection recommended."
            
        result = {
            "status": pred_class,
            "condition": "FRESH" if pred_class == "Fresh" else "CONSUME_SOON" if pred_class == "Consume Soon" else "SPOILED",
            "riskScore": round(risk_score, 2),
            "foodConditionScore": food_condition_score,
            "confidence": confidence_str,
            "timeRemaining": rem,
            "primaryIndicator": primary_ind,
            "explainableFactors": explainable,
            "recommendation": rec
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == '__main__':
    main()
