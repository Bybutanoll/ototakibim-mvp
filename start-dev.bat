@echo off
echo 🚗 OtoTakibim Development Server Başlatılıyor...

cd frontend

if not exist "node_modules" (
    echo 📦 Dependencies yükleniyor...
    npm install
)

echo 🚀 Frontend development server başlatılıyor...
echo 📍 URL: http://localhost:3000
echo ⏹️  Durdurmak için Ctrl+C basın

npm run dev

pause
