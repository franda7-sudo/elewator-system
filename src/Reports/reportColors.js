// /src/reports/reportColors.js

export function getGrainColor(grainType, quality) {
  switch (grainType) {
    case "PSZENICA":
      if (quality?.bialko >= 12) return "#F5B041"; // pomarańczowy
      return "#FAD7A0"; // jasnopomarańczowy

    case "ZYTO":
      return "#ABEBC6"; // jasnozielony

    case "OWIES":
      return "#F7DC6F"; // żółty

    case "JECZMIEN":
      return "#AED6F1"; // błękitny

    case "PELLET":
      return "#D5D8DC"; // szary

    default:
      return "#E5E7E9"; // pusta
  }
}
