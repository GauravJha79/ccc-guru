import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Build-time Supabase client — does NOT use cookies.
 * Use ONLY in generateStaticParams() and other build-time contexts.
 * For runtime Server Components, use createClient from ./server.ts instead.
 */
export function createBuildClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
