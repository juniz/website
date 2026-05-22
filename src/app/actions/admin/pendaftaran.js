'use server';

import { revalidatePath } from 'next/cache';
import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth-utils';

async function getHeaders() {
  const token = await getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function updateStatusPendaftaran(id, status) {
  try {
    const VALID_STATUSES = ['Pending', 'Confirmed', 'Done', 'Cancelled'];
    if (!VALID_STATUSES.includes(status)) return { error: 'Status tidak valid.' };

    const headers = await getHeaders();
    const result = await api.patch(`/registrations/${id}`, { status }, { headers });

    if (!result.success) return { error: result.error };

    revalidatePath('/admin/pendaftaran');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function deletePendaftaran(id) {
  try {
    const headers = await getHeaders();
    const result = await api.delete(`/registrations/${id}`, { headers });

    if (!result.success) return { error: result.error };

    revalidatePath('/admin/pendaftaran');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function scanQrCode(token) {
  try {
    const headers = await getHeaders();
    const result = await api.get(`/pre-registration/scan/${token}`, { headers });

    if (!result.success) {
      return { error: result.error || 'Token QR tidak valid atau sudah kedaluwarsa.' };
    }

    // Backend wraps response in { data: ... }
    return { success: true, data: result.data.data || result.data };
  } catch (err) {
    return { error: 'Terjadi kesalahan sistem saat memindai QR.' };
  }
}

export async function updatePreRegStatus(id, status) {
  try {
    const headers = await getHeaders();
    const result = await api.patch(`/pre-registration/status/${id}`, { status }, { headers });

    if (!result.success) return { error: result.error };

    revalidatePath('/admin/pendaftaran');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}
