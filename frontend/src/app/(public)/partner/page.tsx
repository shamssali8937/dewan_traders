import type { Metadata } from 'next';
import PartnerClient from './PartnerClient';
import JsonLd from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';

export const metadata: Metadata = {
  title: 'Partner With Us | B2B Global Trade Partnership — Dewan Traders',
  description:
    'Partner with Dewan Traders, Pakistan\'s premier B2B export house. We offer supply chain partnerships, joint ventures, agricultural contracts, and distribution opportunities for global import houses.',
  keywords: [
    'partner with Dewan Traders', 'import export partnership', 'Pakistan B2B distributor',
    'Basmati rice agent', 'surgical instruments distributor Sialkot', 'citrus import agent',
  ],
  alternates: { canonical: `${SITE_URL}/partner` },
  openGraph: {
    title: 'Partner With Us — Dewan Traders Pakistan',
    description: 'Grow your business with Pakistan\'s leading exporter. Trade partnership and global supply chain alignment.',
    url: `${SITE_URL}/partner`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Partner With Dewan Traders' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Partner with Us', item: `${SITE_URL}/partner` },
  ],
};

export default function PartnerPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <PartnerClient />
    </>
  );
}
