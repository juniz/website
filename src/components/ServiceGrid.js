import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';

export default function ServiceGrid({ data = [] }) {
  const displayServices = data.length > 0 ? data : [];

  return (
    <section
      aria-labelledby="services-heading"
      className="section-py"
      style={{ background: 'var(--color-neutral-50)' }}
    >
      <div className="container-site">
        {/* Section header */}
        <div className="section-header">
          <div>
            <h2 className="section-title" id="services-heading">
              Layanan Unggulan
            </h2>
            <p className="section-subtitle">
              Didukung tenaga medis spesialis berpengalaman
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
            Lihat semua
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        </div>

        {/* Services grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          {displayServices.map((service) => (
            <Link
              key={service.slug}
              href={`/doctors?specialization=${service.slug}`}
              style={{ textDecoration: 'none', display: 'block' }}
              className="service-card-link"
            >
              <article
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--color-neutral-200)',
                  borderRadius: '10px',
                  padding: '1.125rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  height: '100%',
                  transition: 'border-color 150ms ease-out, box-shadow 200ms ease-out, transform 150ms ease-out',
                }}
                className="service-card"
              >
                {/* Icon container */}
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    background: service.bgColorCode || 'var(--color-primary-50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                    padding: '6px'
                  }}
                >
                  <img 
                    src={getImageUrl(service.imageUrl)} 
                    alt="" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain' 
                    }} 
                  />
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--color-neutral-900)',
                      lineHeight: 1.3,
                      fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)',
                    }}
                  >
                    {service.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-neutral-600)',
                      marginTop: '0.2rem',
                    }}
                  >
                    {service.countInfo}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .service-card:hover {
          border-color: var(--color-primary-400);
          box-shadow: 0 4px 20px rgba(55, 138, 221, 0.1);
          transform: translateY(-2px);
        }
        .service-card-link:focus-visible .service-card {
          outline: 2.5px solid var(--color-primary-400);
          outline-offset: 2px;
        }
        .see-all-link:hover {
          color: var(--color-primary-400) !important;
        }
      `}</style>
    </section>
  );
}
