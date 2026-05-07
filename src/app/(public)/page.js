import HeroSection from '@/components/HeroSection';
import ServiceGrid from '@/components/ServiceGrid';
import DoctorPreview from '@/components/DoctorPreview';
import SchedulePreview from '@/components/SchedulePreview';
import CTABanner from '@/components/CTABanner';
import TestimonialSection from '@/components/TestimonialSection';
import FAQSection from '@/components/FAQSection';
import NewsPreview from '@/components/NewsPreview';
import JsonLd from '@/components/JsonLd';
import ScrollReveal from '@/components/ScrollReveal';
import { getImageUrl } from '@/lib/utils';
import { getHeroSettings, getPublicServices, getPageSEO, getPublicTestimonials, getPublicFAQs } from '@/app/actions/public';

/* ============================================================
   Landing Page — RSC (React Server Components)
   Scroll-reveal animations via ScrollReveal client wrapper.
   ============================================================ */

export async function generateMetadata() {
  const seo = await getPageSEO('/');
  const title = seo?.meta_title || 'RS Bhayangkara Nganjuk — Layanan Kesehatan Terpercaya';
  const description = seo?.meta_description || 'Rumah sakit terakreditasi dengan 32+ dokter spesialis di Nganjuk. Daftar online, cek jadwal dokter, dan layanan IGD 24 jam.';
  const ogImageUrl = seo?.og_image ? getImageUrl(seo.og_image) : 'https://rsbhayangkaranganjuk.com/og-home.jpg';

  return {
    title: { absolute: title },
    description,
    keywords: seo?.meta_keywords || [
      'rumah sakit Nganjuk',
      'RS Bhayangkara Nganjuk',
      'dokter spesialis',
    ],
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
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
    url: 'https://rsbhayangkaranganjuk.com',
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

      {/* Hero — above-the-fold, CSS-only entrance (no observer needed) */}
      <HeroSection data={heroSettings} />

      {/* Layanan Unggulan — fades up as user scrolls down */}
      <ScrollReveal variant="fade-up" threshold={0.08}>
        <ServiceGrid data={services} />
      </ScrollReveal>

      {/* Preview Dokter — slides in from left */}
      <ScrollReveal variant="fade-right" threshold={0.06}>
        <DoctorPreview />
      </ScrollReveal>

      {/* Preview Jadwal — slides in from right */}
      <ScrollReveal variant="fade-left" threshold={0.06}>
        <SchedulePreview />
      </ScrollReveal>

      {/* CTA Pendaftaran */}
      {/* <ScrollReveal variant="zoom" threshold={0.15}>
        <CTABanner />
      </ScrollReveal> */}

      {/* Testimoni — zoom-in for impactful reveal */}
      <ScrollReveal variant="zoom" threshold={0.08}>
        <TestimonialSection data={testimonials} />
      </ScrollReveal>

      {/* FAQ — simple fade-up */}
      <ScrollReveal variant="fade-up" threshold={0.06}>
        <FAQSection data={faqs} compact={true} />
      </ScrollReveal>

      {/* Preview Berita — fade-up last */}
      <ScrollReveal variant="fade-up" threshold={0.06}>
        <NewsPreview />
      </ScrollReveal>
    </>
  );
}
