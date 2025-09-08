# TypeScript Next.js Hata Önleme Rehberi

## 🚨 Kalıcı Çözümler - Tekrarlanmaması İçin

### 1. Backend Server.ts Scope Hatası
**Hata:** `server` değişkeni scope dışında kullanılmış
**Çözüm:** Global server referansı kullan
```typescript
let globalServer: any = null;

const tryPort = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const server = createServer(app);
    globalServer = server; // Global referans
    // ...
  });
};

// Graceful shutdown'ta globalServer kullan
process.on('SIGTERM', () => {
  if (globalServer) {
    globalServer.close(() => process.exit(0));
  }
});
```

### 2. Next.js 15 Uyumluluk
**Hata:** `output: 'export'` Next.js 15'te sorun yaratıyor
**Çözüm:** Minimal config kullan
```javascript
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // output: 'export', // KALDIRILDI
};
```

### 3. SWC Dependency Eksikliği
**Hata:** SWC compiler bulunamıyor
**Çözüm:** Platform-specific SWC kur
```bash
# Windows
npm install @next/swc-win32-x64-msvc --save-dev

# Linux
npm install @next/swc-linux-x64-gnu --save-dev

# macOS
npm install @next/swc-darwin-x64 --save-dev
```

### 4. TypeScript Strict Mode
**Hata:** Strict mode çok katı
**Çözüm:** Development için kapat
```json
{
  "compilerOptions": {
    "strict": false,
    "skipLibCheck": true
  }
}
```

## 🛡️ Önleyici Tedbirler

### Backend Geliştirme Kuralları
1. **Server Scope:** Server değişkenini global tanımla
2. **Error Handling:** Try-catch bloklarını doğru kullan
3. **Port Management:** Port fallback sistemi kullan
4. **TypeScript:** Strict mode'u development'ta kapat

### Frontend Geliştirme Kuralları
1. **Next.js Config:** Minimal config kullan
2. **SWC:** Platform-specific dependency kur
3. **Export Mode:** Development'ta kullanma
4. **React Strict:** Production'da aç, development'ta kapat

### Genel Kurallar
1. **Dependencies:** Platform-specific paketleri kur
2. **Config Files:** Minimal ve temiz tut
3. **Error Handling:** Kapsamlı hata yakalama
4. **Testing:** Her değişiklikten sonra test et

## 🔧 Hızlı Düzeltme Komutları

```bash
# Port temizleme
npm run kill-ports

# SWC kurulumu (Windows)
cd frontend && npm install @next/swc-win32-x64-msvc --save-dev

# Güvenli başlatma
npm run dev:safe

# Backend health check
npm run health
```

## 📋 Kontrol Listesi

### Backend Kontrolleri
- [ ] Server değişkeni global tanımlanmış
- [ ] Port fallback sistemi aktif
- [ ] TypeScript strict: false
- [ ] Error handling mevcut

### Frontend Kontrolleri
- [ ] Next.js config minimal
- [ ] SWC dependency kurulu
- [ ] Output export kaldırılmış
- [ ] React strict mode uygun

### Sistem Kontrolleri
- [ ] Port yönetim scriptleri mevcut
- [ ] Health check endpoints çalışıyor
- [ ] Error prevention guide güncel
- [ ] Dependencies platform-specific

## 🚀 Gelecekteki Geliştirmeler

1. **Otomatik Hata Tespiti:** CI/CD pipeline'da hata kontrolü
2. **Config Validation:** Konfigürasyon dosyalarını otomatik kontrol
3. **Dependency Check:** Platform-specific dependency kontrolü
4. **Error Monitoring:** Gerçek zamanlı hata izleme

Bu rehberi takip ederek TypeScript ve Next.js hatalarını önleyebilirsiniz.
