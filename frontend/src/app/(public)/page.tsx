import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import JsonLd from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';

export const metadata: Metadata = {
  title: 'Dewan Traders | Pakistan Import & Export — Kinnow, Rice, Surgical, Sports',
  description:
    'Dewan Traders — Sargodha\'s premier B2B export company. We supply Kinnow mandarins, Basmati rice, fresh fruits & vegetables, surgical instruments, and sports goods to buyers worldwide. Get a free trade quote today.',
  keywords: [
    'Kinnow exporter Pakistan', 'Basmati rice exporter', 'import export company Sargodha',
    'fresh fruit export Pakistan', 'surgical instruments exporter', 'sports goods Pakistan',
    'Pakistan B2B trade', 'Dewan Traders', 'halal food export Pakistan',
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'Dewan Traders | Pakistan Import & Export — Kinnow, Rice, Surgical, Sports',
    description: 'Sargodha\'s premier B2B export company. Kinnow, Basmati rice, fresh produce, surgical & sports goods.',
    url: SITE_URL,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Dewan Traders Pakistan' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }],
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <HomeClient />
    </>
  );
}
