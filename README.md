# 🚗 OtoTakibim - AI Destekli Araç Sağlık Asistanı

OtoTakibim, oto servisler için geliştirilmiş kapsamlı bir araç takip ve yönetim sistemidir. Yapay zeka destekli özellikleri ile araç bakımını optimize eder, maliyetleri düşürür ve müşteri memnuniyetini artırır.

## ✨ Özellikler

### 🏢 Multi-Tenant SaaS Platform
- **Çoklu İşletme Desteği**: Her oto servis kendi verilerini güvenle yönetir
- **Özelleştirilebilir Branding**: Kendi logo ve renklerinizi kullanın
- **Bağımsız Veri Yönetimi**: Her tenant'ın verileri izole edilmiştir

### 🔐 Güvenlik ve Yetkilendirme
- **JWT Tabanlı Authentication**: Güvenli kullanıcı girişi
- **Role-Based Access Control (RBAC)**: Sahip, Yönetici, Teknisyen rolleri
- **API Rate Limiting**: DDoS koruması ve güvenlik
- **Data Encryption**: Veriler şifrelenerek saklanır

### 🚗 Araç Yönetimi
- **Kapsamlı Araç Kayıtları**: Marka, model, yıl, VIN, kilometre
- **Bakım Geçmişi**: Detaylı bakım kayıtları ve fotoğraflar
- **Araç Durumu Takibi**: Aktif, bakımda, satıldı durumları
- **Müşteri Bağlantısı**: Araç-müşteri ilişkisi yönetimi

### 🔧 İş Emri Yönetimi
- **Detaylı İş Tanımları**: Açıklama, öncelik, tahmini maliyet
- **Teknisyen Atama**: İş emirlerini teknisyenlere atama
- **Durum Takibi**: Beklemede, devam ediyor, tamamlandı, iptal
- **Maliyet Hesaplama**: Tahmini ve gerçek maliyet karşılaştırması

### 👥 Müşteri Yönetimi
- **Kapsamlı Müşteri Profilleri**: Kişisel bilgiler, iletişim, adres
- **İletişim Geçmişi**: E-posta, SMS, telefon kayıtları
- **Araç Geçmişi**: Müşterinin tüm araçları
- **Memnuniyet Takibi**: Müşteri değerlendirmeleri

### 💳 Abonelik Yönetimi
- **3 Farklı Plan**: Başlangıç, Profesyonel, Kurumsal
- **Kullanım Limitleri**: İş emri, kullanıcı, depolama, API çağrı limitleri
- **Stripe Entegrasyonu**: Güvenli ödeme işlemleri
- **Otomatik Faturalandırma**: Aylık/yıllık faturalandırma

### 📊 Raporlama ve Analitik
- **Finansal Raporlar**: Gelir, gider, kâr analizleri
- **Operasyonel Raporlar**: İş emri, teknisyen performansı
- **Müşteri Analitikleri**: Müşteri memnuniyeti, sadakat
- **Trend Analizleri**: Zaman bazlı performans analizleri

### 📱 Modern UI/UX
- **Responsive Tasarım**: Mobil, tablet, desktop uyumlu
- **PWA Desteği**: Progressive Web App özellikleri
- **Dark/Light Mode**: Tema seçenekleri
- **Accessibility**: Erişilebilirlik standartları

### 🔔 Bildirim Sistemi
- **E-posta Bildirimleri**: Otomatik e-posta gönderimi
- **SMS Bildirimleri**: NetGSM entegrasyonu
- **WhatsApp Bildirimleri**: WhatsApp Business API
- **Push Bildirimleri**: Mobil uygulama bildirimleri

### 🤖 AI Destekli Özellikler
- **Öngörülü Bakım**: Makine öğrenmesi ile bakım tahmini
- **Anomali Tespiti**: Olağandışı durumları tespit etme
- **Akıllı Öneriler**: Bakım ve onarım önerileri
- **Otomatik Kategorizasyon**: İş emirlerini otomatik kategorize etme

## 🏗️ Teknoloji Stack

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **TypeScript**: Type-safe JavaScript
- **MongoDB**: NoSQL veritabanı
- **Mongoose**: MongoDB ODM
- **Redis**: Cache ve session store
- **JWT**: Authentication
- **Stripe**: Payment processing

### Frontend
- **Next.js 14**: React framework
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS
- **Framer Motion**: Animation library
- **React Query**: Data fetching
- **Zustand**: State management

### DevOps & Infrastructure
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Reverse proxy ve load balancer
- **Prometheus**: Monitoring
- **Grafana**: Visualization
- **ELK Stack**: Logging
- **Let's Encrypt**: SSL certificates

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18.0+
- MongoDB 6.0+
- Redis 7.0+
- Docker (opsiyonel)

### Kurulum

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/your-username/ototakibim.git
cd ototakibim
```

2. **Bağımlılıkları yükleyin:**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Environment dosyalarını oluşturun:**
```bash
# Backend
cp .env.example .env.development

# Frontend
cp .env.example .env.local
```

4. **Veritabanlarını başlatın:**
```bash
# MongoDB
mongod

# Redis
redis-server
```

5. **Uygulamaları başlatın:**
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

6. **Tarayıcıda açın:**
```
Frontend: http://localhost:3000
Backend API: http://localhost:5000
```

## 📖 Dokümantasyon

- **[API Dokümantasyonu](./API_DOCUMENTATION.md)**: Tüm API endpoint'leri
- **[Kullanıcı Kılavuzu](./USER_GUIDE.md)**: Kullanıcı rehberi
- **[Geliştirici Rehberi](./DEVELOPER_GUIDE.md)**: Geliştirme rehberi
- **[Deployment Rehberi](./DEPLOYMENT_GUIDE.md)**: Production deployment
- **[Hotfix Özeti](./HOTFIX_SUMMARY.md)**: UI düzeltmeleri ve modern tasarım

## 🧪 Test

```bash
# Backend testleri
cd backend
npm test

# Frontend testleri
cd frontend
npm test

# Tüm testler
npm run test:all
```

## 📦 Production Deployment

### Docker ile Deployment
```bash
# Production build
docker-compose -f docker-compose.production.yml up -d
```

### Manuel Deployment
```bash
# Deployment script'ini çalıştırın
chmod +x deploy.sh
./deploy.sh
```

## 🔧 Konfigürasyon

### Environment Variables

#### Backend (.env)
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ototakibim
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=sk_live_your_stripe_key
```

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
```

## 📊 Monitoring

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001
- **Kibana**: http://localhost:5601

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

- **Website**: https://ototakibim.com
- **Email**: info@ototakibim.com
- **Support**: support@ototakibim.com
- **GitHub**: https://github.com/ototakibim

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org) - React framework
- [MongoDB](https://mongodb.com) - Database
- [Stripe](https://stripe.com) - Payment processing
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Vercel](https://vercel.com) - Deployment platform

---

**OtoTakibim** ile araç bakımınızı dijitalleştirin! 🚗✨