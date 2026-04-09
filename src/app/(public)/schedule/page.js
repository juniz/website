import SchedulePageClient from './SchedulePageClient';

export const metadata = {
  title: 'Jadwal Dokter',
  description:
    'Cek jadwal praktik dokter spesialis RS Bhayangkara Nganjuk. Lihat ketersediaan dan daftar langsung dengan konfirmasi WhatsApp.',
  keywords: ['jadwal dokter nganjuk', 'jadwal poli rs bhayangkara nganjuk', 'jadwal praktek dokter nganjuk'],
};

import { getSchedules } from '@/lib/data/schedule';

export default async function SchedulePage() {
  const schedules = await getSchedules();
  return <SchedulePageClient initialSchedules={schedules} />;
}
