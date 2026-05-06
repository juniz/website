'use server';

import { api } from '@/lib/api';
import { revalidatePath } from 'next/cache';
import { getAuthToken } from '@/lib/auth-utils';

async function getHeaders() {
  const token = await getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

/**
 * Buat partner baru via NestJS API
 */
export async function createPartner(formData) {
  try {
    const headers = await getHeaders();
    const name       = formData.get('name')?.trim();
    const websiteUrl = formData.get('website_url')?.trim() || '';
    const sortOrder  = formData.get('sort_order') || '0';
    const isActive   = formData.get('is_active') === 'true';

    if (!name) return { error: 'Nama partner wajib diisi.' };

    const body = new FormData();
    body.append('name', name);
    body.append('link', websiteUrl); // Backend Partner entity uses 'link'
    body.append('sortOrder', sortOrder);
    body.append('isActive', isActive ? 'true' : 'false');

    const file = formData.get('logo');
    if (file && file.size > 0) {
      body.append('image', file);
    }

    const result = await api.post('/partners', body, { headers });
    if (!result.success) throw new Error(result.error || 'Gagal menambahkan partner');

    revalidatePath('/admin/partner');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    console.error('Create partner error:', err);
    return { error: err.message };
  }
}

/**
 * Update partner via NestJS API
 */
export async function updatePartner(id, formData) {
  try {
    const headers = await getHeaders();
    const name       = formData.get('name')?.trim();
    const websiteUrl = formData.get('website_url')?.trim() || '';
    const sortOrder  = formData.get('sort_order') || '0';
    const isActive   = formData.get('is_active') === 'true';

    if (!name) return { error: 'Nama partner wajib diisi.' };

    const body = new FormData();
    body.append('name', name);
    body.append('link', websiteUrl);
    body.append('sortOrder', sortOrder);
    body.append('isActive', isActive ? 'true' : 'false');

    const file = formData.get('logo');
    if (file && file.size > 0) {
      body.append('image', file);
    }

    const result = await api.patch(`/partners/${id}`, body, { headers });
    if (!result.success) throw new Error(result.error || 'Gagal memperbarui partner');

    revalidatePath('/admin/partner');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    console.error('Update partner error:', err);
    return { error: err.message };
  }
}

/**
 * Hapus partner via NestJS API
 */
export async function deletePartner(id) {
  try {
    const headers = await getHeaders();
    const result = await api.delete(`/partners/${id}`, { headers });
    if (!result.success) throw new Error(result.error);

    revalidatePath('/admin/partner');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    console.error('Delete partner error:', err);
    return { error: err.message };
  }
}
