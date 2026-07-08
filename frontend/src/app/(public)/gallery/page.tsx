import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';
import JsonLd from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';

export const metadata: Metadata = {
  title: 'Media Gallery | Packing House & Export Quality — Dewan Traders',
  description:
    'Visual documentation of our export operations. Browse photos of premium Kinnow packaging in Sargodha, Basmati rice milling in Punjab, and surgical instrument inspections in Sialkot.',
  keywords: [
    'Dewan Traders gallery', 'Kinnow packing photos', 'basmati rice milling photos',
    'surgical instruments manufacturing sialkot', 'export quality control pictures',
  ],
  alternates: { canonical: `${SITE_URL}/gallery` },
  openGraph: {
    title: 'Media Gallery — Dewan Traders Pakistan',
    description: 'Visual documentation of our packing houses, quality inspection, and agricultural sourcing.',
    url: `${SITE_URL}/gallery`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Dewan Traders Gallery' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Media Gallery', item: `${SITE_URL}/gallery` },
  ],
};

export default function GalleryPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <GalleryClient />
    </>
  );
}
