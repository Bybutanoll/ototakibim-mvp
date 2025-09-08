# 🔧 OtoTakibim Troubleshooting Guide

## 🚨 Yaygın Sorunlar ve Çözümleri

### 1. **PowerShell Syntax Hatası**

**Hata:**
```
The token '&&' is not a valid statement separator in this version.
```

**Çözüm:**
```powershell
# ❌ Yanlış
cd frontend && npm run dev

# ✅ Doğru
cd frontend; npm run dev

# ✅ En iyi çözüm
.\start-dev.ps1
```

### 2. **pnpm Bulunamıyor**

**Hata:**
```
pnpm : The term 'pnpm' is not recognized...
```

**Çözüm:**
```powershell
# pnpm yükle
npm install -g pnpm

# Veya npm kullan
npm install
npm run dev
```

### 3. **Package.json Bulunamıyor**

**Hata:**
```
Could not read package.json: Error: ENOENT: no such file or directory
```

**Çözüm:**
```powershell
# Doğru dizinde olduğunuzdan emin olun
pwd
# D:\ototakibim\oto-tamir-mvp olmalı

# Frontend dizinine gidin
cd frontend
npm run dev
```

### 4. **Development Server Başlatma**

**Manuel Başlatma:**
```powershell
# 1. Proje dizinine git
cd D:\ototakibim\oto-tamir-mvp

# 2. Frontend dizinine git
cd frontend

# 3. Dependencies yükle (ilk kez)
npm install

# 4. Development server başlat
npm run dev
```

**Script ile Başlatma:**
```powershell
# PowerShell script ile
.\start-dev.ps1

# Batch file ile
start-dev.bat
```

### 5. **Port Zaten Kullanımda**

**Hata:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Çözüm:**
```powershell
# Port 3000'i kullanan process'i bul
netstat -ano | findstr :3000

# Process'i sonlandır (PID ile)
taskkill /PID <PID_NUMBER> /F

# Veya farklı port kullan
npm run dev -- --port 3001
```

### 6. **Node Modules Sorunu**

**Hata:**
```
Module not found: Can't resolve...
```

**Çözüm:**
```powershell
# Node modules'ı sil ve yeniden yükle
rm -rf node_modules
rm package-lock.json
npm install
```

### 7. **Build Hataları**

**Hata:**
```
Error occurred prerendering page...
```

**Çözüm:**
```powershell
# TypeScript hatalarını kontrol et
npm run type-check

# Lint hatalarını kontrol et
npm run lint

# Build'i temizle
rm -rf .next
npm run build
```

### 8. **Git Branch Sorunları**

**Hata:**
```
fatal: not a git repository
```

**Çözüm:**
```powershell
# Git repository'yi başlat
git init

# Remote ekle
git remote add origin https://github.com/Bybutanoll/ototakibim-mvp.git

# Branch'leri çek
git fetch origin
git checkout main
```

## 🛠️ **Hızlı Çözümler**

### Development Server Başlatma
```powershell
# En hızlı yöntem
.\start-dev.ps1
```

### Dependencies Yenileme
```powershell
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Build Temizleme
```powershell
cd frontend
rm -rf .next
npm run build
```

### Git Reset
```powershell
git clean -fd
git reset --hard HEAD
```

## 📱 **Test Etme**

### 1. **Ana Sayfa Testi**
- URL: http://localhost:3000
- Modern hero section görünüyor mu?
- Responsive tasarım çalışıyor mu?

### 2. **Dashboard Testi**
- URL: http://localhost:3000/dashboard
- Login gerekli mi?
- Sidebar çalışıyor mu?

### 3. **Mobile Testi**
- Chrome DevTools → Mobile view
- 375px, 768px, 1024px breakpoints
- Touch interactions çalışıyor mu?

## 🔍 **Debug Modu**

### Console Logları
```javascript
// Browser console'da
console.log('Debug mode aktif');

// Network tab'da
// API çağrıları görünüyor mu?
```

### Development Tools
```powershell
# Frontend
npm run dev

# Backend (ayrı terminal)
cd backend
npm run dev

# MongoDB (ayrı terminal)
mongod
```

## 📞 **Destek**

Sorun devam ederse:
1. **GitHub Issues**: https://github.com/Bybutanoll/ototakibim-mvp/issues
2. **Email**: dev@ototakibim.com
3. **Slack**: #support

---

**Not**: Bu guide, Windows PowerShell için optimize edilmiştir. Linux/Mac kullanıcıları için komutlar farklı olabilir.
