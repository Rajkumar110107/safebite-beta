import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import Hardware from '../components/Hardware';
import Sensors from '../components/Sensors';
import History from '../components/History';
import Alerts from '../components/Alerts';
import About from '../components/About';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function Home() {
    const [activeTab, setActiveTab] = useState('Sensors');
    const [history, setHistory] = useState([]);
    const [currentData, setCurrentData] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch('http://localhost:3000/latest');
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.deviceStatus === "disconnected") {
                        setCurrentData({ status: "Device not connected" });
                        return;
                    }
                    if (data && data.deviceStatus === "connected" && !data.sensorData) {
                        setCurrentData(null); // Show waiting overlay
                        return;
                    }

                    if (data && data.prediction && data.sensorData) {
                        console.log("Frontend received:", data);
                        setCurrentData(data);
                    }
                }
            } catch (err) {
                // Ignore silent poll errors if backend disconnects temporarily
            }
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleCalculate = async (foodType, gasValue, presence, days) => {
        setIsPredicting(true);
        try {
            const response = await fetch('http://localhost:3000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gas_value: Number(gasValue),
                    presence: Number(presence),
                    storageDays: Number(days)
                })
            });
            
            const data = await response.json();
            
            if (!response.ok || data.error) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            console.log("API Response:", data);
            
            let colorClass, iconType;
            if (data.status === 'Spoiled') {
                colorClass = 'status-red';
                iconType = 'x';
            } else if (data.status === 'Consume Soon') {
                colorClass = 'status-yellow';
                iconType = 'alert-triangle';
            } else {
                colorClass = 'status-green';
                iconType = 'check';
            }

            const newData = {
                id: Date.now(),
                date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
                foodType,
                colorClass,
                iconType,
                status: data.status,
                riskScore: data.riskScore,
                deviceStatus: "manual_override",
                sensorData: {
                    gas_value: Number(gasValue),
                    presence: Number(presence),
                    storageDays: Number(days)
                },
                prediction: {
                    status: data.status,
                    recommendation: data.recommendation,
                    riskScore: data.riskScore,
                    timeRemaining: data.timeRemaining
                }
            };
            setCurrentData(newData);
            setHistory([newData, ...history]);
            setActiveTab('Dashboard');
        } catch (error) {
            console.error('Error fetching prediction:', error);
            alert(error.message === "Prediction failed" ? "Prediction failed" : "Failed to connect to ML backend or backend processing failed. Please check the server.");
        } finally {
            setIsPredicting(false);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard':
                return <Dashboard data={currentData} />;
            case 'Hardware':
                return <Hardware />;
            case 'Sensors':
                return <Sensors onCalculate={handleCalculate} isPredicting={isPredicting} />;
            case 'History':
                return <History history={history} />;
            case 'Alerts':
                return <Alerts history={history} />;
            case 'About':
                return <About />;
            default:
                return <Dashboard data={currentData} />;
        }
    };

    return (
        <div className="min-h-screen bg-surface text-on-surface font-body">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <Topbar />
            <main className="ml-64 pt-16 min-h-screen">
                {renderContent()}
            </main>
        </div>
    );
}
