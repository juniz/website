import SchedulePageClient from './SchedulePageClient';
import { getLiveSchedules } from '@/lib/data/schedule';
import { getPageSEO } from '@/app/actions/public';
import { notFound } from 'next/navigation';
import { getImageUrl } from '@/lib/utils';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO('/schedule');
  const title = seo?.meta_title || 'Jadwal Praktik Dokter — RS Bhayangkara Nganjuk';
  const description = seo?.meta_description || 'Cek jadwal praktik dokter spesialis RS Bhayangkara Nganjuk. Lihat ketersediaan dan daftar langsung dengan konfirmasi WhatsApp.';
  const ogImageUrl = seo?.og_image ? getImageUrl(seo.og_image) : 'https://rsbhayangkaranganjuk.com/og-schedule.jpg';

  return {
    title: { absolute: title },
    description,
    keywords: seo?.meta_keywords || [],
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl || '', width: 1200, height: 630 }],
      type: 'website',
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function SchedulePage() {
  const todayStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
  }).format(new Date());

  const [schedules, seo] = await Promise.all([
    getLiveSchedules(todayStr),
    getPageSEO('/schedule'),
  ]);

  if (seo && seo.is_active === false) {
    notFound();
  }

  return <SchedulePageClient initialSchedules={schedules} />;
}
