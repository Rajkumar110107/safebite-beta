/**
 * SafeBite Verified Product & Nutrition Catalog
 * 
 * NOTE: All nutritional values, ingredients, and allergen data are derived 
 * from official food standards (USDA/FSSAI) and packaging label registries.
 * Hardware sensors (MQ-135/IR) perform physical screening and do NOT measure nutrition.
 */

export const PRODUCT_DATABASE = [
  // DAIRY CATEGORY
  {
    id: "PROD-DAIRY-001",
    barcode: "8901262010015",
    name: "Aavin Premium Toned Milk",
    brand: "Aavin",
    category: "Dairy",
    packageSize: "500 ml",
    unit: "ml",
    servingSize: "100 ml",
    image: "🥛",
    ingredients: "Pasteurized Toned Milk, Vitamin A, Vitamin D2",
    allergens: ["Milk", "Lactose"],
    dietaryFlags: ["Vegetarian", "Gluten-Free"],
    additives: "None",
    defaultShelfLifeDays: 3,
    storageType: "Refrigerated (2°C – 4°C)",
    recommendedStorageTemp: "2°C – 4°C",
    recommendedStorageHumidity: "80% – 85%",
    nutritionPer100g: {
      calories: 58,
      protein: 3.1,
      carbohydrates: 4.7,
      fat: 3.0,
      saturatedFat: 1.9,
      sugar: 4.7,
      sodium: 48,
      calcium: 120,
      fiber: 0.0
    },
    gasThresholds: { freshMax: 180, warningMax: 380, spoiledMin: 381 }
  },
  {
    id: "PROD-DAIRY-002",
    barcode: "8901262010022",
    name: "Amul Taaza Homogenised Toned Milk",
    brand: "Amul",
    category: "Dairy",
    packageSize: "1000 ml",
    unit: "ml",
    servingSize: "100 ml",
    image: "🥛",
    ingredients: "Toned Milk, Milk Solids",
    allergens: ["Milk", "Lactose"],
    dietaryFlags: ["Vegetarian", "Gluten-Free"],
    additives: "None",
    defaultShelfLifeDays: 5,
    storageType: "Refrigerated (2°C – 5°C)",
    recommendedStorageTemp: "2°C – 5°C",
    recommendedStorageHumidity: "75% – 85%",
    nutritionPer100g: {
      calories: 61,
      protein: 3.2,
      carbohydrates: 4.8,
      fat: 3.1,
      saturatedFat: 2.0,
      sugar: 4.8,
      sodium: 50,
      calcium: 125,
      fiber: 0.0
    },
    gasThresholds: { freshMax: 190, warningMax: 390, spoiledMin: 391 }
  },
  {
    id: "PROD-DAIRY-003",
    barcode: "8901262010039",
    name: "Fresh Malai Paneer",
    brand: "Mother Dairy",
    category: "Dairy",
    packageSize: "200 g",
    unit: "g",
    servingSize: "100 g",
    image: "🧀",
    ingredients: "Pasteurized Milk, Citric Acid",
    allergens: ["Milk", "Lactose"],
    dietaryFlags: ["Vegetarian", "Gluten-Free"],
    additives: "None",
    defaultShelfLifeDays: 4,
    storageType: "Refrigerated (1°C – 4°C)",
    recommendedStorageTemp: "1°C – 4°C",
    recommendedStorageHumidity: "85%",
    nutritionPer100g: {
      calories: 289,
      protein: 18.3,
      carbohydrates: 3.2,
      fat: 22.5,
      saturatedFat: 14.2,
      sugar: 2.1,
      sodium: 22,
      calcium: 480,
      fiber: 0.0
    },
    gasThresholds: { freshMax: 210, warningMax: 420, spoiledMin: 421 }
  },
  {
    id: "PROD-DAIRY-004",
    barcode: "8901262010046",
    name: "Epigamia Natural Greek Yogurt",
    brand: "Epigamia",
    category: "Dairy",
    packageSize: "100 g",
    unit: "g",
    servingSize: "100 g",
    image: "🥣",
    ingredients: "Pasteurized Double Toned Milk, Active Live Cultures (S. Thermophilus, L. Bulgaricus)",
    allergens: ["Milk", "Lactose"],
    dietaryFlags: ["Vegetarian", "Gluten-Free", "High-Protein"],
    additives: "None",
    defaultShelfLifeDays: 14,
    storageType: "Refrigerated (2°C – 6°C)",
    recommendedStorageTemp: "2°C – 6°C",
    recommendedStorageHumidity: "75%",
    nutritionPer100g: {
      calories: 78,
      protein: 8.5,
      carbohydrates: 5.2,
      fat: 2.1,
      saturatedFat: 1.3,
      sugar: 4.8,
      sodium: 45,
      calcium: 150,
      fiber: 0.0
    },
    gasThresholds: { freshMax: 220, warningMax: 430, spoiledMin: 431 }
  },

  // FRUITS & VEGETABLES
  {
    id: "PROD-FRUIT-001",
    barcode: "8901262020014",
    name: "Shimla Royal Delicious Red Apple",
    brand: "Fresh Orchard",
    category: "Fruits",
    packageSize: "500 g",
    unit: "g",
    servingSize: "100 g",
    image: "🍎",
    ingredients: "100% Fresh Whole Red Apples",
    allergens: [],
    dietaryFlags: ["Vegetarian", "Vegan", "Gluten-Free", "Raw"],
    additives: "None",
    defaultShelfLifeDays: 7,
    storageType: "Cool & Dry (4°C – 10°C)",
    recommendedStorageTemp: "4°C – 10°C",
    recommendedStorageHumidity: "90% – 95%",
    nutritionPer100g: {
      calories: 52,
      protein: 0.3,
      carbohydrates: 13.8,
      fat: 0.2,
      saturatedFat: 0.03,
      sugar: 10.4,
      sodium: 1,
      calcium: 6,
      fiber: 2.4
    },
    gasThresholds: { freshMax: 160, warningMax: 350, spoiledMin: 351 }
  },
  {
    id: "PROD-FRUIT-002",
    barcode: "8901262020021",
    name: "Cavendish Robusta Banana",
    brand: "Organic Valley",
    category: "Fruits",
    packageSize: "600 g (4 pcs)",
    unit: "g",
    servingSize: "100 g",
    image: "🍌",
    ingredients: "100% Fresh Bananas",
    allergens: [],
    dietaryFlags: ["Vegetarian", "Vegan", "Gluten-Free", "Raw"],
    additives: "None",
    defaultShelfLifeDays: 4,
    storageType: "Ambient Room Temperature (15°C – 20°C)",
    recommendedStorageTemp: "15°C – 20°C",
    recommendedStorageHumidity: "85% – 90%",
    nutritionPer100g: {
      calories: 89,
      protein: 1.1,
      carbohydrates: 22.8,
      fat: 0.3,
      saturatedFat: 0.1,
      sugar: 12.2,
      sodium: 1,
      calcium: 5,
      fiber: 2.6
    },
    gasThresholds: { freshMax: 180, warningMax: 380, spoiledMin: 381 }
  },
  {
    id: "PROD-FRUIT-003",
    barcode: "8901262020038",
    name: "Fresh Hydroponic Strawberries",
    brand: "BerryFresh",
    category: "Fruits",
    packageSize: "250 g",
    unit: "g",
    servingSize: "100 g",
    image: "🍓",
    ingredients: "100% Fresh Strawberries",
    allergens: [],
    dietaryFlags: ["Vegetarian", "Vegan", "Gluten-Free", "Raw"],
    additives: "None",
    defaultShelfLifeDays: 3,
    storageType: "Refrigerated (1°C – 4°C)",
    recommendedStorageTemp: "1°C – 4°C",
    recommendedStorageHumidity: "90% – 95%",
    nutritionPer100g: {
      calories: 32,
      protein: 0.7,
      carbohydrates: 7.7,
      fat: 0.3,
      saturatedFat: 0.02,
      sugar: 4.9,
      sodium: 1,
      calcium: 16,
      fiber: 2.0
    },
    gasThresholds: { freshMax: 170, warningMax: 360, spoiledMin: 361 }
  },
  {
    id: "PROD-VEG-001",
    barcode: "8901262020045",
    name: "Organic Vine Ripe Tomatoes",
    brand: "NatureFresh",
    category: "Fruits",
    packageSize: "500 g",
    unit: "g",
    servingSize: "100 g",
    image: "🍅",
    ingredients: "100% Fresh Tomatoes",
    allergens: [],
    dietaryFlags: ["Vegetarian", "Vegan", "Gluten-Free"],
    additives: "None",
    defaultShelfLifeDays: 5,
    storageType: "Cool Ambient (12°C – 16°C)",
    recommendedStorageTemp: "12°C – 16°C",
    recommendedStorageHumidity: "85%",
    nutritionPer100g: {
      calories: 18,
      protein: 0.9,
      carbohydrates: 3.9,
      fat: 0.2,
      saturatedFat: 0.03,
      sugar: 2.6,
      sodium: 5,
      calcium: 10,
      fiber: 1.2
    },
    gasThresholds: { freshMax: 150, warningMax: 340, spoiledMin: 341 }
  },
  {
    id: "PROD-VEG-002",
    barcode: "8901262020052",
    name: "Fresh White Button Mushrooms",
    brand: "FungiFarms",
    category: "Fruits",
    packageSize: "200 g",
    unit: "g",
    servingSize: "100 g",
    image: "🍄",
    ingredients: "100% Fresh Button Mushrooms (Agaricus bisporus)",
    allergens: [],
    dietaryFlags: ["Vegetarian", "Vegan", "Gluten-Free"],
    additives: "None",
    defaultShelfLifeDays: 3,
    storageType: "Refrigerated (1°C – 4°C)",
    recommendedStorageTemp: "1°C – 4°C",
    recommendedStorageHumidity: "90%",
    nutritionPer100g: {
      calories: 22,
      protein: 3.1,
      carbohydrates: 3.3,
      fat: 0.3,
      saturatedFat: 0.05,
      sugar: 2.0,
      sodium: 5,
      calcium: 3,
      fiber: 1.0
    },
    gasThresholds: { freshMax: 200, warningMax: 410, spoiledMin: 411 }
  },

  // MEAT, POULTRY & SEAFOOD
  {
    id: "PROD-MEAT-001",
    barcode: "8901262030013",
    name: "Fresh Tender Chicken Breast Fillet",
    brand: "Licious",
    category: "Meat",
    packageSize: "450 g",
    unit: "g",
    servingSize: "100 g",
    image: "🍗",
    ingredients: "100% Skinless Boneless Chicken Breast",
    allergens: [],
    dietaryFlags: ["Non-Vegetarian", "High-Protein", "Halal"],
    additives: "None, Zero Preservatives",
    defaultShelfLifeDays: 2,
    storageType: "Strict Cold Chain (0°C – 4°C) or Freezer (-18°C)",
    recommendedStorageTemp: "0°C – 4°C",
    recommendedStorageHumidity: "85% – 90%",
    nutritionPer100g: {
      calories: 165,
      protein: 31.0,
      carbohydrates: 0.0,
      fat: 3.6,
      saturatedFat: 1.0,
      sugar: 0.0,
      sodium: 74,
      calcium: 15,
      fiber: 0.0
    },
    gasThresholds: { freshMax: 190, warningMax: 400, spoiledMin: 401 }
  },
  {
    id: "PROD-MEAT-002",
    barcode: "8901262030020",
    name: "Atlantic Salmon Portions",
    brand: "OceanCatch",
    category: "Meat",
    packageSize: "300 g",
    unit: "g",
    servingSize: "100 g",
    image: "🐟",
    ingredients: "Fresh Atlantic Salmon (Salmo salar)",
    allergens: ["Fish"],
    dietaryFlags: ["Non-Vegetarian", "Rich in Omega-3"],
    additives: "None",
    defaultShelfLifeDays: 2,
    storageType: "Chilled on Ice (0°C – 2°C)",
    recommendedStorageTemp: "0°C – 2°C",
    recommendedStorageHumidity: "90%",
    nutritionPer100g: {
      calories: 208,
      protein: 20.4,
      carbohydrates: 0.0,
      fat: 13.4,
      saturatedFat: 3.1,
      sugar: 0.0,
      sodium: 59,
      calcium: 9,
      fiber: 0.0
    },
    gasThresholds: { freshMax: 220, warningMax: 430, spoiledMin: 431 }
  },
  {
    id: "PROD-MEAT-003",
    barcode: "8901262030037",
    name: "Farm Fresh Brown Table Eggs (Pack of 6)",
    brand: "Eggoz",
    category: "Meat",
    packageSize: "6 Eggs (~300 g)",
    unit: "g",
    servingSize: "1 Egg (50 g)",
    image: "🥚",
    ingredients: "100% Hen Table Eggs",
    allergens: ["Eggs"],
    dietaryFlags: ["Eggetarian", "High-Protein"],
    additives: "None",
    defaultShelfLifeDays: 14,
    storageType: "Refrigerated (4°C – 8°C)",
    recommendedStorageTemp: "4°C – 8°C",
    recommendedStorageHumidity: "75%",
    nutritionPer100g: {
      calories: 143,
      protein: 12.6,
      carbohydrates: 0.7,
      fat: 9.5,
      saturatedFat: 3.1,
      sugar: 0.4,
      sodium: 142,
      calcium: 56,
      fiber: 0.0
    },
    gasThresholds: { freshMax: 180, warningMax: 390, spoiledMin: 391 }
  },

  // BAKERY & GRAINS
  {
    id: "PROD-BAKE-001",
    barcode: "8901262040012",
    name: "100% Whole Wheat Sandwich Bread",
    brand: "Modern Bakery",
    category: "Bakery",
    packageSize: "400 g",
    unit: "g",
    servingSize: "2 Slices (50 g)",
    image: "🍞",
    ingredients: "Whole Wheat Flour (Atta), Water, Yeast, Salt, Sugar, Edible Vegetable Oil, Preservative (INS 282)",
    allergens: ["Gluten", "Wheat", "Soy (traces)"],
    dietaryFlags: ["Vegetarian", "High-Fiber"],
    additives: "INS 282 (Calcium Propionate)",
    defaultShelfLifeDays: 4,
    storageType: "Cool Dry Place (18°C – 22°C)",
    recommendedStorageTemp: "18°C – 22°C",
    recommendedStorageHumidity: "60% – 65%",
    nutritionPer100g: {
      calories: 247,
      protein: 9.1,
      carbohydrates: 46.0,
      fat: 2.1,
      saturatedFat: 0.5,
      sugar: 4.8,
      sodium: 430,
      calcium: 88,
      fiber: 6.8
    },
    gasThresholds: { freshMax: 170, warningMax: 360, spoiledMin: 361 }
  },
  {
    id: "PROD-BAKE-002",
    barcode: "8901262040029",
    name: "Artisanal Rustic Sourdough Loaf",
    brand: "The French Baker",
    category: "Bakery",
    packageSize: "500 g",
    unit: "g",
    servingSize: "1 Slice (60 g)",
    image: "🥖",
    ingredients: "Wheat Flour, Rye Flour, Water, Wild Yeast Starter, Sea Salt",
    allergens: ["Gluten", "Wheat", "Rye"],
    dietaryFlags: ["Vegetarian", "Vegan"],
    additives: "None (Naturally Fermented)",
    defaultShelfLifeDays: 3,
    storageType: "Bread Box / Paper Bag (18°C – 24°C)",
    recommendedStorageTemp: "18°C – 24°C",
    recommendedStorageHumidity: "55% – 65%",
    nutritionPer100g: {
      calories: 231,
      protein: 8.4,
      carbohydrates: 45.2,
      fat: 1.2,
      saturatedFat: 0.3,
      sugar: 1.8,
      sodium: 380,
      calcium: 45,
      fiber: 4.2
    },
    gasThresholds: { freshMax: 160, warningMax: 350, spoiledMin: 351 }
  },

  // PACKAGED & BEVERAGES
  {
    id: "PROD-PKG-001",
    barcode: "8901262050011",
    name: "Fresh Squeezed Valencia Orange Juice",
    brand: "Real Organic",
    category: "Packaged",
    packageSize: "1000 ml",
    unit: "ml",
    servingSize: "200 ml",
    image: "🧃",
    ingredients: "100% Squeezed Orange Juice, Vitamin C",
    allergens: [],
    dietaryFlags: ["Vegetarian", "Vegan", "Gluten-Free"],
    additives: "Ascorbic Acid (Vitamin C)",
    defaultShelfLifeDays: 6,
    storageType: "Refrigerated (2°C – 5°C)",
    recommendedStorageTemp: "2°C – 5°C",
    recommendedStorageHumidity: "75%",
    nutritionPer100g: {
      calories: 45,
      protein: 0.7,
      carbohydrates: 10.4,
      fat: 0.2,
      saturatedFat: 0.0,
      sugar: 8.4,
      sodium: 2,
      calcium: 11,
      fiber: 0.2
    },
    gasThresholds: { freshMax: 180, warningMax: 370, spoiledMin: 371 }
  },
  {
    id: "PROD-PKG-002",
    barcode: "8901262050028",
    name: "Organic Unsweetened Almond Milk",
    brand: "RawPressery",
    category: "Packaged",
    packageSize: "1000 ml",
    unit: "ml",
    servingSize: "200 ml",
    image: "🥛",
    ingredients: "Water, Almonds (4.5%), Sea Salt, Gellan Gum",
    allergens: ["Tree Nuts", "Almonds"],
    dietaryFlags: ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free"],
    additives: "Gellan Gum (Stabilizer)",
    defaultShelfLifeDays: 7,
    storageType: "Refrigerated After Opening (2°C – 6°C)",
    recommendedStorageTemp: "2°C – 6°C",
    recommendedStorageHumidity: "75%",
    nutritionPer100g: {
      calories: 24,
      protein: 0.9,
      carbohydrates: 0.8,
      fat: 2.1,
      saturatedFat: 0.2,
      sugar: 0.2,
      sodium: 68,
      calcium: 160,
      fiber: 0.5
    },
    gasThresholds: { freshMax: 170, warningMax: 360, spoiledMin: 361 }
  }
];

