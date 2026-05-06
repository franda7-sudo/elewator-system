import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { Box, Paper, Typography, MenuItem, Select, Button, Grid } from "@mui/material";

const GRAIN_TYPES = [
  "pszenica",
  "zyto",
  "owies",
  "jeczmien",
  "kukurydza",
  "pellet",
  "puste"
];

export default function GrainEditor() {
  const [cells, setCells] = useState([]);
  const [values, setValues] = useState({});

  const loadCells = async () => {
    const snap = await getDocs(collection(db, "dallas"));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setCells(data);

    const initial = {};
    data.forEach((c) => {
      initial[c.id] = c.grainType || "puste";
    });
    setValues(initial);
  };

  const save = async (id) => {
    await updateDoc(doc(db, "dallas", id), {
      grainType: values[id]
    });
    alert(`Zapisano zboże dla komory ${id}`);
  };

  useEffect(() => {
    loadCells();
  }, []);

  return (
    <Box sx={{ p: 3, color: "#fff" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Edycja zboża w komorach
      </Typography>

      <Grid container spacing={3}>
        {cells.map((c) => (
          <Grid item xs={12} md={6} lg={4} key={c.id}>
            <Paper sx={{ p: 2, background: "#111", border: "1px solid #333" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Komora {c.id}
              </Typography>

              <Select
                fullWidth
                value={values[c.id]}
                onChange={(e) =>
                  setValues({ ...values, [c.id]: e.target.value })
                }
                sx={{ color: "#fff" }}
              >
                {GRAIN_TYPES.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </Select>

              <Button
                variant="contained"
                sx={{ mt: 2, color: "#fff" }}
                onClick={() => save(c.id)}
              >
                Zapisz
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
