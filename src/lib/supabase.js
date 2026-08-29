import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ruwsodepugidsqsihtkx.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_7G39gWeQo1f3KhXzNBt3rA_roONlBHP';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
