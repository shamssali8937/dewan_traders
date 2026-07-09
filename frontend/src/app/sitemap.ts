import { MetadataRoute } from 'next';
import { mockDb } from '@/services/mockDb';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';
  const now = new Date();

  // 1. Static Routes
  const routes = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/about`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/services`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/catalog`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/catalog/fruits`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/catalog/vegetables`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/catalog/rice`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/catalog/surgical`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/catalog/sports`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/industries`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/export-process`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/certifications`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/countries`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/journal`, priority: 0.7, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/partner`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/contact`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/quote`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/faqs`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/gallery`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/track`, priority: 0.4, changeFrequency: 'monthly' as const },
  ];

  // 2. Dynamic Product Detail Pages
  try {
    const productsResult = mockDb.getProducts();
    const productRoutes = productsResult.products.map((product) => ({
      url: `${baseUrl}/catalog/${product.category?.slug || 'fruits'}/${product.slug}`,
      priority: 0.9,
      changeFrequency: 'weekly' as const,
      lastModified: now,
    }));
    routes.push(...productRoutes);
  } catch (err) {
    console.error('Sitemap product load failed:', err);
  }

  // 3. Dynamic Journal/Blog Pages
  try {
    const postsResult = mockDb.getJournalPosts();
    const postRoutes = postsResult.posts.map((post) => ({
      url: `${baseUrl}/journal/${post.slug}`,
      priority: 0.6,
      changeFrequency: 'weekly' as const,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
    }));
    routes.push(...postRoutes);
  } catch (err) {
    console.error('Sitemap journal load failed:', err);
  }

  return routes.map((route) => ({
    lastModified: now,
    ...route,
  }));
}
