import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { getSchedules, getScheduleStatus } from '@/lib/data/schedule';

export default async function SchedulePreview() {
  const allSchedules = await getSchedules();
  
  const now = new Date();
  const dayFormatter = new Intl.DateTimeFormat('id-ID', { weekday: 'long', timeZone: 'Asia/Jakarta' });
  const todayDayName = dayFormatter.format(now);
  
  // Filter only schedules whose day matches today in Asia/Jakarta
  const todaySchedule = allSchedules.filter(s => s.date?.toLowerCase() === todayDayName.toLowerCase()).slice(0, 5);
  
  // Format today's date in Indonesian with Jakarta timezone
  const todayStr = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(now);

  return (
    <section
      aria-labelledby="schedule-heading"
      className="section-py"
      style={{ background: 'var(--color-neutral-50)' }}
    >
      <div className="container-site">
        {/* Section badge */}
        <span className="section-badge">Jadwal Praktik</span>

        {/* Section header */}
        <div className="section-header" style={{ flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.25rem' }}>
          <div>
            <h2 className="section-title" id="schedule-heading">
              Jadwal Dokter Hari Ini
            </h2>
            <p className="section-subtitle">
              <span>{todayStr}</span>
            </p>
          </div>
          <Link
            href="/schedule"
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-primary-600)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontWeight: 600,
              flexShrink: 0,
              minHeight: '44px',
              padding: '0.25rem 0.5rem',
            }}
            className="see-all-link"
          >
            Lihat jadwal lengkap
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        </div>

        {/* Horizontal Cards stack */}
        {todaySchedule.length === 0 ? (
          <div
            style={{
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              background: 'var(--color-neutral-50)',
              borderRadius: '12px',
              border: '1px solid var(--color-neutral-200)',
            }}
          >
            <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-neutral-900)' }}>
              Tidak ada jadwal poliklinik rawat jalan untuk hari ini ({todayDayName}).
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-600)', marginTop: '0.375rem' }}>
              Layanan IGD dan Rawat Inap RS Bhayangkara Nganjuk beroperasi 24 jam setiap hari.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {todaySchedule.map((row) => {
              const status = getScheduleStatus(row.filledQuota, row.totalQuota);
              const percent = Math.min(100, Math.round((row.filledQuota / row.totalQuota) * 100));
              const isFull = row.filledQuota >= row.totalQuota;
              return (
                <div
                  key={row.id}
                  style={{
                    background: 'var(--color-neutral-50)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-neutral-200)',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    transition: 'border-color 200ms ease-out, box-shadow 200ms ease-out, transform 200ms ease-out',
                  }}
                  className="schedule-card-row"
                >
                  {/* Upper line: Name, Poli, Time, and Actions */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                    }}
                  >
                    {/* Doctor details & tags */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-neutral-900)', fontFamily: 'var(--font-figtree, Figtree, sans-serif)' }}>
                        {row.doctorName}
                      </span>
                      <span
                        style={{
                          background: 'var(--color-primary-50)',
                          color: 'var(--color-primary-800)',
                          border: '1px solid var(--color-primary-100)',
                          padding: '0.25rem 0.625rem',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {row.specialization}
                      </span>
                      
                      {/* Time badge */}
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          background: 'var(--color-primary-50)',
                          color: 'var(--color-primary-900)',
                          padding: '0.25rem 0.625rem',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {row.time}
                      </span>
                    </div>

                    {/* Actions (Badge + CTA) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Badge
                        variant={
                          status.label === 'Tersedia' ? 'success' :
                          status.label === 'Sisa Sedikit' ? 'warning' : 'danger'
                        }
                        dot
                      >
                        {status.label}
                      </Badge>
                      
                      {!isFull ? (
                        <Link
                          href="/pendaftaran"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.5rem 1.25rem',
                            borderRadius: '8px',
                            background: 'var(--color-cta)',
                            color: 'var(--color-cta-text)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            transition: 'background-color 150ms ease-out, box-shadow 150ms ease-out',
                            boxShadow: '0 2px 6px rgba(255, 183, 3, 0.2)',
                            minHeight: '44px',
                          }}
                          className="schedule-card-daftar-btn"
                          aria-label={`Daftar ke ${row.doctorName}`}
                        >
                          Daftar
                        </Link>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.5rem 1.25rem',
                            borderRadius: '8px',
                            background: 'var(--color-neutral-200)',
                            color: 'var(--color-neutral-600)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            opacity: 0.7,
                            cursor: 'not-allowed',
                            minHeight: '44px',
                          }}
                        >
                          Penuh
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quota Progress Bar (Full width) */}
                  <div style={{ borderTop: '1px solid var(--color-neutral-100)', paddingTop: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem', fontSize: '0.75rem', color: 'var(--color-neutral-600)' }}>
                      <span>Kapasitas Kuota Pasien</span>
                      <span style={{ fontWeight: 600, color: isFull ? 'var(--color-danger)' : 'var(--color-primary-900)' }}>
                        {row.filledQuota} / {row.totalQuota} Terdaftar ({percent}%)
                      </span>
                    </div>
                    <div
                      role="progressbar"
                      aria-valuenow={row.filledQuota}
                      aria-valuemin={0}
                      aria-valuemax={row.totalQuota}
                      aria-label={`Kapasitas kuota pasien ${row.doctorName}`}
                      style={{ width: '100%', height: '6px', background: 'var(--color-primary-50)', borderRadius: '3px', overflow: 'hidden' }}
                    >
                      <div style={{ width: '100%', height: '100%', background: isFull ? 'var(--color-danger)' : 'var(--color-primary-600)', borderRadius: '3px', transform: `scaleX(${percent / 100})`, transformOrigin: 'left center', transition: 'transform 0.4s ease-out' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer link */}
        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <Link
            href="/schedule"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontSize: '0.875rem',
              color: 'var(--color-primary-600)',
              textDecoration: 'none',
              fontWeight: 500,
              padding: '0.5rem',
              borderRadius: '6px',
              transition: 'color 150ms ease-out',
            }}
            className="see-all-link"
          >
            Lihat Jadwal Lengkap & Filter Dokter
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        .see-all-link:hover {
          color: var(--color-primary-400) !important;
        }
        .schedule-card-row:hover {
          border-color: var(--color-primary-200) !important;
          box-shadow: 0 6px 20px rgba(33, 158, 188, 0.08);
          transform: translateY(-2px);
        }
        .schedule-card-daftar-btn:hover {
          background: var(--color-cta-dark) !important;
          color: var(--color-cta-text) !important;
          box-shadow: 0 4px 10px rgba(208, 149, 0, 0.35);
        }
        @media (max-width: 640px) {
          .schedule-card-row {
            padding: 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}
