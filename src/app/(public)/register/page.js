import RegisterPageClient from './RegisterPageClient';

export const metadata = {
  title: 'Daftar Online',
  description:
    'Daftar berobat online di RS Bhayangkara Nganjuk. Pilih dokter, tentukan jadwal, dan dapatkan konfirmasi via WhatsApp — tanpa antri panjang.',
  keywords: ['daftar online rs bhayangkara nganjuk', 'pendaftaran online rumah sakit nganjuk', 'bpjs nganjuk'],
};

import { getDoctors } from '@/lib/data/doctors';
import { getSchedules } from '@/lib/data/schedule';

export default async function RegisterPage() {
  const [doctors, schedules] = await Promise.all([
    getDoctors(),
    getSchedules()
  ]);
  return <RegisterPageClient initialDoctors={doctors} initialSchedules={schedules} />;
}
