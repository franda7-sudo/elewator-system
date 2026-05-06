import React from "react";

export default function PzzLogo({ width = 200 }) {
  return (
    <svg
      width={width}
      viewBox="0 0 300 70"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="300" height="70" fill="#020617" />
      <text
        x="20"
        y="38"
        fill="#fbbf24"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI'"
        fontSize="28"
        fontWeight="700"
      >
        PZZ S.A.
      </text>
      <text
        x="20"
        y="55"
        fill="#9ca3af"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI'"
        fontSize="11"
        letterSpacing="3"
      >
        SYSTEM ELEWATOR
      </text>
    </svg>
  );
}
