import { getPublicClient } from '@/lib/supabase/public';
import type { Chapter } from '@/types/database';

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
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('getChapterById:', error.message);
    return null;
  }
  return data;
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
