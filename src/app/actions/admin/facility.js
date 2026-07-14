'use server';

import { api } from '@/lib/api';
import { revalidatePath } from 'next/cache';
import { getAuthToken } from '@/lib/auth-utils';

async function getHeaders() {
  const token = await getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

/**
 * Buat atau Update Fasilitas via NestJS API
 */
export async function upsertFacilityAction(id, formData) {
  try {
    const headers = await getHeaders();
    const title       = formData.get('title')?.trim();
    const description = formData.get('description')?.trim() || '';
    const category    = formData.get('category')?.trim() || 'Umum';
    const sortOrder   = formData.get('sort_order') || '0';
    const isActive    = formData.get('is_active') === 'true'; // Convert to boolean
    const existingImg = formData.get('existing_image') || '';

    if (!title) return { error: 'Nama fasilitas wajib diisi.' };

    const body = new FormData();
    body.append('title', title);
    body.append('description', description);
    body.append('category', category);
    body.append('sortOrder', sortOrder);
    body.append('isActive', isActive ? 'true' : 'false');
    body.append('imageUrl', existingImg);

    const file = formData.get('image');
    if (file && file.size > 0) {
      body.append('image', file);
    }

    let result;
    if (id) {
      result = await api.patch(`/facilities/${id}`, body, { headers });
    } else {
      result = await api.post('/facilities', body, { headers });
    }

    if (!result.success) throw new Error(result.error || 'Terjadi kesalahan pada server');

    revalidatePath('/admin/fasilitas');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    console.error('Upsert facility error:', err);
    return { error: err.message };
  }
}

export async function deleteFacilityAction(id) {
  try {
    const headers = await getHeaders();
    const result = await api.delete(`/facilities/${id}`, { headers });
    if (!result.success) throw new Error(result.error);

    revalidatePath('/admin/fasilitas');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    console.error('Delete facility error:', err);
    return { error: err.message };
  }
}
