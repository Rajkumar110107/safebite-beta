# SafeBite 🍎🛡️

SafeBite is an intelligent food safety and freshness detection system integrating hardware sensors, machine learning models, a Node.js backend, and a modern React frontend dashboard.

---

## 📁 Repository Structure

```
Safebite/
├── safebite/                   # Frontend React + Vite application
│   ├── src/                    # UI Components, pages, and context
│   └── package.json            # Frontend dependencies
├── backend/                    # Node.js / Express backend server
│   ├── server.js               # API server and hardware / ML bridge
│   └── package.json            # Backend dependencies
├── ml/                         # Machine Learning models and training scripts
│   ├── train.py                # Model training script
│   ├── predict.py              # Inference script
│   ├── model.pkl               # Serialized trained model
│   └── imputer.pkl             # Preprocessing pipeline
├── arduino_bluetooth/          # Arduino firmware for Bluetooth communication
├── arduino_safebite_hardware/  # Sensor interface hardware code
└── datasets/                   # Datasets, schemas, and processing scripts
```

---

## 🚀 Quick Start

### 1. Frontend (React / Vite)
```bash
cd safebite
npm install
npm run dev
```

### 2. Backend (Node.js)
```bash
cd backend
npm install
node server.js
```

### 3. Machine Learning (Python)
```bash
cd ml
pip install -r requirements.txt # (or install scikit-learn, pandas, numpy)
python predict.py
```

---

## 🛠️ Tech Stack
- **Frontend**: React, Vite, TailwindCSS / CSS
- **Backend**: Node.js, Express
- **Machine Learning**: Python, Scikit-learn
- **Hardware**: Arduino, Bluetooth (HC-05/HC-06), Gas / Quality Sensors
