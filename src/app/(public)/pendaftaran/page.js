import { getTerms } from '@/app/actions/pre-registration';
import ConsentForm from './ConsentForm';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, Lock, FileText } from 'lucide-react';

export const metadata = {
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

      {/* ── Hero Header ── */}
      <section style={{
        background: 'linear-gradient(165deg, var(--color-primary-900) 0%, var(--color-primary-800) 100%)',
        paddingBlock: '5rem 7rem',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '4px solid var(--color-primary-600)',
      }}>
        {/* Grid pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none' }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pendaftaran" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pendaftaran)" />
          </svg>
        </div>

        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '40%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(55,138,221,0.18) 0%, transparent 70%)',
          filter: 'blur(70px)',
          zIndex: 0,
        }} />

        <div className="container-site" style={{ position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'center' }}>
            <ol style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', listStyle: 'none', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', padding: 0, margin: 0 }}>
              <li><Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Beranda</Link></li>
              <li aria-hidden="true" style={{ opacity: 0.5 }}>/</li>
              <li aria-current="page" style={{ color: 'var(--color-primary-100)', fontWeight: 500 }}>Pendaftaran</li>
            </ol>
          </nav>

          {/* Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(55,138,221,0.15)', border: '1px solid rgba(181,212,244,0.3)', borderRadius: '999px', padding: '0.375rem 1rem' }}>
              <ShieldCheck size={14} style={{ color: 'var(--color-primary-200)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-primary-200)', fontFamily: 'var(--font-figtree)' }}>
                Data Terlindungi
              </span>
            </div>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.25rem)',
            fontWeight: 800,
            fontFamily: 'var(--font-figtree)',
            marginBottom: '1.125rem',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: '#FFFFFF',
            textAlign: 'center',
          }}>
            Pendaftaran{' '}
            <span style={{ color: 'var(--color-primary-400)' }}>Pasien Online</span>
          </h1>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <p style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '680px',
              lineHeight: 1.7,
              fontWeight: 400,
              textAlign: 'center',
            }}>
              Daftarkan diri dari rumah dan hemat waktu antrean. Baca dan setujui syarat &amp; ketentuan perlindungan data pasien sebelum melanjutkan.
            </p>
          </div>

          {/* Step indicators */}
          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
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
        </div>
      </section>

      {/* ── Content Card (lifted overlap) ── */}
      <section style={{ marginTop: '-3.5rem', paddingBottom: '6rem', position: 'relative', zIndex: 10 }}>
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
