import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Provider'lar (bunlar server-side olabilir)
import { AuthProvider } from '../contexts/AuthContext';
import { TenantProvider } from '../contexts/TenantContext';
import { AppointmentProvider } from '@/contexts/AppointmentContext';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { UsageMonitoringProvider } from '@/contexts/UsageMonitoringContext';
import { QueryProvider } from '@/providers/QueryProvider';
import { PWAProvider } from '@/components/PWAProvider';
import PerformanceMonitor from '@/components/PerformanceMonitor';

// Client wrapper'ı import et
import ClientWrapper from '@/components/ClientWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OtoTakibim - AI Destekli Araç Sağlık Asistanı',
  description: 'Türkiye\'nin ilk yapay zeka destekli araç sağlık asistanı. Araç bakımınızı takip edin, sorunları önceden tespit edin ve servis maliyetlerinizi düşürün.',
  keywords: 'araç takibi, araç bakımı, AI, yapay zeka, oto servis, araç sağlığı',
  authors: [{ name: 'OtoTakibim Team' }],
  creator: 'OtoTakibim',
  publisher: 'OtoTakibim',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ototakibim.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'OtoTakibim - AI Destekli Araç Sağlık Asistanı',
    description: 'Türkiye\'nin ilk yapay zeka destekli araç sağlık asistanı',
    url: 'https://ototakibim.com',
    siteName: 'OtoTakibim',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OtoTakibim - AI Destekli Araç Sağlık Asistanı',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OtoTakibim - AI Destekli Araç Sağlık Asistanı',
    description: 'Türkiye\'nin ilk yapay zeka destekli araç sağlık asistanı',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="OtoTakibim" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="OtoTakibim" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/_next/static/css/app.css" as="style" />
        <link rel="preload" href="/_next/static/chunks/framework.js" as="script" />
        <link rel="preload" href="/_next/static/chunks/main.js" as="script" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//ototakibim-mvp.onrender.com" />
        
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://ototakibim-mvp.onrender.com" />
      </head>
      <body className={inter.className}>
        <PWAProvider>
          <QueryProvider>
            <AuthProvider>
              <TenantProvider>
                <SubscriptionProvider>
                  <UsageMonitoringProvider>
                    <AppointmentProvider>
                      <PaymentProvider>
                        <ClientWrapper>
                          {children}
                        </ClientWrapper>
                        <PerformanceMonitor />
                        
                        {/* Portal container for modals, toasts, etc. */}
                        <div id="portal-root" className="relative z-50" />
                      </PaymentProvider>
                    </AppointmentProvider>
                  </UsageMonitoringProvider>
                </SubscriptionProvider>
              </TenantProvider>
            </AuthProvider>
          </QueryProvider>
        </PWAProvider>
      </body>
    </html>
  );
}
