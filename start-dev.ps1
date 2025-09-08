# OtoTakibim Development Server Başlatma Script
# PowerShell için optimize edilmiş

Write-Host "🚗 OtoTakibim Development Server Başlatılıyor..." -ForegroundColor Green

# Frontend dizinine git
Set-Location "frontend"

# Dependencies kontrol et
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Dependencies yükleniyor..." -ForegroundColor Yellow
    npm install
}

# Development server başlat
Write-Host "🚀 Frontend development server başlatılıyor..." -ForegroundColor Cyan
Write-Host "📍 URL: http://localhost:3000" -ForegroundColor White
Write-Host "⏹️  Durdurmak için Ctrl+C basın" -ForegroundColor Gray

npm run dev
