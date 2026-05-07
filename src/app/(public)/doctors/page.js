import DoctorsPageClient from './DoctorsPageClient';

import { getPageSEO } from '@/app/actions/public';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';

export async function generateMetadata() {
  const seo = await getPageSEO('/doctors');
  const title = seo?.meta_title || 'Dokter Spesialis — RS Bhayangkara Nganjuk';
  const description = seo?.meta_description || 'Temukan dokter spesialis RS Bhayangkara Nganjuk — lebih dari 32 dokter spesialis di 10 poli klinik. Cek ketersediaan dan jadwal praktik.';
  const ogImageUrl = seo?.og_image ? getImageUrl(seo.og_image) : 'https://rsbhayangkara-nganjuk.id/og-doctors.jpg';

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
import { getImageUrl } from '@/lib/utils';

export default async function DoctorsPage() {
  const [doctors, seo] = await Promise.all([
    getDoctors(),
    getPageSEO('/doctors')
  ]);

  if (seo && seo.isActive === false) {
    notFound();
  }

  const medicalTeamSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: 'Dokter Spesialis RS Bhayangkara Nganjuk',
    description: 'Daftar dokter spesialis dan jadwal praktik di RS Bhayangkara Nganjuk.',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: doctors.map((d, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Physician',
          name: d.name,
          medicalSpecialty: d.specialization,
          affiliation: {
            '@type': 'Hospital',
            name: 'RS Bhayangkara Nganjuk'
          }
        }
      }))
    }
  };

  return (
    <>
      <JsonLd data={medicalTeamSchema} />
      <DoctorsPageClient initialDoctors={doctors} />
    </>
  );
}
