import React from "react";
import { Box, Typography } from "@mui/material";

export default function LogsPanel() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Logi operacji
      </Typography>
      <Typography variant="body2">
        Tutaj pojawią się logi systemowe i historia operacji.
      </Typography>
    </Box>
  );
}
