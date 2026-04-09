import HeroSection from '@/components/HeroSection';
import ServiceGrid from '@/components/ServiceGrid';
import DoctorPreview from '@/components/DoctorPreview';
import SchedulePreview from '@/components/SchedulePreview';
import CTABanner from '@/components/CTABanner';
import NewsPreview from '@/components/NewsPreview';
import JsonLd from '@/components/JsonLd';

/* ============================================================
   Landing Page — SSG (Static Site Generation)
   SEO Priority: TINGGI — target keyword "rumah sakit Nganjuk terpercaya"
   ============================================================ */

export const metadata = {
  title: 'RS Bhayangkara Nganjuk — Layanan Kesehatan Terpercaya',
  description:
    'Rumah sakit terakreditasi dengan 32+ dokter spesialis di Nganjuk. ' +
    'Daftar online, cek jadwal dokter, dan layanan IGD 24 jam.',
  keywords: [
    'rumah sakit Nganjuk',
    'RS Bhayangkara Nganjuk',
    'dokter spesialis Nganjuk',
    'IGD 24 jam Nganjuk',
    'jadwal dokter Nganjuk',
    'daftar online rumah sakit Nganjuk',
    'rumah sakit terpercaya Nganjuk',
  ],
  openGraph: {
    title: 'RS Bhayangkara Nganjuk — Layanan Kesehatan Terpercaya',
    description:
      'Daftar online, cek jadwal dokter spesialis, dan layanan IGD 24 jam di RS Bhayangkara Nganjuk.',
    images: [{ url: '/og-home.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://rsbhayangkara-nganjuk.id',
  },
};

/* JSON-LD: MedicalOrganization + Hospital */
const hospitalSchema = {
  '@context': 'https://schema.org',
  '@type': ['MedicalOrganization', 'Hospital'],
  name: 'RS Bhayangkara Nganjuk',
  url: 'https://rsbhayangkara-nganjuk.id',
  telephone: '+62-358-XXXXXX',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jl. Ahmad Yani No. 1',
    addressLocality: 'Nganjuk',
    addressRegion: 'Jawa Timur',
    postalCode: '64418',
    addressCountry: 'ID',
  },
  openingHours: ['Mo-Fr 07:00-21:00', 'Sa-Su 08:00-14:00'],
  hasMap: 'https://maps.google.com/?q=RS+Bhayangkara+Nganjuk',
  medicalSpecialty: [
    'Cardiology',
    'Pediatrics',
    'GeneralSurgery',
    'Neurology',
    'Obstetrics',
    'Ophthalmology',
  ],
  numberOfBeds: 120,
  availableService: [
    { '@type': 'MedicalTherapy', name: 'IGD 24 Jam' },
    { '@type': 'MedicalTherapy', name: 'Rawat Inap' },
    { '@type': 'MedicalTherapy', name: 'Rawat Jalan' },
    { '@type': 'MedicalTherapy', name: 'Radiologi & CT Scan' },
  ],
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={hospitalSchema} />

      {/* Hero Section */}
      <HeroSection />

      {/* Layanan Unggulan */}
      <ServiceGrid />

      {/* Preview Dokter */}
      <DoctorPreview />

      {/* Preview Jadwal */}
      <SchedulePreview />

      {/* CTA Pendaftaran */}
      <CTABanner />

      {/* Preview Berita */}
      <NewsPreview />
    </>
  );
}
