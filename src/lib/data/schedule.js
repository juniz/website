import { api } from '@/lib/api';
import { scheduleFilters, getScheduleStatus } from './shared';

export { scheduleFilters, getScheduleStatus };

export async function getSchedules() {
  const result = await api.get('/schedules', { cache: 'no-store' });
  
  // Karena backend ada TransformInterceptor, data asli ada di dalam property 'data'
  const items = result.success ? (result.data.data || result.data) : [];

  return items.map(s => {
    // Backend kita menggunakan properti 'doctor' (singular) dan camelCase
    const doc = s.doctor;
    return {
      ...s,
      totalQuota: s.totalQuota,
      filledQuota: s.filledQuota,
      doctorId: s.doctorId,
      doctorName: doc?.name || '',
      specialization: doc?.specialization || '',
      specializationCode: doc?.specialization?.toLowerCase().includes('jantung') ? 'jantung' :
                          doc?.specialization?.toLowerCase().includes('anak') ? 'anak' :
                          doc?.specialization?.toLowerCase().includes('kandungan') ? 'kandungan' :
                          doc?.specialization?.toLowerCase().includes('bedah') ? 'bedah' : 'all'
    };
  });
}
