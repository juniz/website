import SchedulePageClient from './SchedulePageClient';

export async function generateMetadata() {
  const seo = await getPageSEO('/schedule');
  
  return {
    title: seo?.meta_title || 'Jadwal Praktik Dokter — RS Bhayangkara Nganjuk',
    description: seo?.meta_description || 'Cek jadwal praktik dokter spesialis RS Bhayangkara Nganjuk. Lihat ketersediaan dan daftar langsung dengan konfirmasi WhatsApp.',
    keywords: seo?.meta_keywords || ['jadwal dokter nganjuk', 'jadwal poli rs bhayangkara'],
    openGraph: {
      title: seo?.meta_title,
      description: seo?.meta_description,
      images: [{ url: seo?.og_image || '/og-schedule.jpg' }],
    },
  };
}

export const dynamic = 'force-dynamic';

import { getSchedules } from '@/lib/data/schedule';
import { getPageSEO } from '@/app/actions/public';
import { notFound } from 'next/navigation';

export default async function SchedulePage() {
  const [schedules, seo] = await Promise.all([
    getSchedules(),
    getPageSEO('/schedule')
  ]);

  if (seo && seo.isActive === false) {
    notFound();
  }

  console.log('Public Schedule Page - Schedules Count:', schedules.length);
  return <SchedulePageClient initialSchedules={schedules} />;
}
