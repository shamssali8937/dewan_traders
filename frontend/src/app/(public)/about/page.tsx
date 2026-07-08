import type { Metadata } from 'next';
import AboutClient from './AboutClient';
import JsonLd from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';

export const metadata: Metadata = {
  title: 'About Us | Dewan Traders — Sargodha Export Company Est. 2005',
  description:
    'Learn about Dewan Traders — a family-owned B2B import & export company founded in 2005 in Sargodha, Punjab, Pakistan by Sajjad Hussain Awan. Our mission is to connect Pakistan\'s finest agricultural and industrial products with global buyers.',
  keywords: [
    'about Dewan Traders', 'Sargodha export company', 'Sajjad Hussain Awan',
    'Pakistan trade company history', 'Punjab agricultural exporter',
  ],
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: 'About Dewan Traders — Sargodha Export Company Est. 2005',
    description: 'Family-owned B2B import & export company from Sargodha, Punjab, Pakistan. Est. 2005.',
    url: `${SITE_URL}/about`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'About Dewan Traders' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'About Us', item: `${SITE_URL}/about` },
  ],
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <AboutClient />
    </>
  );
}
