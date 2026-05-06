export const QUALITY_GROUPS = {
  "Pszenica": {
    unit: "% Białko",
    param: "protein", // klucz w bazie
    ranges: [
      { label: "Paszowa", min: 0, max: 11.4 },
      { label: "Konsumpcyjna B2", min: 11.5, max: 12.4 },
      { label: "Konsumpcyjna B1", min: 12.5, max: 13.9 },
      { label: "Elite", min: 14.0, max: 99.0 }
    ]
  },
  "Żyto": {
    unit: "s (Opadanie)",
    param: "fallingNumber",
    ranges: [
      { label: "Paszowe", min: 0, max: 99 },
      { label: "Konsumpcyjne", min: 100, max: 999 }
    ]
  },
  "Jęczmień": {
    unit: "kg/hl (Gęstość)",
    param: "density",
    ranges: [
      { label: "Lekki", min: 0, max: 61.9 },
      { label: "Gęsty", min: 62.0, max: 99.0 }
    ]
  },
  "Pellet": {
    unit: "% Wilgotność",
    param: "moisture",
    ranges: [
      { label: "Suchy", min: 0, max: 10.0 },
      { label: "Wilgotny", min: 10.1, max: 99.0 }
    ]
  }
};