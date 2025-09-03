# Oto Tamir MVP - Server Başlatma Scripti
Write-Host "🚀 Oto Tamir MVP Server'ları Başlatılıyor..." -ForegroundColor Green

# Mevcut Node.js süreçlerini temizle
Write-Host "🧹 Eski süreçler temizleniyor..." -ForegroundColor Yellow
taskkill /f /im node.exe 2>$null
Start-Sleep -Seconds 2

# Portları kontrol et
Write-Host "🔍 Portlar kontrol ediliyor..." -ForegroundColor Yellow
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue

if ($port3000) {
    Write-Host "❌ Port 3000 kullanımda! PID: $($port3000.OwningProcess)" -ForegroundColor Red
    Stop-Process -Id $port3000.OwningProcess -Force
    Start-Sleep -Seconds 1
}

if ($port5000) {
    Write-Host "❌ Port 5000 kullanımda! PID: $($port5000.OwningProcess)" -ForegroundColor Red
    Stop-Process -Id $port5000.OwningProcess -Force
    Start-Sleep -Seconds 1
}

# Backend'i başlat
Write-Host "🔧 Backend başlatılıyor (Port 5000)..." -ForegroundColor Cyan
Set-Location ".\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 5

# Frontend'i başlat
Write-Host "🎨 Frontend başlatılıyor (Port 3000)..." -ForegroundColor Cyan
Set-Location ".\frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 5

# Durum kontrolü
Write-Host "✅ Server'lar başlatıldı!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "🔧 Backend: http://localhost:5000" -ForegroundColor White
Write-Host "🏥 Health Check: http://localhost:5000/api/health" -ForegroundColor White

# Port durumunu göster
Write-Host "`n📊 Port Durumu:" -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 3000,5000 -ErrorAction SilentlyContinue | Format-Table LocalAddress, LocalPort, State, OwningProcess

Write-Host "`n🎉 Ready! Open http://localhost:3000 in your browser." -ForegroundColor Green
