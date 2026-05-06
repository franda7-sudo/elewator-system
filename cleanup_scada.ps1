# cleanup_scada.ps1 — automatyczne czyszczenie projektu SCADA

Write-Host "=== Rozpoczynam czyszczenie projektu SCADA ===" -ForegroundColor Cyan

# 1️⃣ Usuwanie duplikatów i starych wersji
$pathsToRemove = @(
    "src\ElevatorOverview",
    "src\Nowy folder",
    "src\corrections",
    "src\utils\SiloDetails",
    "src\admin\korekta",
    "src\admin\OperatorPanel.jsx",
    "src\admin\OperatorPanel.css"
)

foreach ($path in $pathsToRemove) {
    if (Test-Path $path) {
        Remove-Item -Recurse -Force $path
        Write-Host "Usunięto: $path" -ForegroundColor Yellow
    }
}

# 2️⃣ Usuwanie plików .txt (kopie starych komponentów)
Get-ChildItem -Path "src" -Recurse -Include *.txt | Remove-Item -Force
Write-Host "Usunięto wszystkie pliki .txt" -ForegroundColor Yellow

# 3️⃣ Usuwanie lokalnych package.json w podfolderach
Get-ChildItem -Path "src" -Recurse -Include package.json, package-lock.json | Remove-Item -Force
Write-Host "Usunięto lokalne package.json" -ForegroundColor Yellow

# 4️⃣ Czyszczenie pustych folderów
Get-ChildItem -Path "src" -Recurse | Where-Object { $_.PSIsContainer -and @(Get-ChildItem $_.FullName).Count -eq 0 } | Remove-Item -Recurse -Force
Write-Host "Usunięto puste foldery" -ForegroundColor Yellow

Write-Host "=== Czyszczenie zakonczone pomyslnie ===" -ForegroundColor Green

