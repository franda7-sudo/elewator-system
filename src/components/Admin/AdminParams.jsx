import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Grid,
  Paper
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc
} from "firebase/firestore";

import { db } from "../../firebase";

const AdminParams = () => {
  const [grains, setGrains] = useState([]);
  const [selectedGrain, setSelectedGrain] = useState(null);

  const [globalParams, setGlobalParams] = useState([]);
  const [grainParams, setGrainParams] = useState({});
  const [groups, setGroups] = useState([]);

  const [cells, setCells] = useState([]);
  const [freeCells, setFreeCells] = useState([]);

  const [loading, setLoading] = useState(true);

  // -----------------------------------------
  // 1. Pobierz listę zbóż
  // -----------------------------------------
  useEffect(() => {
    const fetchGrains = async () => {
      const snap = await getDocs(collection(db, "grains"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setGrains(list);
    };
    fetchGrains();
  }, []);

  // -----------------------------------------
  // 2. Pobierz globalne parametry
  // -----------------------------------------
  useEffect(() => {
    const fetchParams = async () => {
      const snap = await getDocs(collection(db, "qualityParams"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setGlobalParams(list);
    };
    fetchParams();
  }, []);

  // -----------------------------------------
  // 3. Pobierz parametry zboża
  // -----------------------------------------
  useEffect(() => {
    if (!selectedGrain) return;

    const loadGrainParams = async () => {
      const grainRef = doc(db, "grains", selectedGrain);
      const grainSnap = await getDoc(grainRef);

      if (grainSnap.exists()) {
        const data = grainSnap.data();
        setGrainParams(data.parameters || {});
      }
    };

    loadGrainParams();
  }, [selectedGrain]);

  // -----------------------------------------
  // 4. Pobierz grupy jakości
  // -----------------------------------------
  useEffect(() => {
    if (!selectedGrain) return;

    const loadGroups = async () => {
      const grainRef = doc(db, "grains", selectedGrain);
      const grainSnap = await getDoc(grainRef);

      if (grainSnap.exists()) {
        const data = grainSnap.data();
        const groupsMap = data.groups || {};
        const list = Object.entries(groupsMap).map(([id, g]) => ({
          id,
          ...g
        }));
        setGroups(list);
      }
    };

    loadGroups();
  }, [selectedGrain]);

  // -----------------------------------------
  // 5. Pobierz komory
  // -----------------------------------------
  useEffect(() => {
    const fetchCells = async () => {
      const snap = await getDocs(collection(db, "cells"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCells(list);
    };
    fetchCells();
  }, []);

  // -----------------------------------------
  // ZAPIS PARAMETRÓW ZBOŻA
  // -----------------------------------------
  const saveGrainParams = async () => {
    if (!selectedGrain) return;

    const grainRef = doc(db, "grains", selectedGrain);

    await updateDoc(grainRef, {
      parameters: grainParams
    });
  };

  // -----------------------------------------
  // UI PARAMETRÓW ZBOŻA
  // -----------------------------------------
  const renderGrainParams = () => {
    if (!selectedGrain) {
      return (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Wybierz zboże, aby edytować parametry.
        </Typography>
      );
    }

    return (
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6">Parametry jakości dla zboża</Typography>
          <Divider sx={{ my: 2 }} />

          {globalParams.map((p) => {
            const isActive = grainParams[p.id]?.active || false;
            const isKey = grainParams[p.id]?.isKey || false;

            return (
              <Box
                key={p.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isActive}
                      onChange={(e) => {
                        setGrainParams((prev) => ({
                          ...prev,
                          [p.id]: {
                            ...prev[p.id],
                            active: e.target.checked,
                            isKey: e.target.checked ? prev[p.id]?.isKey || false : false
                          }
                        }));
                      }}
                    />
                  }
                  label={`${p.id}`}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isKey}
                      disabled={!isActive}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const updated = {};
                          Object.keys(grainParams).forEach((k) => {
                            updated[k] = {
                              ...grainParams[k],
                              isKey: k === p.id
                            };
                          });
                          setGrainParams(updated);
                        }
                      }}
                    />
                  }
                  label="Parametr kluczowy"
                />
              </Box>
            );
          })}

          <Button variant="contained" sx={{ mt: 2 }} onClick={saveGrainParams}>
            Zapisz parametry
          </Button>
        </CardContent>
      </Card>
    );
  };

  // -----------------------------------------
  // STANY DIALOGU GRUPY
  // -----------------------------------------
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null);

  const [groupName, setGroupName] = useState("");
  const [groupKeyParam, setGroupKeyParam] = useState("");
  const [groupRanges, setGroupRanges] = useState({});
  const [groupCells, setGroupCells] = useState([]);

  // -----------------------------------------
  // OTWARCIE DIALOGU (NOWA GRUPA)
  // -----------------------------------------
  const openNewGroupDialog = () => {
    setEditingGroupId(null);
    setGroupName("");
    setGroupKeyParam("");
    setGroupRanges({});
    setGroupCells([]);
    setGroupDialogOpen(true);
  };

  // -----------------------------------------
  // OTWARCIE DIALOGU (EDYCJA GRUPY)
  // -----------------------------------------
  const openEditGroupDialog = (group) => {
    setEditingGroupId(group.id);
    setGroupName(group.name);
    setGroupKeyParam(group.keyParam);
    setGroupRanges(group.params || {});
    setGroupCells(group.assignedCells || []);
    setGroupDialogOpen(true);
  };

  // -----------------------------------------
  // ZAPIS GRUPY
  // -----------------------------------------
  const saveGroup = async () => {
    if (!selectedGrain) return;

    const grainRef = doc(db, "grains", selectedGrain);
    const grainSnap = await getDoc(grainRef);
    const data = grainSnap.data();

    const groupsMap = data.groups || {};

    let groupId = editingGroupId;

    if (!groupId) {
      groupId = "g_" + Math.random().toString(36).substring(2, 10);
    }

    groupsMap[groupId] = {
      name: groupName,
      keyParam: groupKeyParam,
      params: groupRanges,
      assignedCells: groupCells
    };

    await updateDoc(grainRef, { groups: groupsMap });

    setGroupDialogOpen(false);
    setEditingGroupId(null);

    const updated = Object.entries(groupsMap).map(([id, g]) => ({
      id,
      ...g
    }));
    setGroups(updated);
  };

  // -----------------------------------------
  // USUWANIE GRUPY
  // -----------------------------------------
  const deleteGroup = async (groupId) => {
    if (!selectedGrain) return;

    const grainRef = doc(db, "grains", selectedGrain);
    const grainSnap = await getDoc(grainRef);
    const data = grainSnap.data();

    const groupsMap = data.groups || {};
    delete groupsMap[groupId];

    await updateDoc(grainRef, { groups: groupsMap });

    const updated = Object.entries(groupsMap).map(([id, g]) => ({
      id,
      ...g
    }));
    setGroups(updated);
  };

  // -----------------------------------------
  // WYLICZANIE KOMÓR WOLNYCH
  // -----------------------------------------
  const computeFreeCells = () => {
    const used = new Set();

    groups.forEach((g) => {
      if (g.id !== editingGroupId) {
        (g.assignedCells || []).forEach((c) => used.add(c));
      }
    });

    return cells.filter((c) => !used.has(c.id));
  };

  useEffect(() => {
    setFreeCells(computeFreeCells());
  }, [cells, groups, editingGroupId]);

  const [cellSearch, setCellSearch] = useState("");

  const filteredFreeCells = useMemo(() => {
    return freeCells.filter((c) =>
      c.id.toLowerCase().includes(cellSearch.toLowerCase())
    );
  }, [cellSearch, freeCells]);

  const addCellToGroup = (cellId) => {
    if (!groupCells.includes(cellId)) {
      setGroupCells((prev) => [...prev, cellId]);
    }
  };

  const removeCellFromGroup = (cellId) => {
    setGroupCells((prev) => prev.filter((c) => c !== cellId));
  };

  // -----------------------------------------
  // UI PRZYDZIAŁU KOMÓR
  // -----------------------------------------
  const renderCellAssigner = () => {
    return (
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {/* LEWA KOLUMNA — WOLNE KOMORY */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1">Wolne komory</Typography>

          <TextField
            fullWidth
            placeholder="Szukaj komory..."
            value={cellSearch}
            onChange={(e) => setCellSearch(e.target.value)}
            sx={{ mt: 1, mb: 2 }}
          />

          <Paper sx={{ maxHeight: 250, overflowY: "auto" }}>
            <List dense>
              {filteredFreeCells.map((c) => (
                <ListItem key={c.id} button onClick={() => addCellToGroup(c.id)}>
                  <ListItemText primary={c.id} />
                </ListItem>
              ))}

              {filteredFreeCells.length === 0 && (
                <ListItem>
                  <ListItemText primary="Brak wolnych komór" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* PRAWA KOLUMNA — PRZYPISANE KOMORY */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1">Komory przypisane</Typography>

          <Paper sx={{ maxHeight: 250, overflowY: "auto", mt: 2 }}>
            <List dense>
              {groupCells.map((c) => (
                <ListItem
                  key={c}
                  secondaryAction={
                    <IconButton onClick={() => removeCellFromGroup(c)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={c} />
                </ListItem>
              ))}

              {groupCells.length === 0 && (
                <ListItem>
                  <ListItemText primary="Brak przypisanych komór" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  // -----------------------------------------
  // RENDEROWANIE ZAKRESÓW MIN–MAX
  // -----------------------------------------
  const renderRangesEditor = () => {
    const activeParams = Object.entries(grainParams)
      .filter(([id, p]) => p.active)
      .map(([id]) => id);

    if (activeParams.length === 0) {
      return (
        <Typography sx={{ mt: 2 }}>
          Brak aktywnych parametrów dla tego zboża.
        </Typography>
      );
    }

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Zakresy parametrów (min–max)
        </Typography>

        {activeParams.map((paramId) => {
          const range = groupRanges[paramId] || { min: "", max: "" };

          return (
            <Box
              key={paramId}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 1
              }}
            >
              <Typography sx={{ width: 150 }}>{paramId}</Typography>

              <TextField
                label="Min"
                type="number"
                value={range.min ?? ""}
                onChange={(e) =>
                  setGroupRanges((prev) => ({
                    ...prev,
                    [paramId]: {
                      ...prev[paramId],
                      min: e.target.value === "" ? null : Number(e.target.value)
                    }
                  }))
                }
                sx={{ width: 120 }}
              />

              <TextField
                label="Max"
                type="number"
                value={range.max ?? ""}
                onChange={(e) =>
                  setGroupRanges((prev) => ({
                    ...prev,
                    [paramId]: {
                      ...prev[paramId],
                      max: e.target.value === "" ? null : Number(e.target.value)
                    }
                  }))
                }
                sx={{ width: 120 }}
              />
            </Box>
          );
        })}
      </Box>
    );
  };

  // -----------------------------------------
  // DIALOG GRUPY
  // -----------------------------------------
  const renderGroupDialog = () => (
    <Dialog
      open={groupDialogOpen}
      onClose={() => setGroupDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {editingGroupId ? "Edytuj grupę jakości" : "Nowa grupa jakości"}
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label="Nazwa grupy"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          sx={{ mt: 1, mb: 3 }}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Parametr kluczowy</InputLabel>
          <Select
            value={groupKeyParam}
            label="Parametr kluczowy"
            onChange={(e) => setGroupKeyParam(e.target.value)}
          >
            {Object.entries(grainParams)
              .filter(([id, p]) => p.active)
              .map(([id]) => (
                <MenuItem key={id} value={id}>
                  {id}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {renderRangesEditor()}
        {renderCellAssigner()}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setGroupDialogOpen(false)}>Anuluj</Button>
        <Button variant="contained" onClick={saveGroup}>
          Zapisz
        </Button>
      </DialogActions>
    </Dialog>
  );

  // -----------------------------------------
  // LISTA GRUP
  // -----------------------------------------
  const renderGroups = () => {
    if (!selectedGrain) return null;

    return (
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Grupy jakości</Typography>

            <Button variant="contained" startIcon={<AddIcon />} onClick={openNewGroupDialog}>
              Dodaj grupę
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          {groups.length === 0 && (
            <Typography>Brak grup jakości dla tego zboża.</Typography>
          )}

          <List>
            {groups.map((g) => (
              <ListItem
                key={g.id}
                secondaryAction={
                  <>
                    <IconButton onClick={() => openEditGroupDialog(g)}>
                      <AddIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteGroup(g.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={`${g.name} — ${g.keyParam} ${g.params?.[g.keyParam]?.min ?? "?"}–${g.params?.[g.keyParam]?.max ?? "?"}`}
                  secondary={`Komór: ${g.assignedCells?.length || 0}`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  };

  // -----------------------------------------
  // GŁÓWNY RENDER PANELU
  // -----------------------------------------
   // -----------------------------------------
  // GŁÓWNY RENDER PANELU
  // -----------------------------------------
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Parametry jakości
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6">Wybór zboża</Typography>
          <Divider sx={{ my: 2 }} />

          <FormControl fullWidth>
            <InputLabel>Zboże</InputLabel>
            <Select
              value={selectedGrain || ""}
              label="Zboże"
              onChange={(e) => setSelectedGrain(e.target.value)}
            >
              {grains.map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {g.name || g.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {renderGrainParams()}
      {renderGroups()}
      {renderGroupDialog()}
    </Box>
  );
};

export default AdminParams;
