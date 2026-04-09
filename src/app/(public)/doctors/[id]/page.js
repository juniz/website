import { notFound } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { getDoctors, getDoctorById, getInitials } from '@/lib/data/doctors';
import { getSchedules, getScheduleStatus } from '@/lib/data/schedule';

export async function generateStaticParams() {
  const allDocs = await getDoctors();
  return allDocs.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const doctor = await getDoctorById(id);
  if (!doctor) return {};
  return {
    title: doctor.name,
    description: `${doctor.specialization} — ${doctor.experience}. ${doctor.bio}`,
  };
}

export default async function DoctorDetailPage({ params }) {
  const { id } = await params;
  const doctor = await getDoctorById(id);
  if (!doctor) notFound();

  const initials = getInitials(doctor.name);

  const availabilityConfig = {
    today:       { variant: 'success', label: 'Tersedia hari ini' },
    tomorrow:    { variant: 'warning', label: 'Besok tersedia' },
    unavailable: { variant: 'danger',  label: 'Tidak tersedia' },
  };

  const avail = availabilityConfig[doctor.availability] ?? availabilityConfig.unavailable;

  // Get today's schedules for this doctor
  const todaySchedules = await getSchedules();
  const doctorSchedules = todaySchedules.filter((s) => s.doctorId === doctor.id);

  return (
    <>
      {/* Hero header */}
      <section
        style={{
          background: 'var(--color-primary-800)',
          paddingBlock: '2.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="container-site">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1.25rem' }}>
            <ol style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', listStyle: 'none', fontSize: '0.75rem', color: 'var(--color-primary-200)' }}>
              <li><Link href="/" style={{ color: 'var(--color-primary-200)', textDecoration: 'none' }}>Beranda</Link></li>
              <li aria-hidden="true"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></li>
              <li><Link href="/doctors" style={{ color: 'var(--color-primary-200)', textDecoration: 'none' }}>Dokter</Link></li>
              <li aria-hidden="true"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></li>
              <li aria-current="page" style={{ color: 'var(--color-primary-50)' }}>{doctor.name}</li>
            </ol>
          </nav>

          {/* Doctor profile hero */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div
              aria-hidden="true"
              style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: doctor.avatarBg, color: doctor.avatarColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)',
                fontSize: '1.625rem', fontWeight: 700, flexShrink: 0,
                border: `2px solid ${doctor.avatarColor}33`,
              }}
            >
              {initials}
            </div>
            <div>
              <h1
                style={{
                  fontSize: 'clamp(1.375rem, 3vw, 1.875rem)',
                  fontWeight: 700,
                  color: 'var(--color-primary-50)',
                  fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)',
                  lineHeight: 1.25,
                  marginBottom: '0.375rem',
                }}
              >
                {doctor.name}
              </h1>
              <p style={{ color: 'var(--color-primary-200)', fontSize: '0.9375rem', marginBottom: '0.5rem' }}>
                {doctor.specialization}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Badge variant={avail.variant} dot>{avail.label}</Badge>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary-200)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12"/></svg>
                  {doctor.experience}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div
        className="container-site"
        style={{ paddingBlock: '2.5rem', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: '2rem', alignItems: 'start' }}
        id="main-detail-grid"
      >
        {/* Left: Bio, Education */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* About */}
          <section aria-labelledby="bio-heading" style={{ background: '#fff', border: '1px solid var(--color-neutral-200)', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 id="bio-heading" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-neutral-900)', fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)', marginBottom: '0.875rem' }}>
              Tentang Dokter
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-neutral-600)', lineHeight: 1.7 }}>
              {doctor.bio}
            </p>
          </section>

          {/* Education & Details */}
          <section aria-labelledby="edu-heading" style={{ background: '#fff', border: '1px solid var(--color-neutral-200)', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 id="edu-heading" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-neutral-900)', fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)', marginBottom: '1rem' }}>
              Riwayat Pendidikan & Karir
            </h2>
            <dl style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { label: 'Pendidikan', value: doctor.education },
                { label: 'Pengalaman', value: doctor.experience },
                { label: 'Spesialisasi', value: doctor.specialization },
              ].map((item) => (
                <div key={item.label} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem' }}>
                  <dt style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-neutral-600)' }}>{item.label}</dt>
                  <dd style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-900)' }}>{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        {/* Right: Schedule + CTA card */}
        <aside aria-label="Jadwal dan pendaftaran" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Today's schedule card */}
          <div style={{ background: '#fff', border: '1px solid var(--color-neutral-200)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ background: 'var(--color-primary-50)', borderBottom: '1px solid var(--color-neutral-200)', padding: '1rem 1.25rem' }}>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-800)', fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)' }}>
                Jadwal Praktik
              </h2>
            </div>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {doctorSchedules.length > 0 ? doctorSchedules.map((s) => {
                const status = getScheduleStatus(s.filledQuota, s.totalQuota);
                return (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.875rem', borderBottom: '0.5px solid var(--color-neutral-200)' }}>
                    <div>
                      <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-neutral-900)' }}>{s.time}</span>
                      <p style={{ fontSize: '0.6875rem', color: 'var(--color-neutral-600)', marginTop: '0.125rem' }}>{s.filledQuota}/{s.totalQuota} kuota</p>
                    </div>
                    <Badge variant={status.variant} dot>{status.label}</Badge>
                  </div>
                );
              }) : (
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-600)' }}>Jadwal hari ini belum tersedia.</p>
              )}

              <p style={{ fontSize: '0.75rem', color: 'var(--color-neutral-600)' }}>
                <strong>Jadwal Reguler:</strong> {doctor.todaySchedule}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div style={{ background: 'var(--color-primary-50)', border: '1px solid var(--color-primary-100)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-primary-900)' }}>
              Ingin berobat dengan {doctor.name.split(',')[0]}?
            </p>
            <Link
              href={`/register?doctorId=${doctor.id}`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                background: 'var(--color-primary-400)', color: '#fff',
                fontSize: '0.875rem', fontWeight: 600, padding: '0.75rem 1rem',
                borderRadius: '8px', textDecoration: 'none', minHeight: '44px',
                transition: 'background 150ms',
              }}
              className="detail-cta-btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Daftar Sekarang
            </Link>
            <Link href="/schedule" style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-primary-600)', textDecoration: 'none' }}>
              Lihat jadwal lengkap →
            </Link>
          </div>
        </aside>
      </div>

      <style>{`
        .detail-cta-btn:hover { background: var(--color-primary-600) !important; }
        @media (max-width: 768px) {
          #main-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
