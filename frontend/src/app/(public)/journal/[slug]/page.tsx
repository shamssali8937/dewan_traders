import type { Metadata } from 'next';
import JournalDetailClient from './JournalDetailClient';
import JsonLd from '@/components/seo/JsonLd';
import { mockDb } from '@/services/mockDb';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = mockDb.getJournalPosts().posts.find(p => p.slug === slug);

  if (!post) {
    return {
      title: 'Article Not Found | Dewan Traders Journal',
      description: 'The requested trade journal article was not found.',
    };
  }

  const title = `${post.title} | Dewan Traders Pakistan`;
  const desc = post.excerpt || `${post.title}. Read export insights, agriculture trends, and Sialkot quality standards from Dewan Traders.`;

  return {
    title,
    description: desc,
    keywords: post.tags ? [...post.tags, 'Pakistan export blog', 'Dewan Traders news'] : ['Pakistan export', 'trade news'],
    alternates: { canonical: `${SITE_URL}/journal/${slug}` },
    openGraph: {
      title,
      description: desc,
      type: 'article',
      url: `${SITE_URL}/journal/${slug}`,
      publishedTime: post.publishedAt,
      authors: [post.author || 'Dewan Traders'],
      images: [{ url: post.imageUrl || '/og-image.png', width: 1200, height: 630, alt: post.title }],
    },
  };
}

export default async function JournalDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = mockDb.getJournalPosts().posts.find(p => p.slug === slug);

  const articleSchema = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: post.title,
        description: post.excerpt || post.title,
        image: [`${SITE_URL}${post.imageUrl}`],
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        author: {
          '@type': 'Organization',
          name: post.author || 'Dewan Traders',
          url: SITE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Dewan Traders',
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/images/logo.png`,
          },
        },
      }
    : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE_URL}/journal` },
      { '@type': 'ListItem', position: 3, name: post?.title || slug, item: `${SITE_URL}/journal/${slug}` },
    ],
  };

  return (
    <>
      {articleSchema && <JsonLd data={articleSchema} />}
      <JsonLd data={breadcrumbSchema} />
      <JournalDetailClient params={params} />
    </>
  );
}
