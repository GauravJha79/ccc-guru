import { getPublicClient } from '@/lib/supabase/public';
import type { BlogCategory, Blog, BlogWithCategory } from '@/types/database';

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('getBlogCategories:', error.message);
    return [];
  }
  return data ?? [];
}

export async function getBlogs(options?: {
  categoryId?: string;
  featuredOnly?: boolean;
  limit?: number;
  search?: string;
  excludeSlug?: string;
}): Promise<BlogWithCategory[]> {
  const supabase = getPublicClient();
  let query = supabase
    .from('blogs')
    .select('*, blog_categories(id, title, hindi_title)')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (options?.categoryId) {
    query = query.eq('category_id', options.categoryId);
  }
  if (options?.featuredOnly) {
    query = query.eq('is_featured', true);
  }
  if (options?.search) {
    query = query.ilike('title_en', `%${options.search}%`);
  }
  if (options?.excludeSlug) {
    query = query.neq('slug', options.excludeSlug);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error('getBlogs:', error.message);
    return [];
  }
  return (data as BlogWithCategory[]) ?? [];
}

export async function getBlogBySlug(slug: string): Promise<BlogWithCategory | null> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('blogs')
    .select('*, blog_categories(id, title, hindi_title)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error('getBlogBySlug:', error.message);
    return null;
  }
  return data as BlogWithCategory;
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('blogs')
    .select('slug')
    .eq('is_published', true);

  if (error) {
    console.error('getAllBlogSlugs:', error.message);
    return [];
  }
  return (data ?? []).map((b: { slug: string }) => b.slug);
}
