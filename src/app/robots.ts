import type { MetadataRoute } from 'next';

const siteUrl = 'https://www.cccguru.in';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/test-series/*/exam', // Don't index live exam sessions
          '/search',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
