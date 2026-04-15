# Password Strength Analyzer — Start Script
# Run this from the project root: .\start.ps1

Write-Host "`n[PassGuard AI] Starting setup..." -ForegroundColor Cyan

$backendDir = Join-Path $PSScriptRoot "backend"

# 1. Check Python
try {
    $pyVer = python --version 2>&1
    Write-Host "[✓] Python found: $pyVer" -ForegroundColor Green
} catch {
    Write-Host "[✗] Python not found. Please install Python 3.9+" -ForegroundColor Red
    exit 1
}

# 2. Create virtual environment if needed
$venvPath = Join-Path $backendDir ".venv"
if (-not (Test-Path $venvPath)) {
    Write-Host "[*] Creating virtual environment..." -ForegroundColor Yellow
    python -m venv $venvPath
}

# 3. Activate venv
$activateScript = Join-Path $venvPath "Scripts\Activate.ps1"
& $activateScript

# 4. Install dependencies
Write-Host "[*] Installing Python dependencies..." -ForegroundColor Yellow
pip install -r (Join-Path $backendDir "requirements.txt") -q

# 5. Train model if not present
$modelPath = Join-Path $backendDir "password_model.pkl"
if (-not (Test-Path $modelPath)) {
    Write-Host "[*] Training ML model (first run)..." -ForegroundColor Yellow
    python (Join-Path $backendDir "train_model.py")
} else {
    Write-Host "[✓] ML model already exists, skipping training." -ForegroundColor Green
}

# 6. Start FastAPI server
Write-Host "`n[✓] Starting FastAPI server at http://localhost:8000" -ForegroundColor Green
Write-Host "[→] Open frontend/index.html in your browser`n" -ForegroundColor Cyan

Set-Location $backendDir
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
