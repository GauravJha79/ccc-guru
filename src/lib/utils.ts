// Format file size in human-readable form
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// Format date for display
export function formatDate(dateString: string | null, locale = 'en-IN'): string {
  if (!dateString) return '';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
}

// Format price with currency
export function formatPrice(price: number, currency = 'INR'): string {
  if (price === 0) return 'Free';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price);
}

// Format timer seconds to MM:SS
export function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Get difficulty color class
export function getDifficultyColor(difficulty: 'Easy' | 'Medium' | 'Hard'): string {
  switch (difficulty) {
    case 'Easy':
      return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950';
    case 'Medium':
      return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950';
    case 'Hard':
      return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950';
  }
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + '…';
}

// Build absolute site URL with canonical host https://www.cccguru.in
export function siteUrl(path: string = ''): string {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.cccguru.in'
  )
    .replace(/^https?:\/\/cccguru\.in/i, 'https://www.cccguru.in')
    .replace(/cccprep\.in/gi, 'www.cccguru.in')
    .replace(/\/+$/, '');
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  return `${base}${cleanPath}`;
}

// Canonical chapter slugs mapped by chapter sort_order
export const CHAPTER_SLUGS: Record<number, string> = {
  1: 'chapter-1-introduction-to-computer',
  2: 'chapter-2-operating-systems',
  3: 'chapter-3-libreoffice-writer',
  4: 'chapter-4-libreoffice-calc',
  5: 'chapter-5-libreoffice-impress',
  6: 'chapter-6-internet-and-web',
  7: 'chapter-7-email-social-media-egovernance',
  8: 'chapter-8-digital-financial-tools',
  9: 'chapter-9-cyber-security-future-skills',
};

// Simple slug from title
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Calculate reading time for blog content
export function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

// Resolve Supabase Storage or external image URL safely
export function getImageUrl(path?: string | null, defaultBucket = 'images'): string | null {
  if (!path) return null;
  const trimmed = path.trim();
  if (!trimmed) return null;

  // Already a full URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zxzzxtiwlndsghmelnph.supabase.co';
  const cleanSupabaseUrl = supabaseUrl.replace(/\/+$/, '');

  // Full path from storage root
  if (trimmed.startsWith('/storage/v1/object/public/')) {
    return `${cleanSupabaseUrl}${trimmed}`;
  }
  if (trimmed.startsWith('storage/v1/object/public/')) {
    return `${cleanSupabaseUrl}/${trimmed}`;
  }

  // Relative path with or without bucket name
  const cleanPath = trimmed.replace(/^\/+/, '');
  if (cleanPath.startsWith(`${defaultBucket}/`)) {
    return `${cleanSupabaseUrl}/storage/v1/object/public/${cleanPath}`;
  }

  return `${cleanSupabaseUrl}/storage/v1/object/public/${defaultBucket}/${cleanPath}`;
}
