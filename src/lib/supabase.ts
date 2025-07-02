import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  if (!email || !password) {
    return {
      data: null,
      error: { message: 'Email and password are required' }
    };
  }

  if (password.length < 8) {
    return {
      data: null,
      error: { message: 'Password must be at least 8 characters long' }
    };
  }

  // First check if user exists
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    return {
      data: null,
      error: { message: 'User already exists' }
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        email_confirm: true
      }
    }
  });

  if (error) {
    console.error('Sign up error:', error);
    return { data: null, error };
  }

  if (!data.user) {
    return {
      data: null,
      error: { message: 'Failed to create user' }
    };
  }

  // Create profile for the new user
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([
      {
        id: data.user.id,
        email: data.user.email,
        name: null,
        avatar_url: null,
        reputation: 100,
        trust_score: 50,
        balance: 0
      }
    ]);

  if (profileError) {
    console.error('Profile creation error:', profileError);
    return { data: null, error: profileError };
  }

  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  if (!email || !password) {
    return {
      data: null,
      error: { message: 'Email and password are required' }
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error('Sign in error:', error);
    return { data: null, error };
  }

  if (!data.user?.email_confirmed_at) {
    return {
      data: null,
      error: { message: 'Please verify your email before signing in' }
    };
  }

  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email: string) => {
  if (!email) {
    return {
      data: null,
      error: { message: 'Email is required' }
    };
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`
  });
  return { data, error };
};

export const updatePassword = async (newPassword: string) => {
  if (!newPassword || newPassword.length < 8) {
    return {
      data: null,
      error: { message: 'Password must be at least 8 characters long' }
    };
  }

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });
  return { data, error };
};

export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Get user error:', error);
    return { user: null, error };
  }

  if (user && !user.email_confirmed_at) {
    return {
      user: null,
      error: { message: 'Email not verified' }
    };
  }

  return { user, error };
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Get session error:', error);
    return { session: null, error };
  }

  if (session?.user && !session.user.email_confirmed_at) {
    return {
      session: null,
      error: { message: 'Email not verified' }
    };
  }

  return { session, error };
}; 