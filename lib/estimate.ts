export type FoodItem = { keyword: string; kg: number };
export type TransportItem = { keyword: string; km: number; kg: number };

export type FootprintResult = {
  totalKg: number;
  foodItems: FoodItem[];
  transportItems: TransportItem[];
  unmatched: boolean;
};

// Approximate kg CO2e. Rounded DEFRA / Our World in Data averages for an MVP.
const FOOD_FACTORS: Record<string, number> = {
  "carne de res": 6.6,
  carne: 6.6,
  res: 6.6,
  cerdo: 3.8,
  pollo: 1.1,
  pescado: 1.5,
  huevo: 0.4,
  lacteos: 1.0,
  lácteos: 1.0,
  queso: 2.1,
  vegetariano: 0.5,
  vegetariana: 0.5,
  vegano: 0.3,
  vegana: 0.3,
  ensalada: 0.3,
};

const TRANSPORT_KG_PER_KM: Record<string, number> = {
  avion: 0.15,
  avión: 0.15,
  carro: 0.21,
  auto: 0.21,
  coche: 0.21,
  moto: 0.11,
  bus: 0.1,
  autobus: 0.1,
  autobús: 0.1,
  metro: 0.04,
  tren: 0.04,
  bicicleta: 0.0,
  bici: 0.0,
  caminando: 0.0,
  "a pie": 0.0,
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findFoodMatches(text: string): FoodItem[] {
  const matches: FoodItem[] = [];
  for (const [keyword, kg] of Object.entries(FOOD_FACTORS)) {
    const pattern = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i");
    if (pattern.test(text)) {
      matches.push({ keyword, kg });
    }
  }
  return matches;
}

function findTransportMatches(text: string): TransportItem[] {
  const matches: TransportItem[] = [];
  for (const [keyword, factor] of Object.entries(TRANSPORT_KG_PER_KM)) {
    const escaped = escapeRegExp(keyword);
    const pattern = new RegExp(
      `(\\d+(?:[.,]\\d+)?)\\s*km[^.]*?\\b${escaped}\\b|\\b${escaped}\\b[^.]*?(\\d+(?:[.,]\\d+)?)\\s*km`,
      "i",
    );
    const match = text.match(pattern);
    if (!match) continue;
    const kmStr = match[1] ?? match[2];
    if (!kmStr) continue;
    const km = Number.parseFloat(kmStr.replace(",", "."));
    matches.push({ keyword, km, kg: km * factor });
  }
  return matches;
}

export function estimateFootprint(rawText: string): FootprintResult {
  const text = rawText.toLowerCase();
  const foodMatches = findFoodMatches(text);
  const transportMatches = findTransportMatches(text);

  const uniqueFood: FoodItem[] = [];
  const seenFoodFactors = new Set<number>();
  for (const item of foodMatches) {
    if (seenFoodFactors.has(item.kg)) continue;
    seenFoodFactors.add(item.kg);
    uniqueFood.push(item);
  }

  const uniqueTransport: TransportItem[] = [];
  const seenTransport = new Set<string>();
  for (const item of transportMatches) {
    const key = `${item.km}:${item.kg}`;
    if (seenTransport.has(key)) continue;
    seenTransport.add(key);
    uniqueTransport.push(item);
  }

  const totalKg =
    uniqueFood.reduce((sum, item) => sum + item.kg, 0) +
    uniqueTransport.reduce((sum, item) => sum + item.kg, 0);

  return {
    totalKg: Math.round(totalKg * 100) / 100,
    foodItems: uniqueFood,
    transportItems: uniqueTransport,
    unmatched: uniqueFood.length === 0 && uniqueTransport.length === 0,
  };
}
