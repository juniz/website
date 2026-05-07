import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import FAQSection from '@/components/FAQSection';
import { getPublicFAQs } from '@/app/actions/public';

import { getPageSEO } from '@/app/actions/public';
import { notFound } from 'next/navigation';
import { getImageUrl } from '@/lib/utils';

export async function generateMetadata() {
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
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: 'website',
    },
  };
}

const faqSchema = (faqs) => ({
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
      <section style={{
        background: 'var(--color-primary-800)',
        paddingBlock: '2.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div className="container-site">
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1rem' }}>
            <ol style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              listStyle: 'none', fontSize: '0.75rem', color: 'var(--color-primary-200)',
            }}>
              <li>
                <Link href="/" style={{ color: 'var(--color-primary-200)', textDecoration: 'none' }}>
                  Beranda
                </Link>
              </li>
              <li aria-hidden="true">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </li>
              <li aria-current="page" style={{ color: 'var(--color-primary-50)' }}>
                FAQ
              </li>
            </ol>
          </nav>

          <h1 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700,
            color: 'var(--color-primary-50)',
            fontFamily: 'var(--font-figtree, Figtree, sans-serif)',
            marginBottom: '0.375rem',
          }}>
            Pertanyaan yang Sering Diajukan
          </h1>
          <p style={{ color: 'var(--color-primary-200)', fontSize: '0.9375rem' }}>
            {faqs.length > 0
              ? `${faqs.length} pertanyaan tersedia — temukan jawaban yang Anda cari`
              : 'Hubungi kami jika ada pertanyaan'}
          </p>
        </div>
      </section>

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
