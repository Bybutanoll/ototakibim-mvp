import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppointmentProvider } from '@/contexts/AppointmentContext';
import { PaymentProvider } from '@/contexts/PaymentContext';

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
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0F172A" />
        <meta name="msapplication-TileColor" content="#0F172A" />
      </head>
              <body className={inter.className}>
          <AuthProvider>
            <AppointmentProvider>
              <PaymentProvider>
                {children}
              </PaymentProvider>
            </AppointmentProvider>
          </AuthProvider>
        </body>
    </html>
  );
}
