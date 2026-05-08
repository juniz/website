import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';

/**
 * PartnerSection — RSC (React Server Component)
 *
 * Displays the "Mitra & Kepercayaan" section on the public landing page.
 * Data is driven entirely by the admin panel (PartnerForm / /admin/partner).
 *
 * Design tokens used:
 *   --color-primary-{50,100,200,400,600,900} — azure-blue system
 *   --color-neutral-{50,100,200,600,700,900}
 *   --font-figtree — heading font
 *   section-py / container-site              — global layout utilities
 */

function PartnerLogo({ partner }) {
  const inner = (
    <figure
      className="ps-logo-card"
      aria-label={`Logo mitra: ${partner.name}`}
    >
      {partner.logo_url ? (
        <Image
          src={getImageUrl(partner.logo_url)}
          alt={partner.name}
          width={160}
          height={72}
          className="ps-logo-img"
        />
      ) : (
        /* Fallback: text monogram when no logo is uploaded */
        <span className="ps-logo-fallback" aria-hidden="true">
          {partner.name.slice(0, 2).toUpperCase()}
        </span>
      )}
      {/* <figcaption className="ps-logo-caption">{partner.name}</figcaption> */}
    </figure>
  );

  if (partner.website_url) {
    return (
      <a
        href={partner.website_url}
        target="_blank"
        rel="noopener noreferrer"
        className="ps-logo-link"
        title={`Kunjungi situs ${partner.name}`}
      >
        {inner}
      </a>
    );
  }

  return <div className="ps-logo-link ps-logo-no-link">{inner}</div>;
}

