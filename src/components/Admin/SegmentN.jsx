import React from "react";

export default function SegmentN({ status, onClick }) {
  const color =
    status === "alarm"
      ? "#f44336"
      : status === "warning"
      ? "#ff9800"
      : "#4caf50";

  return (
    <rect
      x="150"
      y="50"
      width="80"
      height="80"
      fill={color}
      stroke="#333"
      onClick={onClick}
      className="segment"
    />
  );
}
