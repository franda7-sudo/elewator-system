// =====================================
// getCellColor.js — pełny plik
// =====================================

import { GRAIN_COLORS } from "./GrainColors";

// Automatyczny kolor grupy jakości
export function getQualityGroupColor(label) {
  if (!label) return null;

  const hash = [...label].reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue = hash % 360;

  return `hsl(${hue}, 70%, 65%)`;
}

// Kolor zboża
export function getGrainColor(cell) {
  if (!cell || !cell.grain) return null;

  const grain = cell.grain;
  const colorDef = GRAIN_COLORS[grain];

  if (!colorDef) return null;

  // Pszenica ma zakresy białka
  if (grain === "pszenica" && colorDef.ranges && cell.bialko) {
    const protein = Number(cell.bialko);
    const range = colorDef.ranges.find(
      (r) => protein >= r.from && (r.to === undefined || protein < r.to)
    );
    return range ? range.color : null;
  }

  // Pozostałe zboża mają stały kolor
  if (typeof colorDef === "string") return colorDef;

  return null;
}

// Główna funkcja kolorowania komór
export function getCellColor(cell) {
  if (!cell) return "#ffffff";

  // 1. Kolor grupy jakości
  if (cell.qualityGroup) {
    const qColor = getQualityGroupColor(cell.qualityGroup);
    if (qColor) return qColor;
  }

  // 2. Kolor zboża
  const gColor = getGrainColor(cell);
  if (gColor) return gColor;

  // 3. Domyślny
  return "#ffffff";
}
