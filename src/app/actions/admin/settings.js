'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

/**
 * Update site settings (Header, Hero, Footer)
 */
export async function updateSiteSettings(key, value) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    .select()
    .single();

  if (error) {
    console.error(`Error updating site settings (${key}):`, error);
    return { success: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  revalidatePath('/admin/pengaturan');
  return { success: true, data };
}

/**
 * Get site settings by key
 */
export async function getSiteSettings(key) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error) {
    console.error(`Error fetching site settings (${key}):`, error);
    return null;
  }

  return data.value;
}

/**
 * Update Page SEO
 */
export async function updatePageSEO(id, seoData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('page_seo')
    .update({
      ...seoData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating page SEO:', error);
    return { success: false, error: error.message };
  }

  // Revalidate the specific route if provided in data (though it shouldn't change)
  revalidatePath('/', 'layout');
  revalidatePath(seoData.route);
  
  return { success: true, data };
}

/**
 * Get all SEO settings
 */
export async function getAllSEO() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('page_seo')
    .select('*')
    .order('route', { ascending: true });

  if (error) {
    console.error('Error fetching all SEO:', error);
    return [];
  }

  return data;
}

/**
 * Upload image to Supabase Storage
 */
export async function uploadHeroImage(formData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const file = formData.get('file');
  if (!file) {
    return { success: false, error: 'File tidak ditemukan' };
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `hero_${Date.now()}.${fileExt}`;
  const filePath = `hero/${fileName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('site-assets')
    .upload(filePath, file, {
      contentType: file.type,
      upsert: true
    });

  if (error) {
    console.error('Error uploading image to storage:', error);
    return { success: false, error: error.message };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('site-assets')
    .getPublicUrl(filePath);

  return { success: true, url: publicUrl };
}
