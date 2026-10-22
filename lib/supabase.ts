import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Brak kluczy Supabase w pliku .env.local!');
}

// Klient publiczny (działa w przeglądarce i na serwerze)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);