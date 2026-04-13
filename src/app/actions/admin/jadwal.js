'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

async function getSupabase() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

export async function createJadwal(formData) {
  const supabase = await getSupabase();
  let insertData;

  // Support array of dates for bulk creation
  if (Array.isArray(formData.dates) && formData.dates.length > 0) {
    insertData = formData.dates.map((date) => ({
      doctor_id: formData.doctor_id,
      date: date,
      time: formData.time.trim(),
      total_quota: parseInt(formData.total_quota, 10),
      filled_quota: 0,
    }));
  } else {
    // Fallback for single creation
    insertData = {
      doctor_id: formData.doctor_id,
      date: formData.date,
      time: formData.time.trim(),
      total_quota: parseInt(formData.total_quota, 10),
      filled_quota: 0,
    };
  }

  const { error } = await supabase.from('schedules').insert(insertData);
  if (error) return { error: error.message };
  revalidatePath('/admin/jadwal');
  revalidatePath('/');
  return { success: true };
}

export async function updateJadwal(id, formData) {
  const supabase = await getSupabase();
  const { error } = await supabase
    .from('schedules')
    .update({
      doctor_id: formData.doctor_id,
      date: formData.date,
      time: formData.time.trim(),
      total_quota: parseInt(formData.total_quota, 10),
    })
    .eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/jadwal');
  revalidatePath('/');
  return { success: true };
}

export async function deleteJadwal(id) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('schedules').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/jadwal');
  revalidatePath('/');
  return { success: true };
}
