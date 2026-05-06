import React from "react";

const grains = [
  { id: "pszenica", name: "Pszenica" },
  { id: "zyto", name: "Żyto" },
  { id: "owies", name: "Owies" },
  { id: "jeczmien", name: "Jęczmień" },
  { id: "pellet", name: "Pellet" },
  { id: "pellet-otrebowy", name: "Pellet otrębowy" },
];

// Zmieniamy to w komponent React
const GrainList = () => {
  return (
    <div>
      <h1>Lista zbóż</h1>
      <ul>
        {grains.map((grain) => (
          <li key={grain.id}>{grain.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default GrainList;