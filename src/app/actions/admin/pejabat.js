'use server';

import { revalidatePath } from 'next/cache';
import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth-utils';

async function getHeaders() {
  const token = await getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createPejabat(formData) {
  try {
    const headers = await getHeaders();
    const body = new FormData();
    body.append('name', formData.get('name') || '');
    body.append('slug', formData.get('slug') || '');
    body.append('jabatan', formData.get('jabatan') || '');
    body.append('pangkat', formData.get('pangkat') || '');
    body.append('bio', formData.get('bio') || '');
    body.append('sortOrder', formData.get('sortOrder') || '0');
    body.append('isActive', formData.get('isActive') || 'true');
    body.append('timeline', formData.get('timeline') || '[]');

    const photo = formData.get('photo');
    if (photo && typeof photo !== 'string' && photo.size > 0) {
      body.append('photo', photo);
    }

    const result = await api.post('/pejabat', body, { headers });
    if (!result.success) return { error: result.error };

    revalidatePath('/admin/pejabat');
    revalidatePath('/pejabat');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function updatePejabat(id, formData) {
  try {
    const headers = await getHeaders();
    const body = new FormData();
    body.append('name', formData.get('name') || '');
    body.append('slug', formData.get('slug') || '');
    body.append('jabatan', formData.get('jabatan') || '');
    body.append('pangkat', formData.get('pangkat') || '');
    body.append('bio', formData.get('bio') || '');
    body.append('sortOrder', formData.get('sortOrder') || '0');
    body.append('isActive', formData.get('isActive') || 'true');
    body.append('timeline', formData.get('timeline') || '[]');

    const photo = formData.get('photo');
    if (photo && typeof photo !== 'string' && photo.size > 0) {
      body.append('photo', photo);
    }

    const result = await api.patch(`/pejabat/${id}`, body, { headers });
    if (!result.success) return { error: result.error };

    revalidatePath('/admin/pejabat');
    revalidatePath('/pejabat');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function deletePejabat(id) {
  try {
    const headers = await getHeaders();
    const result = await api.delete(`/pejabat/${id}`, { headers });
    if (!result.success) return { error: result.error };

    revalidatePath('/admin/pejabat');
    revalidatePath('/pejabat');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function bulkDeletePejabat(ids) {
  try {
    const headers = await getHeaders();
    const result = await api.post('/pejabat/bulk-delete', { ids }, { headers });
    if (!result.success) return { error: result.error };

    revalidatePath('/admin/pejabat');
    revalidatePath('/pejabat');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}
