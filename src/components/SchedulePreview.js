import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { getSchedules, getScheduleStatus } from '@/lib/data/schedule';

export default async function SchedulePreview() {
  const allSchedules = await getSchedules();
  const todaySchedule = allSchedules.slice(0, 5); // Just take first 5
  
  // Format today's date in Indonesian
  const today = new Date();
  const todayStr = today.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section
      aria-labelledby="schedule-heading"
      className="section-py"
      style={{ background: 'var(--color-neutral-50)' }}
    >
      <div className="container-site">
        {/* Section header */}
        <div className="section-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 className="section-title" id="schedule-heading">
              Jadwal Dokter Hari Ini
            </h2>
            <p className="section-subtitle">
              <span aria-live="polite">{todayStr}</span>
            </p>
          </div>
          <Link
            href="/schedule"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-primary-600)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontWeight: 500,
              flexShrink: 0,
            }}
            className="see-all-link"
          >
            Lihat jadwal lengkap
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        </div>

        {/* Table (desktop) */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid var(--color-neutral-200)',
            overflow: 'hidden',
          }}
        >
          {/* Table header */}
          <div
            role="row"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(180px, 1fr) minmax(130px, auto) auto minmax(120px, auto)',
              gap: '0',
              background: 'var(--color-primary-50)',
              borderBottom: '1px solid var(--color-neutral-200)',
              padding: '0.75rem 1.25rem',
            }}
            className="schedule-table-header"
            aria-hidden="true"
          >
            {['Dokter', 'Spesialisasi', 'Jam Praktik', 'Status'].map((col) => (
              <span
                key={col}
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: 'var(--color-primary-800)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                {col}
              </span>
            ))}
          </div>

          {/* Table body */}
          <div role="table" aria-label="Jadwal dokter hari ini">
            <div role="rowgroup">
              {todaySchedule.map((row, index) => {
                const status = getScheduleStatus(row.filledQuota, row.totalQuota);
                return (
                  <div
                    key={row.id}
                    role="row"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(180px, 1fr) minmax(130px, auto) auto minmax(120px, auto)',
                      alignItems: 'center',
                      padding: '1rem 1.25rem',
                      borderBottom: index < todaySchedule.length - 1 ? '0.5px solid var(--color-neutral-200)' : 'none',
                      gap: '0.5rem',
                      transition: 'background 150ms ease-out',
                    }}
                    className="schedule-row"
                  >
                    {/* Doctor */}
                    <div role="cell">
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-neutral-900)' }}>
                        {row.doctorName}
                      </span>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--color-neutral-600)', marginTop: '0.1rem' }}>
                        {row.filledQuota}/{row.totalQuota} kuota terisi
                      </div>
                    </div>

                    {/* Specialization */}
                    <div role="cell">
                      <span style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-600)' }}>
                        {row.specialization}
                      </span>
                    </div>

                    {/* Time */}
                    <div role="cell">
                      <span
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          color: 'var(--color-neutral-900)',
                          fontVariantNumeric: 'tabular-nums',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-600)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {row.time}
                      </span>
                    </div>

                    {/* Status + action */}
                    <div role="cell" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', justifyContent: 'flex-end' }}>
                      <Badge
                        variant={
                          status.label === 'Tersedia' ? 'success' :
                          status.label === 'Sisa Sedikit' ? 'warning' : 'danger'
                        }
                        dot
                      >
                        {status.label}
                      </Badge>
                      {row.filledQuota < row.totalQuota && (
                        <Link
                          href={`/register?scheduleId=${row.id}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.3125rem 0.75rem',
                            borderRadius: '6px',
                            background: 'var(--color-primary-400)',
                            color: '#fff',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                            transition: 'background 150ms ease-out',
                            minHeight: '32px',
                          }}
                          className="schedule-daftar-btn"
                          aria-label={`Daftar ke ${row.doctorName}`}
                        >
                          Daftar
                        </Link>
                      )}
                      {row.filledQuota >= row.totalQuota && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.3125rem 0.75rem',
                            borderRadius: '6px',
                            background: 'var(--color-neutral-200)',
                            color: 'var(--color-neutral-600)',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            opacity: 0.6,
                            cursor: 'not-allowed',
                            minHeight: '32px',
                          }}
                          aria-label="Kuota penuh"
                        >
                          Penuh
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

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
        .schedule-row:hover {
          background: var(--color-primary-50) !important;
        }
        .schedule-daftar-btn:hover {
          background: var(--color-primary-600) !important;
        }
        /* Responsive: collapse table on mobile */
        @media (max-width: 640px) {
          .schedule-table-header {
            display: none !important;
          }
          .schedule-row {
            grid-template-columns: 1fr !important;
            gap: 0.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
