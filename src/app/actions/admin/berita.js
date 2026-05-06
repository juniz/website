'use server';

import { revalidatePath } from 'next/cache';
import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth-utils';

async function getHeaders() {
  const token = await getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function createBerita(formData) {
  try {
    const headers = await getHeaders();
    
    // Map form fields to backend names (read_time -> readTime)
    const body = new FormData();
    body.append('title', formData.get('title'));
    body.append('slug', formData.get('slug'));
    body.append('excerpt', formData.get('excerpt') || '');
    body.append('content', formData.get('content'));
    body.append('category', formData.get('category'));
    body.append('author', formData.get('author') || 'Tim RS Bhayangkara');
    body.append('readTime', formData.get('read_time') || '3 menit baca');
    body.append('date', formData.get('date'));
    
    const image = formData.get('image');
    if (image && typeof image !== 'string' && image.size > 0) {
      body.append('image', image);
    }

    const result = await api.post('/news', body, { headers });

    if (!result.success) return { error: result.error };
    
    revalidatePath('/admin/berita');
    revalidatePath('/news');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function updateBerita(id, formData) {
  try {
    const headers = await getHeaders();
    
    const body = new FormData();
    body.append('title', formData.get('title'));
    body.append('slug', formData.get('slug'));
    body.append('excerpt', formData.get('excerpt') || '');
    body.append('content', formData.get('content'));
    body.append('category', formData.get('category'));
    body.append('author', formData.get('author') || 'Tim RS Bhayangkara');
    body.append('readTime', formData.get('read_time') || '3 menit baca');
    body.append('date', formData.get('date'));
    
    const image = formData.get('image');
    if (image && typeof image !== 'string' && image.size > 0) {
      body.append('image', image);
    }

    const result = await api.patch(`/news/${id}`, body, { headers });

    if (!result.success) return { error: result.error };

    revalidatePath('/admin/berita');
    revalidatePath('/news');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function deleteBerita(id) {
  try {
    const headers = await getHeaders();
    const result = await api.delete(`/news/${id}`, { headers });

    if (!result.success) return { error: result.error };

    revalidatePath('/admin/berita');
    revalidatePath('/news');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}
