'use server';

import { revalidatePath } from 'next/cache';
import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth-utils';

async function getHeaders() {
  const token = await getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// ── Profile ──────────────────────────────────────────────────
export async function getAboutProfile() {
  const res = await api.get('/about/profile');
  if (!res.success) return null;
  const data = res.data;
  if (!data) return null;
  
  // Map camelCase backend ke snake_case frontend
  return {
    ...data,
    header_title: data.headerTitle,
    header_subtitle: data.headerSubtitle,
    paragraph_1: data.paragraph1,
    paragraph_2: data.paragraph2,
    accreditation_title: data.accreditationTitle,
    accreditation_body: data.accreditationBody,
    accreditation_valid: data.accreditationValid,
    accreditation_certificate_url: data.accreditationCertificateUrl
  };
}

export async function upsertAboutProfile(formData) {
  try {
    const headers = await getHeaders();
    const payload = {
      headerTitle:        formData.get('header_title')?.trim()        || 'Tentang Kami',
      headerSubtitle:     formData.get('header_subtitle')?.trim()     || '',
      paragraph1:         formData.get('paragraph_1')?.trim()         || '',
      paragraph2:         formData.get('paragraph_2')?.trim()         || '',
      accreditationTitle: formData.get('accreditation_title')?.trim() || 'TERAKREDITASI MADYA',
      accreditationBody:  formData.get('accreditation_body')?.trim()  || '',
      accreditationValid: formData.get('accreditation_valid')?.trim() || '',
    };

    const result = await api.post('/about/profile', payload, { headers });
    if (!result.success) return { error: result.error };

    revalidatePath('/about');
    revalidatePath('/admin/tentang');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

// ── Certificate Upload ────────────────────────────────────────
export async function uploadAccreditationCertificate(formData) {
  try {
    const headers = await getHeaders();
    const file = formData.get('certificate');
    if (!file || file.size === 0) return { error: 'File tidak ditemukan.' };

    // Gunakan UploadsController generik
    const uploadBody = new FormData();
    uploadBody.append('file', file);
    uploadBody.append('folder', 'about');

    const uploadRes = await api.post('/uploads/image', uploadBody, { headers });
    if (!uploadRes.success) return { error: uploadRes.error };

    const publicUrl = uploadRes.data.url;

    // Update profile dengan URL baru
    const profileRes = await api.post('/about/profile', {
      accreditationCertificateUrl: publicUrl
    }, { headers });

    if (!profileRes.success) return { error: profileRes.error };

    revalidatePath('/about');
    revalidatePath('/admin/tentang');
    return { success: true, url: publicUrl };
  } catch (err) {
    return { error: err.message };
  }
}

export async function removeAccreditationCertificate() {
  try {
    const headers = await getHeaders();
    const result = await api.post('/about/profile', {
      accreditationCertificateUrl: null
    }, { headers });

    if (!result.success) return { error: result.error };

    revalidatePath('/about');
    revalidatePath('/admin/tentang');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

// ── Stats ─────────────────────────────────────────────────────
export async function getAboutStats() {
  const res = await api.get('/about/stats');
  if (!res.success) return [];
  const items = res.data.data || res.data || [];
  
  return items.map(d => ({
    ...d,
    icon_name: d.iconName,
    sort_order: d.sortOrder
  }));
}

export async function upsertAboutStat(id, data) {
  try {
    const headers = await getHeaders();
    const payload = {
      id,
      label: data.label,
      value: data.value,
      iconName: data.icon_name,
      sortOrder: parseInt(data.sort_order || '0', 10)
    };

    const result = await api.post('/about/stats', payload, { headers });
    if (!result.success) return { error: result.error };

    revalidatePath('/about');
    revalidatePath('/admin/tentang');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function deleteAboutStat(id) {
  try {
    const headers = await getHeaders();
    const result = await api.delete(`/about/stats/${id}`, { headers });
    if (!result.success) return { error: result.error };

    revalidatePath('/about');
    revalidatePath('/admin/tentang');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

// ── Visi & Misi ───────────────────────────────────────────────
export async function getAboutVisiMisi() {
  const res = await api.get('/about/visi-misi');
  if (!res.success) return null;
  return res.data;
}

export async function upsertAboutVisiMisi(formData) {
  try {
    const headers = await getHeaders();
    const misiRaw = formData.get('misi') || '';
    const misi = misiRaw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      visi: formData.get('visi')?.trim() || '',
      misi,
    };

    const result = await api.post('/about/visi-misi', payload, { headers });
    if (!result.success) return { error: result.error };

    revalidatePath('/about');
    revalidatePath('/admin/tentang');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

// ── Values ────────────────────────────────────────────────────
export async function getAboutValues() {
  const res = await api.get('/about/values');
  if (!res.success) return [];
  const items = res.data.data || res.data || [];
  
  return items.map(d => ({
    ...d,
    sort_order: d.sortOrder
  }));
}

export async function upsertAboutValue(id, data) {
  try {
    const headers = await getHeaders();
    const payload = {
      id,
      title: data.title,
      description: data.description,
      sortOrder: parseInt(data.sort_order || '0', 10)
    };

    const result = await api.post('/about/values', payload, { headers });
    if (!result.success) return { error: result.error };

    revalidatePath('/about');
    revalidatePath('/admin/tentang');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function deleteAboutValue(id) {
  try {
    const headers = await getHeaders();
    const result = await api.delete(`/about/values/${id}`, { headers });
    if (!result.success) return { error: result.error };

    revalidatePath('/about');
    revalidatePath('/admin/tentang');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

// ── Milestones ────────────────────────────────────────────────
export async function getAboutMilestones() {
  const res = await api.get('/about/milestones');
  if (!res.success) return [];
  const items = res.data.data || res.data || [];
  
  return items.map(d => ({
    ...d,
    sort_order: d.sortOrder
  }));
}

export async function upsertAboutMilestone(id, data) {
  try {
    const headers = await getHeaders();
    const payload = {
      id,
      year: data.year,
      event: data.event,
      sortOrder: parseInt(data.sort_order || '0', 10)
    };

    const result = await api.post('/about/milestones', payload, { headers });
    if (!result.success) return { error: result.error };

    revalidatePath('/about');
    revalidatePath('/admin/tentang');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function deleteAboutMilestone(id) {
  try {
    const headers = await getHeaders();
    const result = await api.delete(`/about/milestones/${id}`, { headers });
    if (!result.success) return { error: result.error };

    revalidatePath('/about');
    revalidatePath('/admin/tentang');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

// ── Contact ───────────────────────────────────────────────────
export async function getAboutContact() {
  const res = await api.get('/about/contact');
  if (!res.success) return [];
  const items = res.data.data || res.data || [];
  
  return items.map(d => ({
    ...d,
    sort_order: d.sortOrder
  }));
}

export async function upsertAboutContact(id, data) {
  try {
    const headers = await getHeaders();
    const payload = {
      id,
      icon: data.icon,
      text: data.text,
      sortOrder: parseInt(data.sort_order || '0', 10)
    };

    const result = await api.post('/about/contact', payload, { headers });
    if (!result.success) return { error: result.error };

    revalidatePath('/about');
    revalidatePath('/admin/tentang');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function deleteAboutContact(id) {
  try {
    const headers = await getHeaders();
    const result = await api.delete(`/about/contact/${id}`, { headers });
    if (!result.success) return { error: result.error };

    revalidatePath('/about');
    revalidatePath('/admin/tentang');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}
