import React, { useState } from "react";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import {
  Box,
  Paper,
  TextField,
  Button,
  MenuItem,
  Divider
} from "@mui/material";

export default function CellPanel({ cell, onClose }) {
  const [grain, setGrain] = useState(cell.grain || "");
  const [protein, setProtein] = useState(cell.protein ?? "");
  const [humidity, setHumidity] = useState(cell.humidity ?? "");
  const [paramFrom, setParamFrom] = useState(cell.paramFrom ?? "");
  const [paramTo, setParamTo] = useState(cell.paramTo ?? "");
  const [weight, setWeight] = useState(cell.weight ?? "");
  const [firstFill, setFirstFill] = useState(cell.firstFill ?? "");

  const save = async () => {
    await updateDoc(doc(db, "cells", cell.id), {
      grain,
      protein: protein === "" ? null : Number(protein),
      humidity: humidity === "" ? null : Number(humidity),
      paramFrom: paramFrom === "" ? null : Number(paramFrom),
      paramTo: paramTo === "" ? null : Number(paramTo),
      weight: weight === "" ? null : Number(weight),
      firstFill: firstFill || null
    });

    onClose();
  };

  const fieldStyle = {
    mt: 2,
    "& .MuiInputBase-input": { color: "#fff" },
    "& .MuiInputLabel-root": { color: "#bbb" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#555" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#888" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" }
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        top: 20,
        right: 20,
        width: 340,
        p: 2,
        bgcolor: "#1e1e1e",
        color: "#fff",
        border: "1px solid #444",
        borderRadius: "8px",
        zIndex: 2000,
        boxShadow: "0 0 20px rgba(0,0,0,0.5)"
      }}
    >
      <h2 style={{ margin: 0, marginBottom: 10 }}>Komora {cell.id}</h2>

      <Divider sx={{ borderColor: "#444", mb: 2 }} />

      {/* ZBOŻE */}
      <TextField
        select
        fullWidth
        label="Zboże"
        value={grain}
        onChange={(e) => setGrain(e.target.value)}
        sx={fieldStyle}
      >
        <MenuItem value="">—</MenuItem>
        <MenuItem value="pszenica">Pszenica</MenuItem>
        <MenuItem value="zyto">Żyto</MenuItem>
        <MenuItem value="owies">Owies</MenuItem>
        <MenuItem value="jeczmien">Jęczmień</MenuItem>
        <MenuItem value="kukurydza">Kukurydza</MenuItem>
        <MenuItem value="pellet">Pellet</MenuItem>
        <MenuItem value="pellet-otrebowy">Pellet otrębowy</MenuItem>
      </TextField>

      {/* PARAMETRY */}
      <TextField
        fullWidth
        label="Białko (%)"
        type="number"
        value={protein}
        onChange={(e) => setProtein(e.target.value)}
        sx={fieldStyle}
      />

      <TextField
        fullWidth
        label="Wilgotność (%)"
        type="number"
        value={humidity}
        onChange={(e) => setHumidity(e.target.value)}
        sx={fieldStyle}
      />

      <TextField
        fullWidth
        label="Param od"
        type="number"
        value={paramFrom}
        onChange={(e) => setParamFrom(e.target.value)}
        sx={fieldStyle}
      />

      <TextField
        fullWidth
        label="Param do"
        type="number"
        value={paramTo}
        onChange={(e) => setParamTo(e.target.value)}
        sx={fieldStyle}
      />

      {/* WAGA */}
      <TextField
        fullWidth
        label="Waga (kg)"
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        sx={fieldStyle}
      />

      {/* DATA ZASYPU */}
      <TextField
        fullWidth
        label="Data zasypu"
        value={firstFill}
        onChange={(e) => setFirstFill(e.target.value)}
        sx={fieldStyle}
      />

      {/* PRZYCISKI */}
      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={save}
        >
          Zapisz
        </Button>

        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={onClose}
        >
          Zamknij
        </Button>
      </Box>
    </Paper>
  );
}
