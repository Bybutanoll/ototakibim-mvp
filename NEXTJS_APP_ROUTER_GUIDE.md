# Next.js App Router Server/Client Component Rehberi

## 🚨 Kalıcı Çözümler - Tekrarlanmaması İçin

### 1. Server/Client Component Ayrımı
**Hata:** Server Component içinde `ssr: false` kullanılamaz
**Çözüm:** ClientWrapper pattern kullan

```typescript
// ❌ YANLIŞ - Server Component'da
import dynamic from 'next/dynamic';
const Component = dynamic(() => import('./Component'), { ssr: false });

// ✅ DOĞRU - ClientWrapper'da
"use client";
import dynamic from 'next/dynamic';
const Component = dynamic(() => import('./Component'), { ssr: false });
```

### 2. Hydration Sorunları
**Hata:** Server ve client render farklılıkları
**Çözüm:** useClientOnly hook kullan

```typescript
// ❌ YANLIŞ
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

// ✅ DOĞRU
import { useClientOnly } from '@/hooks/useClientOnly';
const hasMounted = useClientOnly();
```

### 3. Dynamic Import Yönetimi
**Hata:** Server Component'da dynamic import
**Çözüm:** ClientWrapper'da topla

```typescript
// components/ClientWrapper.tsx
"use client";
import dynamic from 'next/dynamic';

const OfflineIndicator = dynamic(() => import('./OfflineIndicator'), {
  ssr: false,
  loading: () => null
});

export default function ClientWrapper({ children }) {
  return (
    <>
      <OfflineIndicator />
      {children}
    </>
  );
}
```

### 4. Error Boundary Yönetimi
**Hata:** Server Component'da Error Boundary
**Çözüm:** Client Component olarak işaretle

```typescript
// ❌ YANLIŞ
class ErrorBoundary extends React.Component { ... }

// ✅ DOĞRU
"use client";
class ErrorBoundary extends React.Component { ... }
```

## 🛡️ Önleyici Tedbirler

### Component Geliştirme Kuralları
1. **Client-side functionality:** "use client" direktifi
2. **Dynamic imports:** Sadece Client Component'larda
3. **Server Component:** Static import kullan
4. **Hydration:** useClientOnly hook'u kullan

### Layout Yapısı
```typescript
// app/layout.tsx - Server Component
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Provider1>
          <Provider2>
            <ClientWrapper>
              {children}
            </ClientWrapper>
          </Provider2>
        </Provider1>
      </body>
    </html>
  );
}
```

### ClientWrapper Pattern
```typescript
// components/ClientWrapper.tsx
"use client";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DynamicComponent = dynamic(() => import('./Component'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function ClientWrapper({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicComponent />
      {children}
    </Suspense>
  );
}
```

## 🔧 Hızlı Düzeltme Komutları

```bash
# Favicon çakışmasını çöz
rm -rf src/app/favicon.ico

# ClientWrapper oluştur
# components/ClientWrapper.tsx dosyasını oluştur

# useClientOnly hook kur
# hooks/useClientOnly.ts dosyasını oluştur
```

## 📋 Kontrol Listesi

### Server Component Kontrolleri
- [ ] "use client" direktifi yok
- [ ] Dynamic import yok
- [ ] Browser API kullanımı yok
- [ ] Event listener yok

### Client Component Kontrolleri
- [ ] "use client" direktifi var
- [ ] Dynamic import'lar mevcut
- [ ] useClientOnly hook kullanılıyor
- [ ] Hydration kontrolü yapılıyor

### Layout Kontrolleri
- [ ] Server Component olarak kalıyor
- [ ] ClientWrapper kullanılıyor
- [ ] Provider'lar doğru sırada
- [ ] Error Boundary client-side

## 🚀 Gelecekteki Geliştirmeler

1. **Otomatik Component Detection:** CI/CD'de Server/Client ayrımı kontrolü
2. **Hydration Monitoring:** Gerçek zamanlı hydration hata izleme
3. **Component Safety:** Otomatik güvenlik kontrolleri
4. **Performance Optimization:** Dynamic import optimizasyonu

## 🎯 Best Practices

### 1. Component Ayrımı
- **Server Component:** Data fetching, static content
- **Client Component:** Interactivity, browser API

### 2. Import Stratejisi
- **Static Import:** Server Component'larda
- **Dynamic Import:** Client Component'larda

### 3. State Yönetimi
- **Server State:** Server Component'larda
- **Client State:** Client Component'larda

### 4. Error Handling
- **Server Errors:** Server Component'larda
- **Client Errors:** Error Boundary ile

Bu rehberi takip ederek Next.js App Router sorunlarını önleyebilirsiniz.
