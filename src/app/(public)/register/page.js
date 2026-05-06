import RegisterPageClient from './RegisterPageClient';

export async function generateMetadata() {
  const seo = await getPageSEO('/register');
  
  return {
    title: seo?.meta_title || 'Pendaftaran Online — RS Bhayangkara Nganjuk',
    description: seo?.meta_description || 'Daftar berobat online di RS Bhayangkara Nganjuk. Pilih dokter, tentukan jadwal, dan dapatkan konfirmasi via WhatsApp — tanpa antri panjang.',
    keywords: seo?.meta_keywords || ['daftar online rs bhayangkara', 'pendaftaran rs nganjuk'],
    openGraph: {
      title: seo?.meta_title,
      description: seo?.meta_description,
      images: [{ url: seo?.og_image || '/og-register.jpg' }],
    },
  };
}

import { getDoctors } from '@/lib/data/doctors';
import { getSchedules } from '@/lib/data/schedule';
import { getPageSEO } from '@/app/actions/public';
import { notFound } from 'next/navigation';

export default async function RegisterPage() {
  const [doctors, schedules, seo] = await Promise.all([
    getDoctors(),
    getSchedules(),
    getPageSEO('/register')
  ]);

  if (seo && seo.isActive === false) {
    notFound();
  }

  return <RegisterPageClient initialDoctors={doctors} initialSchedules={schedules} />;
}
