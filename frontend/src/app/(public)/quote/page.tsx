import type { Metadata } from 'next';
import QuoteClient from './QuoteClient';
import JsonLd from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';

export const metadata: Metadata = {
  title: 'Request a Trade Quote | Pakistan B2B Export Pricing — Dewan Traders',
  description:
    'Get a free B2B export quote from Dewan Traders. Request FOB/CIF pricing for Kinnow mandarins, Basmati rice, fresh vegetables, surgical instruments, or sports goods. Fast response within 24 hours.',
  keywords: [
    'Pakistan export quote', 'Kinnow export price', 'Basmati rice export quote',
    'Pakistan B2B trade quote', 'surgical instruments price Pakistan', 'sports goods export quote',
    'free trade quote Pakistan exporter', 'FOB CIF price Pakistan',
  ],
  alternates: { canonical: `${SITE_URL}/quote` },
  openGraph: {
    title: 'Request a Trade Quote — Dewan Traders Pakistan',
    description: 'Free B2B export quote: Kinnow, Basmati rice, produce, surgical, sports. 24hr response.',
    url: `${SITE_URL}/quote`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Get a Trade Quote — Dewan Traders' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Request a Quote', item: `${SITE_URL}/quote` },
  ],
};

export default function QuotePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <QuoteClient />
    </>
  );
}
