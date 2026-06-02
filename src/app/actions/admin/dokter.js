'use server';

import { revalidatePath } from 'next/cache';
import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth-utils';

async function getHeaders() {
  const token = await getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function createDokter(formData) {
  try {
    const headers = await getHeaders();
    
    // Pastikan kita hanya mengirim field yang diperbolehkan oleh DTO NestJS
    const body = new FormData();
    body.append('name', formData.get('name'));
    body.append('specialization', formData.get('specialization'));
    body.append('isAvailable', formData.get('isAvailable'));
    
    const image = formData.get('image');
    if (image) {
      if (typeof image !== 'string' && image.size > 0) {
        body.append('image', image);
      } else if (typeof image === 'string' && image.startsWith('/uploads/')) {
        body.append('image', image);
      }
    }

    const result = await api.post('/doctors', body, { headers });

    if (!result.success) return { error: result.error };
    
    revalidatePath('/admin/dokter');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function updateDokter(id, formData) {
  try {
    const headers = await getHeaders();
    
    // Pick only allowed fields for NestJS DTO
    const body = new FormData();
    body.append('name', formData.get('name'));
    body.append('specialization', formData.get('specialization'));
    body.append('isAvailable', formData.get('isAvailable'));
    
    const image = formData.get('image');
    if (image) {
      if (typeof image !== 'string' && image.size > 0) {
        body.append('image', image);
      } else if (typeof image === 'string' && image.startsWith('/uploads/')) {
        body.append('image', image);
      }
    }

    const result = await api.patch(`/doctors/${id}`, body, { headers });

    if (!result.success) return { error: result.error };

    revalidatePath('/admin/dokter');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function deleteDokter(id) {
  try {
    const headers = await getHeaders();
    const result = await api.delete(`/doctors/${id}`, { headers });

    if (!result.success) return { error: result.error };

    revalidatePath('/admin/dokter');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function bulkDeleteDokter(ids) {
  try {
    const headers = await getHeaders();
    const result = await api.post('/doctors/bulk-delete', { ids }, { headers });

    if (!result.success) return { error: result.error };

    revalidatePath('/admin/dokter');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function getSimrsPhoto(name) {
  try {
    const headers = await getHeaders();
    const result = await api.get(`/simrs/pegawai-photo?name=${encodeURIComponent(name)}`, { headers });
    if (!result.success) return { error: result.error };
    // NestJS response is wrapped in { data: { ... } } by TransformInterceptor
    return result.data?.data || result.data;
  } catch (err) {
    return { error: err.message };
  }
}
