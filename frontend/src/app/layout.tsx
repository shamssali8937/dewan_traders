import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/QueryProvider';
import { Toaster } from 'sonner';
import AnimatedBackground from '@/components/AnimatedBackground';
import JsonLd from '@/components/seo/JsonLd';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Dewan Traders | Import & Export Company — Sargodha, Pakistan',
    template: '%s | Dewan Traders Pakistan',
  },
  description:
    'Dewan Traders is a trusted B2B import & export company based in Sargodha, Punjab, Pakistan. We export premium Kinnow mandarins, Basmati rice, fresh vegetables, surgical instruments from Sialkot, and sports goods globally. Contact us for wholesale trade enquiries.',
  keywords: [
    'Dewan Traders', 'Dewan Traders Sargodha', 'import export Pakistan',
    'Kinnow exporter Pakistan', 'Kinnow mandarin wholesale', 'Sargodha Kinnow',
    'Basmati rice exporter Pakistan', 'Pakistan rice export',
    'fresh fruit export Pakistan', 'mango exporter Pakistan',
    'vegetable exporter Pakistan', 'potato exporter Pakistan',
    'surgical instruments exporter Sialkot', 'sports goods exporter Pakistan',
    'Pakistan B2B trade supplier', 'agricultural exporter Punjab Pakistan',
    'halal food exporter Pakistan', 'Pakistan export company',
    'Sajjad Hussain Awan', 'import export Sargodha Punjab',
  ],
  authors: [{ name: 'Dewan Traders', url: SITE_URL }],
  creator: 'Dewan Traders',
  publisher: 'Dewan Traders',
  category: 'Business',
  classification: 'Import Export',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Dewan Traders',
    title: 'Dewan Traders | Premium Import & Export — Pakistan',
    description:
      'B2B export of Kinnow mandarins, Basmati rice, fresh fruits & vegetables, surgical instruments, and sports goods from Pakistan. Est. 2005.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Dewan Traders — Pakistan Import & Export Company',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dewan Traders | Premium Import & Export — Pakistan',
    description: 'B2B export of Kinnow, Basmati rice, fruits, vegetables, surgical & sports goods from Pakistan.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: SITE_URL,
    languages: { 'en-US': SITE_URL },
  },
  icons: {
    icon: [{ url: '/images/logo.png', type: 'image/png' }],
    apple: '/images/logo.png',
    shortcut: '/images/logo.png',
  },
  verification: {
    google: 'h6UM8mFKWkVSZlfG8QFSve4zgzVYjypQtAZXPVb6NA4',
  },
};

// ─── Global Structured Data Schemas ──────────────────────────────────────────
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness'],
  name: 'Dewan Traders',
  alternateName: 'Dewan Trade',
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  image: `${SITE_URL}/og-image.png`,
  description:
    'Dewan Traders is a premium B2B import & export company in Sargodha, Punjab, Pakistan, specializing in Kinnow mandarins, Basmati rice, fresh produce, surgical instruments, and sports goods.',
  foundingDate: '2005',
  founder: { '@type': 'Person', name: 'Sajjad Hussain Awan' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '38-A, Mansoorabad',
    addressLocality: 'Sargodha',
    addressRegion: 'Punjab',
    postalCode: '40100',
    addressCountry: 'PK',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 32.0836,
    longitude: 72.6711,
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+92-345-6776075',
      contactType: 'customer service',
      availableLanguage: ['English', 'Urdu'],
      areaServed: 'Worldwide',
    },
    {
      '@type': 'ContactPoint',
      email: 'awantransportuae@gmail.com',
      contactType: 'sales',
    },
  ],
  sameAs: [
    'https://www.facebook.com/dewantraders',
    'https://www.linkedin.com/company/dewan-traders',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Export Products',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Kinnow Mandarin' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Basmati Rice' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Fresh Vegetables' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Surgical Instruments' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Sports Goods' } },
    ],
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Dewan Traders',
  url: SITE_URL,
  description: 'Pakistan import & export company — Kinnow, Basmati rice, surgical instruments, sports goods',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/catalog?search={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* Geographic SEO tags */}
        <meta name="geo.region" content="PK-PB" />
        <meta name="geo.placename" content="Sargodha, Punjab, Pakistan" />
        <meta name="geo.position" content="32.0836;72.6711" />
        <meta name="ICBM" content="32.0836, 72.6711" />
        {/* Bing Webmaster Tools Verification */}
        <meta name="msvalidate.01" content="586DFBED7966D14796E82D37B91CB34C" />
        {/* Language */}
        <meta httpEquiv="content-language" content="en" />
        {/* Structured Data */}
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-white text-slate-900`} suppressHydrationWarning>
        <QueryProvider>
          {/* Global Ambient Background Animation */}
          <AnimatedBackground />

          <div className="relative z-10">
            {children}
          </div>

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #334155',
              },
            }}
            richColors
          />
        </QueryProvider>
      </body>
    </html>
  );
}
