'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

async function getSupabase() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

/**
 * Upload logo partner ke Supabase Storage
 */
async function uploadPartnerLogo(supabase, file, partnerName) {
  if (!file || typeof file === 'string' || file.size === 0) return null;

  const slug = partnerName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);

  const ext = file.name.split('.').pop() || 'png';
  const fileName = `${Date.now()}-${slug}.${ext}`.replace(/[^a-zA-Z0-9.-]/g, '');

  const { error } = await supabase.storage
    .from('partner-logos')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (error) {
    console.error('Storage upload error:', error);
    throw new Error('Gagal mengunggah logo: ' + error.message);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('partner-logos')
    .getPublicUrl(fileName);

  return publicUrl;
}

/**
 * Buat partner baru
 */
export async function createPartner(formData) {
  const supabase = await getSupabase();

  const name        = formData.get('name')?.trim();
  const website_url = formData.get('website_url')?.trim() || null;
  const sort_order  = parseInt(formData.get('sort_order') || '0', 10);
  const is_active   = formData.get('is_active') !== 'false';

  if (!name) return { error: 'Nama partner wajib diisi.' };

  try {
    const logo_url = await uploadPartnerLogo(supabase, formData.get('logo'), name);

    const { error } = await supabase.from('partners').insert({
      name,
      logo_url: logo_url || null,
      website_url,
      sort_order,
      is_active,
    });

    if (error) return { error: error.message };
  } catch (err) {
    return { error: err.message };
  }

  revalidatePath('/admin/partner');
  revalidatePath('/');
  return { success: true };
}

/**
 * Update partner yang sudah ada
 */
export async function updatePartner(id, formData) {
  const supabase = await getSupabase();

  const name         = formData.get('name')?.trim();
  const website_url  = formData.get('website_url')?.trim() || null;
  const sort_order   = parseInt(formData.get('sort_order') || '0', 10);
  const is_active    = formData.get('is_active') !== 'false';
  const existing_logo = formData.get('existing_logo') || null;

  if (!name) return { error: 'Nama partner wajib diisi.' };

  try {
    let logo_url = await uploadPartnerLogo(supabase, formData.get('logo'), name);
    // Fallback ke logo lama jika tidak ada upload baru
    logo_url = logo_url || existing_logo;

    const { error } = await supabase
      .from('partners')
      .update({
        name,
        logo_url,
        website_url,
        sort_order,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) return { error: error.message };
  } catch (err) {
    return { error: err.message };
  }

  revalidatePath('/admin/partner');
  revalidatePath('/');
  return { success: true };
}

/**
 * Hapus partner
 */
export async function deletePartner(id) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('partners').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/partner');
  revalidatePath('/');
  return { success: true };
}
