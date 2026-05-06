'use server';

import { api } from '@/lib/api';
import { revalidatePath } from 'next/cache';
import { getAuthToken } from '@/lib/auth-utils';

async function getHeaders() {
  const token = await getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

/**
 * Update site settings (Header, Hero, Footer) via NestJS API
 */
export async function updateSiteSettings(key, value) {
  try {
    const headers = await getHeaders();
    const result = await api.post(`/settings/key/${key}`, { value }, { headers });
    if (!result.success) throw new Error(result.error);

    revalidatePath('/', 'layout');
    revalidatePath('/admin/pengaturan');
    return { success: true, data: result.data };
  } catch (err) {
    console.error(`Error updating site settings (${key}):`, err);
    return { success: false, error: err.message };
  }
}

/**
 * Update Page SEO via NestJS API
 */
export async function updatePageSEO(id, seoData) {
  try {
    const headers = await getHeaders();
    // Map snake_case to camelCase for backend
    const payload = {
      route: id, // id berisi rute (misal: '/')
      title: seoData.meta_title,
      description: seoData.meta_description,
      keywords: Array.isArray(seoData.meta_keywords) ? seoData.meta_keywords.join(',') : seoData.meta_keywords,
      isActive: seoData.is_active,
      ogImage: seoData.og_image
    };

    const result = await api.post('/seo', payload, { headers });
    if (!result.success) throw new Error(result.error);

    revalidatePath('/', 'layout');
    revalidatePath(id);
    
    return { success: true, data: result.data };
  } catch (err) {
    console.error('Error updating page SEO:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Upload image (used for Hero etc) via NestJS API
 */
export async function uploadHeroImage(formData) {
  try {
    const headers = await getHeaders();
    // Use the generic /uploads endpoint
    const result = await api.post('/uploads', formData, { headers });
    if (!result.success) throw new Error(result.error);

    // Backend wraps response in { data: { ... } }
    const url = result.data.data?.url || result.data.url;
    return { success: true, url };
  } catch (err) {
    console.error('Error uploading image:', err);
    return { success: false, error: err.message };
  }
}
