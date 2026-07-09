import type { Metadata } from 'next';
import CountriesClient from './CountriesClient';
import JsonLd from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';

export const metadata: Metadata = {
  title: 'Countries We Export To | UAE, Saudi Arabia, UK, Europe — Dewan Traders',
  description:
    'Dewan Traders exports to 30+ countries including UAE, Saudi Arabia, Qatar, UK, Germany, USA, China, Malaysia, and more. We handle all shipping, customs, and last-mile delivery logistics from Pakistan.',
  keywords: [
    'Pakistan export to UAE', 'Pakistan export to Saudi Arabia', 'Pakistan export to UK',
    'Pakistan export to Europe', 'Pakistan fruits UAE', 'Pakistan rice Saudi Arabia',
    'Pakistan agricultural export countries', 'Pakistan global trade destinations',
    'Kinnow UAE importer', 'Basmati rice UK importer',
  ],
  alternates: { canonical: `${SITE_URL}/countries` },
  openGraph: {
    title: 'Countries We Export To — Dewan Traders Pakistan',
    description: 'Exporting to UAE, Saudi Arabia, UK, Europe, USA and 30+ more countries from Pakistan.',
    url: `${SITE_URL}/countries`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Dewan Traders Export Destinations' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Export Countries', item: `${SITE_URL}/countries` },
  ],
};

export default function CountriesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <CountriesClient />
    </>
  );
}
