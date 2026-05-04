'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

/**
 * Generic CRUD Helper
 */
async function performAction(table, action, id, data = null) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  let result;

  try {
    if (action === 'create') {
      result = await supabase.from(table).insert(data).select().single();
    } else if (action === 'update') {
      result = await supabase.from(table).update({ ...data, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    } else if (action === 'delete') {
      result = await supabase.from(table).delete().eq('id', id);
    }

    if (result.error) throw result.error;

    revalidatePath('/', 'layout');
    revalidatePath(`/admin/${table}`);
    return { success: true, data: result.data };
  } catch (error) {
    console.error(`Error in ${action} on ${table}:`, error);
    return { success: false, error: error.message };
  }
}

// Services
export const upsertService = async (id, data) => performAction('services', id ? 'update' : 'create', id, data);
export const deleteService = async (id) => performAction('services', 'delete', id);

// Facilities
export const upsertFacility = async (id, data) => performAction('facilities', id ? 'update' : 'create', id, data);
export const deleteFacility = async (id) => performAction('facilities', 'delete', id);

// Testimonials
export const upsertTestimonial = async (id, data) => performAction('testimonials', id ? 'update' : 'create', id, data);
export const deleteTestimonial = async (id) => performAction('testimonials', 'delete', id);

// FAQs
export const upsertFAQ = async (id, data) => performAction('faqs', id ? 'update' : 'create', id, data);
export const deleteFAQ = async (id) => performAction('faqs', 'delete', id);

// Partners
export const upsertPartner = async (id, data) => performAction('partners', id ? 'update' : 'create', id, data);
export const deletePartner = async (id) => performAction('partners', 'delete', id);

// Contact Messages
export async function markMessageRead(id) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/pesan');
  return { success: true };
}

export const deleteMessage = async (id) => performAction('contact_messages', 'delete', id);
