// /src/utils/grainCalculations.js

// Współczynniki gęstości dla różnych gatunków i typów komór
export const GRAIN_FACTORS = {
  PSZENICA: 0.75, // t/m³
  ZYTO: 0.72,
  OWIES: 0.55,
  JECZMIEN: 0.60,
  PELLET: 0.50,
  PUSTE: 1.00
};

// Pobiera współczynnik gęstości
export function getFactor(grainType, siloType = "S") {
  const base = GRAIN_FACTORS[grainType?.toUpperCase()] || 1;
  const correction = siloType === "N" ? 1.05 : 1; // północne komory nieco wyższe
  return base * correction;
}

// Konwersja ton → metry (wysokość zasypu)
export function tonsToMeters(tons, grainType, siloType = "S") {
  const factor = getFactor(grainType, siloType);
  return (tons / (factor * 100)).toFixed(2); // uproszczony przelicznik
}

// Wiek spodu (LIFO)
export function getBottomAge(layers) {
  if (!layers || layers.length === 0) return 0;
  const bottom = layers[0];
  return Math.floor((new Date() - new Date(bottom.date)) / (1000 * 60 * 60 * 24));
}

// Konwersja pustej objętości na tony (dla raportów pojemności)
export function voidToTons(meters, grainType, siloType = "S") {
  const factor = getFactor(grainType, siloType);
  return (meters * factor * 100).toFixed(1);
}
