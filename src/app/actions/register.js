'use server';

import { api } from '@/lib/api';

export async function submitRegistration(prevState, formData) {
  try {
    const bpjsNumber = formData.get('bpjsNumber');
    const complaint = formData.get('complaint');

    const payload = {
      patientName: formData.get('patientName'),
      birthDate: new Date(formData.get('dob')).toISOString(),
      phoneNumber: formData.get('phone'),
      scheduleId: formData.get('schedule'),
      insurance: formData.get('insurance'),
      nik: formData.get('nik') || '', // Added NIK if available in form
      bpjsNumber: bpjsNumber || null,
      complaint: complaint || '',
      status: 'Pending'
    };

    // Post to NestJS API
    const result = await api.post('/registrations', payload);

    if (!result.success) {
      return {
        success: false,
        message: result.error || 'Gagal melakukan pendaftaran. Silahkan coba lagi.'
      };
    }

    const registration = result.data;
    const ticketId = registration.id ? registration.id.substring(registration.id.length - 6).toUpperCase() : 'NEW';

    return {
      success: true,
      ticket: `RSB-${ticketId}`
    };

  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'Gagal melakukan pendaftaran. Silahkan coba lagi.'
    };
  }
}
