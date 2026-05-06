export function calculateTonnage(cellId, grainType, emptySpace) {
  const special_25 = ["444", "45", "48", "49", "51", "52"];
  const special_5 = ["46", "47", "40"];

  const id = String(cellId);

  // SPECJALNE KOMORY
  if (special_25.includes(id)) return 2.5 * emptySpace;
  if (special_5.includes(id)) return 5 * emptySpace;

  // TYP N
  if (id.endsWith("N")) {
    if (grainType === "pszenica") return 39.5 * emptySpace;
    if (grainType === "zyto") return 39 * emptySpace;
  }

  // TYP O
  if (id.endsWith("O")) {
    if (grainType === "owies") return 43 * emptySpace;
  }

  // TYP S + G
  if (id.endsWith("S") || id.endsWith("G")) {
    if (grainType === "pszenica" || grainType === "zyto") return 250;
    if (grainType === "owies") return 180;
  }

  return 0;
}
