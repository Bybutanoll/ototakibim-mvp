import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  canonical?: string;
  structuredData?: any;
}

export const SEO = ({
  title = 'OtoTakibim - Araç Tamir Takip Sistemi',
  description = 'Profesyonel araç tamir takip sistemi. Araçlarınızın bakım, onarım ve servis geçmişini takip edin. Müşteri yönetimi, randevu sistemi ve detaylı raporlama.',
  keywords = 'araç tamir, oto servis, araç bakım, takip sistemi, müşteri yönetimi, randevu sistemi, oto tamirci, araç servisi',
  image = '/og-image.jpg',
  url,
  type = 'website',
  author = 'OtoTakibim',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noindex = false,
  canonical,
  structuredData
}: SEOProps) => {
  const fullTitle = title.includes('OtoTakibim') ? title : `${title} | OtoTakibim`;
  const fullUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const fullImage = image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_BASE_URL || 'https://ototakibim.com'}${image}`;

  // Default structured data
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "OtoTakibim",
    "description": description,
    "url": fullUrl,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "TRY"
    },
    "author": {
      "@type": "Organization",
      "name": "OtoTakibim",
      "url": "https://ototakibim.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "OtoTakibim",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://ototakibim.com'}/logo.png`
      }
    }
  };

  // Article structured data
  const articleStructuredData = type === 'article' ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": fullImage,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "OtoTakibim",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://ototakibim.com'}/logo.png`
      }
    },
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    },
    "articleSection": section,
    "keywords": tags.join(', ')
  } : null;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="OtoTakibim" />
      <meta property="og:locale" content="tr_TR" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@ototakibim" />
      <meta name="twitter:creator" content="@ototakibim" />

      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* App-specific meta tags */}
      <meta name="application-name" content="OtoTakibim" />
      <meta name="apple-mobile-web-app-title" content="OtoTakibim" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#2563eb" />

      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData || (type === 'article' ? articleStructuredData : defaultStructuredData))
        }}
      />

      {/* Additional SEO meta tags */}
      <meta name="google-site-verification" content="your-google-verification-code" />
      <meta name="msvalidate.01" content="your-bing-verification-code" />
      <meta name="yandex-verification" content="your-yandex-verification-code" />
    </Head>
  );
};

// Predefined SEO configurations for different pages
export const SEOConfigs = {
  home: {
    title: 'OtoTakibim - Araç Tamir Takip Sistemi',
    description: 'Profesyonel araç tamir takip sistemi. Araçlarınızın bakım, onarım ve servis geçmişini takip edin.',
    keywords: 'araç tamir, oto servis, araç bakım, takip sistemi',
    type: 'website' as const
  },
  dashboard: {
    title: 'Dashboard - OtoTakibim',
    description: 'Araç tamir işletmenizin genel durumunu görüntüleyin. İstatistikler, grafikler ve önemli bilgiler.',
    keywords: 'dashboard, istatistik, araç tamir, yönetim',
    type: 'website' as const
  },
  vehicles: {
    title: 'Araç Yönetimi - OtoTakibim',
    description: 'Araçlarınızı yönetin, bakım geçmişini görüntüleyin ve yeni araç ekleyin.',
    keywords: 'araç yönetimi, araç listesi, bakım geçmişi',
    type: 'website' as const
  },
  workOrders: {
    title: 'İş Emirleri - OtoTakibim',
    description: 'İş emirlerinizi yönetin, durumlarını takip edin ve yeni iş emri oluşturun.',
    keywords: 'iş emri, tamir, onarım, takip',
    type: 'website' as const
  },
  customers: {
    title: 'Müşteri Yönetimi - OtoTakibim',
    description: 'Müşterilerinizi yönetin, iletişim bilgilerini güncelleyin ve geçmiş işlemlerini görüntüleyin.',
    keywords: 'müşteri yönetimi, müşteri listesi, iletişim',
    type: 'website' as const
  },
  appointments: {
    title: 'Randevu Sistemi - OtoTakibim',
    description: 'Randevularınızı yönetin, yeni randevu oluşturun ve takvim görünümünde görüntüleyin.',
    keywords: 'randevu, takvim, planlama, zamanlama',
    type: 'website' as const
  }
};

export default SEO;
