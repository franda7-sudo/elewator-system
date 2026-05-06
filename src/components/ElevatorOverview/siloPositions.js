// --- BLOK S (1S–40S) ---
export const S_SILOS = Array.from({ length: 40 }, (_, i) => {
  const index = i + 1;
  const row = Math.floor((index - 1) / 10);
  const col = (index - 1) % 10;

  return {
    id: `${index}S`,
    x: 5 + col * 8,   // %
    y: 5 + row * 10,  // %
  };
});

// --- BLOK N/G (1N–20N + 21G–25G) ---
export const NG_SILOS = [];

for (let s = 0; s < 5; s++) {
  const baseX = 5 + s * 14; // 12% segment + 2% odstępu
  const baseY = 55;

  NG_SILOS.push(
    // parzyste (góra)
    { id: `${2 + s * 4}N`, x: baseX,     y: baseY },
    { id: `${4 + s * 4}N`, x: baseX + 6, y: baseY },

    // centralna G
    { id: `${21 + s}G`,    x: baseX + 3, y: baseY + 5 },

    // nieparzyste (dół)
    { id: `${1 + s * 4}N`, x: baseX,     y: baseY + 10 },
    { id: `${3 + s * 4}N`, x: baseX + 6, y: baseY + 10 }
  );
}

// --- BLOK PRAWY (43–50) ---
export const RIGHT_SILOS = Array.from({ length: 8 }, (_, i) => ({
  id: `${43 + i}`,
  x: 85,
  y: 10 + i * 7
}));

export const ALL_POSITIONS = [
  ...S_SILOS,
  ...NG_SILOS,
  ...RIGHT_SILOS
];
