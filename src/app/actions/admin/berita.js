'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

async function getSupabase() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

async function handleImageUpload(supabase, imageFile, slug) {
  // Return null if no file or empty file
  if (!imageFile || typeof imageFile === 'string' || imageFile.size === 0) {
    return null;
  }

  const fileExt = imageFile.name.split('.').pop() || 'jpg';
  // Santize filename
  const fileName = `${Date.now()}-${slug}.${fileExt}`.replace(/[^a-zA-Z0-9.-]/g, '');

  const { data, error } = await supabase.storage
    .from('news-images')
    .upload(fileName, imageFile, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Supabase Storage Error:', error);
    throw new Error('Gagal mengupload gambar: ' + error.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from('news-images')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

export async function createBerita(formData) {
  const supabase = await getSupabase();
  const slug = formData.get('slug').trim().toLowerCase();
  
  try {
    const imageUrl = await handleImageUpload(supabase, formData.get('image'), slug);

    const { error } = await supabase.from('news').insert({
      title:     formData.get('title').trim(),
      slug:      slug,
      excerpt:   formData.get('excerpt')?.trim() || null,
      content:   formData.get('content').trim(),
      category:  formData.get('category'),
      image:     imageUrl || formData.get('existing_image') || null,
      author:    formData.get('author')?.trim() || 'Tim RS Bhayangkara',
      read_time: formData.get('read_time')?.trim() || '3 menit baca',
      date:      formData.get('date') || new Date().toISOString(),
    });

    if (error) return { error: error.message };
  } catch (err) {
    return { error: err.message };
  }

  revalidatePath('/admin/berita');
  revalidatePath('/news');
  revalidatePath('/');
  return { success: true };
}

export async function updateBerita(id, formData) {
  const supabase = await getSupabase();
  const slug = formData.get('slug').trim().toLowerCase();

  try {
    let imageUrl = await handleImageUpload(supabase, formData.get('image'), slug);
    // Fallback to existing image if a new one wasn't uploaded
    imageUrl = imageUrl || formData.get('existing_image') || null;

    const { error } = await supabase
      .from('news')
      .update({
        title:     formData.get('title').trim(),
        slug:      slug,
        excerpt:   formData.get('excerpt')?.trim() || null,
        content:   formData.get('content').trim(),
        category:  formData.get('category'),
        image:     imageUrl,
        author:    formData.get('author')?.trim() || 'Tim RS Bhayangkara',
        read_time: formData.get('read_time')?.trim() || '3 menit baca',
        date:      formData.get('date') || new Date().toISOString(),
      })
      .eq('id', id);

    if (error) return { error: error.message };
  } catch (err) {
    return { error: err.message };
  }

  revalidatePath('/admin/berita');
  revalidatePath('/news');
  revalidatePath('/');
  return { success: true };
}

export async function deleteBerita(id) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/berita');
  revalidatePath('/news');
  revalidatePath('/');
  return { success: true };
}
