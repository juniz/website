import { api } from '@/lib/api';
import { scheduleFilters, getScheduleStatus } from './shared';

export { scheduleFilters, getScheduleStatus };

export async function getSchedules() {
  const result = await api.get('/schedules?limit=100', { cache: 'no-store' });
  
  // Handle nested paginated structure: { success: true, data: { data: { data: [], meta: {} } } }
  // TransformInterceptor wraps the response in { data: ... }
  // Our service returns { data: [], meta: {} }
  const items = result.success ? (result.data.data?.data || result.data.data || result.data) : [];

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
