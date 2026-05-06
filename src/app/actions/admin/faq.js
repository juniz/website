'use server';

import { revalidatePath } from 'next/cache';
import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth-utils';

async function getHeaders() {
  const token = await getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

/**
 * Dapatkan semua kategori FAQ yang sudah ada (untuk dropdown)
 */
export async function getFAQCategories() {
  const res = await api.get('/faqs');
  if (!res.success) return [];
  
  const items = res.data.data || res.data;
  const unique = [...new Set(items.map((d) => d.category).filter(Boolean))];
  return unique;
}

/**
 * Buat FAQ baru
 */
export async function createFAQ(formData) {
  try {
    const headers = await getHeaders();
    const result = await api.post('/faqs', {
      question: formData.get('question')?.trim(),
      answer: formData.get('answer')?.trim(),
      category: formData.get('category')?.trim() || 'Umum',
      sortOrder: parseInt(formData.get('sort_order') || '0', 10),
      isActive: formData.get('is_active') !== 'false',
    }, { headers });

    if (!result.success) return { error: result.error };

    revalidatePath('/admin/faq');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Update FAQ yang sudah ada
 */
export async function updateFAQ(id, formData) {
  try {
    const headers = await getHeaders();
    const result = await api.patch(`/faqs/${id}`, {
      question: formData.get('question')?.trim(),
      answer: formData.get('answer')?.trim(),
      category: formData.get('category')?.trim() || 'Umum',
      sortOrder: parseInt(formData.get('sort_order') || '0', 10),
      isActive: formData.get('is_active') !== 'false',
    }, { headers });

    if (!result.success) return { error: result.error };

    revalidatePath('/admin/faq');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Hapus FAQ
 */
export async function deleteFAQ(id) {
  try {
    const headers = await getHeaders();
    const result = await api.delete(`/faqs/${id}`, { headers });

    if (!result.success) return { error: result.error };

    revalidatePath('/admin/faq');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}
