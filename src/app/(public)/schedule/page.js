import SchedulePageClient from './SchedulePageClient';

export async function generateMetadata() {
  const seo = await getPageSEO('/schedule');
  const title = seo?.meta_title || 'Jadwal Praktik Dokter — RS Bhayangkara Nganjuk';
  const description = seo?.meta_description || 'Cek jadwal praktik dokter spesialis RS Bhayangkara Nganjuk. Lihat ketersediaan dan daftar langsung dengan konfirmasi WhatsApp.';
  const ogImageUrl = seo?.og_image ? getImageUrl(seo.og_image) : 'https://rsbhayangkara-nganjuk.id/og-schedule.jpg';

  return {
    title: { absolute: title },
    description,
    keywords: seo?.meta_keywords || [],
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: 'website',
    },
  };
}

export const dynamic = 'force-dynamic';

import { getSchedules } from '@/lib/data/schedule';
import { getPageSEO } from '@/app/actions/public';
import { notFound } from 'next/navigation';
import { getImageUrl } from '@/lib/utils';

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
