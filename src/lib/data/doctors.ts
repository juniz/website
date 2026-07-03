import { api } from '@/lib/api';
import { specializationFilters, getInitials } from './shared';
import { Doctor } from '@/types/api';

export { specializationFilters, getInitials };

export async function getDoctors(): Promise<Doctor[]> {
  const result = await api.get<any>('/doctors?limit=100');
  
  // Handle nested paginated structure
  const rawData: any = result.success ? (result.data as any)?.data || result.data : [];
  const items: any[] = Array.isArray(rawData) ? rawData : (rawData?.data || []);

  return items.map((doc: any): Doctor => {
    let specCode = 'all';
    if (doc.specialization?.toLowerCase().includes('jantung')) specCode = 'jantung';
    else if (doc.specialization?.toLowerCase().includes('anak')) specCode = 'anak';
    else if (doc.specialization?.toLowerCase().includes('kandungan')) specCode = 'kandungan';
    else if (doc.specialization?.toLowerCase().includes('bedah')) specCode = 'bedah';
    else if (doc.specialization?.toLowerCase().includes('dalam')) specCode = 'penyakit-dalam';

    return {
      ...doc,
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

export async function getDoctorById(id: string | number): Promise<Doctor | null> {
  const result = await api.get<any>(`/doctors/${id}`);
  const s = result.success ? ((result.data as any)?.data || result.data) : null;
  if (!s) return null;

  let specCode = 'all';
  if (s.specialization?.toLowerCase().includes('jantung')) specCode = 'jantung';
  else if (s.specialization?.toLowerCase().includes('anak')) specCode = 'anak';
  else if (s.specialization?.toLowerCase().includes('kandungan')) specCode = 'kandungan';
  else if (s.specialization?.toLowerCase().includes('bedah')) specCode = 'bedah';
  else if (s.specialization?.toLowerCase().includes('dalam')) specCode = 'penyakit-dalam';

  return {
    ...s,
    isAvailable: s.isAvailable,
    specializationCode: specCode,
    availability: s.isAvailable ? 'today' : 'unavailable',
    avatarBg: 'var(--color-primary-100)',
    avatarColor: 'var(--color-primary-700)',
    experience: '10+ Tahun',
    education: 'Universitas Indonesia',
    bio: `Dr. ${s.name} adalah seorang dokter spesialis yang berdedikasi tinggi memberikan pelayanan terbaik untuk kesehatan Anda.`,
    todaySchedule: s.isAvailable ? '10:00 - 14:00' : null
  } as Doctor;
}
