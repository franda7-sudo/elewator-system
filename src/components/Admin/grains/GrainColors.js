export const GRAIN_COLORS = {
  // ============================
  // PSZENICA — ZAKRESY BIAŁKA
  // ============================
  pszenica: {
    ranges: [
      { from: 0, to: 12.0, color: "#FFCC80" },   // Jasnopomarańczowy (do 12%)
      { from: 12.0, color: "#FF9800" }           // Pomarańczowy (powyżej 12%)
    ]
  },

  // ============================
  // ŻYTO
  // ============================
  zyto: "#90EE90",
  żyto: "#90EE90",

  // ============================
  // OWIES
  // ============================
  owies: "#FFF59D",

  // ============================
  // JĘCZMIEŃ
  // ============================
  jeczmien: "#87CEEB",
  jęczmień: "#87CEEB",

  // ============================
  // PELLET
  // ============================
  pellet: "#9E9E9E"
};

// ===============================================
// FUNKCJA getCellColor — BRAKOWAŁA W TWOIM KODZIE
// ===============================================
export function getCellColor(cell) {
  if (!cell || !cell.grain) return "#444"; // neutralne tło

  const grain = cell.grain.toLowerCase();

  // -------------------------
  // PSZENICA — zakresy białka
  // -------------------------
  if (grain === "pszenica") {
    const protein = cell.params?.bialko;
    const ranges = GRAIN_COLORS.pszenica.ranges;

    if (typeof protein === "number") {
      const match = ranges.find(r =>
        protein >= r.from && (r.to === undefined || protein < r.to)
      );
      if (match) return match.color;
    }

    return ranges[ranges.length - 1].color;
  }

  // -------------------------
  // POZOSTAŁE ZBOŻA
  // -------------------------
  return (
    GRAIN_COLORS[grain] ||
    GRAIN_COLORS[grain.normalize("NFD").replace(/[\u0300-\u036f]/g, "")] ||
    "#444"
  );
}
