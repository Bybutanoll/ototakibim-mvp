# 🚗 OtoTakibim - Akıllı Oto Servis Yönetimi

Türkiye'nin en gelişmiş oto servis yönetim sistemi. Yapay zeka destekli iş emri yönetimi, otomatik müşteri bildirimleri, stok takibi ve gelişmiş raporlama ile servisinizi dijitalleştirin.

## 🚀 Hızlı Başlatma

### Yöntem 1: Otomatik Başlatma (Önerilen)
```bash
# Windows için
start.bat

# PowerShell için
.\start-servers.ps1
```

### Yöntem 2: Manuel Başlatma
```bash
# Backend başlat
cd backend
npm run dev

# Yeni terminal aç ve frontend başlat
cd frontend
npm run dev
```

## 📱 Erişim Linkleri

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

## 🛠️ Teknolojiler

### Frontend
- **Next.js 15.5.2** - React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Styling
- **Framer Motion** - Animasyonlar
- **React Hook Form** - Form yönetimi
- **React Hot Toast** - Bildirimler

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Tip güvenliği
- **MongoDB** - Veritabanı (opsiyonel)
- **JWT** - Kimlik doğrulama
- **bcryptjs** - Şifre hashleme

## 🎯 Özellikler

### ✅ Tamamlanan
- [x] Kullanıcı kayıt/giriş sistemi
- [x] İş emri oluşturma
- [x] İş emri listeleme ve filtreleme
- [x] İş emri detay sayfası
- [x] Durum güncelleme
- [x] Modern UI/UX tasarımı
- [x] Responsive tasarım
- [x] Animasyonlar ve efektler

### 🔄 Geliştirilecek
- [ ] Müşteri yönetimi
- [ ] Araç yönetimi
- [ ] Fatura oluşturma
- [ ] Raporlama
- [ ] SMS/Email bildirimleri
- [ ] Dosya yükleme

## 🐛 Sorun Giderme

### Port Çakışması
```bash
# Portları kontrol et
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Süreçleri durdur
taskkill /f /im node.exe
```

### MongoDB Bağlantı Hatası
Sistem demo modunda çalışır. Gerçek MongoDB için:
1. `.env` dosyasında `MONGODB_URI` ayarlayın
2. MongoDB servisini başlatın

### TypeScript Hataları
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## 📁 Proje Yapısı

```
oto-tamir-mvp/
├── frontend/          # Next.js uygulaması
├── backend/           # Express.js API
├── start.bat         # Windows başlatma scripti
├── start-servers.ps1 # PowerShell başlatma scripti
└── README.md         # Bu dosya
```

## 🔧 Geliştirme

### Backend API Endpoints
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/work-orders` - İş emirleri listesi
- `POST /api/work-orders` - Yeni iş emri
- `GET /api/work-orders/:id` - İş emri detayı
- `PUT /api/work-orders/:id` - İş emri güncelleme
- `DELETE /api/work-orders/:id` - İş emri silme

### Environment Variables
```env
# Backend (.env)
PORT=5000
JWT_SECRET=your_jwt_secret
MONGODB_URI=mongodb://localhost:27017/oto-tamir-mvp
FRONTEND_URL=http://localhost:3000
```

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. `start.bat` dosyasını çalıştırın
2. Port çakışması varsa süreçleri temizleyin
3. Node.js ve npm'in güncel olduğundan emin olun

---

**🎉 Başarılı geliştirmeler!**
