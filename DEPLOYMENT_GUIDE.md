# OtoTakibim Production Deployment Guide

Bu rehber, OtoTakibim uygulamasını production ortamına deploy etmek için gerekli adımları içerir.

## 📋 Gereksinimler

### Sistem Gereksinimleri
- **OS**: Ubuntu 20.04+ / CentOS 8+ / RHEL 8+
- **RAM**: Minimum 8GB, Önerilen 16GB+
- **CPU**: Minimum 4 core, Önerilen 8 core+
- **Disk**: Minimum 100GB SSD
- **Network**: Statik IP adresi

### Yazılım Gereksinimleri
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Node.js**: 18+
- **npm**: 8+
- **Git**: 2.30+

## 🚀 Hızlı Başlangıç

### 1. Sunucu Hazırlığı

```bash
# Sistem güncellemesi
sudo apt update && sudo apt upgrade -y

# Gerekli paketlerin kurulumu
sudo apt install -y curl wget git unzip

# Docker kurulumu
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Docker Compose kurulumu
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Node.js kurulumu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Proje Kurulumu

```bash
# Projeyi klonlama
git clone https://github.com/your-username/ototakibim.git
cd ototakibim

# Environment dosyalarını oluşturma
cp backend/env.production.example backend/.env.production
cp frontend/env.production.example frontend/.env.production

# Environment değişkenlerini düzenleme
nano backend/.env.production
nano frontend/.env.production
```

### 3. SSL Sertifikası

```bash
# Let's Encrypt ile SSL sertifikası
sudo apt install certbot python3-certbot-nginx

# Domain için sertifika alma
sudo certbot certonly --standalone -d ototakibim.com -d www.ototakibim.com -d api.ototakibim.com -d cdn.ototakibim.com

# Sertifikaları nginx dizinine kopyalama
sudo mkdir -p ssl
sudo cp /etc/letsencrypt/live/ototakibim.com/fullchain.pem ssl/ototakibim.com.crt
sudo cp /etc/letsencrypt/live/ototakibim.com/privkey.pem ssl/ototakibim.com.key
```

### 4. Deployment

```bash
# Deployment script'ini çalıştırma
chmod +x deploy.sh
./deploy.sh
```

## 🔧 Detaylı Konfigürasyon

### Environment Variables

#### Backend (.env.production)
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ototakibim_prod
DB_NAME=ototakibim_prod

# Security
JWT_SECRET=your-super-secure-jwt-secret-key
BCRYPT_ROUNDS=12

# Redis
REDIS_HOST=your-redis-host
REDIS_PASSWORD=your-redis-password

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

#### Frontend (.env.production)
```bash
# API
NEXT_PUBLIC_API_URL=https://api.ototakibim.com
NEXT_PUBLIC_APP_URL=https://ototakibim.com

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

## 📊 Monitoring ve Logging

### Prometheus & Grafana
- **Prometheus**: http://your-server:9090
- **Grafana**: http://your-server:3001
- **Default Login**: admin / admin

### ELK Stack
- **Elasticsearch**: http://your-server:9200
- **Kibana**: http://your-server:5601
- **Logstash**: Port 5044

## 🔒 Güvenlik

### Firewall Konfigürasyonu
```bash
# UFW kurulumu
sudo ufw enable

# Gerekli portları açma
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
```

### SSL/TLS
- Let's Encrypt sertifikaları otomatik yenilenir
- HSTS header'ları aktif
- TLS 1.2+ zorunlu

## 📦 Backup ve Restore

### Otomatik Backup
```bash
# Cron job ekleme
crontab -e

# Her gün saat 02:00'da backup
0 2 * * * /path/to/ototakibim/backup.sh
```

### Manuel Backup
```bash
# Tam backup
./backup.sh

# Sadece MongoDB
./backup.sh --mongodb-only
```

## 🔄 Güncelleme

### Zero-Downtime Deployment
```bash
# Yeni versiyonu çekme
git pull origin main

# Sadece build
./deploy.sh --build-only

# Sadece deploy
./deploy.sh --deploy-only
```

## 🐛 Troubleshooting

### Yaygın Sorunlar

#### 1. Docker Container'ları Başlamıyor
```bash
# Container loglarını kontrol etme
docker-compose -f docker-compose.production.yml logs

# Container'ları yeniden başlatma
docker-compose -f docker-compose.production.yml restart
```

#### 2. Database Bağlantı Hatası
```bash
# MongoDB bağlantısını test etme
mongo "mongodb://username:password@host:port/database"

# Redis bağlantısını test etme
redis-cli -h host -p port -a password ping
```

## 📈 Performance Optimization

### Database Optimization
```bash
# MongoDB index'leri
mongo ototakibim_prod
> db.users.createIndex({email: 1})
> db.workorders.createIndex({tenantId: 1, createdAt: -1})
```

### Caching
- Redis cache aktif
- Nginx static file caching
- Browser caching headers

## 📞 Destek

### İletişim
- **Email**: support@ototakibim.com
- **Slack**: #ototakibim-support

### Dokümantasyon
- **API Docs**: https://api.ototakibim.com/docs
- **User Guide**: https://ototakibim.com/docs