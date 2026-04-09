import DoctorsPageClient from './DoctorsPageClient';

export const metadata = {
  title: 'Dokter Spesialis',
  description:
    'Temukan dokter spesialis RS Bhayangkara Nganjuk — lebih dari 32 dokter spesialis di 10 poli klinik. Cek ketersediaan dan jadwal praktik.',
  keywords: ['dokter spesialis nganjuk', 'dokter jantung nganjuk', 'dokter anak nganjuk', 'rs bhayangkara nganjuk dokter'],
};

import { getDoctors } from '@/lib/data/doctors';

export default async function DoctorsPage() {
  const doctors = await getDoctors();
  return <DoctorsPageClient initialDoctors={doctors} />;
}
