// ============================================================
// CCC Guru — Database Types (matches Supabase schema exactly)
// ============================================================

export interface TestCategory {
  id: string;
  title: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface TestSeries {
  id: string;
  category_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  description_md: string | null;
  featured_image?: string | null;
  is_featured: boolean;
  featured_tag: string | null;
  featured_short_desc: string | null;
  total_sets_available: number;
  total_enrolled: number;
  is_paid: boolean;
  price: number;
  currency: string;
  created_at: string;
  last_updated_at: string;
}

export interface TestSeriesItem {
  id: string;
  series_id: string;
  title: string;
  test_type: string;
  question_count: number;
  duration: number; // minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  total_marks: number;
  negative_marking_enabled: boolean;
  negative_marks: number;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

export interface Chapter {
  id: string;
  title: string;
  hindi_title: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Question {
  id: string;
  chapter_id: string | null;
  question_en: string;
  question_hi: string;
  option_a_en: string;
  option_a_hi: string;
  option_b_en: string;
  option_b_hi: string;
  option_c_en: string;
  option_c_hi: string;
  option_d_en: string;
  option_d_hi: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation_en: string | null;
  explanation_hi: string | null;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question_type: 'MCQ' | 'True/False';
  source: string | null;
  is_active: boolean;
  created_at: string;
  test_ids: string[];
}

export interface TestQuestion {
  id: string;
  test_series_item_id: string;
  question_id: string;
  question_order: number;
  created_at: string;
}

export interface NoteCategory {
  id: string;
  title: string;
  hindi_title: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Note {
  id: string;
  category_id: string | null;
  title: string;
  hindi_title: string;
  description: string | null;
  hindi_description: string | null;
  pdf_url: string;
  thumbnail_url: string | null;
  file_name: string;
  file_size: number;
  page_count: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export interface BlogCategory {
  id: string;
  title: string;
  hindi_title: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Blog {
  id: string;
  category_id: string | null;
  title_en: string;
  title_hi: string;
  slug: string;
  summary_en: string | null;
  summary_hi: string | null;
  content_en: string;
  content_hi: string;
  featured_image: string | null;
  author: string;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface BookCategory {
  id: string;
  title: string;
  hindi_title: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Book {
  id: string;
  category_id: string | null;
  title: string;
  hindi_title: string;
  author: string;
  description: string | null;
  hindi_description: string | null;
  cover_image: string | null;
  language: string;
  pages: number;
  edition: string | null;
  publisher: string | null;
  isbn: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export interface BookLink {
  id: string;
  book_id: string;
  platform: 'Amazon' | 'Flipkart' | 'BookBazaar' | 'Other';
  affiliate_url: string;
  price: number;
  currency: string;
  is_available: boolean;
  created_at: string;
}

export interface SeriesEnrollment {
  id: string;
  user_id: string;
  user_name: string | null;
  user_email: string | null;
  series_id: string;
  access_type: 'free' | 'paid' | 'promotional';
  status: 'active' | 'expired' | 'revoked';
  enrolled_at: string;
  expires_at: string | null;
}

// ============================================================
// Joined / Enriched Types
// ============================================================

export interface TestSeriesWithCategory extends TestSeries {
  test_categories: TestCategory | null;
}

export interface TestSeriesItemWithSeries extends TestSeriesItem {
  test_series: TestSeries | null;
}

export interface NoteWithCategory extends Note {
  note_categories: NoteCategory | null;
}

export interface BlogWithCategory extends Blog {
  blog_categories: BlogCategory | null;
}

export interface BookWithCategory extends Book {
  book_categories: BookCategory | null;
}

export interface BookWithLinks extends Book {
  book_links: BookLink[];
}

export interface TestQuestionWithDetails extends TestQuestion {
  questions: Question;
}

// Exam-session type (client-side only, never persisted)
export interface ExamAnswer {
  questionId: string;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  isFlagged: boolean;
  timeSpent: number; // seconds
}

export interface ExamResult {
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  score: number;
  totalMarks: number;
  accuracy: number;
  timeTaken: number; // seconds
  answers: ExamAnswer[];
}
