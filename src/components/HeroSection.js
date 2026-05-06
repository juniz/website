import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';

/**
 * HeroSection — Landing page hero with stat cards.
 * CSS-only staggered entrance animations (no client JS needed).
 * @param {Object} data - Hero settings data from database
 */
export default function HeroSection({ data }) {
  const stats = data?.stats || [
    { value: '32+', label: 'Dokter Spesialis' },
    { value: '10',  label: 'Poli Klinik' },
    { value: '24/7', label: 'IGD Siaga' },
  ];

  const heroImageUrl = data?.image_url || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2053';

  return (
    <section
      aria-labelledby="hero-heading"
      style={{
        backgroundColor: 'var(--color-primary-900)',
        position: 'relative',
        minHeight: '750px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        color: '#fff',
      }}
      className="hero-section-fhd"
    >
      {/* Background image layer */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        {/* Image — Ken Burns subtle zoom */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${getImageUrl(heroImageUrl)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          animation: 'heroKenBurns 20s ease-out forwards',
        }} />

        {/* Cinematic gradient overlay (desktop) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(4, 44, 83, 0.95) 0%, rgba(4, 44, 83, 0.7) 40%, rgba(4, 44, 83, 0.3) 100%)',
        }} className="hero-overlay-desktop" />

        {/* Solid overlay (mobile) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(4, 44, 83, 0.75)',
          display: 'none',
        }} className="hero-overlay-mobile" />
      </div>

      <div
        className="container-site"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          paddingBlock: '5rem',
        }}
      >
        <div style={{ maxWidth: '640px' }} className="hero-content">

          {/* Accreditation badge — animates first */}
          <div
            className="hero-anim-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(55, 138, 221, 0.2)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(55, 138, 221, 0.3)',
              color: 'var(--color-primary-100)',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.4rem 0.875rem',
              borderRadius: '999px',
              marginBottom: '1.5rem',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent-teal)',
                boxShadow: '0 0 10px var(--color-accent-teal)',
              }}
            />
            {data?.accreditation || 'Terakreditasi Madya — RS Bhayangkara Nganjuk'}
          </div>

          {/* H1 */}
          <h1
            id="hero-heading"
            className="hero-anim-title"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.25rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.05,
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)',
              letterSpacing: '-0.03em',
            }}
          >
            {data?.title || 'Kesehatan Anda,'}<br />
            <span style={{
              background: 'linear-gradient(to right, #85B7EB, #B5D4F4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {data?.title_accent || 'Prioritas Kami'}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="hero-anim-sub"
            style={{
              color: 'var(--color-primary-100)',
              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
              maxWidth: '540px',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            {data?.subtitle || 'Layanan kesehatan terpercaya dengan dokter spesialis berpengalaman dan teknologi medis terkini untuk masyarakat Nganjuk dan sekitarnya.'}
          </p>

          {/* CTA buttons */}
          <div
            style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}
            className="hero-cta-group hero-anim-cta"
          >
            <Link
              href={data?.cta_primary?.href || '/register'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.625rem',
                backgroundColor: 'var(--color-primary-400)',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 600,
                padding: '1rem 2rem',
                borderRadius: '14px',
                textDecoration: 'none',
                minHeight: '56px',
                transition: 'all 300ms cubic-bezier(0.23, 1, 0.32, 1)',
                boxShadow: '0 8px 30px rgba(55, 138, 221, 0.3)',
              }}
              className="hero-btn-primary"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {data?.cta_primary?.label || 'Daftar Online'}
            </Link>

            <Link
              href={data?.cta_secondary?.href || '/schedule'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.625rem',
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 600,
                padding: '1rem 2rem',
                borderRadius: '14px',
                border: '1.5px solid rgba(255,255,255,0.2)',
                textDecoration: 'none',
                minHeight: '56px',
                transition: 'all 300ms ease-out',
              }}
              className="hero-btn-outline"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {data?.cta_secondary?.label || 'Lihat Jadwal'}
            </Link>
          </div>

          {/* Stats bar — each stat staggers in */}
          <div
            style={{ display: 'flex', gap: '2rem', marginTop: '4.5rem', flexWrap: 'wrap' }}
            className="hero-stats-bar"
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="hero-anim-stat"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  animationDelay: `${0.65 + i * 0.12}s`,
                }}
              >
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#fff',
                  fontFamily: 'var(--font-figtree, Figtree, sans-serif)',
                  lineHeight: 1,
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--color-primary-200)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Trust indicators */}
          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              marginTop: '3.5rem',
              flexWrap: 'wrap',
            }}
            className="hero-trust-indicators hero-anim-trust"
          >
            {(data?.trust_indicators || [
              { icon: '🏥', label: 'BPJS Kesehatan' },
              { icon: '🔒', label: 'Data Terlindungi' },
              { icon: '⭐', label: 'Akreditasi KARS' },
            ]).map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8125rem',
                  color: 'var(--color-primary-100)',
                  fontWeight: 500,
                  opacity: 0.85,
                }}
              >
                <span role="img" aria-hidden="true">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        /* ── Hero entrance keyframes ────────────────────────── */
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes heroKenBurns {
          from { transform: scale(1.06); }
          to   { transform: scale(1); }
        }

        /* ── Staggered entrance: badge → title → sub → cta → stats → trust */
        .hero-anim-badge {
          animation: heroFadeUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.05s both;
        }
        .hero-anim-title {
          animation: heroFadeUp 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both;
        }
        .hero-anim-sub {
          animation: heroFadeUp 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.35s both;
        }
        .hero-anim-cta {
          animation: heroFadeUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.48s both;
        }
        .hero-anim-stat {
          animation: heroFadeUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        .hero-anim-trust {
          animation: heroFadeIn 0.8s ease-out 1s both;
        }

        /* ── Button hover ───────────────────────────────────── */
        .hero-btn-primary:hover {
          background-color: var(--color-primary-600) !important;
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 40px rgba(55, 138, 221, 0.4);
        }
        .hero-btn-outline:hover {
          background-color: rgba(255, 255, 255, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
          transform: translateY(-2px);
        }

        /* ── Responsive ─────────────────────────────────────── */
        @media (max-width: 1023px) {
          .hero-section-fhd {
            min-height: 680px !important;
            padding-block: 4rem !important;
          }
          .hero-overlay-desktop { display: none !important; }
          .hero-overlay-mobile  { display: block !important; }
          .hero-content {
            margin-inline: auto !important;
            text-align: center !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          .hero-cta-group   { justify-content: center !important; }
          .hero-stats-bar   { justify-content: center !important; gap: 1.5rem !important; margin-top: 3rem !important; }
          .hero-trust-indicators { justify-content: center !important; }
        }

        @media (max-width: 639px) {
          .hero-section-fhd { min-height: 600px !important; }
          .hero-stats-bar > div { flex: 1 1 100px; }
        }

        /* ── Reduced motion ─────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .hero-anim-badge,
          .hero-anim-title,
          .hero-anim-sub,
          .hero-anim-cta,
          .hero-anim-stat,
          .hero-anim-trust {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
