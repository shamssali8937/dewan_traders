import type { Metadata } from 'next';
import CategoryClient from './CategoryClient';
import JsonLd from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';

const categoryMeta: Record<string, { title: string; desc: string; keywords: string[] }> = {
  fruits: {
    title: 'Fresh Fruits Export | Sargodha Kinnow & Mangoes — Dewan Traders',
    desc: 'Sourcing premium Sargodha Kinnow mandarins, fresh sweet mangoes, and high-quality seasonal Pakistani fruits for global markets. Phytosanitary cleared cold chain export.',
    keywords: ['Sargodha Kinnow export', 'Pakistani citrus supplier', 'fresh mango exporter Pakistan', 'wholesale Kinnow mandarin'],
  },
  vegetables: {
    title: 'Vegetables Export | Graded Potatoes, Onions, Garlic — Dewan Traders',
    desc: 'B2B export of graded Pakistani potatoes, red onions, garlic bulbs, and fresh seasonal vegetables. Sorted and cured under ISO and HACCP compliance.',
    keywords: ['Pakistan vegetable exporter', 'wholesale potato supplier Pakistan', 'red onion export Pakistan', 'fresh produce Pakistan B2B'],
  },
  rice: {
    title: 'Basmati Rice Export | 1121 Sella & Super Kernel — Dewan Traders',
    desc: 'Exporting aged long-grain Super Kernel Basmati and premium 1121 Sella rice from top Punjab mills. High aroma, premium color sorting, custom B2B packaging.',
    keywords: ['Basmati rice exporter Pakistan', 'Super Kernel Basmati wholesale', '1121 sella rice exporter', 'buy Pakistan rice bulk'],
  },
  surgical: {
    title: 'Surgical Instruments Export | CE & ISO Sialkot Tools — Dewan Traders',
    desc: 'Premium medical-grade AISI 410/420 stainless steel surgical instruments directly from Sialkot. CE and ISO compliant instruments for hospitals worldwide.',
    keywords: ['surgical instruments exporter Sialkot', 'medical tools wholesale Pakistan', 'Sialkot medical device exporter', 'surgical steel tools'],
  },
  sports: {
    title: 'Sports Goods Export | Footballs, Cricket Bats, Gear — Dewan Traders',
    desc: 'Supplying professional thermo-bonded match footballs, English willow cricket bats, and athletic equipment directly from Sialkot. FIFA standards compliant.',
    keywords: ['sports goods exporter Pakistan', 'Sialkot football manufacturer', 'wholesale cricket bats Pakistan', 'sports gear supplier'],
  },
};

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryMeta[category] || {
    title: 'Export Categories | Premium Pakistan Goods — Dewan Traders',
    desc: 'Explore our B2B export categories from Pakistan: fresh fruits, vegetables, aged Basmati rice, surgical tools, and sports goods.',
    keywords: ['Pakistan exporter', 'Dewan Traders export categories'],
  };

  return {
    title: meta.title,
    description: meta.desc,
    keywords: meta.keywords,
    alternates: { canonical: `${SITE_URL}/catalog/${category}` },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: `${SITE_URL}/catalog/${category}`,
      images: [{ url: `/images/${category}_hero.png`, width: 1200, height: 630, alt: meta.title }],
    },
  };
}

export default async function CategoryPagePage({ params }: Props) {
  const resolvedParams = await params;
  const categoryName = resolvedParams.category;
  const meta = categoryMeta[categoryName];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Catalog', item: `${SITE_URL}/catalog` },
      { '@type': 'ListItem', position: 3, name: meta?.title || categoryName, item: `${SITE_URL}/catalog/${categoryName}` },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <CategoryClient params={params} />
    </>
  );
}
