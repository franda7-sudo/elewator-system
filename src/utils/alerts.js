// /src/utils/alerts.js

export function getSiloAlert(silo) {
  const alerts = [];

  if (silo.masa?.status === "ALARM") alerts.push("Różnica masy");
  if (silo.temperatura?.status === "SAMOZAGRZEWANIE") alerts.push("Temperatura");
  if (silo.przerzuty?.status === "WYMAGANY") alerts.push("Przerzut");

  return alerts;
}
