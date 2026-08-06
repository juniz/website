import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import { Service } from '@/types/api';

interface ServiceGridProps {
  data?: Service[];
}

export default function ServiceGrid({ data = [] }: ServiceGridProps) {
  const displayServices = data;

  if (displayServices.length === 0) {
    return (
      <section
        aria-labelledby="services-heading"
        className="section-py"
        style={{ background: 'var(--color-neutral-50)' }}
      >
        <div className="container-site">
          <div className="section-header">
            <div>
              <h2 className="section-title" id="services-heading">Layanan Unggulan</h2>
              <p className="section-subtitle">Didukung tenaga medis spesialis berpengalaman</p>
            </div>
          </div>
              <p style={{ color: 'var(--color-neutral-600)', fontSize: '0.875rem', textAlign: 'center', padding: '3rem 0' }}>
            Belum ada layanan tersedia saat ini.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="services-heading"
      className="section-py"
      style={{ background: 'var(--color-neutral-50)' }}
    >
      <div className="container-site">
        {/* Section badge */}
        <span className="section-badge">Layanan Kami</span>
        
        {/* Section header */}
        <div className="section-header" style={{ marginTop: '0.25rem' }}>
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
              fontSize: '0.75rem',
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.25rem',
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
                  background: 'var(--color-neutral-50)',
                  border: '1px solid var(--color-neutral-200)',
                  borderLeft: '1px solid var(--color-neutral-200)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.875rem',
                  height: '100%',
                  transition: 'border-color 200ms ease-out, box-shadow 200ms ease-out, transform 200ms ease-out',
                }}
                className="service-card"
              >
                {/* Icon container */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    background: service.bgColorCode || 'var(--color-primary-50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                    padding: '8px',
                    transition: 'transform 200ms ease-out',
                  }}
                  className="service-icon-container"
                >
                  {(() => {
                    const iconUrl = getImageUrl(service.iconName || service.icon_name);
                    return iconUrl ? (
                      <Image 
                        src={iconUrl} 
                        alt="" 
                        width={32}
                        height={32}
                        style={{ 
                          objectFit: 'contain' 
                        }} 
                        sizes="32px"
                      />
                    ) : (
                      <div style={{ width: 32, height: 32, background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }} />
                    );
                  })()}
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 700,
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
                      marginTop: '0.25rem',
                    }}
                  >
                    {service.countInfo || service.count_info}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .service-card:hover {
          border-color: var(--color-primary-200);
          border-left-color: var(--color-primary-600);
          box-shadow: 0 8px 24px rgba(33, 158, 188, 0.12);
          transform: translateY(-3px);
        }
        .service-card:hover .service-icon-container {
          transform: scale(1.08);
        }
        .service-card-link:focus-visible {
          outline: 2.5px solid var(--color-primary-400);
          outline-offset: 2px;
          border-radius: 12px;
        }
        .see-all-link:hover {
          color: var(--color-primary-400) !important;
        }
      `}</style>
    </section>
  );
}
