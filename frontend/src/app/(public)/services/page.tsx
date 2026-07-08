import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';
import JsonLd from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';

export const metadata: Metadata = {
  title: 'Export Services | Freight, Customs & Trade Logistics — Dewan Traders Pakistan',
  description:
    'Dewan Traders provides end-to-end B2B export services from Pakistan: product sourcing, quality inspection, HACCP certification, phytosanitary clearance, freight booking, Karachi Port loading, and global delivery.',
  keywords: [
    'Pakistan export services', 'freight forwarding Pakistan', 'customs clearance Pakistan',
    'phytosanitary certificate Pakistan', 'HACCP certified exporter', 'Karachi port export',
    'agricultural export services Punjab', 'Pakistan trade logistics',
  ],
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    title: 'Export Services — Dewan Traders Pakistan',
    description: 'End-to-end B2B export: sourcing, quality inspection, customs, freight, delivery from Pakistan.',
    url: `${SITE_URL}/services`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Dewan Traders Export Services' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <ServicesClient />
    </>
  );
}
