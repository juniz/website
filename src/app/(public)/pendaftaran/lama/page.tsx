import LamaForm from './LamaForm';
import { UserCheck } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pre-Registrasi Pasien Lama | RS Bhayangkara Nganjuk',
  description: 'Booking jadwal dokter untuk pasien lama RS Bhayangkara Nganjuk.',
};

export default function PasienLamaPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-neutral-50)' }}>

      {/* Page Header (Hidden on Mobile < 640px) */}
      <div className="lama-hero-desktop">
        <PageHero
          breadcrumb="Pasien Lama"
          title="Booking Jadwal Dokter"
          subtitle="Verifikasi data Anda menggunakan NIK dan tanggal lahir, lalu pilih tanggal dan jadwal dokter yang diinginkan."
        >
          {/* Pasien Lama badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', padding: '0.375rem 1rem' }}>
            <UserCheck size={14} style={{ color: 'var(--color-primary-200)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-primary-200)', fontFamily: 'var(--font-figtree)' }}>
              Pasien Lama
            </span>
          </div>
        </PageHero>
      </div>

      {/* Form Card Container */}
      <section className="lama-section">
        <div className="container-site lama-container-site" style={{ maxWidth: '780px' }}>
          <div className="lama-card-wrapper">
            {/* Card Header (Hidden on Mobile < 640px) */}
            <div className="lama-card-header" style={{ background: 'linear-gradient(to bottom, var(--color-primary-50), #ffffff)', borderBottom: '1px solid var(--color-primary-100)', padding: '1.75rem 2.5rem', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(24,95,165,0.3)', flexShrink: 0 }}>
                <UserCheck size={20} style={{ color: '#fff' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-figtree)', color: 'var(--color-primary-900)', margin: 0 }}>Verifikasi &amp; Booking</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-500)', marginTop: '2px' }}>Masukkan NIK dan tanggal lahir untuk memverifikasi data Anda.</p>
              </div>
            </div>
            
            <div className="lama-card-body">
              <LamaForm />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .lama-hero-desktop {
          display: none;
        }

        .lama-section {
          padding-top: 0;
          padding-bottom: 2rem;
        }

        .lama-container-site {
          padding-left: 1rem;
          padding-right: 1rem;
        }

        .lama-card-wrapper {
          background: transparent;
          border-radius: 0;
          box-shadow: none;
          border: none;
          overflow: visible;
        }

        .lama-card-header {
          display: none;
        }

        .lama-card-body {
          padding: 0.5rem 0;
        }

        @media (min-width: 640px) {
          .lama-hero-desktop {
            display: block;
          }

          .lama-section {
            padding-top: 2.5rem;
            padding-bottom: 6rem;
          }

          .lama-container-site {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }

          .lama-card-wrapper {
            background: #fff;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(4, 44, 83, 0.1);
            border: 1px solid var(--color-neutral-200);
            overflow: hidden;
          }

          .lama-card-header {
            display: flex;
          }

          .lama-card-body {
            padding: 2rem 2.5rem;
          }
        }
      `}</style>
    </main>
  );
}
