export default async function getIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch (err) {
    console.error("Nie udało się pobrać IP:", err);
    return "unknown";
  }
}
