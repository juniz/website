'use server';

import { api } from '@/lib/api';
import { setAuthToken, removeAuthToken } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';

export async function checkLogin(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const captchaToken = formData.get('captcha_token');

  if (!captchaToken) {
    return 'Selesaikan verifikasi Captcha terlebih dahulu.';
  }

  const result = await api.post('/auth/login', {
    email,
    password,
    captcha_token: captchaToken
  });

  if (!result.success) {
    return 'Email atau password salah.';
  }

  // Karena backend NestJS kita memiliki TransformInterceptor yang membungkus response di dalam { data: ... }
  // maka struktur datanya adalah result.data.data.access_token
  const token = result.data.data?.access_token || result.data.access_token;

  await setAuthToken(token);

  redirect('/admin');
}

export async function doLogout() {
  await removeAuthToken();
  redirect('/login');
}
