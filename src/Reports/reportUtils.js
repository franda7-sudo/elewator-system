// /src/reports/reportUtils.js

export function parseQuality(grainType, qualityParam) {
  if (!qualityParam) return {};

  const q = qualityParam.toLowerCase();

  if (grainType === "PSZENICA") {
    const bialko = q.match(/białko\s*([\d.,]+)/);
    return {
      bialko: bialko ? parseFloat(bialko[1].replace(",", ".")) : null
    };
  }

  if (grainType === "ZYTO") {
    const lo = q.match(/lo\s*([\d.,]+)/);
    const wilg = q.match(/wilg\.*\s*([\d.,]+)/);
    return {
      lo: lo ? parseFloat(lo[1].replace(",", ".")) : null,
      wilgotnosc: wilg ? parseFloat(wilg[1].replace(",", ".")) : null
    };
  }

  if (grainType === "OWIES" || grainType === "JECZMIEN") {
    const gest = q.match(/gęstość\s*([\d.,]+)/);
    const wilg = q.match(/wilg\.*\s*([\d.,]+)/);
    return {
      gestosc: gest ? parseFloat(gest[1].replace(",", ".")) : null,
      wilgotnosc: wilg ? parseFloat(wilg[1].replace(",", ".")) : null
    };
  }

  return {};
}

export function getDays(date) {
  return Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
}
