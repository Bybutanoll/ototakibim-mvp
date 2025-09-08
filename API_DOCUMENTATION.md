# OtoTakibim API Documentation

Bu dokümantasyon, OtoTakibim API'sinin tüm endpoint'lerini ve kullanım örneklerini içerir.

## 📋 Genel Bilgiler

### Base URL
```
Production: https://api.ototakibim.com
Development: http://localhost:5000
```

### API Version
```
v1
```

### Authentication
API, JWT (JSON Web Token) tabanlı authentication kullanır.

```bash
Authorization: Bearer <your-jwt-token>
```

### Response Format
Tüm API yanıtları aşağıdaki formatta döner:

```json
{
  "status": "success|error",
  "message": "İşlem mesajı",
  "data": {}, // Başarılı yanıtlarda veri
  "error": {} // Hata durumunda hata detayları
}
```

### Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## 🔐 Authentication Endpoints

### POST /api/auth/register
Yeni kullanıcı kaydı.

**Request Body:**
```json
{
  "name": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "password": "securePassword123",
  "tenantName": "Yılmaz Oto Servis",
  "tenantSlug": "yilmaz-oto-servis"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Kullanıcı başarıyla oluşturuldu",
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Ahmet Yılmaz",
      "email": "ahmet@example.com",
      "tenantId": "64f1a2b3c4d5e6f7g8h9i0j2",
      "role": "owner"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tenant": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Yılmaz Oto Servis",
      "slug": "yilmaz-oto-servis",
      "subscription": {
        "plan": "starter",
        "status": "trial"
      }
    }
  }
}
```

### POST /api/auth/login
Kullanıcı girişi.

**Request Body:**
```json
{
  "email": "ahmet@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Giriş başarılı",
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Ahmet Yılmaz",
      "email": "ahmet@example.com",
      "tenantId": "64f1a2b3c4d5e6f7g8h9i0j2",
      "role": "owner"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tenant": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Yılmaz Oto Servis",
      "slug": "yilmaz-oto-servis"
    }
  }
}
```

### POST /api/auth/refresh
Token yenileme.

**Headers:**
```
Authorization: Bearer <current-token>
```

**Response:**
```json
{
  "status": "success",
  "message": "Token yenilendi",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /api/auth/logout
Kullanıcı çıkışı.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "message": "Çıkış başarılı"
}
```

## 👥 User Management Endpoints

### GET /api/users
Kullanıcıları listele.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Sayfa numarası (default: 1)
- `limit` (optional): Sayfa başına kayıt (default: 10)
- `search` (optional): Arama terimi

**Response:**
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "name": "Ahmet Yılmaz",
        "email": "ahmet@example.com",
        "role": "owner",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

### POST /api/users
Yeni kullanıcı oluştur.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Ayşe Demir",
  "email": "ayse@example.com",
  "password": "securePassword123",
  "role": "technician"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Kullanıcı başarıyla oluşturuldu",
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j3",
      "name": "Ayşe Demir",
      "email": "ayse@example.com",
      "role": "technician",
      "isActive": true
    }
  }
}
```

### GET /api/users/:id
Kullanıcı detayları.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Ahmet Yılmaz",
      "email": "ahmet@example.com",
      "role": "owner",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "lastLogin": "2024-01-15T10:30:00Z"
    }
  }
}
```

### PUT /api/users/:id
Kullanıcı güncelle.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Ahmet Yılmaz Güncellendi",
  "email": "ahmet.guncel@example.com"
}
```

### PATCH /api/users/:id/role
Kullanıcı rolü güncelle.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "role": "manager"
}
```

### DELETE /api/users/:id
Kullanıcı sil.

**Headers:**
```
Authorization: Bearer <token>
```

## 🚗 Vehicle Management Endpoints

### GET /api/vehicles
Araçları listele.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Sayfa numarası
- `limit` (optional): Sayfa başına kayıt
- `search` (optional): Arama terimi
- `status` (optional): Araç durumu (active, maintenance, sold)

**Response:**
```json
{
  "status": "success",
  "data": {
    "vehicles": [
      {
        "id": "64f1a2b3c4d5e6f7g8h9i0j4",
        "plateNumber": "34ABC123",
        "brand": "Toyota",
        "model": "Corolla",
        "year": 2020,
        "vin": "1HGBH41JXMN109186",
        "customerId": "64f1a2b3c4d5e6f7g8h9i0j5",
        "status": "active",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

### POST /api/vehicles
Yeni araç ekle.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "plateNumber": "34ABC123",
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2020,
  "vin": "1HGBH41JXMN109186",
  "customerId": "64f1a2b3c4d5e6f7g8h9i0j5",
  "color": "Beyaz",
  "fuelType": "Benzin",
  "engineSize": "1.6",
  "mileage": 50000
}
```

