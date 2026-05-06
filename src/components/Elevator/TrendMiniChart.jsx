// /src/components/Elevator/TrendMiniChart.jsx
import { Line } from "react-chartjs-2";

export default function TrendMiniChart({ label, values }) {
  if (!values || values.length === 0) return null;

  const data = {
    labels: values.map((_, i) => i + 1),
    datasets: [
      {
        label,
        data: values,
        borderColor: "#4fc3f7",
        backgroundColor: "rgba(79,195,247,0.2)",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const options = {
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="trend-mini-chart">
      <Line data={data} options={options} />
    </div>
  );
}
