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

// Build absolute site URL
export function siteUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cccguru.in').replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

// Simple slug from title (for display only, not used for DB slugs)
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Calculate reading time for blog content
export function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}
