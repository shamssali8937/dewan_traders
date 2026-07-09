import type { Metadata } from 'next';
import FaqsClient from './FaqsClient';
import JsonLd from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';

export const metadata: Metadata = {
  title: 'FAQs | Pakistan Export Compliance, MOQ, Shipping — Dewan Traders',
  description:
    'Frequently asked questions about Dewan Traders export services: minimum order quantities, private labeling, phytosanitary certificates, surgical steel grades, FOB/CIF Incoterms, shipping documents, and Karachi port logistics.',
  keywords: [
    'Pakistan export FAQ', 'minimum order quantity Pakistan export', 'FOB Karachi Pakistan',
    'phytosanitary certificate FAQ', 'Pakistan export documents', 'CIF CFR Pakistan trade',
    'surgical instruments steel grade Pakistan', 'Pakistan private label exporter',
  ],
  alternates: { canonical: `${SITE_URL}/faqs` },
  openGraph: {
    title: 'FAQs — Dewan Traders Pakistan Export',
    description: 'MOQ, documents, compliance, shipping terms — all your Pakistan export questions answered.',
    url: `${SITE_URL}/faqs`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Dewan Traders FAQs' }],
  },
};

// FAQPage schema — gives Google rich "People Also Ask" snippets
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the Minimum Order Quantity (MOQ) for imports from Dewan Traders?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MOQs vary by product. Fresh produce (Kinnow, mangoes) is typically 10–25 Metric Tons (one refrigerated 40ft container). Surgical sets and sports goods can be dispatched in smaller LCL air-freight volumes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Dewan Traders offer private labeling or custom brand packing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We provide complete OEM private label printing and packaging for Basmati rice sacks, surgical instrument boxes, and sports items matching your domestic store requirements.',
      },
    },
    {
      '@type': 'Question',
      name: 'What ports does Dewan Traders ship from in Pakistan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ocean cargo is cleared from Karachi Port (KP) or Port Qasim (PQ). Air freight is consolidated from Islamabad, Sialkot, or Lahore airports.',
      },
    },
    {
      '@type': 'Question',
      name: 'What trade documents are provided with shipments?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Standard documents include: Bill of Lading, Commercial Invoice, Packing List, Certificate of Origin (COO), Phytosanitary (Health) Certificate, and laboratory test reports.',
      },
    },
    {
      '@type': 'Question',
      name: 'What shipping Incoterms does Dewan Traders support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We support FOB (Free On Board) Karachi, CFR (Cost and Freight), and CIF (Cost, Insurance, Freight) to your destination port.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are product samples available before placing a full order?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We dispatch sample cartons of Kinnow, Basmati rice, or surgical tools via DHL/FedEx to verified importers for compliance checks.',
      },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'FAQs', item: `${SITE_URL}/faqs` },
  ],
};

export default function FaqsPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />
      <FaqsClient />
    </>
  );
}
