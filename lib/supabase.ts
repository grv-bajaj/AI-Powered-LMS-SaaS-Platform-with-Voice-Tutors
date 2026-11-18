import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export const createSupabaseClient = (authenticated = true) => {
  const options = authenticated
    ? {
        async accessToken() {
          return (await auth()).getToken();
        },
      }
    : undefined;

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    options,
  );
}