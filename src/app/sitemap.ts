import type { MetadataRoute } from "next";
import { getBlogs } from "@/lib/data/blogs";
import { getChapters, getChapterSlug } from "@/lib/data/chapters";
import { getTestSeries, getTestSeriesItems, getTestItemSlug } from "@/lib/data/tests";
import { siteUrl } from "@/lib/utils";

export const revalidate = 3600;

const BASE_URL = "https://www.cccguru.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Safely fetch published data
  const [blogs, chapters, testSeries] = await Promise.all([
    getBlogs().catch(() => []),
    getChapters().catch(() => []),
    getTestSeries().catch(() => []),
  ]);

  // Static pillar pages that contain real, indexable content
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tests`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ccc-syllabus`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/chapters`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blogs`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/contact`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/terms`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // Published test series routes
  const testSeriesRoutes: MetadataRoute.Sitemap = (testSeries || []).map(
    (series) => ({
      url: `${BASE_URL}/test-series/${encodeURIComponent(series.slug)}`,
      lastModified: series.last_updated_at
        ? new Date(series.last_updated_at)
        : series.created_at
          ? new Date(series.created_at)
          : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  // Published test set instruction/landing routes
  const testItemRoutesArrays = await Promise.all(
    (testSeries || []).map(async (series) => {
      const items = await getTestSeriesItems(series.id).catch(() => []);
      return items.map((item) => ({
        url: `${BASE_URL}/test-series/${encodeURIComponent(series.slug)}/${encodeURIComponent(getTestItemSlug(item))}`,
        lastModified: item.created_at ? new Date(item.created_at) : undefined,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    })
  );
  const testItemRoutes = testItemRoutesArrays.flat();

  // Published chapter routes with semantic slugs
  const chapterRoutes: MetadataRoute.Sitemap = (chapters || []).map(
    (chapter) => ({
      url: `${BASE_URL}/chapters/${encodeURIComponent(getChapterSlug(chapter))}`,
      lastModified: chapter.created_at ? new Date(chapter.created_at) : undefined,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  // Published blog articles
  const blogRoutes: MetadataRoute.Sitemap = (blogs || []).map((blog) => ({
    url: `${BASE_URL}/blogs/${encodeURIComponent(blog.slug)}`,
    lastModified: blog.published_at
      ? new Date(blog.published_at)
      : blog.created_at
        ? new Date(blog.created_at)
        : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...testSeriesRoutes,
    ...testItemRoutes,
    ...chapterRoutes,
    ...blogRoutes,
  ];
}
