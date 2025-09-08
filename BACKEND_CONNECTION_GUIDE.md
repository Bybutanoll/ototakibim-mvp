# Backend Bağlantı Sorunları - Kalıcı Çözüm Rehberi

## 🚨 Çözülen Sorunlar

### 1. CSP (Content Security Policy) Sorunları
**Hata:** `Refused to connect because it violates the following Content Security Policy directive`
**Çözüm:** Next.js config'de localhost portları eklendi

```javascript
// next.config.js
"connect-src 'self' http://localhost:5000 http://localhost:5001 http://localhost:5002 http://localhost:5003 https://ototakibim-mvp.onrender.com"
```

### 2. Backend Port Uyumsuzluğu
**Hata:** Frontend 5001 portuna bağlanmaya çalışıyor, backend 5000'de
**Çözüm:** API service'de backend discovery sistemi

```typescript
// services/api.ts
const discoverBackend = async (): Promise<string> => {
  const ports = [5000, 5001, 5002, 5003];
  for (const port of ports) {
    try {
      const response = await fetch(`http://localhost:${port}/health`);
      if (response.ok) {
        return `http://localhost:${port}/api`;
      }
    } catch (error) {
      continue;
    }
  }
  return API_BASE_URL;
};
```

### 3. Favicon 500 Hatası
**Hata:** `GET http://localhost:3000/favicon.ico 500 (Internal Server Error)`
**Çözüm:** Doğru favicon dosyası kopyalandı

```bash
copy "D:\ototakibim\favicon.ico" "public\favicon.ico"
```

### 4. CSS MIME Type Sorunu
**Hata:** `MIME type ('text/plain') is not a supported stylesheet MIME type`
**Çözüm:** Next.js config'de CSS headers eklendi

```javascript
// next.config.js
{
  source: '/_next/static/css/:path*',
  headers: [
    {
      key: 'Content-Type',
      value: 'text/css',
    },
  ],
}
```

## 🛡️ Önleyici Tedbirler

### Backend Bağlantı Kontrolü
```typescript
// Her API çağrısından önce backend kontrolü
const checkBackendHealth = async () => {
  try {
    const response = await fetch('/health');
    return response.ok;
  } catch (error) {
    return false;
  }
};
```

### Port Discovery Sistemi
```typescript
// Otomatik port keşfi
const findAvailablePort = async (ports: number[]) => {
  for (const port of ports) {
    try {
      const response = await fetch(`http://localhost:${port}/health`);
      if (response.ok) return port;
    } catch (error) {
      continue;
    }
  }
  return null;
};
```

### Error Handling
```typescript
// Kapsamlı hata yakalama
const handleApiError = (error: any) => {
  if (error.code === 'ECONNREFUSED') {
    return 'Backend sunucusu çalışmıyor. Lütfen sunucuyu başlatın.';
  }
  if (error.response?.status === 401) {
    return 'Oturum süresi dolmuş. Lütfen tekrar giriş yapın.';
  }
  return 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.';
};
```

## 🔧 Hızlı Düzeltme Komutları

```bash
# Backend başlatma
cd backend && npm run dev

# Port temizleme
npm run kill-ports

# Frontend başlatma
cd frontend && npm run dev

# Health check
curl http://localhost:5000/health
```

## 📋 Kontrol Listesi

### Backend Kontrolleri
- [ ] Backend 5000 portunda çalışıyor
- [ ] Health endpoint erişilebilir
- [ ] MongoDB bağlantısı aktif
- [ ] CORS ayarları doğru

### Frontend Kontrolleri
- [ ] CSP localhost portları içeriyor
- [ ] API service backend discovery kullanıyor
- [ ] Error handling kapsamlı
- [ ] Favicon dosyası mevcut

### Network Kontrolleri
- [ ] Port çakışması yok
- [ ] Firewall engeli yok
- [ ] DNS çözümlemesi çalışıyor
- [ ] Proxy ayarları doğru

## 🚀 Gelecekteki Geliştirmeler

1. **Otomatik Backend Discovery:** Real-time port monitoring
2. **Health Check Dashboard:** Backend durumu görselleştirme
3. **Connection Pooling:** Performans optimizasyonu
4. **Retry Logic:** Otomatik yeniden deneme

## 🎯 Best Practices

### 1. Backend Başlatma
```bash
# Güvenli başlatma
npm run dev:safe

# Port kontrolü
npm run kill-ports && npm run dev
```

### 2. API Service
```typescript
// Retry mechanism
const apiCall = async (url: string, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};
```

### 3. Error Monitoring
```typescript
// Hata loglama
const logError = (error: any, context: string) => {
  console.error(`[${context}]`, error);
  // Analytics'e gönder
};
```

Bu rehberi takip ederek backend bağlantı sorunlarını önleyebilirsiniz.
