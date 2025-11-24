import { supabase } from './supabase';

export interface SignUpData {
  email?: string;
  phone?: string;
  password: string;
  fullName: string;
  institutionType: 'school' | 'college' | 'university';
  institutionName: string;
  course: string;
  year: number;
  subjects?: string[];
  interests?: string[];
}

export interface SignInData {
  email?: string;
  phone?: string;
  password: string;
}

/**
 * Sign up with email
 */
export async function signUpWithEmail(data: SignUpData) {
  if (!data.email) {
    throw new Error('Email is required');
  }

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
      },
    },
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Failed to create user');

  // Create user profile
  const { error: profileError } = await supabase.from('users').insert({
    auth_id: authData.user.id,
    email: data.email,
    full_name: data.fullName,
    institution_type: data.institutionType,
    institution_name: data.institutionName,
    course: data.course,
    year: data.year,
    subjects: data.subjects || [],
    interests: data.interests || [],
  });

  if (profileError) throw profileError;

  return authData;
}

/**
 * Sign up with phone number
 */
export async function signUpWithPhone(data: SignUpData) {
  if (!data.phone) {
    throw new Error('Phone number is required');
  }

  // Create auth user with phone
  const { data: authData, error: authError } = await supabase.auth.signUp({
    phone: data.phone,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
      },
    },
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Failed to create user');

  // Create user profile
  const { error: profileError } = await supabase.from('users').insert({
    auth_id: authData.user.id,
    phone: data.phone,
    full_name: data.fullName,
    institution_type: data.institutionType,
    institution_name: data.institutionName,
    course: data.course,
    year: data.year,
    subjects: data.subjects || [],
    interests: data.interests || [],
  });

  if (profileError) throw profileError;

  return authData;
}

/**
 * Sign in with email
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign in with phone
 */
export async function signInWithPhone(phone: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    phone,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign in with OTP (phone)
 */
export async function signInWithOTP(phone: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
  });

  if (error) throw error;
  return data;
}

/**
 * Verify OTP
 */
export async function verifyOTP(phone: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });

  if (error) throw error;
  return data;
}

/**
 * Sign out
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

/**
 * Get current user profile
 */
export async function getCurrentUserProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', user.id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: Partial<any>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Reset password
 */
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) throw error;
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
}
