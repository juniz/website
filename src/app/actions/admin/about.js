'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

async function getSupabase() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

// ── Profile ──────────────────────────────────────────────────
export async function getAboutProfile() {
  const supabase = await getSupabase();
  const { data } = await supabase.from('about_profile').select('*').limit(1).single();
  return data;
}

export async function upsertAboutProfile(formData) {
  const supabase = await getSupabase();

  const payload = {
    header_title:        formData.get('header_title')?.trim()        || 'Tentang Kami',
    header_subtitle:     formData.get('header_subtitle')?.trim()     || '',
    paragraph_1:         formData.get('paragraph_1')?.trim()         || '',
    paragraph_2:         formData.get('paragraph_2')?.trim()         || '',
    accreditation_title: formData.get('accreditation_title')?.trim() || 'TERAKREDITASI MADYA',
    accreditation_body:  formData.get('accreditation_body')?.trim()  || '',
    accreditation_valid: formData.get('accreditation_valid')?.trim() || '',
    // Preserve existing certificate URL — only certificate upload action changes this field
  };

  const { data: existing } = await supabase.from('about_profile').select('id').limit(1).single();

  let error;
  if (existing) {
    ({ error } = await supabase.from('about_profile').update(payload).eq('id', existing.id));
  } else {
    ({ error } = await supabase.from('about_profile').insert(payload));
  }

  if (error) return { error: error.message };
  revalidatePath('/about');
  revalidatePath('/admin/tentang');
  return { success: true };
}

// ── Certificate Upload ────────────────────────────────────────
export async function uploadAccreditationCertificate(formData) {
  try {
    const supabase = await getSupabase();
    const file = formData.get('certificate');

    if (!file || file.size === 0) return { error: 'File tidak ditemukan.' };

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { error: `Format ${file.type} tidak valid. Gunakan PDF, PNG, atau JPG.` };
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_SIZE) return { error: 'Ukuran file maksimal 10 MB.' };

    const ext = (file.name.split('.').pop() || 'pdf').toLowerCase();
    const fileName = `accreditation/sertifikat-akreditasi-${Date.now()}.${ext}`;

    // 1. Upload ke Storage
    const { error: upErr } = await supabase.storage
      .from('site-assets')
      .upload(fileName, file, { 
        cacheControl: '3600', 
        upsert: true,
        contentType: file.type // Memastikan content type tersimpan benar
      });

    if (upErr) {
      console.error('Storage Upload Error:', upErr);
      return { error: 'Gagal upload ke storage: ' + upErr.message };
    }

    // 2. Dapatkan Public URL
    const { data: urlData } = supabase.storage
      .from('site-assets')
      .getPublicUrl(fileName);
    
    const publicUrl = urlData.publicUrl;

    // 3. Simpan ke Database
    // Kita cari ID profile dulu secara eksplisit
    const { data: profileRow, error: fetchErr } = await supabase
      .from('about_profile')
      .select('id')
      .maybeSingle();

    if (fetchErr) {
      return { error: 'Gagal mengambil data profil: ' + fetchErr.message };
    }

    let dbErr;
    if (profileRow?.id) {
      const { error } = await supabase
        .from('about_profile')
        .update({ accreditation_certificate_url: publicUrl })
        .eq('id', profileRow.id);
      dbErr = error;
    } else {
      const { error } = await supabase
        .from('about_profile')
        .insert({ accreditation_certificate_url: publicUrl });
      dbErr = error;
    }

    if (dbErr) {
      console.error('Database Update Error:', dbErr);
      // Jika ini error "column does not exist", artinya migrasi belum dijalankan
      if (dbErr.code === '42703') {
        return { error: 'Kolom database belum tersedia. Pastikan sudah menjalankan migrasi SQL: accreditation_certificate_url' };
      }
      return { error: 'Gagal menyimpan URL ke database: ' + dbErr.message };
    }

    revalidatePath('/about');
    revalidatePath('/admin/tentang');
    
    return { success: true, url: publicUrl };
  } catch (err) {
    console.error('Unexpected Upload Error:', err);
    return { error: 'Terjadi kesalahan sistem: ' + (err.message || 'Unknown error') };
  }
}

