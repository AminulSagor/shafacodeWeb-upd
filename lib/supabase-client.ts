import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Temporary: the browser upload client goes away when uploads move to
// server-issued signed URLs. Created lazily so pages render without env vars.
let client: SupabaseClient | null = null;

export const supabase = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    if (!client) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !key) throw new Error('Supabase is not configured');
      client = createClient(url, key);
    }
    return Reflect.get(client, prop, client);
  },
});
