import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Public Supabase client for reading public data (mock tests, blogs, notes, books, chapters).
 * Does NOT read cookies, enabling Next.js static generation (SSG) & Incremental Static Regeneration (ISR).
 */
let publicClient: ReturnType<typeof createSupabaseClient> | null = null;

export function getPublicClient() {
  if (!publicClient) {
    publicClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
  }
  return publicClient;
}
