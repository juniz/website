'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

async function getSupabase() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

/**
 * Dapatkan semua kategori FAQ yang sudah ada (untuk dropdown)
 */
export async function getFAQCategories() {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('faqs')
    .select('category')
    .order('category', { ascending: true });

  if (error) return [];

  // Unique categories
  const unique = [...new Set(data.map((d) => d.category).filter(Boolean))];
  return unique;
}

/**
 * Buat FAQ baru
 */
export async function createFAQ(formData) {
  const supabase = await getSupabase();

  const question = formData.get('question')?.trim();
  const answer = formData.get('answer')?.trim();
  const category = formData.get('category')?.trim() || 'Umum';
  const sort_order = parseInt(formData.get('sort_order') || '0', 10);
  const is_active = formData.get('is_active') !== 'false';

  if (!question) return { error: 'Pertanyaan wajib diisi.' };
  if (!answer) return { error: 'Jawaban wajib diisi.' };

  const { error } = await supabase.from('faqs').insert({
    question,
    answer,
    category,
    sort_order,
    is_active,
  });

  if (error) return { error: error.message };

  revalidatePath('/admin/faq');
  revalidatePath('/');
  return { success: true };
}

/**
 * Update FAQ yang sudah ada
 */
export async function updateFAQ(id, formData) {
  const supabase = await getSupabase();

  const question = formData.get('question')?.trim();
  const answer = formData.get('answer')?.trim();
  const category = formData.get('category')?.trim() || 'Umum';
  const sort_order = parseInt(formData.get('sort_order') || '0', 10);
  const is_active = formData.get('is_active') !== 'false';

  if (!question) return { error: 'Pertanyaan wajib diisi.' };
  if (!answer) return { error: 'Jawaban wajib diisi.' };

  const { error } = await supabase
    .from('faqs')
    .update({
      question,
      answer,
      category,
      sort_order,
      is_active,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/faq');
  revalidatePath('/');
  return { success: true };
}

/**
 * Hapus FAQ
 */
export async function deleteFAQ(id) {
  const supabase = await getSupabase();

  const { error } = await supabase.from('faqs').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/faq');
  revalidatePath('/');
  return { success: true };
}
