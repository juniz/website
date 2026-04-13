'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

async function getSupabase() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

async function handleImageUpload(supabase, imageFile, prefix = 'doctor') {
  // Return null if no file or empty file
  if (!imageFile || typeof imageFile === 'string' || imageFile.size === 0) {
    return null;
  }

  const fileExt = imageFile.name.split('.').pop() || 'jpg';
  // Santize filename
  const fileName = `${Date.now()}-${prefix}.${fileExt}`.replace(/[^a-zA-Z0-9.-]/g, '');

  const { error } = await supabase.storage
    .from('doctor-images')
    .upload(fileName, imageFile, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Supabase Storage Error:', error);
    throw new Error('Gagal mengupload foto dokter: ' + error.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from('doctor-images')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

export async function createDokter(formData) {
  const supabase = await getSupabase();
  
  try {
    const imageUrl = await handleImageUpload(supabase, formData.get('image'), 'dr');

    const { error } = await supabase.from('doctors').insert({
      name: formData.get('name').trim(),
      specialization: formData.get('specialization').trim(),
      image: imageUrl || formData.get('existing_image') || null,
      is_available: formData.get('is_available') === 'true',
    });

    if (error) return { error: error.message };
  } catch (err) {
    return { error: err.message };
  }

  revalidatePath('/admin/dokter');
  revalidatePath('/');
  return { success: true };
}

export async function updateDokter(id, formData) {
  const supabase = await getSupabase();
  
  try {
    let imageUrl = await handleImageUpload(supabase, formData.get('image'), 'dr');
    imageUrl = imageUrl || formData.get('existing_image') || null;

    const { error } = await supabase
      .from('doctors')
      .update({
        name: formData.get('name').trim(),
        specialization: formData.get('specialization').trim(),
        image: imageUrl,
        is_available: formData.get('is_available') === 'true',
      })
      .eq('id', id);

    if (error) return { error: error.message };
  } catch (err) {
    return { error: err.message };
  }

  revalidatePath('/admin/dokter');
  revalidatePath('/');
  return { success: true };
}

export async function deleteDokter(id) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('doctors').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/dokter');
  revalidatePath('/');
  return { success: true };
}
