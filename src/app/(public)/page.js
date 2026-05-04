import HeroSection from '@/components/HeroSection';
import ServiceGrid from '@/components/ServiceGrid';
import DoctorPreview from '@/components/DoctorPreview';
import SchedulePreview from '@/components/SchedulePreview';
import CTABanner from '@/components/CTABanner';
import TestimonialSection from '@/components/TestimonialSection';
import FAQSection from '@/components/FAQSection';
import NewsPreview from '@/components/NewsPreview';
import JsonLd from '@/components/JsonLd';
import { getHeroSettings, getPublicServices, getPageSEO, getPublicTestimonials, getPublicFAQs } from '@/app/actions/public';

/* ============================================================
   Landing Page — RSC (React Server Components)
   ============================================================ */

export async function generateMetadata() {
  const seo = await getPageSEO('/');
  
  return {
    title: seo?.meta_title || 'RS Bhayangkara Nganjuk — Layanan Kesehatan Terpercaya',
    description: seo?.meta_description || 'Rumah sakit terakreditasi dengan 32+ dokter spesialis di Nganjuk. Daftar online, cek jadwal dokter, dan layanan IGD 24 jam.',
    keywords: seo?.meta_keywords || [
      'rumah sakit Nganjuk',
      'RS Bhayangkara Nganjuk',
      'dokter spesialis',
    ],
    openGraph: {
      title: seo?.meta_title,
      description: seo?.meta_description,
      images: [{ url: seo?.og_image || '/og-home.jpg', width: 1200, height: 630 }],
      type: 'website',
    },
  };
}

export default async function HomePage() {
  const [heroSettings, services, testimonials, faqs] = await Promise.all([
    getHeroSettings(),
    getPublicServices(),
    getPublicTestimonials(),
    getPublicFAQs(),
  ]);

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
      'Cardiology', 'Pediatrics', 'GeneralSurgery', 'Neurology', 'Obstetrics', 'Ophthalmology',
    ],
    numberOfBeds: 120,
    availableService: services.map(s => ({ '@type': 'MedicalTherapy', name: s.name })),
  };

  return (
    <>
      <JsonLd data={hospitalSchema} />

      {/* Hero Section */}
      <HeroSection data={heroSettings} />

      {/* Layanan Unggulan */}
      <ServiceGrid data={services} />

      {/* Preview Dokter */}
      <DoctorPreview />

      {/* Preview Jadwal */}
      <SchedulePreview />

      {/* CTA Pendaftaran */}
      <CTABanner />

      {/* Testimoni Section */}
      <TestimonialSection data={testimonials} />

      {/* FAQ Section */}
      <FAQSection data={faqs} compact={true} />

      {/* Preview Berita */}
      <NewsPreview />
    </>
  );
}
