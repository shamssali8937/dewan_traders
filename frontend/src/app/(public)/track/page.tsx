import type { Metadata } from 'next';
import PublicTrackingPage from './TrackingClient';
import JsonLd from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';

export const metadata: Metadata = {
  title: 'Track Cargo & Order Status | Dewan Traders',
  description:
    'Track your shipment or cargo order status in real-time. Enter your DT reference or contract number to view packing house status, custom clearance milestones, and shipping line updates.',
  keywords: ['track shipment Pakistan export', 'cargo tracking Dewan Traders', 'citrus container shipping tracking'],
  alternates: { canonical: `${SITE_URL}/track` },
  openGraph: {
    title: 'Track Cargo & Order Status — Dewan Traders',
    description: 'Real-time B2B export shipment and container cargo tracking.',
    url: `${SITE_URL}/track`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Track Cargo - Dewan Traders' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Cargo Tracking', item: `${SITE_URL}/track` },
  ],
};

export default function TrackingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <PublicTrackingPage />
    </>
  );
}
