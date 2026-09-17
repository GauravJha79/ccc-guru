import { getPublicClient } from "@/lib/supabase/public";
import type {
  BookCategory,
  Book,
  BookLink,
  BookWithCategory,
  BookWithLinks,
} from "@/types/database";

export async function getBookCategories(): Promise<BookCategory[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("book_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getBookCategories:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getBooks(options?: {
  categoryId?: string;
  featuredOnly?: boolean;
  limit?: number;
  search?: string;
}): Promise<BookWithCategory[]> {
  const supabase = getPublicClient();
  let query = supabase
    .from("books")
    .select("*, book_categories(id, title, hindi_title)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (options?.categoryId) {
    query = query.eq("category_id", options.categoryId);
  }
  if (options?.featuredOnly) {
    query = query.eq("is_featured", true);
  }
  if (options?.search) {
    query = query.ilike("title", `%${options.search}%`);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error("getBooks:", error.message);
    return [];
  }
  return (data as BookWithCategory[]) ?? [];
}

export async function getBookById(id: string): Promise<BookWithLinks | null> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("books")
    .select("*, book_links(*)")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("getBookById:", error.message);
    return null;
  }

  const book = data as BookWithLinks;
  // Only expose available links
  book.book_links = (book.book_links ?? []).filter(
    (l: BookLink) => l.is_available,
  );
  return book;
}

export async function getAllBookIds(): Promise<string[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("books")
    .select("id")
    .eq("is_active", true);

  if (error) {
    console.error("getAllBookIds:", error.message);
    return [];
  }
  return (data ?? []).map((b: { id: string }) => b.id);
}
