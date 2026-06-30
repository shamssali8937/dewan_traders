import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/QueryProvider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dewantraders.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Dewan Traders — Import & Export, Sargodha Pakistan',
    template: '%s | Dewan Traders',
  },
  description:
    'Dewan Traders is a Sargodha-based premium import & export company by Sajjad Hussain Awan, specializing in fresh fruits, vegetables, premium rice, surgical instruments, and sports equipment from Pakistan.',
  keywords: [
    'Dewan Traders', 'import export Pakistan', 'Sargodha exporter',
    'Kinnow mandarin export', 'Basmati rice export', 'surgical instruments Sialkot',
    'sports goods Pakistan', 'fresh fruits export', 'vegetables export',
    'Sajjad Hussain Awan'
  ],
  authors: [{ name: 'Dewan Traders', url: SITE_URL }],
  creator: 'Dewan Traders',
  publisher: 'Dewan Traders',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Dewan Traders',
    title: 'Dewan Traders — Premium Import & Export from Pakistan',
    description:
      'Sourcing excellence since 1998. Fresh Fruits, Vegetables, Premium Rice, Surgical Items & Sports Goods — direct from Pakistan to the world.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dewan Traders — Import & Export Company',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dewan Traders — Premium Import & Export from Pakistan',
    description: 'Fresh Fruits, Vegetables, Rice, Surgical & Sports Goods from Pakistan.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <meta name="geo.region" content="PK-PB" />
        <meta name="geo.placename" content="Sargodha, Pakistan" />
        <meta name="geo.position" content="32.0836;72.6711" />
        <meta name="ICBM" content="32.0836, 72.6711" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-slate-950 text-white`} suppressHydrationWarning>
        <QueryProvider>
          {children}
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
