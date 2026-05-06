import React, { useEffect, useState } from "react";
import { Paper, Typography, Box } from "@mui/material";
import { db } from "../../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "logs"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setLogs(data);
    });

    return () => unsub();
  }, []);

  return (
    <Paper sx={{ p: 3, background: "#111", color: "#fff" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Historia alarmów
      </Typography>

      {logs.map((log) => (
        <Box
          key={log.id}
          sx={{
            p: 1,
            mb: 1,
            borderBottom: "1px solid #333",
            color: log.level === "critical" ? "#ff1744" : "#ff9100",
          }}
        >
          <Typography>
            {new Date(log.timestamp).toLocaleString()}
          </Typography>
          <Typography>
            Komora {log.cellId} — {log.zone} — {log.sensorId}: {log.temp}°C
          </Typography>
        </Box>
      ))}
    </Paper>
  );
}
