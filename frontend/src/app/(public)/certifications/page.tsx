import type { Metadata } from 'next';
import CertificationsClient from './CertificationsClient';
import JsonLd from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';

export const metadata: Metadata = {
  title: 'Certifications & Compliance | HACCP, Phytosanitary, Halal — Dewan Traders',
  description:
    'Dewan Traders holds industry certifications including HACCP food safety, phytosanitary certificates for agricultural exports, halal compliance, and ISO-aligned quality standards. All exports from Pakistan are fully documented and compliant.',
  keywords: [
    'HACCP certified Pakistan exporter', 'phytosanitary certificate Pakistan',
    'halal certified food exporter', 'Pakistan food safety certification',
    'ISO exporter Pakistan', 'food export compliance Pakistan',
    'certified agricultural exporter Pakistan',
  ],
  alternates: { canonical: `${SITE_URL}/certifications` },
  openGraph: {
    title: 'Certifications & Compliance — Dewan Traders Pakistan',
    description: 'HACCP, phytosanitary, halal certified — fully compliant Pakistan export company.',
    url: `${SITE_URL}/certifications`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Dewan Traders Certifications' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Certifications', item: `${SITE_URL}/certifications` },
  ],
};

export default function CertificationsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <CertificationsClient />
    </>
  );
}
