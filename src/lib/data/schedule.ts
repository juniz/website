import { api } from '@/lib/api';
import { scheduleFilters, getScheduleStatus } from './shared';
import { DoctorSchedule } from '@/types/api';

export { scheduleFilters, getScheduleStatus };

export async function getSchedules(): Promise<DoctorSchedule[]> {
  const result = await api.get<any>('/schedules?limit=100', { cache: 'no-store' });
  
  // Handle nested paginated structure
  const rawData: any = result.success ? (result.data as any)?.data || result.data : [];
  const items: any[] = Array.isArray(rawData) ? rawData : (rawData?.data || []);

  return items.map((s: any): DoctorSchedule => {
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
