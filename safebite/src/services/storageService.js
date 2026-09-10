/**
 * SafeBite Persistent Storage Service
 * Handles persistent storage in browser localStorage with pre-seeded demonstration data.
 * Ensures scan history, inventory, FEFO queues, batches, and alerts survive page reloads.
 */

const STORAGE_KEYS = {
  SCANS: 'safebite_scans_v1',
  INVENTORY: 'safebite_inventory_v1',
  BATCHES: 'safebite_batches_v1',
  ALERTS: 'safebite_alerts_v1',
  SETTINGS: 'safebite_settings_v1',
  COLD_CHAIN: 'safebite_coldchain_v1'
};

// Initial Seed Data for Instant Realistic Platform Experience
const SEED_SCANS = [
  {
    id: "SCAN-1001",
    timestamp: "2026-09-10 16:45:10",
    productId: "PROD-DAIRY-001",
    productName: "Aavin Premium Toned Milk",
    category: "Dairy",
    batchId: "BATCH-AAVIN-0910",
    quantityScanned: "500 ml",
    gasValue: 142,
    presence: 1,
    storageDays: 1,
    condition: "FRESH",
    statusText: "Fresh",
    riskScore: 0.08,
    foodConditionScore: 92,
    confidence: "98%",
    primaryIndicator: "Baseline ambient VOC levels within fresh threshold",
    recommendation: "Optimal freshness • Low VOC baseline • Safe to consume and store",
    mode: "INDUSTRIAL",
    inspector: "Alex Rivera (Safety Lead)"
  },
  {
    id: "SCAN-1002",
    timestamp: "2026-09-10 16:15:22",
    productId: "PROD-FRUIT-002",
    productName: "Cavendish Robusta Banana",
    category: "Fruits",
    batchId: "BATCH-BANANA-0908",
    quantityScanned: "600 g (4 pcs)",
    gasValue: 310,
    presence: 1,
    storageDays: 3,
    condition: "CONSUME_SOON",
    statusText: "Consume Soon",
    riskScore: 0.48,
    foodConditionScore: 52,
    confidence: "94%",
    primaryIndicator: "Moderate VOC gas activity approaching sensory threshold",
    recommendation: "Approaching threshold • Prioritize consumption or process into recipes",
    mode: "INDIVIDUAL",
    inspector: "Self-Scan"
  },
  {
    id: "SCAN-1003",
    timestamp: "2026-09-10 15:30:05",
    productId: "PROD-MEAT-001",
    productName: "Fresh Tender Chicken Breast Fillet",
    category: "Meat",
    batchId: "BATCH-CHK-0906",
    quantityScanned: "450 g",
    gasValue: 680,
    presence: 1,
    storageDays: 4,
    condition: "SPOILED",
    statusText: "Alert / Spoiled",
    riskScore: 0.96,
    foodConditionScore: 4,
    confidence: "99%",
    primaryIndicator: "Elevated volatile organic / ammonia gas emissions (MQ-135 reading high)",
    recommendation: "Screening indicates spoilage risk • Do not consume • Discard immediately",
    mode: "INDUSTRIAL",
    inspector: "QC Station 2"
  },
  {
    id: "SCAN-1004",
    timestamp: "2026-09-10 14:10:48",
    productId: "PROD-BAKE-001",
    productName: "100% Whole Wheat Sandwich Bread",
    category: "Bakery",
    batchId: "BATCH-BRD-0909",
    quantityScanned: "400 g",
    gasValue: 155,
    presence: 1,
    storageDays: 1,
    condition: "FRESH",
    statusText: "Fresh",
    riskScore: 0.05,
    foodConditionScore: 95,
    confidence: "96%",
    primaryIndicator: "Optimal volatile emissions profile",
    recommendation: "Fresh product • Keep sealed in cool, dry bread storage",
    mode: "INDIVIDUAL",
    inspector: "Self-Scan"
  },
  {
    id: "SCAN-1005",
    timestamp: "2026-09-10 11:20:15",
    productId: "PROD-MEAT-002",
    productName: "Atlantic Salmon Portions",
    category: "Meat",
    batchId: "BATCH-SLM-0908",
    quantityScanned: "300 g",
    gasValue: 360,
    presence: 1,
    storageDays: 2,
    condition: "CONSUME_SOON",
    statusText: "Consume Soon",
    riskScore: 0.54,
    foodConditionScore: 46,
    confidence: "91%",
    primaryIndicator: "Moderate amine vapor release detected",
    recommendation: "Cook immediately to safe internal temperature or freeze",
    mode: "INDUSTRIAL",
    inspector: "Cold Vault Line"
  }
];

