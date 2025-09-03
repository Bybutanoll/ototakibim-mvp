@echo off
title Oto Tamir MVP - Server Başlatma
color 0A

echo.
echo ========================================
echo    OTO TAMIR MVP - SERVER BASLATMA
echo ========================================
echo.

echo [1/4] Eski süreçler temizleniyor...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 >nul

echo [2/4] Portlar kontrol ediliyor...
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo Port 3000 kullanımda, temizleniyor...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1
)

netstat -ano | findstr :5000 >nul
if %errorlevel% equ 0 (
    echo Port 5000 kullanımda, temizleniyor...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /f /pid %%a >nul 2>&1
)

echo [3/4] Backend başlatılıyor...
cd backend
start "Backend Server" cmd /k "npm run dev"
timeout /t 5 >nul

echo [4/4] Frontend başlatılıyor...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"
timeout /t 5 >nul

echo.
echo ========================================
echo           BASARILI!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo Health:   http://localhost:5000/api/health
echo.
echo Tarayıcınızda http://localhost:3000 adresini açın
echo.
pause
