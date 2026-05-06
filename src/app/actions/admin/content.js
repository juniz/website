'use server';

import { revalidatePath } from 'next/cache';
import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth-utils';

async function getHeaders() {
  const token = await getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

/**
 * Generic CRUD Helper for NestJS
 */
async function performAction(endpoint, action, id, data = null) {
  const headers = await getHeaders();
  let result;

  try {
    if (action === 'create') {
      result = await api.post(endpoint, data, { headers });
    } else if (action === 'update') {
      result = await api.patch(`${endpoint}/${id}`, data, { headers });
    } else if (action === 'delete') {
      result = await api.delete(`${endpoint}/${id}`, { headers });
    }

    if (!result.success) throw new Error(result.error || 'Terjadi kesalahan pada server');

    revalidatePath('/', 'layout');
    revalidatePath(`/admin/${endpoint.replace(/^\//, '')}`);
    return { success: true, data: result.data };
  } catch (error) {
    console.error(`Error in ${action} on ${endpoint}:`, error);
    return { success: false, error: error.message };
  }
}

// Services
export async function upsertService(id, data) {
  try {
    const headers = await getHeaders();
    
    // Gunakan FormData karena ada upload file
    const body = new FormData();
    body.append('name', data.name);
    body.append('slug', data.slug);
    if (data.description) body.append('description', data.description);
    if (data.countInfo)   body.append('countInfo', data.countInfo);
    body.append('colorCode', data.colorCode || '#185FA5');
    body.append('bgColorCode', data.bgColorCode || '#EBF2FA');
    body.append('sortOrder', String(data.sortOrder || 0));
    body.append('isActive', String(data.isActive));

    // Jika imageUrl adalah file (upload baru), masukkan ke field 'image'
    // Jika string (URL lama), masukkan ke field 'imageUrl'
    if (data.imageUrl instanceof File) {
      body.append('image', data.imageUrl);
    } else if (data.imageUrl) {
      body.append('imageUrl', data.imageUrl);
    }

    const endpoint = '/services';
    const result = id 
      ? await api.patch(`${endpoint}/${id}`, body, { headers })
      : await api.post(endpoint, body, { headers });

    if (!result.success) throw new Error(result.error || 'Terjadi kesalahan pada server');

    revalidatePath('/', 'layout');
    revalidatePath('/admin/layanan');
    return { success: true, data: result.data };
  } catch (error) {
    console.error(`Error in upsertService:`, error);
    return { success: false, error: error.message };
  }
}

export const deleteService = async (id) => performAction('/services', 'delete', id);

// Facilities
export async function upsertFacility(id, data) {
  const payload = {
    title: data.title,
    description: data.description,
    category: data.category,
    imageUrl: data.image_url,
    sortOrder: data.sort_order,
    isActive: data.is_active,
  };
  return performAction('/facilities', id ? 'update' : 'create', id, payload);
}
export const deleteFacility = async (id) => performAction('/facilities', 'delete', id);

// Testimonials
export async function upsertTestimonial(id, data) {
  const payload = {
    name: data.name,
    role: data.role,
    content: data.content,
    avatarUrl: data.avatar_url,
    rating: data.rating,
    isActive: data.is_active,
  };
  return performAction('/testimonials', id ? 'update' : 'create', id, payload);
}
export const deleteTestimonial = async (id) => performAction('/testimonials', 'delete', id);

// FAQs
export async function upsertFAQ(id, data) {
  const payload = {
    question: data.question,
    answer: data.answer,
    category: data.category,
    sortOrder: data.sort_order,
    isActive: data.is_active,
  };
  return performAction('/faqs', id ? 'update' : 'create', id, payload);
}
export const deleteFAQ = async (id) => performAction('/faqs', 'delete', id);

// Partners
export async function upsertPartner(id, data) {
  const payload = {
    name: data.name,
    logoUrl: data.logo_url,
    link: data.link,
    sortOrder: data.sort_order,
    isActive: data.is_active,
  };
  return performAction('/partners', id ? 'update' : 'create', id, payload);
}
export const deletePartner = async (id) => performAction('/partners', 'delete', id);

// Contact Messages
export async function markMessageRead(id) {
  try {
    const headers = await getHeaders();
    const result = await api.patch(`/contact-messages/${id}/read`, {}, { headers });
    if (!result.success) return { success: false, error: result.error };
    revalidatePath('/admin/pesan');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export const deleteMessage = async (id) => performAction('/contact-messages', 'delete', id);
