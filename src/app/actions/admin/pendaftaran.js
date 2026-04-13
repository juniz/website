'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

async function getSupabase() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

export async function updateStatusPendaftaran(id, status) {
  const VALID_STATUSES = ['Pending', 'Confirmed', 'Done', 'Cancelled'];
  if (!VALID_STATUSES.includes(status)) return { error: 'Status tidak valid.' };

  const supabase = await getSupabase();
  const { error } = await supabase
    .from('registrations')
    .update({ status })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/pendaftaran');
  return { success: true };
}

export async function deletePendaftaran(id) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('registrations').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/pendaftaran');
  return { success: true };
}
