import Link from 'next/link';

export default function CTABanner() {
  return (
    <section
      aria-labelledby="cta-heading"
      style={{
        backgroundColor: 'var(--color-primary-900)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute',
          right: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(24, 95, 165, 0.3) 0%, transparent 70%)',
        }} />
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.04 }}>
          <defs>
            <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>
      </div>

      <div
        className="container-site"
        style={{
          paddingBlock: '3.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Text left */}
        <div style={{ flex: 1, minWidth: '240px' }}>
          {/* Label */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: 'var(--color-primary-400)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Pendaftaran Online
          </div>

          <h2
            id="cta-heading"
            style={{
              fontSize: 'clamp(1.375rem, 3vw, 1.875rem)',
              fontWeight: 700,
              color: 'var(--color-primary-50)',
              lineHeight: 1.3,
              marginBottom: '0.75rem',
              fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)',
            }}
          >
            Daftar Berobat Online<br />
            <span style={{ color: 'var(--color-primary-200)' }}>Tanpa Antri Panjang</span>
          </h2>

          <p style={{ fontSize: '0.9375rem', color: 'var(--color-primary-200)', lineHeight: 1.6, maxWidth: '480px' }}>
            Pilih dokter, tentukan jadwal, dan terima konfirmasi via WhatsApp — semuanya dari rumah.
            Berlaku untuk semua poli dan jaminan BPJS Kesehatan.
          </p>

          {/* Feature list */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginTop: '1.25rem',
            }}
          >
            {[
              'Konfirmasi WhatsApp otomatis',
              'BPJS & Umum diterima',
              'Pilih dokter & jam praktik',
            ].map((feature) => (
              <div
                key={feature}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8125rem',
                  color: 'var(--color-primary-200)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-teal)" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* CTA right */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.875rem',
            textAlign: 'center',
          }}
        >
          {/* Medical calendar icon */}
          <div
            aria-hidden="true"
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '16px',
              background: 'var(--color-primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.25rem',
              border: '2px solid rgba(55, 138, 221, 0.3)',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-100)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <path d="M12 14v3m-1.5-1.5h3" strokeWidth="2" />
            </svg>
          </div>

          <Link
            href="/pendaftaran"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-primary-400)',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 600,
              padding: '0.875rem 2rem',
              borderRadius: '10px',
              textDecoration: 'none',
              minHeight: '52px',
              whiteSpace: 'nowrap',
              transition: 'background-color 150ms ease-out, box-shadow 150ms ease-out, transform 100ms ease-out',
              boxShadow: '0 4px 20px rgba(55, 138, 221, 0.3)',
            }}
            className="cta-main-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Daftar Sekarang
          </Link>

          <p style={{ fontSize: '0.75rem', color: 'var(--color-primary-200)' }}>
            Gratis · Proses cepat · Tanpa biaya tambahan
          </p>
        </div>
      </div>

      <style>{`
        .cta-main-btn:hover {
          background-color: var(--color-primary-600) !important;
          box-shadow: 0 6px 24px rgba(55, 138, 221, 0.45) !important;
          transform: translateY(-1px);
        }
        .cta-main-btn:active {
          transform: scale(0.97);
        }
      `}</style>
    </section>
  );
}
