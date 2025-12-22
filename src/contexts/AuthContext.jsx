import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error);
        setUser(null);
      } else {
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      // When user signs in, ensure profile exists
      if (session?.user) {
        ensureProfile(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Simple function to ensure user profile exists in public.users
  const ensureProfile = async (user) => {
    if (!user || !user.id || !user.email) {
      console.error('Invalid user data:', user);
      return;
    }

    try {
      // Check if profile exists in public.users
      const { data: existing, error: checkError } = await supabase
        .from('users')
        .select('id, email, name')
        .eq('id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" which is fine
        console.error('Error checking profile:', checkError);
      }

      // If doesn't exist, create it
      if (!existing) {
        console.log('Creating profile for user:', user.email);
        
        const { data: inserted, error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            name: user.email?.split('@')[0] || 'User',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select();

        if (insertError) {
          console.error('Failed to create profile:', insertError);
          console.error('Error details:', {
            message: insertError.message,
            code: insertError.code,
            details: insertError.details,
            hint: insertError.hint
          });
        } else {
          console.log('✅ Profile created successfully in public.users:', inserted);
          
          // Verify it was actually created
          const { data: verify, error: verifyError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (verifyError) {
            console.error('❌ Verification failed - profile not found after insert:', verifyError);
          } else {
            console.log('✅ Profile verified in public.users:', verify);
          }
        }
      } else {
        console.log('✅ Profile already exists in public.users:', existing);
      }
    } catch (err) {
      console.error('Profile check/creation error:', err);
    }
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Ensure profile exists in public.users after sign in
    if (data.user) {
      console.log('Sign in successful, ensuring profile exists...');
      await ensureProfile(data.user);
    }

    return data;
  };

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Create profile in public.users after sign up
    if (data.user) {
      console.log('Sign up successful, creating profile in public.users...');
      await ensureProfile(data.user);
    } else {
      console.warn('Sign up succeeded but no user data returned');
    }

    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