const SEED_INVENTORY = [
  {
    id: "INV-001",
    productId: "PROD-DAIRY-001",
    productName: "Aavin Premium Toned Milk",
    category: "Dairy",
    batchId: "BATCH-AAVIN-0910",
    quantity: 120,
    unit: "packs",
    storageLocation: "Chiller Bay A-02",
    intakeDate: "2026-09-08",
    declaredExpiryDate: "2026-09-12",
    daysUntilDeclaredExpiry: 2,
    condition: "FRESH",
    foodConditionScore: 92,
    fefoPriority: "MEDIUM",
    status: "IN_STOCK"
  },
  {
    id: "INV-002",
    productId: "PROD-FRUIT-002",
    productName: "Cavendish Robusta Banana",
    category: "Fruits",
    batchId: "BATCH-BANANA-0908",
    quantity: 45,
    unit: "kg",
    storageLocation: "Produce Stand 4",
    intakeDate: "2026-09-06",
    declaredExpiryDate: "2026-09-11",
    daysUntilDeclaredExpiry: 1,
    condition: "CONSUME_SOON",
    foodConditionScore: 52,
    fefoPriority: "URGENT",
    status: "DISCOUNT_AISLE"
  },
  {
    id: "INV-003",
    productId: "PROD-MEAT-001",
    productName: "Fresh Tender Chicken Breast Fillet",
    category: "Meat",
    batchId: "BATCH-CHK-0906",
    quantity: 18,
    unit: "packs",
    storageLocation: "Meat Cooler Bay 1",
    intakeDate: "2026-09-06",
    declaredExpiryDate: "2026-09-10",
    daysUntilDeclaredExpiry: 0,
    condition: "SPOILED",
    foodConditionScore: 4,
    fefoPriority: "EXPIRED_QUARANTINE",
    status: "QUARANTINED"
  },
  {
    id: "INV-004",
    productId: "PROD-FRUIT-001",
    productName: "Shimla Royal Delicious Red Apple",
    category: "Fruits",
    batchId: "BATCH-APL-0905",
    quantity: 80,
    unit: "kg",
    storageLocation: "Cold Store Room 2",
    intakeDate: "2026-09-05",
    declaredExpiryDate: "2026-09-15",
    daysUntilDeclaredExpiry: 5,
    condition: "FRESH",
    foodConditionScore: 96,
    fefoPriority: "LOW",
    status: "IN_STOCK"
  },
  {
    id: "INV-005",
    productId: "PROD-BAKE-001",
    productName: "100% Whole Wheat Sandwich Bread",
    category: "Bakery",
    batchId: "BATCH-BRD-0909",
    quantity: 35,
    unit: "loaves",
    storageLocation: "Bakery Shelf 1",
    intakeDate: "2026-09-08",
    declaredExpiryDate: "2026-09-12",
    daysUntilDeclaredExpiry: 2,
    condition: "FRESH",
    foodConditionScore: 90,
    fefoPriority: "MEDIUM",
    status: "IN_STOCK"
  }
];

const SEED_BATCHES = [
  {
    batchId: "BATCH-AAVIN-0910",
    productName: "Aavin Premium Toned Milk",
    category: "Dairy",
    totalUnits: 1000,
    scannedUnits: 782,
    freshCount: 650,
    consumeSoonCount: 102,
    spoiledCount: 30,
    qualityPassRate: 96.2,
    status: "ACTIVE_INSPECTION",
    quarantined: false,
    originFacility: "Salem Dairy Plant #4",
    arrivalDate: "2026-09-08"
  },
  {
    batchId: "BATCH-CHK-0906",
    productName: "Fresh Chicken Breast Fillet",
    category: "Meat",
    totalUnits: 250,
    scannedUnits: 250,
    freshCount: 180,
    consumeSoonCount: 42,
    spoiledCount: 28,
    qualityPassRate: 88.8,
    status: "QUARANTINED",
    quarantined: true,
    originFacility: "Hubli Processing Hub",
    arrivalDate: "2026-09-06"
  },
  {
    batchId: "BATCH-BANANA-0908",
    productName: "Cavendish Robusta Banana",
    category: "Fruits",
    totalUnits: 500,
    scannedUnits: 410,
    freshCount: 290,
    consumeSoonCount: 110,
    spoiledCount: 10,
    qualityPassRate: 97.5,
    status: "FEFO_PRIORITY",
    quarantined: false,
    originFacility: "Theni Ripening Center",
    arrivalDate: "2026-09-07"
  }
];

const SEED_ALERTS = [
  {
    id: "ALT-001",
    title: "Critical Spoilage: Chicken Breast",
    severity: "HIGH",
    category: "Meat",
    itemRef: "INV-003",
    batchRef: "BATCH-CHK-0906",
    message: "Screening detected high volatile organic gas signatures (680 RAW). Immediate quarantine mandated.",
    timestamp: "2026-09-10 15:30",
    resolved: false,
    action: "Quarantine & Safely Discard"
  },
  {
    id: "ALT-002",
    title: "Consumption Priority: Cavendish Banana",
    severity: "MEDIUM",
    category: "Fruits",
    itemRef: "INV-002",
    batchRef: "BATCH-BANANA-0908",
    message: "45 kg batch approaching maturity threshold (310 RAW). FEFO priority recommended.",
    timestamp: "2026-09-10 16:15",
    resolved: false,
    action: "Move to Rapid Sale / Kitchen Processing"
  },
  {
    id: "ALT-003",
    title: "Batch Quality Advisory: #BATCH-CHK-0906",
    severity: "HIGH",
    category: "Industrial",
    itemRef: null,
    batchRef: "BATCH-CHK-0906",
    message: "Batch defect threshold reached 11.2% (28 units flagged spoiled).",
    timestamp: "2026-09-10 15:35",
    resolved: false,
    action: "Hold batch dispatch"
  }
];

