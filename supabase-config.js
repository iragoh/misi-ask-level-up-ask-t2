// Misi ASK: Level Up! — Supabase browser configuration
// 1) Replace the two placeholder values below with your Supabase Project URL
//    and Publishable Key from Supabase Dashboard > Settings > API Keys.
// 2) NEVER put a Supabase secret/service_role key in this file.
// 3) This file is intentionally safe to publish when using a publishable key + RLS.

const SUPABASE_URL = 'PASTE_YOUR_SUPABASE_PROJECT_URL_HERE';
const SUPABASE_PUBLISHABLE_KEY = 'PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE';

window.supabaseClient = null;

if (window.supabase &&
    SUPABASE_URL.startsWith('https://vdbvigbkuzryfppjrynf.supabase.co/rest/v1/') &&
    SUPABASE_PUBLISHABLE_KEY &&
    !SUPABASE_URL.includes('https://vdbvigbkuzryfppjrynf.supabase.co/rest/v1/') &&
    !SUPABASE_PUBLISHABLE_KEY.includes('sb_publishable_RRbbO4ggSrEMOYnl8RWTFw_ElCp3uI6')) {
  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    { auth: { persistSession: false } }
  );
}
