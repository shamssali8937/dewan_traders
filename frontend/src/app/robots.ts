import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dewantrade.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/user/',
          '/auth/',
          '/orders/', // Customer transaction details
          '/api/',    // Raw API access
          '/*?*',     // Avoid crawling parameters/searches to prevent duplicate content
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
