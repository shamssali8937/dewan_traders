import type { Metadata } from 'next';
import CatalogClient from './CatalogClient';
import JsonLd from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';

export const metadata: Metadata = {
  title: 'Product Catalog | Kinnow, Basmati Rice, Surgical & Sports Exports — Dewan Traders',
  description:
    'Browse Dewan Traders\' full export catalog: Sargodha Kinnow mandarins, Chaunsa mangoes, Basmati rice, fresh vegetables, Sialkot surgical instruments, and Pakistani sports goods. Wholesale B2B pricing available.',
  keywords: [
    'Kinnow mandarin wholesale', 'Basmati rice export catalog', 'Pakistan export products',
    'fresh fruit wholesale Pakistan', 'surgical instruments wholesale Sialkot',
    'sports goods wholesale Pakistan', 'Pakistan agricultural export catalog',
    'buy Kinnow Pakistan', 'halal meat alternative', 'Pakistani products B2B',
  ],
  alternates: { canonical: `${SITE_URL}/catalog` },
  openGraph: {
    title: 'Product Catalog | Pakistan Export Goods — Dewan Traders',
    description: 'Kinnow, Basmati rice, fresh vegetables, surgical instruments & sports goods. Wholesale B2B pricing.',
    url: `${SITE_URL}/catalog`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Dewan Traders Product Catalog' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Product Catalog', item: `${SITE_URL}/catalog` },
  ],
};

export default function CatalogPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <CatalogClient />
    </>
  );
}
