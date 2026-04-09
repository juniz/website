import { createClient } from '@/utils/supabase/static';
import { scheduleFilters, getScheduleStatus } from './shared';

export { scheduleFilters, getScheduleStatus };

export async function getSchedules() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const supabase = createClient();

  const { data: schedules } = await supabase
    .from('schedules')
    .select('*, doctor:doctors(*)')
    .gte('date', today.toISOString())
    .order('time', { ascending: true });
    
  const items = schedules || [];

  return items.map(s => {
    const doc = Array.isArray(s.doctor) ? s.doctor[0] : s.doctor;
    return {
      ...s,
      totalQuota: s.total_quota,
      filledQuota: s.filled_quota,
      doctorId: s.doctor_id,
      doctorName: doc?.name || '',
      specialization: doc?.specialization || '',
      specializationCode: doc?.specialization?.toLowerCase().includes('jantung') ? 'jantung' :
                          doc?.specialization?.toLowerCase().includes('anak') ? 'anak' :
                          doc?.specialization?.toLowerCase().includes('kandungan') ? 'kandungan' :
                          doc?.specialization?.toLowerCase().includes('bedah') ? 'bedah' : 'all'
    };
  });
}

// Utility remains exported from shared, no local copy needed here for build safety

