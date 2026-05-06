export default function CellBase({
  id,
  grain,
  weight,
  params,
  avgTemp,
  firstFill,
  color,
  border
}) {
  const getTextColor = (bg) => {
    if (!bg) return "#000";
    const r = parseInt(bg.substr(1, 2), 16);
    const g = parseInt(bg.substr(3, 2), 16);
    const b = parseInt(bg.substr(5, 2), 16);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 150 ? "#000" : "#fff";
  };

  return (
    <div
      style={{
        backgroundColor: color,
        border: border,
        borderRadius: 4,
        width: "100%",
        height: "48px",          // ⭐ stała wysokość = stabilny układ
        display: "flex",
        alignItems: "center",     // pionowe centrowanie
        justifyContent: "center", // poziome centrowanie
        fontWeight: "bold",
        color: getTextColor(color),
        boxSizing: "border-box",
        userSelect: "none"
      }}
    >
      {id}
    </div>
  );
}
