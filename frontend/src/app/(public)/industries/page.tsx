import type { Metadata } from 'next';
import IndustriesClient from './IndustriesClient';
import JsonLd from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';

export const metadata: Metadata = {
  title: 'Industries Served | Agri, Medical, Sports Export — Dewan Traders Pakistan',
  description:
    'Dewan Traders serves importers across food & beverage, healthcare (surgical instruments), retail sports, and hospitality industries. Trusted Pakistan B2B supplier for UAE, Saudi Arabia, UK, Europe, and beyond.',
  keywords: [
    'Pakistan agricultural industry exporter', 'Pakistan medical device exporter',
    'Pakistan sports industry supplier', 'B2B food supplier Pakistan',
    'Pakistan UAE trade', 'Pakistan Saudi Arabia import', 'Pakistan UK export',
  ],
  alternates: { canonical: `${SITE_URL}/industries` },
  openGraph: {
    title: 'Industries Served — Dewan Traders Pakistan',
    description: 'Agri, healthcare, sports & hospitality — trusted Pakistan B2B exporter for global buyers.',
    url: `${SITE_URL}/industries`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Dewan Traders Industries' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Industries', item: `${SITE_URL}/industries` },
  ],
};

export default function IndustriesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <IndustriesClient />
    </>
  );
}
