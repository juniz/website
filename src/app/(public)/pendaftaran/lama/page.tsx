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

      {/* Page Header */}
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

      {/* Form Card */}
      <section style={{ paddingTop: '2.5rem', paddingBottom: '6rem' }}>
        <div className="container-site" style={{ maxWidth: '780px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 20px 60px rgba(4,44,83,0.1)', border: '1px solid var(--color-neutral-200)', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(to bottom, var(--color-primary-50), #ffffff)', borderBottom: '1px solid var(--color-primary-100)', padding: '1.75rem 2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(24,95,165,0.3)', flexShrink: 0 }}>
                <UserCheck size={20} style={{ color: '#fff' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-figtree)', color: 'var(--color-primary-900)', margin: 0 }}>Verifikasi &amp; Booking</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-500)', marginTop: '2px' }}>Masukkan NIK dan tanggal lahir untuk memverifikasi data Anda.</p>
              </div>
            </div>
            <div style={{ padding: '2rem 2.5rem' }}>
              <LamaForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
