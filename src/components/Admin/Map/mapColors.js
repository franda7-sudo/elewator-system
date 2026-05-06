export function getGrainColor({ grain, protein }) {
  if (!grain) return "#777";

  const g = grain.toLowerCase();

  const COLORS = {
    pszenica: protein >= 11 ? "#d98e04" : "#b57a03",
    zyto: "#7fbf3f",
    owies: "#e6d54a",
    jeczmien: "#4fa3d1",
    kukurydza: "#ffb300",
    rzepak: "#222",
    pellet: "#999",
    puste: "#777",
  };

  return COLORS[g] || "#777";
}
