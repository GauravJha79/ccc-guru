import { getPublicClient } from "@/lib/supabase/public";
import { toSlug } from "@/lib/utils";
import type {
  TestCategory,
  TestSeries,
  TestSeriesItem,
  TestSeriesWithCategory,
  TestQuestionWithDetails,
  Question,
} from "@/types/database";

export async function getTestCategories(): Promise<TestCategory[]> {
  const supabase = getPublicClient();
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
  const supabase = getPublicClient();
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
  const supabase = getPublicClient();
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

export async function getTestSeriesBySlug(
  slug: string,
): Promise<TestSeriesWithCategory | null> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("test_series")
    .select("*, test_categories(id, title)")
    .eq("slug", slug)
    .maybeSingle();

  if (data) return data as TestSeriesWithCategory;

  // Fallback: check by ID in case an ID was passed
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  if (isUuid) {
    const res = await supabase
      .from("test_series")
      .select("*, test_categories(id, title)")
      .eq("id", slug)
      .maybeSingle();
    if (res.data) return res.data as TestSeriesWithCategory;
  }

  if (error) {
    console.error("getTestSeriesBySlug:", error.message);
  }
  return null;
}

export async function getTestSeriesItems(
  seriesId: string,
): Promise<TestSeriesItem[]> {
  const supabase = getPublicClient();
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

export function getTestItemSlug(item: TestSeriesItem): string {
  return toSlug(item.title);
}

export async function getTestSeriesItemByIdOrSlug(
  idOrSlug: string,
  seriesId?: string,
): Promise<TestSeriesItem | null> {
  const supabase = getPublicClient();
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      idOrSlug
    );

  if (isUuid) {
    let query = supabase
      .from("test_series_items")
      .select("*")
      .eq("id", idOrSlug)
      .eq("is_published", true);

    if (seriesId) {
      query = query.eq("series_id", seriesId);
    }

    const { data } = await query.maybeSingle();
    if (data) return data as TestSeriesItem;
  }

  // Look up by slug across published items
  let query = supabase
    .from("test_series_items")
    .select("*")
    .eq("is_published", true);

  if (seriesId) {
    query = query.eq("series_id", seriesId);
  }

  const { data } = await query;
  if (!data) return null;

  const normalized = idOrSlug.toLowerCase().trim();
  const match = (data as TestSeriesItem[]).find((item) => {
    const slug = getTestItemSlug(item).toLowerCase();
    const cleanIdOrSlug = normalized.replace(/^ccc-/, "");
    return (
      slug === normalized ||
      slug === cleanIdOrSlug ||
      toSlug(item.title).toLowerCase() === normalized ||
      item.id === idOrSlug
    );
  });

  return match ?? null;
}

export async function getTestSeriesItemById(
  itemId: string,
  seriesId?: string,
): Promise<TestSeriesItem | null> {
  return getTestSeriesItemByIdOrSlug(itemId, seriesId);
}

export async function getTestQuestions(
  testSeriesItemId: string,
): Promise<Question[]> {
  const supabase = getPublicClient();

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
): Promise<(TestSeriesItem & { test_series?: { id: string; title: string; slug: string } | null })[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("test_series_items")
    .select("*, test_series(id, title, slug)")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getPopularTestItems:", error.message);
    return [];
  }
  return (data as any) ?? [];
}

export async function getAllTestSeriesIds(): Promise<string[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("test_series")
    .select("id");

  if (error) {
    console.error("getAllTestSeriesIds:", error.message);
    return [];
  }
  return (data ?? []).map((s: { id: string }) => s.id);
}

export async function getAllTestSeriesSlugs(): Promise<string[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("test_series")
    .select("slug");

  if (error) {
    console.error("getAllTestSeriesSlugs:", error.message);
    return [];
  }
  return (data ?? [])
    .map((s: { slug: string }) => s.slug)
    .filter(Boolean);
}

export const CHAPTER_TEST_SERIES_SLUG = "ccc-chapter-wise-test-series-2026";

export interface ChapterTestMeta {
  id: string;
  slug: string;
  title: string;
  questionCount: number;
  duration: number;
  seriesSlug: string;
  testUrl: string;
  examUrl: string;
}

export const CHAPTER_TEST_ITEMS_MAP: Record<
  number,
  { id: string; slug: string; title: string; questionCount: number; duration: number }
> = {
  1: {
    id: "4184483f-2189-454d-ac8b-5189bc0fe64f",
    slug: "introduction-to-computer-hardware",
    title: "Introduction to Computer & Hardware",
    questionCount: 100,
    duration: 90,
  },
  2: {
    id: "e8996ee7-6e63-40df-95c0-7fa66451e295",
    slug: "introduction-to-gui-based-operating-system",
    title: "Introduction to GUI Based Operating System",
    questionCount: 100,
    duration: 90,
  },
  3: {
    id: "249be4da-e627-4ddc-92cd-a90edbad5630",
    slug: "word-processing-libreoffice-writer",
    title: "Word Processing (LibreOffice Writer)",
    questionCount: 100,
    duration: 90,
  },
  4: {
    id: "70c61e7e-c4f8-4eef-af1d-824018d67a7b",
    slug: "libreoffice-calc-spreadsheet",
    title: "LibreOffice Calc (Spreadsheet)",
    questionCount: 100,
    duration: 90,
  },
  5: {
    id: "78c6e1be-3f37-4cdd-8759-4e146635b270",
    slug: "libreoffice-impress-presentation",
    title: "LibreOffice Impress (Presentation)",
    questionCount: 100,
    duration: 90,
  },
  6: {
    id: "aa40a9ce-5f74-463c-bfe7-0958a8a98943",
    slug: "internet-web-browsing",
    title: "Internet & Web Browsing",
    questionCount: 100,
    duration: 90,
  },
  7: {
    id: "7ec44db4-0e5d-4034-9e95-5654d8cf754b",
    slug: "e-mail-social-media-e-governance",
    title: "E-mail, Social Media & E-Governance",
    questionCount: 100,
    duration: 90,
  },
  8: {
    id: "b520ccc4-a988-43f7-8a77-eb98fbebc323",
    slug: "digital-financial-tools-banking",
    title: "Digital Financial Tools & Banking",
    questionCount: 100,
    duration: 90,
  },
  9: {
    id: "dbda7559-24c1-49f7-9c8a-f4cd93a68da1",
    slug: "cyber-security-future-skills",
    title: "Cyber Security & Future Skills",
    questionCount: 100,
    duration: 90,
  },
};

export function getChapterTestInfo(chapterSortOrder: number): ChapterTestMeta | null {
  const item = CHAPTER_TEST_ITEMS_MAP[chapterSortOrder];
  if (!item) return null;
  return {
    ...item,
    seriesSlug: CHAPTER_TEST_SERIES_SLUG,
    testUrl: `/test-series/${CHAPTER_TEST_SERIES_SLUG}/${item.slug}`,
    examUrl: `/test-series/${CHAPTER_TEST_SERIES_SLUG}/${item.slug}/exam`,
  };
}

