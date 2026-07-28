import { getTerms } from '@/app/actions/pre-registration';
import ConsentForm from './ConsentForm';
import { CheckCircle2, Lock, FileText, ArrowLeft, ShieldCheck } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pendaftaran Pasien Online | RS Bhayangkara Nganjuk',
  description:
    'Pendaftaran dan pre-registrasi pasien online RS Bhayangkara Nganjuk. Daftar dari rumah, hemat waktu antrean.',
};

export default async function PendaftaranPage() {
  const termsData = await getTerms();

  const terms = termsData || {
    version: 'v1.0',
    points: [
      'Data pribadi yang Anda berikan akan digunakan hanya untuk keperluan pelayanan kesehatan.',
      'Data tidak akan diberikan kepada pihak ketiga tanpa persetujuan Anda.',
    ],
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-neutral-50)' }}>

      {/* ── MOBILE NATIVE APP VIEW (< 640px) ── */}
      <div className="terms-mobile-container">
        {/* Sticky Mobile App Top Bar */}
        <header className="terms-mobile-topbar">
          <Link href="/" className="terms-mobile-back" aria-label="Kembali ke Beranda">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="terms-mobile-topbar-title">Syarat &amp; Ketentuan</h1>
          <span className="terms-mobile-version-badge">
            v{terms.version}
          </span>
        </header>

        {/* Compact Settings-Style Terms Content */}
        <div className="terms-mobile-body">
          {/* Section Header Label */}
          <div className="terms-mobile-section-label">
            PRIVASI &amp; SYARAT PENDAFTARAN
          </div>

          {/* Settings Group List Container */}
          <div className="terms-mobile-card">
            {terms.points.map((point, index) => (
              <div key={index} className="terms-mobile-item">
                <div className="terms-mobile-item-icon">
                  <CheckCircle2 size={16} style={{ color: 'var(--color-primary-600)' }} />
                </div>
                <div className="terms-mobile-item-content">
                  <p className="terms-mobile-item-text">{point}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Compact Trust Card */}
          <div className="terms-mobile-trust-strip">
            <ShieldCheck size={16} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
            <p className="terms-mobile-trust-text">
              Data terenkripsi &amp; hanya diakses tenaga medis RS Bhayangkara Nganjuk.
            </p>
          </div>

          {/* Consent Selection & Form */}
          <div style={{ marginTop: '1.25rem' }}>
            <ConsentForm />
          </div>
        </div>
      </div>


      {/* ── DESKTOP WEB VIEW (≥ 640px) ── */}
      <div className="terms-desktop-container">
        {/* ── Page Header ── */}
        <PageHero
          breadcrumb="Pendaftaran"
          title="Pendaftaran Pasien Online"
          subtitle="Daftarkan diri dari rumah dan hemat waktu antrean. Baca dan setujui syarat &amp; ketentuan sebelum melanjutkan."
        >
          {/* Step indicators */}
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            {[
              { num: '1', label: 'Baca S&K' },
              { num: '2', label: 'Isi Formulir' },
              { num: '3', label: 'Terima QR' },
            ].map((step) => (
              <div key={step.num} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--color-primary-400)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-figtree)',
                  flexShrink: 0,
                }}>
                  {step.num}
                </span>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                  {step.label}
                </span>
                {step.num !== '3' && (
                  <span style={{ width: '24px', height: '1px', background: 'rgba(255,255,255,0.2)', display: 'block' }} />
                )}
              </div>
            ))}
          </div>
        </PageHero>

        {/* ── Content Card ── */}
        <section style={{ paddingTop: '2.5rem', paddingBottom: '6rem' }}>
          <div className="container-site" style={{ maxWidth: '780px' }}>

            <div style={{
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(4, 44, 83, 0.1)',
              border: '1px solid var(--color-neutral-200)',
              overflow: 'hidden',
            }}>

              {/* Card Header */}
              <div style={{
                background: 'linear-gradient(to bottom, var(--color-primary-50), #ffffff)',
                borderBottom: '1px solid var(--color-primary-100)',
                padding: '2rem 2.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.25rem',
              }}>
                <div style={{
                  flexShrink: 0,
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'var(--color-primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(24, 95, 165, 0.3)',
                }}>
                  <FileText size={22} style={{ color: '#fff' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h2 style={{
                      fontSize: '1.375rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-figtree)',
                      color: 'var(--color-primary-900)',
                      letterSpacing: '-0.02em',
                      margin: 0,
                    }}>
                      Syarat &amp; Ketentuan
                    </h2>
                    <span style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      color: 'var(--color-primary-600)',
                      background: 'var(--color-primary-50)',
                      border: '1px solid var(--color-primary-100)',
                      borderRadius: '999px',
                      padding: '0.25rem 0.875rem',
                      fontFamily: 'var(--font-figtree)',
                    }}>
                      Versi {terms.version}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--color-neutral-500)', marginTop: '0.375rem', lineHeight: 1.5 }}>
                    Persetujuan penggunaan data pribadi untuk keperluan rekam medis.
                  </p>
                </div>
              </div>

              {/* Terms Body */}
              <div style={{ padding: '2rem 2.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
                  {terms.points.map((point, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'flex-start',
                        padding: '1rem 1.25rem',
                        borderRadius: '12px',
                        border: '1px solid var(--color-neutral-100)',
                        background: 'var(--color-neutral-50)',
                        transition: 'border-color 200ms ease, background 200ms ease',
                      }}
                      className="terms-item"
                    >
                      <div style={{ flexShrink: 0, marginTop: '1px' }}>
                        <CheckCircle2 size={18} style={{ color: 'var(--color-primary-400)' }} />
                      </div>
                      <p style={{
                        fontSize: '0.9375rem',
                        color: 'var(--color-neutral-700)',
                        lineHeight: 1.7,
                        margin: 0,
                      }}>
                        {point}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Trust strip */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1.25rem',
                  background: 'var(--color-primary-50)',
                  border: '1px solid var(--color-primary-100)',
                  borderRadius: '10px',
                  marginBottom: '2.5rem',
                }}>
                  <Lock size={15} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                  <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-primary-700)', margin: 0, lineHeight: 1.4, fontFamily: 'var(--font-figtree)' }}>
                    Data Anda terenkripsi dan hanya diakses oleh tenaga medis yang berwenang di RS Bhayangkara Nganjuk.
                  </p>
                </div>

                {/* Consent Form */}
                <ConsentForm />
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        /* Responsive View Controls */
        .terms-mobile-container {
          display: block;
          padding-bottom: 2rem;
        }

        .terms-desktop-container {
          display: none;
        }

        @media (min-width: 640px) {
          .terms-mobile-container {
            display: none;
          }
          .terms-desktop-container {
            display: block;
          }
        }

        /* Mobile Native App Styling */
        .terms-mobile-topbar {
          position: sticky;
          top: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 52px;
          padding: 0 1rem;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--color-neutral-200);
        }

        .terms-mobile-back {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          border: 1px solid var(--color-neutral-200);
          background: #fff;
          color: var(--color-primary-900);
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .terms-mobile-back:active {
          transform: scale(0.94);
          background: var(--color-primary-50);
        }

        .terms-mobile-topbar-title {
          font-size: 0.9375rem;
          font-weight: 800;
          color: var(--color-primary-900);
          font-family: var(--font-figtree);
          margin: 0;
        }

        .terms-mobile-version-badge {
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--color-primary-600);
          background: var(--color-primary-50);
          border: 1px solid var(--color-primary-100);
          border-radius: 999px;
          padding: 2px 8px;
          font-family: var(--font-figtree);
        }

        .terms-mobile-body {
          padding: 1.25rem 1rem;
        }

        .terms-mobile-section-label {
          font-size: 0.6875rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--color-neutral-600);
          font-family: var(--font-figtree);
          margin-bottom: 0.5rem;
          padding-left: 0.25rem;
        }

        .terms-mobile-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid var(--color-neutral-200);
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .terms-mobile-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          border-bottom: 1px solid var(--color-neutral-100);
        }

        .terms-mobile-item:last-child {
          border-bottom: none;
        }

        .terms-mobile-item-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .terms-mobile-item-content {
          flex: 1;
        }

        .terms-mobile-item-text {
          font-size: 0.875rem;
          color: var(--color-neutral-800);
          line-height: 1.5;
          margin: 0;
        }

        .terms-mobile-trust-strip {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          margin-top: 0.875rem;
          padding: 0.75rem 1rem;
          background: var(--color-primary-50);
          border: 1px solid var(--color-primary-100);
          border-radius: 12px;
        }

        .terms-mobile-trust-text {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-primary-900);
          margin: 0;
          line-height: 1.4;
          font-family: var(--font-figtree);
        }

        .terms-item:hover {
          border-color: var(--color-primary-200);
          background: var(--color-primary-50);
        }
      `}</style>
    </main>
  );
}
