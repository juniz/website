import HeroSection from '@/components/HeroSection';
import ServiceGrid from '@/components/ServiceGrid';
import DoctorPreview from '@/components/DoctorPreview';
import SchedulePreview from '@/components/SchedulePreview';
import CTABanner from '@/components/CTABanner';
import TestimonialSection from '@/components/TestimonialSection';
import FAQSection from '@/components/FAQSection';
import NewsPreview from '@/components/NewsPreview';
import PartnerSection from '@/components/PartnerSection';
import JsonLd from '@/components/JsonLd';
import { getHeroSettings, getPublicServices, getPageSEO, getPublicTestimonials, getPublicFAQs, getPublicPartners } from '@/app/actions/public';
import { getOgImageUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

/* ============================================================
   Landing Page — RSC (React Server Components)
   Scroll-reveal animations via ScrollReveal client wrapper.
   ============================================================ */

export async function generateMetadata() {
  const seo = await getPageSEO('/');
  const baseUrl = 'https://rsbhayangkaranganjuk.com';
  
  // Format OG image URL to be absolute and proxied if needed
  const ogImageUrl = seo?.ogImage 
    ? getOgImageUrl(seo.ogImage, baseUrl)
    : `${baseUrl}/og-home.jpg`;
  
  return {
    title: seo?.title || 'RS Bhayangkara Nganjuk — Layanan Kesehatan Terpercaya',
    description: seo?.description || 'Rumah sakit terakreditasi dengan 32+ dokter spesialis di Nganjuk. Daftar online, cek jadwal dokter, dan layanan IGD 24 jam.',
    keywords: seo?.keywords || [
      'rumah sakit Nganjuk',
      'RS Bhayangkara Nganjuk',
      'dokter spesialis',
    ],
    openGraph: {
      title: seo?.title,
      description: seo?.description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: 'website',
    },
  };
}

export default async function HomePage() {
  const [heroSettings, services, testimonials, faqs, partners] = await Promise.all([
    getHeroSettings(),
    getPublicServices(),
    getPublicTestimonials(),
    getPublicFAQs(),
    getPublicPartners(),
  ]);

  /* JSON-LD: MedicalOrganization + Hospital */
  const baseUrl = 'https://rsbhayangkaranganjuk.com';

  /* JSON-LD: MedicalOrganization + Hospital */
  const hospitalSchema = {
    '@context': 'https://schema.org',
    '@type': ['MedicalOrganization', 'Hospital'],
    name: 'RS Bhayangkara Nganjuk',
    url: baseUrl,
    logo: `${baseUrl}/icon.png`,
    image: `${baseUrl}/og-home.jpg`,
    telephone: '+62 812-1683-1605', // Sesuaikan dengan nomor asli jika ada
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Abdurahman Saleh VI No.56, Kauman, Kec. Nganjuk',
      addressLocality: 'Nganjuk',
      addressRegion: 'Jawa Timur',
      postalCode: '64411',
      addressCountry: 'ID',
    },
    openingHours: ['Mo-Su 00:00-23:59'], // IGD 24 Jam
    hasMap: 'https://maps.google.com/?q=RS+Bhayangkara+Nganjuk',
    medicalSpecialty: [
      'Cardiology', 'Pediatrics', 'GeneralSurgery', 'Neurology', 'Obstetrics', 'Ophthalmology',
    ],
    numberOfBeds: 120,
    availableService: services.map(s => ({ '@type': 'MedicalTherapy', name: s.name })),
  };

  /* JSON-LD: WebSite for Sitelinks Searchbox & Navigation */
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RS Bhayangkara Nganjuk',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <JsonLd data={hospitalSchema} />
      <JsonLd data={websiteSchema} />

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

      {/* Mitra & Asuransi — trustworthy azure-blue partners grid */}
      {partners.length > 0 && (
        <ScrollReveal variant="fade-up" threshold={0.06}>
          <PartnerSection data={partners} />
        </ScrollReveal>
      )}

      {/* Preview Berita — fade-up last */}
      <ScrollReveal variant="fade-up" threshold={0.06}>
        <NewsPreview />
      </ScrollReveal>
    </>
  );
}
