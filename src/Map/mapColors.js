// Schemat kolorów:
// pszenica < 11% białka – jasnopomarańczowy
// pszenica > 12% białka – pomarańczowy
// żyto – jasnozielony
// owies – żółty
// jęczmień – błękitny
// pellet – szary
// + możliwość dodania nowych zbóż
import { getQualityColor, getGrainColor } from "../../Map/mapColors";

export function getGrainColor(chamber) {
  const grainRaw = (chamber?.grain || "").toLowerCase();
  const proteinRaw = chamber?.protein ?? chamber?.params?.bialko;
  const protein = proteinRaw != null ? Number(proteinRaw) : null;

  if (!grainRaw) return "#dddddd";

  if (grainRaw.includes("pszenica")) {
    if (protein != null) {
      if (protein < 11) return "#ffb266"; // jasnopomarańczowy
      if (protein > 12) return "#ff8000"; // pomarańczowy
    }
    return "#ff9933"; // środek, gdy 11–12 lub brak danych
  }

  if (grainRaw.includes("żyto") || grainRaw.includes("zyto")) {
    return "#b6ff99"; // jasnozielony
  }

  if (grainRaw.includes("owies")) {
    return "#ffff66"; // żółty
  }

  if (grainRaw.includes("jęczmień") || grainRaw.includes("jeczmien")) {
    return "#66ccff"; // błękitny
  }

  if (grainRaw.includes("pellet")) {
    return "#cccccc"; // szary
  }

  // Nowe definicje zbóż – łatwo dodać:
  // if (grainRaw.includes("kukurydza")) return "#ffd54f";

  return "#dddddd";
}
