import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/QueryProvider';
import { Toaster } from 'sonner';
import AnimatedBackground from '@/components/AnimatedBackground';
import JsonLd from '@/components/seo/JsonLd';
import AuthInitializer from '@/components/AuthInitializer';
import ShippingConfigInitializer from '@/components/ShippingConfigInitializer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Dewan Traders | Sargodha Kinnow & Basmati Rice Exporter',
    template: '%s | Dewan Traders',
  },
  description:
    'Dewan Traders (Dewan Trade / Dwan Trade / Dewantrade) is Pakistan’s leading B2B exporter of Sargodha Kinnow mandarins (oranges), Super Basmati Rice & surgical items.',
  keywords: [
    'Dewan Traders', 'Dewan Trade', 'Dwan Trade', 'Dewantrade', 'Dewan',
    'Kinnow', 'Kinow', 'Kinoww', 'Orange', 'Orrange', 'Sargodha Kinnow', 'Kinnow mandarin export',
    'Dewan Traders Sargodha', 'import export Pakistan', 'Kinnow exporter Pakistan',
    'Kinnow mandarin wholesale', 'Sargodha citrus export', 'Basmati rice exporter Pakistan',
    'Pakistan rice export', 'fresh fruit export Pakistan', 'mango exporter Pakistan',
    'vegetable exporter Pakistan', 'potato exporter Pakistan', 'onion exporter Pakistan',
    'surgical instruments exporter Sialkot', 'sports goods exporter Pakistan',
    'Pakistan B2B trade supplier', 'agricultural exporter Punjab Pakistan',
    'halal food exporter Pakistan', 'Pakistan export company', 'Sajjad Hussain Awan',
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
    title: 'Dewan Traders | Sargodha Kinnow & Basmati Rice Exporter',
    description:
      'Dewan Traders (Dewan Trade / Dwan Trade) is Pakistan’s premier B2B export company based in Sargodha. Specializing in Kinnow mandarins (oranges), Basmati rice & surgical goods.',
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
    title: 'Dewan Traders (Dwan Trade) | Sargodha Kinnow & Basmati Rice Exporter',
    description: 'B2B export of Sargodha Kinnow mandarins (oranges), Basmati rice, fresh produce & surgical goods from Pakistan.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: SITE_URL,
    languages: { 'en-US': SITE_URL },
  },
  icons: {
    icon: [{ url: '/images/dewan_new_logo.png', type: 'image/png' }],
    apple: '/images/dewan_new_logo.png',
    shortcut: '/images/dewan_new_logo.png',
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
  alternateName: ['Dewan Trade', 'Dwan Trade', 'Dewantrade', 'Dwan Traders', 'Dewan Exports', 'Dewan Traders Sargodha'],
  url: SITE_URL,
  logo: `${SITE_URL}/images/dewan_new_logo.png`,
  image: `${SITE_URL}/og-image.png`,
  description:
    'Dewan Traders (also known as Dewan Trade, Dwan Trade, or Dewantrade) is a premier B2B import & export company in Sargodha, Punjab, Pakistan. Global exporter of fresh Sargodha Kinnow mandarins (oranges), Super Kernel Basmati rice, fresh vegetables, Sialkot surgical instruments, and sports goods.',
  foundingDate: '2005',
  founder: { '@type': 'Person', name: 'Sajjad Hussain Awan' },
  knowsAbout: [
    'Sargodha Kinnow Mandarin Export',
    'Fresh Oranges Export Pakistan',
    'Super Basmati Rice Export',
    'Pakistan Agricultural Produce Wholesale',
    'Sialkot Surgical Instruments',
    'Sports Goods Manufacturing & Export',
  ],
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
      email: 'dewantraderssargodha@gmail.com',
      contactType: 'sales',
    },
  ],
  sameAs: [
    'https://www.facebook.com/dewantraders',
    'https://www.linkedin.com/company/dewan-traders',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Export Products & Commodities',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Sargodha Kinnow Mandarin (Fresh Oranges / Kinow)' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Super Kernel Basmati Rice' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Fresh Export Vegetables (Potatoes, Onions, Garlic)' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Sialkot Surgical Instruments' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Sports Goods & Fitness Gear' } },
    ],
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Dewan Traders',
  alternateName: ['Dewan Trade', 'Dwan Trade', 'Dewantrade'],
  url: SITE_URL,
  description: 'Pakistan import & export company — Sargodha Kinnow oranges, Basmati rice, surgical instruments, sports goods',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/catalog?search={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Dewan Traders (also searched as Dewan Trade, Dwan Trade, or Dewantrade)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dewan Traders (Dewan Trade / Dwan Trade / Dewantrade) is a premier B2B export and import company based in Sargodha, Punjab, Pakistan. Founded by Sajjad Hussain Awan in 2005, Dewan Traders exports premium Sargodha Kinnow mandarins (oranges / kinoww), Super Kernel Basmati Rice, fresh produce, surgical instruments, and sports goods to over 30 countries.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where to buy fresh Sargodha Kinnow mandarins (oranges / kinoww) wholesale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dewan Traders offers wholesale pre-booking and export of premium Sargodha Kinnow mandarins (oranges / kinow / kinoww). Cold-chain temperature controlled in 40ft reefer containers, sorted by export grade sizes (48 to 96 count), compliant with global phytosanitary standards.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Dewan Traders export Basmati Rice globally?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Dewan Traders exports Super Kernel Basmati Rice, 1121 Extra Long Grain Basmati Rice, and Non-Basmati Long Grain Rice in custom B2B packaging (10kg, 20kg, 50kg PP/Jute bags) with full quality inspection.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can B2B buyers contact Dewan Traders (Dwan Trade)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'B2B buyers can request quotes directly through the official website dewantrade.com, via email at dewantraderssargodha@gmail.com, or via WhatsApp / Phone at +92 345 6776075.',
      },
    },
  ],
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
        <JsonLd data={faqSchema} />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-white text-slate-900`} suppressHydrationWarning>
        <QueryProvider>
          <AuthInitializer />
          <ShippingConfigInitializer />
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
