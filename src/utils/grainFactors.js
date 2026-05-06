// src/utils/grainFactors.js

// --- PRZELICZNIKI LUZU (t/m) ---
export const CORRECTION_FACTORS = {
  S: { // S + G
    height: 24,
    factors: {
      pszenica: 11.5,
      zyto: 11.0,
      owies: 8.0,
      jeczmien: 10.5,
      pellet: 9.5
    },
    capacity: {
      pszenica: 250,
      zyto: 250,
      owies: 180,
      jeczmien: 250,
      pellet: 250
    }
  },

  N: { // Nowy elewator
    height: 28,
    factors: {
      pszenica: 39.5,
      zyto: 39.0
    },
    capacity: {
      pszenica: 1060,
      zyto: 1060
    }
  }
};

// --- USTALENIE SEKCJI NA PODSTAWIE ID KOMORY ---
export function getCellSection(cellId) {
  if (cellId.endsWith("N")) return "N";
  return "S"; // S + G + W
}

// --- GŁÓWNA FUNKCJA OBLICZAJĄCA KOREKTĘ ---
export function calculateCorrectionForCell(cell, luzCm) {
  if (!cell || !cell.id || !cell.grain) return null;

  const section = getCellSection(cell.id);
  const cfg = CORRECTION_FACTORS[section];

  const factor = cfg.factors[cell.grain];
  if (!factor) return null;

  const luzM = (Number(luzCm) || 0) / 100;

  const korekta = luzM * factor;
  const newWeight = (Number(cell.weight) || 0) + korekta;

  const height = cfg.height;
  const zajetaPrzestrzen = Math.max(0, height - luzM);

  return {
    luzM,
    korekta,
    newWeight,
    zajetaPrzestrzen,
    height,
    factor
  };
}
