import type { Metadata } from 'next';
import ExportProcessClient from './ExportProcessClient';
import JsonLd from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';

export const metadata: Metadata = {
  title: 'How We Export | Pakistan Export Process & Documentation — Dewan Traders',
  description:
    'Step-by-step Pakistan export process by Dewan Traders: RFQ, product selection, quality inspection, phytosanitary certificate, customs documentation, Karachi port loading, sea/air freight, and delivery. Fully documented and compliant.',
  keywords: [
    'Pakistan export process', 'how to export from Pakistan', 'Pakistan customs documentation',
    'phytosanitary certificate Pakistan', 'Karachi port shipping', 'Pakistan sea freight',
    'export documentation Pakistan', 'Pakistan trade compliance',
  ],
  alternates: { canonical: `${SITE_URL}/export-process` },
  openGraph: {
    title: 'Pakistan Export Process — Dewan Traders',
    description: 'Full export process: RFQ → quality inspection → customs → Karachi port → delivery.',
    url: `${SITE_URL}/export-process`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Dewan Traders Export Process' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Export Process', item: `${SITE_URL}/export-process` },
  ],
};

export default function ExportProcessPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <ExportProcessClient />
    </>
  );
}
