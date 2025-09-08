# 🧪 UI Regression Test Rehberi

## 🚀 Dev Server Durumu
- ✅ Dev server başlatıldı: `http://localhost:3000`
- ✅ Build başarılı: 50 static sayfa
- ✅ Tüm hatalar düzeltildi

## 📋 Test Checklist

### 1. Ana Sayfa Testi (http://localhost:3000)
- [ ] **Hero Section**
  - [ ] Başlık: "OtoTakibim — Servis yönetimini tek panelde yönetin" görünüyor
  - [ ] Alt başlık: "Randevu, iş emri, teklif, e-Fatura ve tahsilat..." görünüyor
  - [ ] "Canlı Demo İste" butonu çalışıyor
  - [ ] "14 Gün Ücretsiz" butonu çalışıyor

- [ ] **3 Ana Fayda Bölümü**
  - [ ] "Gelir ↑" kartı görünüyor
  - [ ] "Zaman Tasarrufu" kartı görünüyor
  - [ ] "Şeffaflık" kartı görünüyor

- [ ] **Responsive Test**
  - [ ] Mobilde (375px) düzgün görünüyor
  - [ ] Tablet'te (768px) düzgün görünüyor
  - [ ] Desktop'ta (1280px) düzgün görünüyor

### 2. Responsive Test Sayfası (http://localhost:3000/responsive-test)
- [ ] **Breakpoint Göstergesi**
  - [ ] Mevcut breakpoint gösteriliyor
  - [ ] Ekran boyutu değiştiğinde güncelleniyor

- [ ] **Grid Layout Test**
  - [ ] 12 item'li grid düzgün görünüyor
  - [ ] Farklı ekran boyutlarında responsive

- [ ] **Flex Layout Test**
  - [ ] Ana içerik ve sidebar düzgün yerleşiyor
  - [ ] Mobilde dikey, desktop'ta yatay düzen

- [ ] **Typography Test**
  - [ ] Başlıklar farklı boyutlarda görünüyor
  - [ ] Paragraf metni responsive

- [ ] **Button Test**
  - [ ] Butonlar responsive boyutlarda
  - [ ] Mobilde tam genişlik, desktop'ta otomatik

- [ ] **Modal Test**
  - [ ] "Modal Aç" butonu çalışıyor
  - [ ] Modal açılıyor
  - [ ] Modal içeriği responsive
  - [ ] "Kapat" ve "Tamam" butonları çalışıyor
  - [ ] Escape tuşu ile kapanıyor
  - [ ] Overlay'e tıklayınca kapanıyor

### 3. Dashboard Testleri (http://localhost:3000/dashboard)
- [ ] **Ana Dashboard**
  - [ ] Sayfa yükleniyor
  - [ ] Navigation çalışıyor
  - [ ] Icon'lar düzgün görünüyor

- [ ] **Usage Sayfası** (http://localhost:3000/dashboard/usage)
  - [ ] Sayfa yükleniyor
  - [ ] Icon'lar düzgün görünüyor
  - [ ] Chart'lar görünüyor

### 4. Console ve Network Kontrolü
- [ ] **Browser Console**
  - [ ] F12 → Console tab
  - [ ] Kırmızı hata mesajı yok
  - [ ] Warning'ler kontrol edildi

- [ ] **Network Tab**
  - [ ] F12 → Network tab
  - [ ] Failed request yok
  - [ ] 404 error yok

### 5. Screenshot'lar
- [ ] **Ana sayfa screenshot'u** (Desktop)
- [ ] **Ana sayfa screenshot'u** (Mobile)
- [ ] **Responsive test sayfası screenshot'u**
- [ ] **Modal açık screenshot'u**
- [ ] **Dashboard screenshot'u**

## 🐛 Hata Bulunursa

### Console Hataları
```javascript
// Hata örneği:
Error: Cannot read properties of undefined
```

### Network Hataları
```
404 Not Found
500 Internal Server Error
```

### UI Hataları
- Butonlar çalışmıyor
- Layout bozuk
- Icon'lar görünmüyor
- Modal açılmıyor

## 📝 Test Sonuçları

### ✅ Başarılı Testler:
- [ ] Ana sayfa yükleniyor
- [ ] Responsive tasarım çalışıyor
- [ ] Modal sistemi çalışıyor
- [ ] Console'da hata yok
- [ ] Network'te hata yok

### ❌ Başarısız Testler:
- [ ] Hata detayı: _______________
- [ ] Çözüm önerisi: _______________

## 🎯 Sonuç
- [ ] Tüm testler başarılı
- [ ] UI regression düzeltildi
- [ ] Production'a hazır
- [ ] PR merge edilebilir

---

**Test Tarihi**: _______________  
**Test Eden**: _______________  
**Sonuç**: _______________