### GET /api/vehicles/:id
Araç detayları.

### PUT /api/vehicles/:id
Araç güncelle.

### DELETE /api/vehicles/:id
Araç sil.

## 🔧 Work Order Endpoints

### GET /api/work-orders
İş emirlerini listele.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Sayfa numarası
- `limit` (optional): Sayfa başına kayıt
- `status` (optional): İş emri durumu
- `vehicleId` (optional): Araç ID'si
- `customerId` (optional): Müşteri ID'si
- `dateFrom` (optional): Başlangıç tarihi
- `dateTo` (optional): Bitiş tarihi

**Response:**
```json
{
  "status": "success",
  "data": {
    "workOrders": [
      {
        "id": "64f1a2b3c4d5e6f7g8h9i0j6",
        "orderNumber": "WO-2024-001",
        "vehicleId": "64f1a2b3c4d5e6f7g8h9i0j4",
        "customerId": "64f1a2b3c4d5e6f7g8h9i0j5",
        "description": "Motor bakımı",
        "status": "in_progress",
        "priority": "medium",
        "estimatedCost": 1500,
        "actualCost": 0,
        "assignedTo": "64f1a2b3c4d5e6f7g8h9i0j3",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

### POST /api/work-orders
Yeni iş emri oluştur.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "vehicleId": "64f1a2b3c4d5e6f7g8h9i0j4",
  "customerId": "64f1a2b3c4d5e6f7g8h9i0j5",
  "description": "Motor bakımı",
  "priority": "medium",
  "estimatedCost": 1500,
  "assignedTo": "64f1a2b3c4d5e6f7g8h9i0j3"
}
```

### GET /api/work-orders/:id
İş emri detayları.

### PUT /api/work-orders/:id
İş emri güncelle.

### PATCH /api/work-orders/:id/status
İş emri durumu güncelle.

**Request Body:**
```json
{
  "status": "completed",
  "actualCost": 1450,
  "notes": "İş tamamlandı"
}
```

### DELETE /api/work-orders/:id
İş emri sil.

## 💳 Subscription Management Endpoints

### GET /api/subscription/current
Mevcut abonelik bilgileri.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "subscription": {
      "plan": "professional",
      "status": "active",
      "expiresAt": "2024-12-31T23:59:59Z",
      "limits": {
        "workOrders": 1000,
        "users": 10,
        "storage": 1000,
        "apiCalls": 10000
      },
      "features": ["workOrders", "users", "reports", "api", "analytics"],
      "stripeCustomerId": "cus_1234567890",
      "stripeSubscriptionId": "sub_1234567890"
    }
  }
}
```

### GET /api/subscription/plans
Mevcut abonelik planları.

**Response:**
```json
{
  "status": "success",
  "data": {
    "plans": [
      {
        "id": "starter",
        "name": "Başlangıç",
        "price": 99,
        "currency": "TRY",
        "interval": "month",
        "limits": {
          "workOrders": 100,
          "users": 3,
          "storage": 100,
          "apiCalls": 1000
        },
        "features": ["workOrders", "users", "basic_reports"]
      },
      {
        "id": "professional",
        "name": "Profesyonel",
        "price": 299,
        "currency": "TRY",
        "interval": "month",
        "limits": {
          "workOrders": 1000,
          "users": 10,
          "storage": 1000,
          "apiCalls": 10000
        },
        "features": ["workOrders", "users", "reports", "api", "analytics"]
      },
      {
        "id": "enterprise",
        "name": "Kurumsal",
        "price": 999,
        "currency": "TRY",
        "interval": "month",
        "limits": {
          "workOrders": -1,
          "users": -1,
          "storage": -1,
          "apiCalls": -1
        },
        "features": ["workOrders", "users", "reports", "api", "analytics", "white_label", "priority_support"]
      }
    ]
  }
}
```

### POST /api/subscription/upgrade
Abonelik yükseltme.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "plan": "professional"
}
```

## 📊 Usage Monitoring Endpoints

