import { notFound, permanentRedirect } from 'next/navigation';
import { getTestSeriesItemByIdOrSlug, getTestSeriesById, getTestItemSlug } from '@/lib/data/tests';
import { getChapterByIdOrSlug, getChapterSlug } from '@/lib/data/chapters';

interface TestSlugRedirectProps {
  params: Promise<{ slug: string }>;
}

export default async function TestSlugRedirectPage({ params }: TestSlugRedirectProps) {
  const { slug } = await params;

  // 1. Check if it's a chapter alias
  const chapter = await getChapterByIdOrSlug(slug);
  if (chapter) {
    permanentRedirect(`/chapters/${getChapterSlug(chapter)}`);
  }

  // 2. Check if it's a test series item
  const item = await getTestSeriesItemByIdOrSlug(slug);
  if (item) {
    const series = await getTestSeriesById(item.series_id);
    if (series) {
      permanentRedirect(`/test-series/${series.slug}/${getTestItemSlug(item)}`);
    }
  }

  notFound();
}
