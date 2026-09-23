import { getPublicClient } from '@/lib/supabase/public';
import type { Chapter } from '@/types/database';
import { CHAPTER_SLUGS, toSlug } from '@/lib/utils';

export function getChapterSlug(chapter: Chapter): string {
  if (CHAPTER_SLUGS[chapter.sort_order]) {
    return CHAPTER_SLUGS[chapter.sort_order];
  }
  return `chapter-${chapter.sort_order}-${toSlug(chapter.title)}`;
}

export async function getChapters(): Promise<Chapter[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('getChapters:', error.message);
    return [];
  }
  return data ?? [];
}

export async function getChapterById(id: string): Promise<Chapter | null> {
  return getChapterByIdOrSlug(id);
}

export async function getChapterByIdOrSlug(idOrSlug: string): Promise<Chapter | null> {
  const supabase = getPublicClient();
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      idOrSlug
    );

  if (isUuid) {
    const { data } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', idOrSlug)
      .eq('is_active', true)
      .maybeSingle();

    if (data) return data;
  }

  // Look up across all chapters by slug or sort order
  const allChapters = await getChapters();
  const normalized = idOrSlug.toLowerCase().trim();

  const match = allChapters.find((c) => {
    const slug = getChapterSlug(c).toLowerCase();
    const titleSlug = toSlug(c.title).toLowerCase();
    const shortSlug = `chapter-${c.sort_order}`;
    return (
      slug === normalized ||
      titleSlug === normalized ||
      shortSlug === normalized ||
      c.id === idOrSlug
    );
  });

  return match ?? null;
}

export async function getAllChapterIds(): Promise<string[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('chapters')
    .select('id')
    .eq('is_active', true);

  if (error) {
    console.error('getAllChapterIds:', error.message);
    return [];
  }
  return (data ?? []).map((c: { id: string }) => c.id);
}

export async function getAllChapterSlugs(): Promise<string[]> {
  const chapters = await getChapters();
  return chapters.map((c) => getChapterSlug(c));
}
