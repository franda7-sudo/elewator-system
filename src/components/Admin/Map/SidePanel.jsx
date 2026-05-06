import React, { useState, useEffect } from "react";
import { Typography, Paper, Button, Box, Divider, TextField, MenuItem } from "@mui/material";

export default function SidePanel({ cell, onClose, role, onSave }) {
  if (!cell) {
    return (
      <Paper
        sx={{
          width: 320,
          background: "#111",
          border: "1px solid #333",
          p: 2,
          color: "#fff"
        }}
      >
        <Typography sx={{ opacity: 0.6 }}>Wybierz komorę…</Typography>
      </Paper>
    );
  }

  const isReadOnly = role === "superuser";

  // 🔥 Lokalne stany edycyjne
  const [grain, setGrain] = useState(cell.grain || "pusta");
  const [waga, setWaga] = useState(cell.waga || "");
  const [temp, setTemp] = useState(cell.temp || "");
  const [bialko, setBialko] = useState(cell.bialko || "");
  const [wilgotnosc, setWilgotnosc] = useState(cell.wilgotnosc || "");
  const [gestosc, setGestosc] = useState(cell.gestosc || "");
  const [groupId, setGroupId] = useState(cell.groupId || "");

  // 🔥 Aktualizacja przy zmianie komórki
  useEffect(() => {
    setGrain(cell.grain || "pusta");
    setWaga(cell.waga || "");
    setTemp(cell.temp || "");
    setBialko(cell.bialko || "");
    setWilgotnosc(cell.wilgotnosc || "");
    setGestosc(cell.gestosc || "");
    setGroupId(cell.groupId || "");
  }, [cell]);

  // 🔥 Zapis zmian
  const handleSave = () => {
    const updated = {
      ...cell,
      grain,
      waga,
      temp,
      bialko,
      wilgotnosc,
      gestosc,
      groupId,
    };

    onSave(updated);
  };

  // 🔥 Reset komórki
  const handleReset = () => {
    const cleared = {
      ...cell,
      grain: "pusta",
      waga: "",
      temp: "",
      bialko: "",
      wilgotnosc: "",
      gestosc: "",
      groupId: "",
    };

    onSave(cleared);
  };

  return (
    <Paper
      sx={{
        width: 320,
        background: "#111",
        border: "1px solid #333",
        p: 2,
        color: "#fff",
        position: "fixed",
        right: 20,
        top: 100,
        zIndex: 1100,
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, color: "#fbbf24" }}>
        Komora {cell.id}
      </Typography>

      {isReadOnly && (
        <Box sx={{ mb: 2, p: 1, background: "#222", borderRadius: 1, border: "1px solid #333" }}>
          <Typography sx={{ color: "#aaa", fontSize: 13 }}>
            Tryb podglądu (SuperUser)
          </Typography>
        </Box>
      )}

      <Divider sx={{ mb: 2, borderColor: "#333" }} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

        {/* 🔥 Dropdown zboża */}
        <TextField
          select
          label="Zboże"
          value={grain}
          onChange={(e) => setGrain(e.target.value)}
          disabled={isReadOnly}
          sx={{ input: { color: "#fff" }, label: { color: "#aaa" } }}
        >
          <MenuItem value="pszenica">Pszenica</MenuItem>
          <MenuItem value="zyto">Żyto</MenuItem>
          <MenuItem value="jeczmien">Jęczmień</MenuItem>
          <MenuItem value="owies">Owies</MenuItem>
          <MenuItem value="pellet">Pellet</MenuItem>
          <MenuItem value="pusta">PUSTA</MenuItem>
        </TextField>

        <TextField
          label="Waga (t)"
          value={waga}
          onChange={(e) => setWaga(e.target.value)}
          disabled={isReadOnly}
          sx={{ input: { color: "#fff" }, label: { color: "#aaa" } }}
        />

        <TextField
          label="Temperatura (°C)"
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          disabled={isReadOnly}
          sx={{ input: { color: "#fff" }, label: { color: "#aaa" } }}
        />

        <Divider sx={{ borderColor: "#333" }} />

        <Typography sx={{ color: "#aaa" }}>Parametry jakościowe</Typography>

        <TextField
          label="Białko"
          value={bialko}
          onChange={(e) => setBialko(e.target.value)}
          disabled={isReadOnly}
          sx={{ input: { color: "#fff" }, label: { color: "#aaa" } }}
        />

        <TextField
          label="Wilgotność (%)"
          value={wilgotnosc}
          onChange={(e) => setWilgotnosc(e.target.value)}
          disabled={isReadOnly}
          sx={{ input: { color: "#fff" }, label: { color: "#aaa" } }}
        />

        <TextField
          label="Gęstość"
          value={gestosc}
          onChange={(e) => setGestosc(e.target.value)}
          disabled={isReadOnly}
          sx={{ input: { color: "#fff" }, label: { color: "#aaa" } }}
        />

        <TextField
          label="Grupa jakości"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          disabled={isReadOnly}
          sx={{ input: { color: "#fff" }, label: { color: "#aaa" } }}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
          sx={{ color: "#fff", borderColor: "#444" }}
        >
          Zamknij
        </Button>

        {!isReadOnly && (
          <Button
            fullWidth
            variant="contained"
            color="warning"
            onClick={handleSave}
          >
            Zapisz
          </Button>
        )}
      </Box>

      {!isReadOnly && (
        <Button
          fullWidth
          variant="outlined"
          color="error"
          sx={{ mt: 1, borderColor: "#552" }}
          onClick={handleReset}
        >
          Reset komórki
        </Button>
      )}
    </Paper>
  );
}
