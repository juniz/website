import Link from 'next/link';
import DoctorCard from '@/components/ui/DoctorCard';
import { getDoctors } from '@/lib/data/doctors';

export default async function DoctorPreview() {
  const allDocs = await getDoctors();
  const featuredDoctors = allDocs.slice(0, 8); // Just take the first 8 for preview

  return (
    <section
      aria-labelledby="doctors-heading"
      className="section-py"
      style={{
        background: 'var(--color-primary-50)',
        borderTop: '1px solid var(--color-primary-100)',
        borderBottom: '1px solid var(--color-primary-100)',
      }}
    >
      <div className="container-site">
        {/* Section badge */}
        <span className="section-badge">Tim Dokter Kami</span>

        {/* Section header */}
        <div className="section-header" style={{ marginTop: '0.25rem' }}>
          <div>
            <h2 className="section-title" id="doctors-heading">
              Dokter Spesialis Kami
            </h2>
            <p className="section-subtitle">
              Tim dokter berpengalaman siap melayani dengan sepenuh hati
            </p>
          </div>
          <Link
            href="/doctors"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-primary-600)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontWeight: 600,
              flexShrink: 0,
            }}
            className="see-all-link"
          >
            Lihat semua dokter
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        </div>

        {/* Doctor cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {featuredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            marginTop: '2.5rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Link
            href="/doctors"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.875rem 2rem',
              borderRadius: '12px',
              backgroundColor: 'var(--color-cta)',
              color: 'var(--color-cta-text)',
              fontSize: '0.9375rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 200ms ease-out',
              boxShadow: '0 4px 14px rgba(255, 183, 3, 0.25)',
            }}
            className="doctors-see-all-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Lihat Semua {allDocs.length}+ Dokter
          </Link>
        </div>
      </div>

      <style>{`
        .see-all-link:hover {
          color: var(--color-primary-400) !important;
        }
        .doctors-see-all-btn:hover {
          background-color: var(--color-cta-dark) !important;
          color: var(--color-cta-text) !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(208, 149, 0, 0.35);
        }
      `}</style>
    </section>
  );
}