export async function removeAccreditationCertificate() {
  const supabase = await getSupabase();
  const { data: existing } = await supabase.from('about_profile').select('id').limit(1).single();
  if (!existing) return { error: 'Profil tidak ditemukan.' };

  const { error } = await supabase
    .from('about_profile')
    .update({ accreditation_certificate_url: null })
    .eq('id', existing.id);

  if (error) return { error: error.message };
  revalidatePath('/about');
  revalidatePath('/admin/tentang');
  return { success: true };
}

// ── Stats ─────────────────────────────────────────────────────
export async function getAboutStats() {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from('about_stats')
    .select('*')
    .order('sort_order', { ascending: true });
  return data || [];
}

export async function upsertAboutStat(id, payload) {
  const supabase = await getSupabase();
  let error;
  if (id) {
    ({ error } = await supabase.from('about_stats').update(payload).eq('id', id));
  } else {
    ({ error } = await supabase.from('about_stats').insert(payload));
  }
  if (error) return { error: error.message };
  revalidatePath('/about');
  revalidatePath('/admin/tentang');
  return { success: true };
}

export async function deleteAboutStat(id) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('about_stats').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/about');
  revalidatePath('/admin/tentang');
  return { success: true };
}

// ── Visi & Misi ───────────────────────────────────────────────
export async function getAboutVisiMisi() {
  const supabase = await getSupabase();
  const { data } = await supabase.from('about_visi_misi').select('*').limit(1).single();
  return data;
}

export async function upsertAboutVisiMisi(formData) {
  const supabase = await getSupabase();

  // misi textarea: one item per line
  const misiRaw = formData.get('misi') || '';
  const misi = misiRaw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const payload = {
    visi: formData.get('visi')?.trim() || '',
    misi,
  };

  const { data: existing } = await supabase.from('about_visi_misi').select('id').limit(1).single();
  let error;
  if (existing) {
    ({ error } = await supabase.from('about_visi_misi').update(payload).eq('id', existing.id));
  } else {
    ({ error } = await supabase.from('about_visi_misi').insert(payload));
  }

  if (error) return { error: error.message };
  revalidatePath('/about');
  revalidatePath('/admin/tentang');
  return { success: true };
}

// ── Values ────────────────────────────────────────────────────
export async function getAboutValues() {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from('about_values')
    .select('*')
    .order('sort_order', { ascending: true });
  return data || [];
}

export async function upsertAboutValue(id, payload) {
  const supabase = await getSupabase();
  let error;
  if (id) {
    ({ error } = await supabase.from('about_values').update(payload).eq('id', id));
  } else {
    ({ error } = await supabase.from('about_values').insert(payload));
  }
  if (error) return { error: error.message };
  revalidatePath('/about');
  revalidatePath('/admin/tentang');
  return { success: true };
}

export async function deleteAboutValue(id) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('about_values').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/about');
  revalidatePath('/admin/tentang');
  return { success: true };
}

// ── Milestones ────────────────────────────────────────────────
export async function getAboutMilestones() {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from('about_milestones')
    .select('*')
    .order('sort_order', { ascending: true });
  return data || [];
}

export async function upsertAboutMilestone(id, payload) {
  const supabase = await getSupabase();
  let error;
  if (id) {
    ({ error } = await supabase.from('about_milestones').update(payload).eq('id', id));
  } else {
    ({ error } = await supabase.from('about_milestones').insert(payload));
  }
  if (error) return { error: error.message };
  revalidatePath('/about');
  revalidatePath('/admin/tentang');
  return { success: true };
}

export async function deleteAboutMilestone(id) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('about_milestones').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/about');
  revalidatePath('/admin/tentang');
  return { success: true };
}

// ── Contact ───────────────────────────────────────────────────
export async function getAboutContact() {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from('about_contact')
    .select('*')
    .order('sort_order', { ascending: true });
  return data || [];
}

export async function upsertAboutContact(id, payload) {
  const supabase = await getSupabase();
  let error;
  if (id) {
    ({ error } = await supabase.from('about_contact').update(payload).eq('id', id));
  } else {
    ({ error } = await supabase.from('about_contact').insert(payload));
  }
  if (error) return { error: error.message };
  revalidatePath('/about');
  revalidatePath('/admin/tentang');
  return { success: true };
}

export async function deleteAboutContact(id) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('about_contact').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/about');
  revalidatePath('/admin/tentang');
  return { success: true };
}
