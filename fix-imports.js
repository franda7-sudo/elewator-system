// fix-imports.js
// Automatycznie poprawia importy w folderze src/Reports

import fs from "fs";
import path from "path";

const reportsDir = path.join("src", "Reports");
const files = fs.readdirSync(reportsDir).filter(f => f.endsWith(".jsx"));

for (const file of files) {
  const filePath = path.join(reportsDir, file);
  let content = fs.readFileSync(filePath, "utf8");

  // popraw ścieżki ../../ → ../
  content = content.replaceAll("../../db/", "../db/");
  content = content.replaceAll("../../utils/", "../utils/");

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`✅ Naprawiono importy w: ${file}`);
}

console.log("🎯 Wszystkie importy zostały poprawione.");
