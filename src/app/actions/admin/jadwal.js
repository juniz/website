'use server';

import { revalidatePath } from 'next/cache';
import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth-utils';

async function getHeaders() {
  const token = await getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function createJadwal(data) {
  try {
    const headers = await getHeaders();
    
    // Support array of dates for bulk creation
    if (Array.isArray(data.dates) && data.dates.length > 0) {
      for (const date of data.dates) {
        const result = await api.post('/schedules', {
          doctorId: data.doctor_id,
          date: date,
          time: data.time.trim(),
          totalQuota: parseInt(data.total_quota, 10),
          filledQuota: 0,
        }, { headers });

        if (!result.success) return { error: `Gagal pada hari ${date}: ${result.error}` };
      }
    } else {
      const result = await api.post('/schedules', {
        doctorId: data.doctor_id,
        date: data.date,
        time: data.time.trim(),
        totalQuota: parseInt(data.total_quota, 10),
        filledQuota: 0,
      }, { headers });

      if (!result.success) return { error: result.error };
    }

    revalidatePath('/admin/jadwal');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function updateJadwal(id, data) {
  try {
    const headers = await getHeaders();
    const result = await api.patch(`/schedules/${id}`, {
      doctorId: data.doctor_id,
      date: data.date,
      time: data.time.trim(),
      totalQuota: parseInt(data.total_quota, 10),
    }, { headers });

    if (!result.success) return { error: result.error };

    revalidatePath('/admin/jadwal');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function deleteJadwal(id) {
  try {
    const headers = await getHeaders();
    const result = await api.delete(`/schedules/${id}`, { headers });

    if (!result.success) return { error: result.error };

    revalidatePath('/admin/jadwal');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function bulkDeleteJadwal(ids) {
  try {
    const headers = await getHeaders();
    const result = await api.post('/schedules/bulk-delete', { ids }, { headers });

    if (!result.success) return { error: result.error };

    revalidatePath('/admin/jadwal');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}
