import type { Metadata } from 'next';
import JournalClient from './JournalClient';
import JsonLd from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';

export const metadata: Metadata = {
  title: 'Trade Journal & Blog | Pakistan Export Insights — Dewan Traders',
  description:
    'Stay informed with Dewan Traders\' trade journal: export market trends, Kinnow harvest seasons, Basmati rice price updates, Pakistan agricultural news, surgical instruments trade, and B2B export guides.',
  keywords: [
    'Pakistan trade journal', 'export market trends Pakistan', 'Kinnow harvest news',
    'Basmati rice price Pakistan', 'Pakistan agricultural export news',
    'Pakistan B2B trade blog', 'import export guide Pakistan',
  ],
  alternates: { canonical: `${SITE_URL}/journal` },
  openGraph: {
    title: 'Trade Journal — Dewan Traders Pakistan',
    description: 'Export market trends, harvest seasons, Basmati rice prices, Pakistan trade news.',
    url: `${SITE_URL}/journal`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Dewan Traders Trade Journal' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Trade Journal', item: `${SITE_URL}/journal` },
  ],
};

export default function JournalPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JournalClient />
    </>
  );
}
