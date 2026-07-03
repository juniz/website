import { getTerms } from '@/app/actions/pre-registration';
import ConsentForm from './ConsentForm';
import { CheckCircle2, Lock, FileText } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Metadata } from 'next';

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

      {/* ── Page Header ── */}
      <PageHero
        breadcrumb="Pendaftaran"
        title="Pendaftaran Pasien Online"
        subtitle="Daftarkan diri dari rumah dan hemat waktu antrean. Baca dan setujui syarat & ketentuan sebelum melanjutkan."
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

      <style>{`
        .terms-item:hover {
          border-color: var(--color-primary-200);
          background: var(--color-primary-50);
        }
      `}</style>
    </main>
  );
}
