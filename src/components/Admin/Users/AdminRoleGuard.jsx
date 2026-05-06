import React from "react";
import { Paper, Typography } from "@mui/material";

export default function AdminRoleGuard() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Ochrona ról
      </Typography>

      <Typography>
        W tej wersji owner nie może być zmieniany przez admina ani superusera.
        Możesz tu dodać własne reguły uprawnień.
      </Typography>
    </Paper>
  );
}
