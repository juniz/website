'use server';

import { revalidatePath } from 'next/cache';
import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth-utils';

async function getHeaders() {
  const token = await getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function syncSimrs() {
  try {
    const headers = await getHeaders();
    // Using empty object for body since NestJS expects something even if empty, 
    // though null might work depending on how api.post handles it
    const result = await api.post('/simrs/sync', {}, { headers });

    if (!result.success) return { error: result.error };

    revalidatePath('/admin/dokter');
    revalidatePath('/admin/jadwal');
    revalidatePath('/');
    
    // NestJS TransformInterceptor might wrap data in { data: ... }
    const count = result.data.data?.count ?? result.data.count ?? 0;
    
    return { success: true, count };
  } catch (err) {
    return { error: err.message };
  }
}