### GET /api/usage/dashboard
Kullanım dashboard verileri.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "currentUsage": {
      "apiCalls": {
        "used": 1500,
        "limit": 10000,
        "percentage": 15.0
      },
      "workOrders": {
        "used": 50,
        "limit": 1000,
        "percentage": 5.0
      },
      "users": {
        "used": 3,
        "limit": 10,
        "percentage": 30.0
      },
      "storage": {
        "used": 250,
        "limit": 1000,
        "percentage": 25.0
      }
    },
    "stats": {
      "apiCalls": {
        "total": 1500,
        "byEndpoint": [
          {
            "endpoint": "/api/work-orders",
            "method": "GET",
            "count": 450,
            "avgResponseTime": 120
          }
        ]
      }
    },
    "alerts": [],
    "plan": "professional",
    "status": "active"
  }
}
```

### GET /api/usage/stats
Kullanım istatistikleri.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (optional): Dönem (day, week, month, year)

### GET /api/usage/alerts
Kullanım uyarıları.

**Headers:**
```
Authorization: Bearer <token>
```

### GET /api/usage/report
Kullanım raporu.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (optional): Rapor dönemi (daily, weekly, monthly)

## 💰 Payment Endpoints

### GET /api/stripe/customers
Stripe müşterileri.

**Headers:**
```
Authorization: Bearer <token>
```

### POST /api/stripe/customers
Yeni Stripe müşteri oluştur.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "customer@example.com",
  "name": "Müşteri Adı",
  "phone": "+905551234567"
}
```

### GET /api/stripe/subscriptions
Stripe abonelikleri.

**Headers:**
```
Authorization: Bearer <token>
```

### POST /api/stripe/subscriptions
Yeni Stripe abonelik oluştur.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "customerId": "cus_1234567890",
  "priceId": "price_1234567890",
  "paymentMethodId": "pm_1234567890"
}
```

## 🔍 Search and Filtering

### Genel Arama Parametreleri
- `search`: Genel arama terimi
- `page`: Sayfa numarası (default: 1)
- `limit`: Sayfa başına kayıt (default: 10)
- `sort`: Sıralama alanı
- `order`: Sıralama yönü (asc, desc)

### Tarih Filtreleri
- `dateFrom`: Başlangıç tarihi (ISO 8601)
- `dateTo`: Bitiş tarihi (ISO 8601)

### Örnek Kullanım
```bash
GET /api/work-orders?search=motor&status=completed&dateFrom=2024-01-01&dateTo=2024-01-31&page=1&limit=20&sort=createdAt&order=desc
```

## 🚨 Rate Limiting

API, rate limiting ile korunmaktadır:

- **Genel API**: 1000 istek / 15 dakika
- **Auth endpoints**: 5 istek / 15 dakika
- **Upload endpoints**: 50 istek / saat
- **Payment endpoints**: 10 istek / saat

Rate limit aşıldığında `429 Too Many Requests` hatası döner.

## 📝 Error Handling

### Hata Formatı
```json
{
  "status": "error",
  "message": "Hata mesajı",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detaylı hata açıklaması",
    "field": "hatalı_alan" // Validation hatalarında
  }
}
```

### Yaygın Hata Kodları
- `VALIDATION_ERROR`: Giriş doğrulama hatası
- `AUTHENTICATION_ERROR`: Kimlik doğrulama hatası
- `AUTHORIZATION_ERROR`: Yetkilendirme hatası
- `NOT_FOUND`: Kaynak bulunamadı
- `DUPLICATE_ERROR`: Tekrarlanan kayıt
- `LIMIT_EXCEEDED`: Limit aşıldı
- `PAYMENT_ERROR`: Ödeme hatası

## 🔧 SDK ve Örnekler

### JavaScript/Node.js
```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://api.ototakibim.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Token ekleme
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Kullanıcı listesi
const users = await api.get('/api/users');

// Yeni iş emri
const workOrder = await api.post('/api/work-orders', {
  vehicleId: '64f1a2b3c4d5e6f7g8h9i0j4',
  description: 'Motor bakımı'
});
```

### Python
```python
import requests

BASE_URL = 'https://api.ototakibim.com'
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

# Kullanıcı listesi
response = requests.get(f'{BASE_URL}/api/users', headers=headers)
users = response.json()

# Yeni iş emri
work_order_data = {
    'vehicleId': '64f1a2b3c4d5e6f7g8h9i0j4',
    'description': 'Motor bakımı'
}
response = requests.post(f'{BASE_URL}/api/work-orders', 
                        json=work_order_data, headers=headers)
```

### cURL Örnekleri
```bash
# Kullanıcı girişi
curl -X POST https://api.ototakibim.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# İş emirlerini listele
curl -X GET https://api.ototakibim.com/api/work-orders \
  -H "Authorization: Bearer YOUR_TOKEN"

# Yeni araç ekle
curl -X POST https://api.ototakibim.com/api/vehicles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plateNumber":"34ABC123","brand":"Toyota","model":"Corolla"}'
```

## 📞 Destek

### API Desteği
- **Email**: api-support@ototakibim.com
- **Slack**: #api-support
- **Dokümantasyon**: https://docs.ototakibim.com

### Rate Limit Artırma
Rate limit artırma talepleri için lütfen destek ekibi ile iletişime geçin.

---

**Not**: Bu dokümantasyon sürekli güncellenmektedir. En güncel versiyon için GitHub repository'sini kontrol edin.
