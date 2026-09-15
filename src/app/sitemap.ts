import type { MetadataRoute } from 'next';
import { getAllBlogSlugs } from '@/lib/data/blogs';
import { getAllBookIds } from '@/lib/data/books';
import { getAllChapterIds } from '@/lib/data/chapters';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cccprep.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogSlugs, bookIds, chapterIds] = await Promise.all([
    getAllBlogSlugs(),
    getAllBookIds(),
    getAllChapterIds(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteUrl}/tests`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/notes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/blogs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/books`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/chapters`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/ccc-syllabus`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${siteUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${siteUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${siteUrl}/blogs/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const bookRoutes: MetadataRoute.Sitemap = bookIds.map((id) => ({
    url: `${siteUrl}/books/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const chapterRoutes: MetadataRoute.Sitemap = chapterIds.map((id) => ({
    url: `${siteUrl}/chapters/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes, ...bookRoutes, ...chapterRoutes];
}
