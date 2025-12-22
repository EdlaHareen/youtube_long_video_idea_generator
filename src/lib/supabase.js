import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key not configured. Some features may not work.');
}

// Clear any invalid/expired tokens on startup if Supabase is not properly configured
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
  try {
    // Clear Supabase auth storage if not configured
    const supabaseStorageKey = 'sb-' + (supabaseUrl || 'placeholder').split('//')[1]?.split('.')[0] + '-auth-token';
    Object.keys(localStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {
    // Ignore errors when clearing storage
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  }
);
