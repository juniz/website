import { api } from '@/lib/api';
import { specializationFilters, getInitials } from './shared';

export { specializationFilters, getInitials };

export async function getDoctors() {
  const result = await api.get('/doctors');
  
  // Karena backend ada TransformInterceptor, data asli ada di dalam property 'data'
  const items = result.success ? (result.data.data || result.data) : [];

  return items.map(doc => {
    let specCode = 'all';
    if (doc.specialization?.toLowerCase().includes('jantung')) specCode = 'jantung';
    else if (doc.specialization?.toLowerCase().includes('anak')) specCode = 'anak';
    else if (doc.specialization?.toLowerCase().includes('kandungan')) specCode = 'kandungan';
    else if (doc.specialization?.toLowerCase().includes('bedah')) specCode = 'bedah';
    else if (doc.specialization?.toLowerCase().includes('dalam')) specCode = 'penyakit-dalam';

    return {
      ...doc,
      // Backend kita menggunakan isAvailable (camelCase)
      isAvailable: doc.isAvailable,
      specializationCode: specCode,
      availability: doc.isAvailable ? 'today' : 'unavailable',
      avatarBg: 'var(--color-primary-100)',
      avatarColor: 'var(--color-primary-700)',
      experience: '10+ Tahun',
      education: 'Universitas Indonesia',
      bio: `Dr. ${doc.name} adalah seorang dokter spesialis yang berdedikasi tinggi memberikan pelayanan terbaik untuk kesehatan Anda.`,
      todaySchedule: doc.isAvailable ? '10:00 - 14:00' : null
    };
  });
}

export async function getDoctorById(id) {
  const result = await api.get(`/doctors/${id}`);
  return result.success ? (result.data.data || result.data) : null;
}
