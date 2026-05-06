export default function CellInfo({ data }) {
  if (!data) return null;

  const fill = Math.min(100, (data.amount / data.capacity) * 100);

  return (
    <div style={{ fontSize: "10px", textAlign: "center", lineHeight: "1.1" }}>
      <div>{data.grain || "—"}</div>
      <div>{data.amount} / {data.capacity} t</div>

      {data.humidity !== null && <div>Wilg: {data.humidity}%</div>}
      {data.protein !== null && <div>Białko: {data.protein}%</div>}

      <div style={{
        width: "100%",
        height: "6px",
        background: "#ccc",
        borderRadius: "3px",
        marginTop: "3px",
        overflow: "hidden"
      }}>
        <div style={{
          width: `${fill}%`,
          height: "100%",
          background: fill > 90 ? "#d9534f" : fill > 70 ? "#f0ad4e" : "#5cb85c"
        }} />
      </div>
    </div>
  );
}
