'use strict';
'use server';

import { api } from '@/lib/api';

export async function getTerms() {
  try {
    const result = await api.get('/consent/terms');
    if (result.success) {
      return result.data.data;
    }
    return null;
  } catch (error) {
    console.error('Failed to get T&C:', error);
    return null;
  }
}

export async function agreeToConsent(prevState, formData) {
  try {
    // Generate a random session ID if not available
    const sessionId = Math.random().toString(36).substring(2, 15);
    const pasienType = formData.get('pasien_type'); // 'baru' or 'lama'

    const payload = {
      session_id: sessionId,
      pasien_type: pasienType,
    };

    const result = await api.post('/consent/agree', payload);

    if (!result.success) {
      return { success: false, message: result.error || 'Failed to submit consent.' };
    }

    return { success: true, data: result.data.data };
  } catch (error) {
    console.error('Consent error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function submitPreRegistration(prevState, formData) {
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

    const result = await api.post('/pre-registration/new', payload);

    if (!result.success) {
      // API error messages might be in result.error
      const message = typeof result.error === 'string' ? result.error : 'Failed to register. Please check your inputs.';
      return { success: false, message };
    }

    return { success: true, data: result.data.data };
  } catch (error) {
    console.error('Pre-registration error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function verifyOldPatient(prevState, formData) {
  try {
    const payload = {
      no_ktp: formData.get('no_ktp'),
      tgl_lahir: formData.get('tgl_lahir'),
      captcha_token: formData.get('captcha_token'),
    };

    const result = await api.post('/patient/verify', payload);

    if (!result.success) {
      return { success: false, message: result.error || 'Patient data not found in SIMRS.' };
    }

    return { success: true, data: result.data.data };
  } catch (error) {
    console.error('Verification error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
export async function getSchedulesByDay(day) {
  try {
    const result = await api.get(`/patient/schedules?day=${day}`);
    if (result.success) {
      return { success: true, data: result.data.data };
    }
    return { success: false, message: result.error || 'Failed to get schedules.' };
  } catch (error) {
    console.error('Get schedules error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function submitBookingRegistrasi(payload) {
  try {
    const result = await api.post('/patient/booking', payload);
    if (!result.success) {
      return { success: false, message: result.error || 'Gagal melakukan booking registrasi.' };
    }
    return { success: true, data: result.data.data };
  } catch (error) {
    console.error('Booking registrasi error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
export async function getQrStatus(token) {
  try {
    const result = await api.get(`/pre-registration/status/${token}`);
    if (result.success) {
      return { success: true, data: result.data.data };
    }
    return { success: false, message: result.error || 'Failed to get status.' };
  } catch (error) {
    console.error('Get QR status error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
