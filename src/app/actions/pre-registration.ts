'use server';

import { api } from '@/lib/api';
import { Terms, ConsentResult, Patient, Schedule, BookingResult, QrStatusResult } from '@/types/api';

export async function getTerms(): Promise<Terms | null> {
  try {
    const result = await api.get<Terms>('/consent/terms');
    if (result.success && result.data) {
      // Direct access from the API structure
      return (result.data as any).data || result.data;
    }
    return null;
  } catch (error) {
    console.error('Failed to get T&C:', error);
    return null;
  }
}

export async function agreeToConsent(
  prevState: any,
  formData: FormData
): Promise<{ success: boolean; data?: ConsentResult; message?: string }> {
  try {
    // Generate a random session ID if not available
    const sessionId = Math.random().toString(36).substring(2, 15);
    const pasienType = formData.get('pasien_type') as 'baru' | 'lama';

    const payload = {
      session_id: sessionId,
      pasien_type: pasienType,
    };

    const result = await api.post<ConsentResult>('/consent/agree', payload);

    if (!result.success || !result.data) {
      return { success: false, message: result.error || 'Failed to submit consent.' };
    }

    return { success: true, data: (result.data as any).data || result.data };
  } catch (error: any) {
    console.error('Consent error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function submitPreRegistration(
  prevState: any,
  formData: FormData
): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const payload = {
      consent_id: formData.get('consent_id'),
      nm_pasien: formData.get('nm_pasien'),
      no_ktp: formData.get('no_ktp'),
      tgl_lahir: formData.get('tgl_lahir'),
      nm_ibu: formData.get('nm_ibu'),
      no_wa: formData.get('no_wa'),
      jk: formData.get('jk'),
      alamat: formData.get('alamat') || '',
      captcha_token: formData.get('captcha_token'),
      tgl_booking: formData.get('tgl_booking'),
      kd_dokter: formData.get('kd_dokter'),
      kd_poli: formData.get('kd_poli'),
    };

    const result = await api.post<any>('/pre-registration/new', payload);

    if (!result.success || !result.data) {
      const message = typeof result.error === 'string' ? result.error : 'Failed to register. Please check your inputs.';
      return { success: false, message };
    }

    return { success: true, data: (result.data as any).data || result.data };
  } catch (error: any) {
    console.error('Pre-registration error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function verifyOldPatient(
  prevState: any,
  formData: FormData
): Promise<{ success: boolean; data?: Patient; message?: string }> {
  try {
    const payload = {
      no_ktp: formData.get('no_ktp'),
      tgl_lahir: formData.get('tgl_lahir'),
      captcha_token: formData.get('captcha_token'),
    };

    const result = await api.post<Patient>('/patient/verify', payload);

    if (!result.success || !result.data) {
      return { success: false, message: result.error || 'Patient data not found in SIMRS.' };
    }

    return { success: true, data: (result.data as any).data || result.data };
  } catch (error: any) {
    console.error('Verification error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function getSchedulesByDay(day: string): Promise<{ success: boolean; data?: Schedule[]; message?: string }> {
  try {
    const result = await api.get<Schedule[]>(`/patient/schedules?day=${day}`);
    if (result.success && result.data) {
      return { success: true, data: (result.data as any).data || result.data };
    }
    return { success: false, message: result.error || 'Failed to get schedules.' };
  } catch (error: any) {
    console.error('Get schedules error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function submitBookingRegistrasi(payload: {
  no_rkm_medis: string;
  tanggal_periksa: string;
  kd_dokter: string;
  kd_poli: string;
  captcha_token: string;
}): Promise<{ success: boolean; data?: BookingResult; message?: string }> {
  try {
    const result = await api.post<BookingResult>('/patient/booking', payload);
    if (!result.success || !result.data) {
      return { success: false, message: result.error || 'Gagal melakukan booking registrasi.' };
    }
    return { success: true, data: (result.data as any).data || result.data };
  } catch (error: any) {
    console.error('Booking registrasi error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function getQrStatus(token: string): Promise<{ success: boolean; data?: QrStatusResult; message?: string }> {
  try {
    const result = await api.get<QrStatusResult>(`/pre-registration/status/${token}`);
    if (result.success && result.data) {
      return { success: true, data: (result.data as any).data || result.data };
    }
    return { success: false, message: result.error || 'Failed to get status.' };
  } catch (error: any) {
    console.error('Get QR status error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