const SEED_COLD_CHAIN = [
  {
    stage: "Farm / Harvest",
    location: "Nilgiris Dairy Cooperative",
    status: "PASS",
    timestamp: "2026-09-08 06:00",
    tempLogged: "3.8°C",
    compliance: "Compliant"
  },
  {
    stage: "Processing & Pasteurization",
    location: "Salem Central Plant",
    status: "PASS",
    timestamp: "2026-09-08 14:30",
    tempLogged: "4.1°C",
    compliance: "Compliant"
  },
  {
    stage: "Cold Storage Warehouse",
    location: "Chennai Logistics Hub Bay 3",
    status: "PASS",
    timestamp: "2026-09-09 04:00",
    tempLogged: "3.5°C",
    compliance: "Compliant"
  },
  {
    stage: "Refrigerated Transit",
    location: "Truck #TN-22-4418",
    status: "WARNING",
    timestamp: "2026-09-09 18:00",
    tempLogged: "7.2°C (Transient Spike)",
    compliance: "Threshold Warning (Ambient Spike)"
  },
  {
    stage: "Retail Inspection (SafeBite Scanner)",
    location: "Supermarket Chiller Intake",
    status: "PASS",
    timestamp: "2026-09-10 16:45",
    tempLogged: "[Future Sensor Integration]",
    compliance: "Hardware Gas Screening: FRESH (142 RAW)"
  }
];

export const storageService = {
  // SCANS
  getScans() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCANS);
      return data ? JSON.parse(data) : SEED_SCANS;
    } catch {
      return SEED_SCANS;
    }
  },
  saveScan(scanRecord) {
    const scans = this.getScans();
    const updated = [scanRecord, ...scans];
    try {
      localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage write error:", e);
    }
    return updated;
  },

  // INVENTORY
  getInventory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      return data ? JSON.parse(data) : SEED_INVENTORY;
    } catch {
      return SEED_INVENTORY;
    }
  },
  saveInventoryItem(item) {
    const inv = this.getInventory();
    const existingIndex = inv.findIndex((i) => i.id === item.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...inv];
      updated[existingIndex] = item;
    } else {
      updated = [item, ...inv];
    }
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage write error:", e);
    }
    return updated;
  },
  deleteInventoryItem(id) {
    const inv = this.getInventory();
    const updated = inv.filter((i) => i.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage write error:", e);
    }
    return updated;
  },

  // BATCHES
  getBatches() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BATCHES);
      return data ? JSON.parse(data) : SEED_BATCHES;
    } catch {
      return SEED_BATCHES;
    }
  },
  updateBatch(batchId, updates) {
    const batches = this.getBatches();
    const updated = batches.map((b) => (b.batchId === batchId ? { ...b, ...updates } : b));
    try {
      localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage write error:", e);
    }
    return updated;
  },

  // ALERTS
  getAlerts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALERTS);
      return data ? JSON.parse(data) : SEED_ALERTS;
    } catch {
      return SEED_ALERTS;
    }
  },
  addAlert(alert) {
    const alerts = this.getAlerts();
    const updated = [alert, ...alerts];
    try {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage write error:", e);
    }
    return updated;
  },
  dismissAlert(id) {
    const alerts = this.getAlerts();
    const updated = alerts.map((a) => (a.id === id ? { ...a, resolved: true } : a));
    try {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage write error:", e);
    }
    return updated;
  },

  // COLD CHAIN
  getColdChainLogs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COLD_CHAIN);
      return data ? JSON.parse(data) : SEED_COLD_CHAIN;
    } catch {
      return SEED_COLD_CHAIN;
    }
  },

  // SETTINGS
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : { mode: 'INDIVIDUAL', theme: 'light', soundEnabled: true };
    } catch {
      return { mode: 'INDIVIDUAL', theme: 'light', soundEnabled: true };
    }
  },
  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn("Storage write error:", e);
    }
  },

  // RESET / PURGE
  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.SCANS);
    localStorage.removeItem(STORAGE_KEYS.INVENTORY);
    localStorage.removeItem(STORAGE_KEYS.BATCHES);
    localStorage.removeItem(STORAGE_KEYS.ALERTS);
    localStorage.removeItem(STORAGE_KEYS.COLD_CHAIN);
    return {
      scans: SEED_SCANS,
      inventory: SEED_INVENTORY,
      batches: SEED_BATCHES,
      alerts: SEED_ALERTS,
      coldChain: SEED_COLD_CHAIN
    };
  }
};
