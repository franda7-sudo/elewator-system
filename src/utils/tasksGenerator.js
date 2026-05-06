// /src/utils/massCalculations.js

export function calcRealMass(height, voidM, factor) {
  const zboze = height - voidM;
  return Math.round(zboze * factor);
}

export function calcDiff(real, theoretical) {
  const diffT = real - theoretical;
  const diffP = (diffT / theoretical) * 100;
  return {
    diffT: Math.round(diffT),
    diffP: Number(diffP.toFixed(2))
  };
}

export function getMassStatus(diffP) {
  if (diffP <= 1) return "OK";
  if (diffP <= 3) return "OSTRZEŻENIE";
  return "ALARM";
}
