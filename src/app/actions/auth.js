'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function checkLogin(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Supabase Auth Error:', error.message, error.status);
    return 'Email atau password salah.';
  }

  console.log('Login successful for:', data.user.email);
  redirect('/admin');
}

export async function doLogout() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.signOut();
  redirect('/login');
}
