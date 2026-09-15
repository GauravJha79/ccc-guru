import { createClient } from '@/lib/supabase/server';
import { createBuildClient } from '@/lib/supabase/build';
import type { Chapter } from '@/types/database';

export async function getChapters(): Promise<Chapter[]> {
  const supabase = await createClient();
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
  const supabase = await createClient();
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
  // Use build client (no cookies) — safe for generateStaticParams
  const supabase = createBuildClient();
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
