import { createClient } from "@/lib/supabase/server";
import type {
  TestCategory,
  TestSeries,
  TestSeriesItem,
  TestSeriesWithCategory,
  TestQuestionWithDetails,
  Question,
} from "@/types/database";

export async function getTestCategories(): Promise<TestCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("test_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getTestCategories:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getTestSeries(options?: {
  categoryId?: string;
  featuredOnly?: boolean;
  limit?: number;
}): Promise<TestSeriesWithCategory[]> {
  const supabase = await createClient();
  let query = supabase
    .from("test_series")
    .select("*, test_categories(id, title)")
    .order("created_at", { ascending: false });

  if (options?.categoryId) {
    query = query.eq("category_id", options.categoryId);
  }
  if (options?.featuredOnly) {
    query = query.eq("is_featured", true);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error("getTestSeries:", error.message);
    return [];
  }
  return (data as TestSeriesWithCategory[]) ?? [];
}

export async function getTestSeriesById(
  id: string,
): Promise<TestSeriesWithCategory | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("test_series")
    .select("*, test_categories(id, title)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getTestSeriesById:", error.message);
    return null;
  }
  return data as TestSeriesWithCategory;
}

export async function getTestSeriesItems(
  seriesId: string,
): Promise<TestSeriesItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("test_series_items")
    .select("*")
    .eq("series_id", seriesId)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getTestSeriesItems:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getTestSeriesItemById(
  itemId: string,
): Promise<TestSeriesItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("test_series_items")
    .select("*")
    .eq("id", itemId)
    .eq("is_published", true)
    .single();

  if (error) {
    console.error("getTestSeriesItemById:", error.message);
    return null;
  }
  return data;
}

export async function getTestQuestions(
  testSeriesItemId: string,
): Promise<Question[]> {
  const supabase = await createClient();

  // 1. Query questions table directly matching test_ids array
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .contains("test_ids", [testSeriesItemId])
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (!error && data && data.length > 0) {
    return data as Question[];
  }

  // 2. Fallback: check test_questions junction table
  const { data: tqData, error: tqError } = await supabase
    .from("test_questions")
    .select("*, questions(*)")
    .eq("test_series_item_id", testSeriesItemId)
    .order("question_order", { ascending: true });

  if (!tqError && tqData && tqData.length > 0) {
    return tqData
      .map((tq: any) => tq.questions)
      .filter((q: any) => q && q.is_active) as Question[];
  }

  if (error) {
    console.error("getTestQuestions:", error.message);
  }
  return [];
}

export async function getPopularTestItems(
  limit = 8,
): Promise<TestSeriesItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("test_series_items")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getPopularTestItems:", error.message);
    return [];
  }
  return data ?? [];
}
