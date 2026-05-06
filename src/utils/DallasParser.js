// src/utils/DallasParser.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * PARSER PLIKU .DAT (WinXP sp3)
 * Przetwarza cały tekst raportu na listę obiektów dla Firebase
 */
export function parseFullDatFile(text) {
  const lines = text.split('\n');
  const results = [];
  let currentDataStr = "";

  // Szukamy linii z datą raportu
  const dateLine = lines.find(l => l.includes("Data:"));
  if (dateLine) currentDataStr = dateLine.replace("Data:", "").trim();

  lines.forEach(line => {
    if (line.trim().startsWith(".Komora:")) {
      // Usuwamy prefiks i dzielimy po spacjach
      const cleanLine = line.replace(".Komora:", "").trim();
      const parts = cleanLine.split(/\s+/);
      
      const cellNumber = parseInt(parts[0]);
      // Temperatury: zamiana przecinka na kropkę, filtrowanie pustych '----'
      const temperatures = parts.slice(1)
        .map(v => v.replace(',', '.'))
        .filter(v => v !== "----" && !isNaN(parseFloat(v)))
        .map(v => parseFloat(v));

      if (!isNaN(cellNumber) && temperatures.length > 0) {
        // Określamy segment na podstawie Twoich wytycznych
        let segment = "S";
        if (cellNumber <= 20) segment = "N";
        else if (cellNumber <= 25) segment = "G";

        results.push({
          cellId: `C${cellNumber}`,
          segment: segment,
          sensors: temperatures,
          average: parseFloat((temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1)),
          maxDiff: parseFloat((Math.max(...temperatures) - Math.min(...temperatures)).toFixed(1)),
          reportDate: currentDataStr,
          timestamp: serverTimestamp() // Czas zapisu na serwerze
        });
      }
    }
  });

  return results;
}

/**
 * ZAPIS DO FIREBASE
 * Wysyła całą paczkę pomiarów do kolekcji "temperatures"
 */
export async function saveFullReportToFirebase(parsedResults) {
  const colRef = collection(db, "temperatures");
  
  const promises = parsedResults.map(data => {
    return addDoc(colRef, data);
  });

  try {
    await Promise.all(promises);
    console.log(`Pomyślnie zapisano ${parsedResults.length} komór do Firebase.`);
    return true;
  } catch (error) {
    console.error("Błąd zapisu do Firebase:", error);
    return false;
  }
}