// src/utils/dallasMap.js
export function mapPhysicalChamberToCellId(n) {
  n = Number(n);

  if (n >= 1 && n <= 20) return `${n}N`;
  if (n >= 21 && n <= 25) return `${n}G`;
  if (n >= 26 && n <= 65) return `${n - 25}S`;

  return null;
}