export default function PartnerSection({ data = [] }) {
  /* Only render if there is at least one active partner */
  if (data.length === 0) return null;

  return (
    <section
      aria-labelledby="partners-heading"
      className="ps-section section-py"
    >
      {/* Top accent line */}
      <div className="ps-accent-bar" aria-hidden="true" />

      <div className="container-site">
        {/* ── Section Header ──────────────────────── */}
        <div className="ps-header">
          <div className="ps-badge" aria-hidden="true">
            {/* Handshake SVG icon */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M11 17a4 4 0 0 1-4-4V5l2-2h6l2 2v8a4 4 0 0 1-4 4z" />
              <path d="M11 17v4" />
              <path d="M7 21h10" />
              <path d="M7 12H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1" />
              <path d="M17 12h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1" />
            </svg>
            Mitra Terpercaya
          </div>

          <h2 className="ps-title" id="partners-heading">
            Didukung Mitra &amp; Asuransi
          </h2>
          <p className="ps-subtitle">
            RS Bhayangkara Nganjuk bekerja sama dengan institusi terkemuka untuk
            memberikan pelayanan kesehatan terbaik bagi seluruh lapisan masyarakat.
          </p>
        </div>

        {/* ── Logo Grid ───────────────────────────── */}
        <div
          className="ps-grid"
          role="list"
          aria-label="Daftar mitra rumah sakit"
        >
          {data.map((partner) => (
            <div key={partner.id} role="listitem" className="ps-grid-item">
              <PartnerLogo partner={partner} />
            </div>
          ))}
        </div>

        {/* ── Trust Strip ─────────────────────────── */}
        <div className="ps-trust-strip" aria-label="Indikator kepercayaan">
          <div className="ps-trust-item">
            {/* Shield check */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
            <span>Terverifikasi &amp; Resmi</span>
          </div>
          <span className="ps-trust-dot" aria-hidden="true" />
          <div className="ps-trust-item">
            {/* Stethoscope / medical icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
              <circle cx="20" cy="10" r="2"/>
            </svg>
            <span>Mendukung Layanan Medis</span>
          </div>
          <span className="ps-trust-dot" aria-hidden="true" />
          <div className="ps-trust-item">
            {/* Users */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>Melayani Semua Pasien</span>
          </div>
        </div>
      </div>

      {/* ── Scoped Styles ─────────────────────────── */}
      <style>{`
        /* ── Section wrapper ───────────────────────────────── */
        .ps-section {
          position: relative;
          background: var(--color-neutral-50, #F8FAFC);
          overflow: hidden;
        }

        /* Top azure accent bar */
        .ps-accent-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(
            90deg,
            var(--color-primary-400, #378ADD) 0%,
            var(--color-primary-600, #185FA5) 50%,
            var(--color-primary-400, #378ADD) 100%
          );
        }

        /* Soft radial glow for depth */
        .ps-section::before {
          content: '';
          position: absolute;
          top: -80px;
          right: -120px;
          width: 480px;
          height: 480px;
          background: radial-gradient(
            circle,
            rgba(55, 138, 221, 0.06) 0%,
            transparent 70%
          );
          pointer-events: none;
        }

        /* ── Header ────────────────────────────────────────── */
        .ps-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.75rem;
          margin-bottom: 2.75rem;
        }

        /* Badge pill */
        .ps-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          background: var(--color-primary-50, #E6F1FB);
          color: var(--color-primary-600, #185FA5);
          border: 1px solid var(--color-primary-100, #B5D4F4);
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
        }

        .ps-title {
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 700;
          color: var(--color-primary-900, #042C53);
          line-height: 1.25;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .ps-subtitle {
          font-size: 0.9375rem;
          color: var(--color-neutral-600, #475569);
          line-height: 1.65;
          max-width: 560px;
          margin: 0;
        }

        /* ── Logo grid ─────────────────────────────────────── */
        .ps-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        @media (min-width: 480px) {
          .ps-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (min-width: 768px) {
          .ps-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.25rem;
          }
        }

        @media (min-width: 1024px) {
          .ps-grid { grid-template-columns: repeat(5, 1fr); }
        }

        @media (min-width: 1280px) {
          .ps-grid { grid-template-columns: repeat(6, 1fr); }
        }

        .ps-grid-item {
          display: flex;
        }

        /* ── Logo card ─────────────────────────────────────── */
        .ps-logo-link {
          display: flex;
          flex: 1;
          text-decoration: none;
          border-radius: 12px;
          outline: none;
          transition: transform 200ms ease-out;
        }

        .ps-logo-link:focus-visible .ps-logo-card {
          outline: 2.5px solid var(--color-primary-400, #378ADD);
          outline-offset: 2px;
        }

        .ps-logo-link:not(.ps-logo-no-link):hover .ps-logo-card {
          border-color: var(--color-primary-200, #85B7EB);
          box-shadow: 0 6px 20px rgba(24, 95, 165, 0.12);
          transform: translateY(-2px);
        }

        .ps-logo-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.625rem;
          padding: 1.25rem 1rem;
          background: #ffffff;
          border: 1px solid var(--color-neutral-200, #E2E8F0);
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition:
            border-color 200ms ease-out,
            box-shadow 200ms ease-out,
            transform 200ms ease-out;
          margin: 0;
          min-height: 110px;
        }

        /* Image logo */
        .ps-logo-img {
          width: 100%;
          max-width: 120px;
          height: 56px;
          object-fit: contain;
          /* Remove color cast from transparent PNGs / make grayscale logos feel branded */
          filter: none;
          transition: filter 200ms ease-out;
        }

        .ps-logo-link:not(.ps-logo-no-link):hover .ps-logo-img {
          filter: none;
        }

        /* Text fallback monogram */
        .ps-logo-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border-radius: 10px;
          background: var(--color-primary-50, #E6F1FB);
          color: var(--color-primary-600, #185FA5);
          font-size: 1.125rem;
          font-weight: 800;
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          letter-spacing: -0.02em;
          flex-shrink: 0;
        }

        /* Caption */
        .ps-logo-caption {
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--color-neutral-600, #475569);
          text-align: center;
          line-height: 1.3;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          letter-spacing: 0.01em;
        }

        /* ── Trust strip ───────────────────────────────────── */
        .ps-trust-strip {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.75rem 1.25rem;
          padding: 1rem 1.5rem;
          background: var(--color-primary-50, #E6F1FB);
          border: 1px solid var(--color-primary-100, #B5D4F4);
          border-radius: 12px;
        }

        .ps-trust-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-primary-600, #185FA5);
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
        }

        .ps-trust-dot {
          display: block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--color-primary-200, #85B7EB);
          flex-shrink: 0;
        }

        @media (max-width: 480px) {
          .ps-trust-dot { display: none; }
          .ps-trust-strip { gap: 0.5rem; }
        }

        /* ── Reduced motion ────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .ps-logo-link:not(.ps-logo-no-link):hover .ps-logo-card {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
