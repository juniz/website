import LamaForm from './LamaForm';
import Link from 'next/link';
import { UserCheck } from 'lucide-react';

export const metadata = {
  title: 'Pre-Registrasi Pasien Lama | RS Bhayangkara Nganjuk',
  description: 'Booking jadwal dokter untuk pasien lama RS Bhayangkara Nganjuk.',
};

export default function PasienLamaPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-neutral-50)' }}>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(165deg, var(--color-primary-900) 0%, var(--color-primary-800) 100%)',
        paddingBlock: '5rem 7rem',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '4px solid var(--color-primary-600)',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none' }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-lama" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-lama)" />
          </svg>
        </div>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '60%', background: 'radial-gradient(circle, rgba(55,138,221,0.18) 0%, transparent 70%)', filter: 'blur(70px)' }} />

        <div className="container-site" style={{ position: 'relative', zIndex: 1, maxWidth: '780px' }}>
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
            <ol style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', listStyle: 'none', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', padding: 0, margin: 0 }}>
              <li><Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Beranda</Link></li>
              <li style={{ opacity: 0.5 }}>/</li>
              <li><Link href="/pendaftaran" style={{ color: 'inherit', textDecoration: 'none' }}>Pendaftaran</Link></li>
              <li style={{ opacity: 0.5 }}>/</li>
              <li style={{ color: 'var(--color-primary-100)', fontWeight: 500 }}>Pasien Lama</li>
            </ol>
          </nav>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(55,138,221,0.15)', border: '1px solid rgba(181,212,244,0.3)', borderRadius: '999px', padding: '0.375rem 1rem', marginBottom: '1.25rem' }}>
            <UserCheck size={14} style={{ color: 'var(--color-primary-200)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-primary-200)', fontFamily: 'var(--font-figtree)' }}>Pasien Lama</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, fontFamily: 'var(--font-figtree)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem' }}>
            Booking{' '}
            <span style={{ color: 'var(--color-primary-400)' }}>Jadwal Dokter</span>
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.75)', maxWidth: '560px', lineHeight: 1.7 }}>
            Verifikasi data Anda menggunakan NIK dan tanggal lahir, lalu pilih tanggal dan jadwal dokter yang diinginkan.
          </p>
        </div>
      </section>

      {/* Form Card */}
      <section style={{ marginTop: '-3.5rem', paddingBottom: '6rem', position: 'relative', zIndex: 10 }}>
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
