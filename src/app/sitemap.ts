import type { MetadataRoute } from "next";
import { getAllBlogSlugs } from "@/lib/data/blogs";
import { getAllBookIds } from "@/lib/data/books";
import { getAllChapterIds } from "@/lib/data/chapters";
import { getAllTestSeriesIds } from "@/lib/data/tests";
import { getAllNoteIds } from "@/lib/data/notes";

export const revalidate = 3600;

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cccguru.in";
const siteUrl = rawSiteUrl
  .replace(/cccprep\.in/gi, "cccguru.in")
  .replace(/\/+$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Safely fetch dynamic content with fallbacks so sitemap never fails
  const [blogSlugs, bookIds, chapterIds, testSeriesIds, noteIds] =
    await Promise.all([
      getAllBlogSlugs().catch(() => []),
      getAllBookIds().catch(() => []),
      getAllChapterIds().catch(() => []),
      getAllTestSeriesIds().catch(() => []),
      getAllNoteIds().catch(() => []),
    ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/tests`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/notes`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blogs`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/books`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/chapters`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/ccc-syllabus`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/download`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const testSeriesRoutes: MetadataRoute.Sitemap = (testSeriesIds || []).map(
    (id) => ({
      url: `${siteUrl}/test-series/${encodeURIComponent(id)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  const notesRoutes: MetadataRoute.Sitemap = (noteIds || []).map((id) => ({
    url: `${siteUrl}/notes/${encodeURIComponent(id)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = (blogSlugs || []).map((slug) => ({
    url: `${siteUrl}/blogs/${encodeURIComponent(slug)}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const bookRoutes: MetadataRoute.Sitemap = (bookIds || []).map((id) => ({
    url: `${siteUrl}/books/${encodeURIComponent(id)}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const chapterRoutes: MetadataRoute.Sitemap = (chapterIds || []).map((id) => ({
    url: `${siteUrl}/chapters/${encodeURIComponent(id)}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...testSeriesRoutes,
    ...notesRoutes,
    ...blogRoutes,
    ...bookRoutes,
    ...chapterRoutes,
  ];
}
