import type { Metadata } from 'next';
import ProductClient from './ProductClient';
import JsonLd from '@/components/seo/JsonLd';
import { mockDb } from '@/services/mockDb';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const product = mockDb.getProductBySlug(slug) || mockDb.getProducts().products.find(p => p.id === slug);

  if (!product) {
    return {
      title: 'Export Product | Dewan Traders Pakistan',
      description: 'Explore premium quality export commodities from Pakistan: fruits, vegetables, rice, surgical and sports goods.',
    };
  }

  const title = `${product.name} Exporter Pakistan | B2B Wholesale — Dewan Traders`;
  const desc = `${product.description} Sourced directly from Pakistan. SKU: ${product.sku}. Grade-A export quality, custom packing, competitive FOB/CIF shipping rates.`;

  return {
    title,
    description: desc,
    keywords: [
      `${product.name} export`,
      `wholesale ${product.name}`,
      `Pakistan ${product.name} supplier`,
      `${product.name} bulk price`,
      product.sku,
      `${category} export Pakistan`,
    ],
    alternates: { canonical: `${SITE_URL}/catalog/${category}/${slug}` },
    openGraph: {
      title,
      description: desc,
      url: `${SITE_URL}/catalog/${category}/${slug}`,
      images: [
        {
          url: product.imageUrl || '/og-image.png',
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { category, slug } = await params;
  const product = mockDb.getProductBySlug(slug) || mockDb.getProducts().products.find(p => p.id === slug);

  const productSchema = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: `${SITE_URL}${product.imageUrl}`,
        description: product.description,
        sku: product.sku,
        mpn: product.sku,
        brand: {
          '@type': 'Brand',
          name: 'Dewan Traders',
        },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'PKR',
          lowPrice: String(product.price),
          highPrice: String(product.price * 1.25),
          offerCount: '1',
          itemCondition: 'https://schema.org/NewCondition',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'Dewan Traders',
          },
        },
      }
    : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Catalog', item: `${SITE_URL}/catalog` },
      { '@type': 'ListItem', position: 3, name: category.charAt(0).toUpperCase() + category.slice(1), item: `${SITE_URL}/catalog/${category}` },
      { '@type': 'ListItem', position: 4, name: product?.name || slug, item: `${SITE_URL}/catalog/${category}/${slug}` },
    ],
  };

  return (
    <>
      {productSchema && <JsonLd data={productSchema} />}
      <JsonLd data={breadcrumbSchema} />
      <ProductClient params={params} />
    </>
  );
}
