import { createClient } from '@/utils/supabase/static';
import { specializationFilters, getInitials } from './shared';

export { specializationFilters, getInitials };

export async function getDoctors() {
  const supabase = createClient();
  const { data: doctors } = await supabase.from('doctors').select('*').order('name', { ascending: true });
  const items = doctors || [];

  return items.map(doc => {
    let specCode = 'all';
    if (doc.specialization.toLowerCase().includes('jantung')) specCode = 'jantung';
    else if (doc.specialization.toLowerCase().includes('anak')) specCode = 'anak';
    else if (doc.specialization.toLowerCase().includes('kandungan')) specCode = 'kandungan';
    else if (doc.specialization.toLowerCase().includes('bedah')) specCode = 'bedah';
    else if (doc.specialization.toLowerCase().includes('dalam')) specCode = 'penyakit-dalam';

    return {
      ...doc,
      isAvailable: doc.is_available,
      specializationCode: specCode,
      availability: doc.is_available ? 'today' : 'unavailable',
      avatarBg: 'var(--color-primary-100)',
      avatarColor: 'var(--color-primary-700)',
      experience: '10+ Tahun',
      education: 'Universitas Indonesia',
      bio: `Dr. ${doc.name} adalah seorang dokter spesialis yang berdedikasi tinggi memberikan pelayanan terbaik untuk kesehatan Anda.`,
      todaySchedule: doc.is_available ? '10:00 - 14:00' : null
    };
  });
}

// Exporting original functions for server use
export async function getDoctorById(id) {
  const supabase = createClient();
  const { data } = await supabase.from('doctors').select('*').eq('id', id).single();
  if (data) {
    data.isAvailable = data.is_available;
  }
  return data;
}
