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
        background: '#ffffff',
        borderTop: '1px solid var(--color-neutral-200)',
        borderBottom: '1px solid var(--color-neutral-200)',
      }}
    >
      <div className="container-site">
        {/* Section header */}
        <div className="section-header">
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
              fontWeight: 500,
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
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Link
            href="/doctors"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.5rem',
              borderRadius: '8px',
              border: '1.5px solid var(--color-primary-200)',
              color: 'var(--color-primary-600)',
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'border-color 150ms ease-out, background 150ms ease-out',
            }}
            className="doctors-see-all-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Lihat Semua {32}+ Dokter
          </Link>
        </div>
      </div>

      <style>{`
        .see-all-link:hover {
          color: var(--color-primary-400) !important;
        }
        .doctors-see-all-btn:hover {
          border-color: var(--color-primary-400) !important;
          background: var(--color-primary-50) !important;
        }
      `}</style>
    </section>
  );
}
