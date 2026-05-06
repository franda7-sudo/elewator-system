// /src/utils/temperatureStatus.js

export function getTemperatureStatus(avg, deltaT, thresholds = { warn: 2, alarm: 3 }) {
  if (deltaT >= thresholds.alarm) return "SAMOZAGRZEWANIE";
  if (deltaT >= thresholds.warn) return "OSTRZEŻENIE";
  return "OK";
}
