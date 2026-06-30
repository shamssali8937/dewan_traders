import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dewantraders.com';
  const now = new Date();

  const staticRoutes = [
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
  ];

  return staticRoutes.map(route => ({
    ...route,
    lastModified: now,
  }));
}
