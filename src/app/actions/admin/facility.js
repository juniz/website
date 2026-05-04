'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

async function getSupabase() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

/**
 * Upload gambar fasilitas ke Supabase Storage (bucket: site-assets)
 */
async function uploadFacilityImage(supabase, file, title) {
  if (!file || typeof file === 'string' || file.size === 0) return null;

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);

  const ext = file.name.split('.').pop() || 'webp';
  const fileName = `facilities/${Date.now()}-${slug}.${ext}`.replace(/[^a-zA-Z0-9/.-]/g, '');

  const { error } = await supabase.storage
    .from('site-assets')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (error) {
    console.error('Storage upload error:', error);
    throw new Error('Gagal mengunggah gambar: ' + error.message);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('site-assets')
    .getPublicUrl(fileName);

  return publicUrl;
}

/**
 * Buat atau Update Fasilitas
 */
export async function upsertFacilityAction(id, formData) {
  const supabase = await getSupabase();

  const title       = formData.get('title')?.trim();
  const description = formData.get('description')?.trim() || null;
  const category    = formData.get('category')?.trim() || 'Umum';
  const sort_order  = parseInt(formData.get('sort_order') || '0', 10);
  const is_active   = formData.get('is_active') !== 'false';
  const existing_img = formData.get('existing_image') || null;

  if (!title) return { error: 'Nama fasilitas wajib diisi.' };

  try {
    const file = formData.get('image');
    let image_url = null;

    if (file && file.size > 0) {
      image_url = await uploadFacilityImage(supabase, file, title);
    } else {
      image_url = existing_img;
    }

    const payload = {
      title,
      description,
      category,
      image_url,
      sort_order,
      is_active,
      updated_at: new Date().toISOString(),
    };

    let result;
    if (id) {
      result = await supabase.from('facilities').update(payload).eq('id', id);
    } else {
      result = await supabase.from('facilities').insert({ ...payload, id: undefined });
      // Note: id: undefined to let DB generate UUID if it's a create
    }

    if (result.error) throw result.error;

    revalidatePath('/admin/fasilitas');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    console.error('Upsert facility error:', err);
    return { error: err.message };
  }
}

export async function deleteFacilityAction(id) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('facilities').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/fasilitas');
  revalidatePath('/');
  return { success: true };
}
