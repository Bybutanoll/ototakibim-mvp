# OtoTakibim Deployment Guide

## 🚀 Production Deployment

### Önkoşullar
- Node.js 18+ yüklü
- npm veya pnpm yüklü
- Git repository erişimi

### 1. Branch Merge Sırası

```bash
# Ana branch'e geç
git checkout main

# Hotfix branch'lerini sırayla merge et
git merge hotfix/repro-logs
git merge hotfix/tailwind-global-fix
git merge hotfix/layout-portal
git merge hotfix/responsive-fixes
git merge feature/landing-pentayazilim-style
git merge ci/smoke-tests

# Değişiklikleri push et
git push origin main
```

### 2. Production Build

```bash
cd frontend

# Dependencies yükle
npm install

# Production build
npm run build

# Build test
npm run type-check
npm run lint
```

### 3. Deployment Seçenekleri

#### A) Vercel (Önerilen)
```bash
# Vercel CLI yükle
npm i -g vercel

# Deploy et
vercel --prod
```

#### B) Netlify
```bash
# Netlify CLI yükle
npm i -g netlify-cli

# Deploy et
netlify deploy --prod --dir=frontend/out
```

#### C) Docker
```bash
# Docker build
docker build -f frontend/Dockerfile.production -t ototakibim-frontend .

# Docker run
docker run -p 3000:3000 ototakibim-frontend
```

### 4. Environment Variables

Production'da gerekli environment variables:

```env
NEXT_PUBLIC_API_URL=https://ototakibim-mvp.onrender.com
NEXT_PUBLIC_APP_URL=https://ototakibim.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://ototakibim.com
```

### 5. Post-Deployment Checklist

- [ ] Ana sayfa yükleniyor
- [ ] Login/Register sayfaları çalışıyor
- [ ] Dashboard erişimi var
- [ ] Responsive tasarım test edildi
- [ ] Mobile uyumluluk kontrol edildi
- [ ] Performance test yapıldı
- [ ] SEO meta tags kontrol edildi
- [ ] Analytics entegrasyonu aktif

### 6. Monitoring

#### Performance Monitoring
- Google PageSpeed Insights
- Lighthouse audit
- Core Web Vitals

#### Error Monitoring
- Sentry entegrasyonu
- Console error tracking
- User feedback collection

### 7. Rollback Plan

Eğer sorun olursa:

```bash
# Önceki stable version'a dön
git checkout main
git reset --hard HEAD~1
git push origin main --force

# Veya specific commit'e dön
git checkout <commit-hash>
git push origin main --force
```

### 8. CI/CD Pipeline

GitHub Actions otomatik olarak:
- Lint ve type check
- Build test
- Smoke tests
- Artifact upload

### 9. Domain ve SSL

- Domain: ototakibim.com
- SSL: Let's Encrypt (otomatik)
- CDN: Cloudflare (önerilen)

### 10. Backup

- Database backup
- File storage backup
- Configuration backup

## 🎯 Success Metrics

### Performance
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- First Input Delay < 100ms

### User Experience
- Mobile responsiveness: 100%
- Accessibility score: 95%+
- Cross-browser compatibility
- Loading speed optimization

## 📞 Support

Deployment sorunları için:
- GitHub Issues
- Email: dev@ototakibim.com
- Slack: #deployment

---

**Not**: Bu deployment guide, hotfix sonrası production'a çıkış için hazırlanmıştır. Tüm adımlar test edilmiş ve onaylanmıştır.