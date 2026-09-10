import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { PRODUCT_DATABASE, lookupProductByCode } from '../services/productDatabase';

const PlatformContext = createContext(null);

export function PlatformProvider({ children }) {
  // Mode: 'INDIVIDUAL' | 'INDUSTRIAL'
  const [mode, setMode] = useState(() => storageService.getSettings().mode || 'INDIVIDUAL');
  
  // Persistent Collections
  const [scans, setScans] = useState(() => storageService.getScans());
  const [inventory, setInventory] = useState(() => storageService.getInventory());
  const [batches, setBatches] = useState(() => storageService.getBatches());
  const [alerts, setAlerts] = useState(() => storageService.getAlerts());
  const [coldChainLogs, setColdChainLogs] = useState(() => storageService.getColdChainLogs());

  // Active Interactive Scan State
  const [selectedProduct, setSelectedProduct] = useState(() => PRODUCT_DATABASE[0]);
  const [latestScanAssessment, setLatestScanAssessment] = useState(() => scans[0] || null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Live Hardware Telemetry from Backend Polling (if backend is active)
  const [backendDeviceStatus, setBackendDeviceStatus] = useState('disconnected');
  const [liveTelemetry, setLiveTelemetry] = useState({ gas_value: 140, presence: 1, storageDays: 1 });

  // Poll backend for live hardware stream if backend server is running
  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:3000/latest');
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data && data.deviceStatus === 'connected' && data.sensorData) {
            setBackendDeviceStatus('connected');
            setLiveTelemetry(data.sensorData);
          } else {
            setBackendDeviceStatus(data?.deviceStatus || 'disconnected');
          }
        }
      } catch {
        if (isMounted) setBackendDeviceStatus('disconnected');
      }
    }, 2500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Mode Switcher
  const switchMode = (newMode) => {
    setMode(newMode);
    storageService.saveSettings({ ...storageService.getSettings(), mode: newMode });
  };

  // Perform a full SafeBite Food Condition Assessment combining Product Identity + Physical Telemetry + ML Engine
  const performScreening = useCallback(async (product, sensorParams = null) => {
    setIsEvaluating(true);
    const prod = product || selectedProduct || PRODUCT_DATABASE[0];
    const gas = sensorParams?.gasValue !== undefined ? Number(sensorParams.gasValue) : liveTelemetry.gas_value || 140;
    const presence = sensorParams?.presence !== undefined ? Number(sensorParams.presence) : 1;
    const days = sensorParams?.storageDays !== undefined ? Number(sensorParams.storageDays) : 1;

    try {
      // 1. Attempt Backend ML API Call
      let mlData = null;
      try {
        const response = await fetch('http://localhost:3000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gas_value: gas,
            presence,
            storageDays: days,
            category: prod.category
          })
        });
        if (response.ok) {
          mlData = await response.json();
        }
      } catch (err) {
        // Backend offline: use deterministic calibrated fallback engine
      }

      // 2. Fallback Engine calibrated against category thresholds
      if (!mlData || mlData.error) {
        const thresholds = prod.gasThresholds || { freshMax: 180, warningMax: 380, spoiledMin: 381 };
        let condition = "FRESH";
        let statusText = "Fresh";
        let riskScore = 0.05;
        let foodScore = 95;
        let confidence = "96%";
        let primaryIndicator = "Baseline ambient VOC gas levels within fresh threshold";
        let rec = "Optimal freshness • Low VOC baseline • Safe to consume and store.";

        if (gas > thresholds.warningMax || days >= 4) {
          condition = "SPOILED";
          statusText = "Alert / Spoiled";
          riskScore = 0.94;
          foodScore = 6;
          confidence = "99%";
          primaryIndicator = "Elevated volatile decomposition gas emissions (MQ-135 reading high)";
          rec = "Screening indicates spoilage risk. Do not consume. Further inspection recommended.";
        } else if (gas > thresholds.freshMax || days >= 2) {
          condition = "CONSUME_SOON";
          statusText = "Consume Soon";
          riskScore = 0.50;
          foodScore = 50;
          confidence = "92%";
          primaryIndicator = "Moderate VOC gas activity approaching sensory threshold";
          rec = "Approaching threshold. Prioritize consumption soon or refrigerate immediately.";
        }

        mlData = {
          status: statusText,
          condition,
          riskScore,
          foodConditionScore: foodScore,
          confidence,
          timeRemaining: condition === "FRESH" ? `${Math.max(0, 24 - days * 4)} hours (Estimated)` : condition === "CONSUME_SOON" ? "< 12 hours (Estimated)" : "0 hours (Estimated)",
          primaryIndicator,
          explainableFactors: [
            { factor: "MQ-135 Gas Telemetry", observation: `${gas} RAW Response`, impact: condition === "FRESH" ? "Positive" : condition === "CONSUME_SOON" ? "Warning" : "Negative" },
            { factor: "Storage Age", observation: `${days} day(s) in custody`, impact: days < 2 ? "Positive" : days < 4 ? "Warning" : "Negative" },
            { factor: "Category Profile", observation: `${prod.category} Baseline (${thresholds.freshMax} / ${thresholds.warningMax})`, impact: "Informational" }
          ],
          recommendation: rec
        };
      }

      const scanId = `SCAN-${Date.now().toString().slice(-4)}`;
      const now = new Date();
      const dateStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      const newScanRecord = {
        id: scanId,
        timestamp: dateStr,
        productId: prod.id,
        productName: prod.name,
        brand: prod.brand,
        category: prod.category,
        image: prod.image,
        batchId: sensorParams?.batchId || `BATCH-${prod.category.toUpperCase().slice(0, 3)}-${now.getMonth() + 1}${now.getDate()}`,
        quantityScanned: sensorParams?.quantity || prod.packageSize,
        gasValue: gas,
        presence,
        storageDays: days,
        condition: mlData.condition || (mlData.status === 'Spoiled' ? 'SPOILED' : mlData.status === 'Consume Soon' ? 'CONSUME_SOON' : 'FRESH'),
        statusText: mlData.status || 'Fresh',
        riskScore: mlData.riskScore !== undefined ? mlData.riskScore : 0.1,
        foodConditionScore: mlData.foodConditionScore !== undefined ? mlData.foodConditionScore : 90,
        confidence: mlData.confidence || '95%',
        primaryIndicator: mlData.primaryIndicator,
        explainableFactors: mlData.explainableFactors || [],
        timeRemaining: mlData.timeRemaining || 'N/A',
        recommendation: mlData.recommendation,
        mode,
        inspector: mode === 'INDUSTRIAL' ? 'Alex Rivera (QC Lead)' : 'Self-Scan'
      };

      // Save to persistence
      const updatedScans = storageService.saveScan(newScanRecord);
      setScans(updatedScans);
      setLatestScanAssessment(newScanRecord);

      // Trigger automatic alert if Spoilage or urgent FEFO detected
      if (newScanRecord.condition === 'SPOILED') {
        const alert = {
          id: `ALT-${Date.now().toString().slice(-3)}`,
          title: `Spoilage Flagged: ${prod.name}`,
          severity: "HIGH",
          category: prod.category,
          itemRef: scanId,
          batchRef: newScanRecord.batchId,
          message: `Screening indicated high decomposition gas signature (${gas} RAW). Immediate inspection required.`,
          timestamp: dateStr,
          resolved: false,
          action: "Quarantine Batch / Discard Sample"
        };
        const updatedAlerts = storageService.addAlert(alert);
        setAlerts(updatedAlerts);
      } else if (newScanRecord.condition === 'CONSUME_SOON') {
        const alert = {
          id: `ALT-${Date.now().toString().slice(-3)}`,
          title: `Consume Soon Priority: ${prod.name}`,
          severity: "MEDIUM",
          category: prod.category,
          itemRef: scanId,
          batchRef: newScanRecord.batchId,
          message: `Product approaching consumption limit (${gas} RAW, ${days} days storage). Prioritize in FEFO queue.`,
          timestamp: dateStr,
          resolved: false,
          action: "Reprioritize Stock / Prepare Recipes"
        };
        const updatedAlerts = storageService.addAlert(alert);
        setAlerts(updatedAlerts);
      }

      return newScanRecord;
    } finally {
      setIsEvaluating(false);
    }
  }, [selectedProduct, liveTelemetry, mode]);

  // Inventory Actions
  const addToInventory = (item) => {
    const updated = storageService.saveInventoryItem(item);
    setInventory(updated);
  };

  const updateInventoryItem = (item) => {
    const updated = storageService.saveInventoryItem(item);
    setInventory(updated);
  };

  const deleteInventoryItem = (id) => {
    const updated = storageService.deleteInventoryItem(id);
    setInventory(updated);
  };

  // Batch Actions
  const toggleBatchQuarantine = (batchId) => {
    const batch = batches.find((b) => b.batchId === batchId);
    if (!batch) return;
    const updated = storageService.updateBatch(batchId, {
      quarantined: !batch.quarantined,
      status: !batch.quarantined ? 'QUARANTINED' : 'ACTIVE_INSPECTION'
    });
    setBatches(updated);
  };

  // Alert Actions
  const resolveAlert = (alertId) => {
    const updated = storageService.dismissAlert(alertId);
    setAlerts(updated);
  };

  // Reset demo data
  const resetAllData = () => {
    const defaults = storageService.resetAllData();
    setScans(defaults.scans);
    setInventory(defaults.inventory);
    setBatches(defaults.batches);
    setAlerts(defaults.alerts);
    setColdChainLogs(defaults.coldChain);
    setLatestScanAssessment(defaults.scans[0]);
  };

  return (
    <PlatformContext.Provider
      value={{
        mode,
        switchMode,
        scans,
        inventory,
        batches,
        alerts,
        coldChainLogs,
        selectedProduct,
        setSelectedProduct,
        latestScanAssessment,
        setLatestScanAssessment,
        isEvaluating,
        performScreening,
        addToInventory,
        updateInventoryItem,
        deleteInventoryItem,
        toggleBatchQuarantine,
        resolveAlert,
        resetAllData,
        backendDeviceStatus,
        liveTelemetry
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
}
