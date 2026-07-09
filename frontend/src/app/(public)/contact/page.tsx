import type { Metadata } from 'next';
import ContactClient from './ContactClient';
import JsonLd from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';

export const metadata: Metadata = {
  title: 'Contact Us | Dewan Traders — Sargodha, Punjab, Pakistan',
  description:
    'Contact Dewan Traders for B2B import/export inquiries. We are located at 38-A, Mansoorabad, Sargodha, Punjab 40100, Pakistan. WhatsApp: +92 345 6776075. Email: awantransportuae@gmail.com. Get a free trade quote today.',
  keywords: [
    'contact Dewan Traders', 'Sargodha exporter contact', 'Pakistan trade inquiry',
    'B2B trade contact Pakistan', 'export quote Pakistan', 'Dewan Traders phone number',
    'Dewan Traders email', 'Sargodha Punjab Pakistan address',
  ],
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: 'Contact Dewan Traders — Sargodha, Pakistan',
    description: '38-A Mansoorabad, Sargodha, Punjab 40100 Pakistan. WhatsApp: +92 345 6776075.',
    url: `${SITE_URL}/contact`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Contact Dewan Traders' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Contact Us', item: `${SITE_URL}/contact` },
  ],
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <ContactClient />
    </>
  );
}
