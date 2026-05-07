import RegisterPageClient from './RegisterPageClient';

export async function generateMetadata() {
  const seo = await getPageSEO('/register');
  const title = seo?.meta_title || 'Pendaftaran Online — RS Bhayangkara Nganjuk';
  const description = seo?.meta_description || 'Daftar berobat online di RS Bhayangkara Nganjuk. Pilih dokter, tentukan jadwal, dan dapatkan konfirmasi via WhatsApp — tanpa antri panjang.';
  const ogImageUrl = seo?.og_image ? getImageUrl(seo.og_image) : 'https://rsbhayangkaranganjuk.com/og-register.jpg';

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

import { getDoctors } from '@/lib/data/doctors';
import { getSchedules } from '@/lib/data/schedule';
import { getPageSEO } from '@/app/actions/public';
import { notFound } from 'next/navigation';
import { getImageUrl } from '@/lib/utils';

export default async function RegisterPage() {
  const [doctors, schedules, seo] = await Promise.all([
    getDoctors(),
    getSchedules(),
    getPageSEO('/register')
  ]);

  if (seo && seo.is_active === false) {
    notFound();
  }

  return <RegisterPageClient initialDoctors={doctors} initialSchedules={schedules} />;
}
