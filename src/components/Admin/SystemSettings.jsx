import React from "react";
import { Box, Typography } from "@mui/material";

export default function SystemSettings() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Ustawienia systemowe
      </Typography>
      <Typography variant="body2">
        Tutaj będą ustawienia globalne systemu elewatora.
      </Typography>
    </Box>
  );
}
