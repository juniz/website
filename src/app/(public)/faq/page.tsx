export const dynamic = 'force-dynamic';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import FAQSection from '@/components/FAQSection';
import { getPublicFAQs, getPageSEO } from '@/app/actions/public';
import PageHero from '@/components/PageHero';
import { getImageUrl } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { FAQ } from '@/types/api';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO('/faq');
  const title = seo?.meta_title || 'FAQ — RS Bhayangkara Nganjuk';
  const description = seo?.meta_description || 'Temukan jawaban atas pertanyaan umum seputar layanan, pendaftaran, jadwal dokter, dan fasilitas RS Bhayangkara Nganjuk.';
  const ogImageUrl = seo?.og_image ? getImageUrl(seo.og_image) : 'https://rsbhayangkaranganjuk.com/og-faq.jpg';

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

const faqSchema = (faqs: FAQ[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.answer,
    },
  })),
});

export default async function FAQPage() {
  const [faqs, seo] = await Promise.all([
    getPublicFAQs(),
    getPageSEO('/faq')
  ]);

  if (seo && seo.is_active === false) {
    notFound();
  }

  return (
    <>
      {faqs.length > 0 && <JsonLd data={faqSchema(faqs)} />}

      {/* ── Header ───────────────────────────────────── */}
      <PageHero
        breadcrumb="FAQ"
        title="Pertanyaan yang Sering Diajukan"
        subtitle={
          faqs.length > 0
            ? `${faqs.length} pertanyaan tersedia — temukan jawaban yang Anda cari`
            : 'Hubungi kami jika ada pertanyaan'
        }
      />

      {/* ── FAQ Accordion ────────────────────────────── */}
      {faqs.length > 0 ? (
        <FAQSection data={faqs} compact={false} />
      ) : (
        <div className="container-site" style={{ paddingBlock: '4rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-neutral-500)', fontSize: '0.9375rem' }}>
            Belum ada pertanyaan yang tersedia saat ini.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              marginTop: '1rem', color: 'var(--color-primary-600)',
              fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem',
            }}
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      )}
    </>
  );
}
