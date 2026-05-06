import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';

/* SVG icon map for services */
function ServiceIcon({ name, color }) {
  const icons = {
    heart: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    users: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    activity: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    monitor: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    zap: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    shield: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    eye: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    ear: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 0 1-7 0"/><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 0 0 4 0"/>
      </svg>
    ),
    bone: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 5 0c0-.81-.7-1.8 0-2.5l7-7z"/>
      </svg>
    ),
    ambulance: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
        <path d="M8 11V7m-2 2h4" strokeWidth="1.75"/>
      </svg>
    ),
  };
  return icons[name] ?? icons.heart;
}

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
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: service.bg_color_code || '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  {service.imageUrl ? (
                    <img 
                      src={getImageUrl(service.imageUrl)} 
                      alt="" 
                      style={{ 
                        width: '22px', 
                        height: '22px', 
                        objectFit: 'contain' 
                      }} 
                    />
                  ) : (
                    <ServiceIcon name={service.icon_name} color={service.color_code || 'var(--color-primary-500)'} />
                  )}
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
                    {service.count_info}
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
