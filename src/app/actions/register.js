'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function submitRegistration(prevState, formData) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const bpjsNumber = formData.get('bpjsNumber');
    const complaint = formData.get('complaint');

    const data = {
      patient_name: formData.get('patientName'),
      dob: new Date(formData.get('dob')).toISOString(),
      phone: formData.get('phone'),
      schedule_id: formData.get('schedule'),
      insurance: formData.get('insurance'),
      bpjs_number: bpjsNumber || null,
      complaint: complaint || '',
      status: 'Pending'
    };

    // Insert into DB
    const { data: registration, error: insertError } = await supabase
      .from('registrations')
      .insert(data)
      .select()
      .single();

    if (insertError) throw insertError;

    // Read current quota and increment
    const { data: currentSchedule } = await supabase
      .from('schedules')
      .select('filled_quota')
      .eq('id', data.schedule_id)
      .single();

    if (currentSchedule) {
      await supabase
        .from('schedules')
        .update({ filled_quota: currentSchedule.filled_quota + 1 })
        .eq('id', data.schedule_id);
    }

    return {
      success: true,
      ticket: `RSB-${registration.id.substring(registration.id.length - 6).toUpperCase()}`
    };

  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'Gagal melakukan pendaftaran. Silahkan coba lagi.'
    };
  }
}
