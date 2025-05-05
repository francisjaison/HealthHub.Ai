
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or anonymous key is missing. Supabase functionality will not work correctly.');
}

// Create a Supabase client with the environment variables
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helpers
export const auth = {
  signUp: async (email: string, password: string) => {
    return supabase.auth.signUp({
      email,
      password,
    });
  },
  
  signIn: async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  },
  
  signOut: async () => {
    return supabase.auth.signOut();
  },
  
  getSession: async () => {
    return supabase.auth.getSession();
  },
  
  getUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }
};

// Database helpers
export const db = {
  // Add your database methods here
};
