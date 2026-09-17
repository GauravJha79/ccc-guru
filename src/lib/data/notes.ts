import { getPublicClient } from '@/lib/supabase/public';
import type { NoteCategory, Note, NoteWithCategory } from '@/types/database';

export async function getNoteCategories(): Promise<NoteCategory[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('note_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('getNoteCategories:', error.message);
    return [];
  }
  return data ?? [];
}

export async function getNotes(options?: {
  categoryId?: string;
  featuredOnly?: boolean;
  limit?: number;
  search?: string;
}): Promise<NoteWithCategory[]> {
  const supabase = getPublicClient();
  let query = supabase
    .from('notes')
    .select('*, note_categories(id, title, hindi_title)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (options?.categoryId) {
    query = query.eq('category_id', options.categoryId);
  }
  if (options?.featuredOnly) {
    query = query.eq('is_featured', true);
  }
  if (options?.search) {
    query = query.ilike('title', `%${options.search}%`);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error('getNotes:', error.message);
    return [];
  }
  return (data as NoteWithCategory[]) ?? [];
}

export async function getNoteById(id: string): Promise<NoteWithCategory | null> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('notes')
    .select('*, note_categories(id, title, hindi_title)')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('getNoteById:', error.message);
    return null;
  }
  return data as NoteWithCategory;
}

export async function getAllNoteIds(): Promise<string[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('notes')
    .select('id')
    .eq('is_active', true);

  if (error) {
    console.error('getAllNoteIds:', error.message);
    return [];
  }
  return (data ?? []).map((n: { id: string }) => n.id);
}
