export default function CellBox({ id, data, onClick }) {
  if (!data) return null;

  const fill = data.capacity ? Math.min(100, (data.amount / data.capacity) * 100) : 0;

  return (
    <div className="cell" onClick={onClick}>
      <div className="cell-id">{id}</div>

      <div className="cell-grain">
        {data.grain || "—"}
      </div>

      <div className="cell-amount">
        {data.amount} / {data.capacity} t
      </div>

      <div className="cell-params">
        {data.humidity !== null && <div>Wilg: {data.humidity}%</div>}
        {data.protein !== null && <div>Białko: {data.protein}%</div>}
        {data.fallingNumber !== null && <div>Opad: {data.fallingNumber}s</div>}
        {data.density !== null && <div>Gęst: {data.density} kg/hl</div>}
      </div>

      <div className="fill-bar">
        <div
          className="fill"
          style={{
            width: `${fill}%`,
            background:
              fill > 90 ? "#d9534f" :
              fill > 70 ? "#f0ad4e" :
              "#5cb85c",
          }}
        />
      </div>
    </div>
  );
}