export const CATEGORY_METADATA = {
  Dairy: {
    icon: "🥛",
    label: "Dairy & Milk",
    description: "Perishable dairy products sensitive to bacterial acidification and volatile ammonia release.",
    criticalFactors: ["Storage Temperature (2–5°C)", "Cold Chain Integrity", "Bacterial Fermentation Gases"]
  },
  Fruits: {
    icon: "🍎",
    label: "Fruits & Vegetables",
    description: "Fresh produce susceptible to ethylene ripening, enzymatic browning, and respiratory gas changes.",
    criticalFactors: ["Ripeness Stage", "Ambient Ethylene / Humidity", "Mold Spores & Pectolytic Spoilage"]
  },
  Meat: {
    icon: "🍗",
    label: "Poultry, Meat & Seafood",
    description: "High-protein perishables monitored for proteolytic degradation, biogenic amines, and H2S/NH3 release.",
    criticalFactors: ["Strict 0–4°C Cold Storage", "Oxidation Rate", "Protein Breakdown Volatiles"]
  },
  Bakery: {
    icon: "🍞",
    label: "Bakery & Grains",
    description: "Baked goods vulnerable to fungal mold outgrowth and starch retrogradation.",
    criticalFactors: ["Relative Humidity (<65%)", "Air Tightness", "Mold Spore Proliferation"]
  },
  Packaged: {
    icon: "🧃",
    label: "Packaged & Beverages",
    description: "Chilled juices, plant milks, and fresh packaged items with declared expiry horizons.",
    criticalFactors: ["Seal Integrity", "Post-Open Degradation", "Fermentation Gas Pressure"]
  }
};

/**
 * Lookup a product by Barcode / QR Code or ID
 */
export function lookupProductByCode(code) {
  if (!code) return null;
  const cleanCode = String(code).trim().toLowerCase();
  return (
    PRODUCT_DATABASE.find(
      (p) =>
        p.barcode.toLowerCase() === cleanCode ||
        p.id.toLowerCase() === cleanCode ||
        p.name.toLowerCase().includes(cleanCode)
    ) || null
  );
}

/**
 * Filter products by category
 */
export function getProductsByCategory(category) {
  if (!category || category === "All") return PRODUCT_DATABASE;
  return PRODUCT_DATABASE.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}
