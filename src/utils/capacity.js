// utils/capacity.js

// Pojemności zależne od zboża dla komór 1–40S
export const capacityByGrain = {
  pszenica: 260,
  zyto: 250,
  owies: 180,
  jeczmien: 220,
  pellet: 220,
};

// Komory specjalizowane 43–52 (każda ma przypisany typ zboża)
export const specialCapacities = {
  "43": { grain: "owies", capacity: 80 },
  "44": { grain: "zyto", capacity: 60 },
  "45": { grain: "zyto", capacity: 60 },
  "46": { grain: "pszenica", capacity: 120 },
  "47": { grain: "pszenica", capacity: 120 },
  "48": { grain: "zyto", capacity: 60 },
  "49": { grain: "zyto", capacity: 60 },
  "50": { grain: "pszenica", capacity: 120 },
  "51": { grain: "pszenica", capacity: 60 },
  "52": { grain: "zyto", capacity: 60 },
};

// Komory N (1N–20N) – tylko pszenica i żyto
export const NCapacities = {
  allowedGrains: ["pszenica", "zyto"],
  capacity: 1060,
};

// Komory 21G–25G – 250 t, bez ograniczeń zboża
export const GCapacities = 250;

// Lista wszystkich komór w systemie
export const ALL_CELLS = [
  // 1–40S
  ...Array.from({ length: 40 }, (_, i) => `${i + 1}`),

  // 1N–20N
  ...Array.from({ length: 20 }, (_, i) => `${i + 1}N`),

  // 21G–25G
  "21G",
  "22G",
  "23G",
  "24G",
  "25G",

  // 43–52
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "50",
  "51",
  "52",
];

// Zwraca pojemność komory dla danego zboża
export function getCapacity(cellId, grain) {
  // Komory 1–40S
  if (/^\d+$/.test(cellId)) {
    const n = Number(cellId);
    if (n >= 1 && n <= 40) {
      return capacityByGrain[grain] || 0;
    }
  }

  // Komory 1N–20N
  if (/^\d+N$/.test(cellId)) {
    if (!NCapacities.allowedGrains.includes(grain)) return 0;
    return NCapacities.capacity;
  }

  // Komory 21G–25G
  if (/^\d+G$/.test(cellId)) {
    const n = Number(cellId.replace("G", ""));
    if (n >= 21 && n <= 25) return GCapacities;
  }

  // Komory specjalizowane 43–52
  if (specialCapacities[cellId]) {
    const spec = specialCapacities[cellId];
    if (spec.grain !== grain) return 0;
    return spec.capacity;
  }

  // Nieznana komora
  return 0;
}
