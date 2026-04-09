import Link from 'next/link';

/**
 * HeroSection — Landing page hero with stat cards
 */
export default function HeroSection() {
  const stats = [
    { value: '32+', label: 'Dokter Spesialis' },
    { value: '10',  label: 'Poli Klinik' },
    { value: '24/7', label: 'IGD Siaga' },
  ];

  return (
    <section
      aria-labelledby="hero-heading"
      style={{
        backgroundColor: 'var(--color-primary-800)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative elements */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Large circle top-right */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(55,138,221,0.15) 0%, transparent 70%)',
        }} />
        {/* Small circle bottom-left */}
        <div style={{
          position: 'absolute',
          bottom: '-40px',
          left: '5%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(29,158,117,0.1) 0%, transparent 70%)',
        }} />
        {/* Subtle grid lines */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.04 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div
        className="container-site"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '2rem',
          paddingBlock: '3.5rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Accreditation badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--color-primary-600)',
              color: 'var(--color-primary-100)',
              fontSize: '0.6875rem',
              fontWeight: 500,
              padding: '0.3125rem 0.75rem',
              borderRadius: '999px',
              marginBottom: '1.25rem',
              letterSpacing: '0.02em',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent-teal)',
                flexShrink: 0,
                boxShadow: '0 0 0 2px rgba(29,158,117,0.3)',
              }}
            />
            Terakreditasi Madya — RS Bhayangkara Nganjuk
          </div>

          {/* H1 */}
          <h1
            id="hero-heading"
            style={{
              fontSize: 'clamp(1.875rem, 4vw, 2.5rem)',
              fontWeight: 600,
              color: 'var(--color-primary-50)',
              lineHeight: 1.25,
              marginBottom: '1rem',
              fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)',
            }}
          >
            Kesehatan Anda,<br />
            <span style={{ color: 'var(--color-primary-100)' }}>Prioritas Kami</span>
          </h1>

          {/* Subtext */}
          <p
            style={{
              color: 'var(--color-primary-200)',
              fontSize: '0.9375rem',
              lineHeight: 1.65,
              marginBottom: '2rem',
              maxWidth: '480px',
            }}
          >
            Layanan kesehatan terpercaya dengan dokter spesialis berpengalaman
            dan teknologi medis terkini untuk masyarakat Nganjuk dan sekitarnya.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              href="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'var(--color-primary-400)',
                color: '#fff',
                fontSize: '0.9375rem',
                fontWeight: 600,
                padding: '0.6875rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                minHeight: '48px',
                transition: 'background-color 150ms ease-out, box-shadow 150ms ease-out, transform 100ms ease-out',
              }}
              className="hero-btn-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Daftar Online
            </Link>

            <Link
              href="/schedule"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'transparent',
                color: 'var(--color-primary-100)',
                fontSize: '0.9375rem',
                fontWeight: 500,
                padding: '0.6875rem 1.5rem',
                borderRadius: '8px',
                border: '1.5px solid var(--color-primary-600)',
                textDecoration: 'none',
                minHeight: '48px',
                transition: 'background-color 150ms ease-out, border-color 150ms ease-out',
              }}
              className="hero-btn-outline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Lihat Jadwal
            </Link>
          </div>

          {/* Trust indicators */}
          <div
            style={{
              display: 'flex',
              gap: '1.25rem',
              marginTop: '2rem',
              flexWrap: 'wrap',
            }}
          >
            {[
              { icon: '🏥', label: 'BPJS Kesehatan' },
              { icon: '🔒', label: 'Data Terlindungi' },
              { icon: '⭐', label: 'Akreditasi KARS' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontSize: '0.75rem',
                  color: 'var(--color-primary-200)',
                }}
              >
                <span role="img" aria-hidden="true">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Stat cards */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            flexShrink: 0,
          }}
          className="stat-cards"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: 'var(--color-primary-600)',
                borderRadius: '10px',
                padding: '0.875rem 1.25rem',
                width: '160px',
                border: '1px solid rgba(55, 138, 221, 0.25)',
                boxShadow: '0 2px 12px rgba(4, 44, 83, 0.3)',
              }}
            >
              <div
                style={{
                  fontSize: '1.625rem',
                  fontWeight: 700,
                  color: 'var(--color-primary-50)',
                  lineHeight: 1.2,
                  fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-primary-200)',
                  marginTop: '0.125rem',
                  lineHeight: 1.3,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hero-btn-primary:hover {
          background-color: var(--color-primary-600) !important;
          box-shadow: 0 6px 20px rgba(55, 138, 221, 0.4);
          transform: translateY(-1px);
        }
        .hero-btn-outline:hover {
          background-color: rgba(24, 95, 165, 0.2) !important;
          border-color: var(--color-primary-400) !important;
        }
        @media (max-width: 640px) {
          .stat-cards {
            flex-direction: row !important;
            width: 100%;
          }
          .stat-cards > div {
            flex: 1 !important;
            width: auto !important;
          }
          [aria-labelledby="hero-heading"] > div {
            flex-direction: column !important;
          }
        }
      `}</style>
    </section>
  );
}
