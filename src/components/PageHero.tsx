import Link from 'next/link';
import * as React from 'react';

/**
 * PageHero — Shared inner-page header for all public routes.
 *
 * Props:
 *   breadcrumb  {string}           Current page label shown after "Beranda ›"
 *   title       {string}           h1 text
 *   subtitle    {string}           Muted subtitle below h1
 *   children    {React.ReactNode}  Optional page-specific content (e.g. step indicators)
 */
interface PageHeroProps {
  breadcrumb: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function PageHero({ breadcrumb, title, subtitle, children }: PageHeroProps) {
  return (
    <section
      aria-label={`Halaman ${breadcrumb}`}
      style={{
        background: 'var(--color-primary-800)',
        paddingTop: '2.5rem',    /* pt-10 */
        paddingBottom: '3rem',   /* pb-12 */
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="container-site">

        {/* ── Breadcrumb ──────────────────────────────────── */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1.125rem' }}>
          <ol style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            listStyle: 'none',
            fontSize: '0.75rem',
            color: 'var(--color-primary-200)',
            margin: 0,
            padding: 0,
          }}>
            <li>
              <Link
                href="/"
                style={{
                  color: 'var(--color-primary-200)',
                  textDecoration: 'none',
                  transition: 'color 150ms',
                }}
                className="page-hero-breadcrumb-link"
              >
                Beranda
              </Link>
            </li>
            <li aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </li>
            <li aria-current="page" style={{ color: 'var(--color-primary-50)', fontWeight: 500 }}>
              {breadcrumb}
            </li>
          </ol>
        </nav>

        {/* ── Title with amber left-border accent ─────────── */}
        <h1
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.875rem',
            fontSize: 'clamp(1.5rem, 3vw, 2.125rem)',
            fontWeight: 700,
            color: 'var(--color-primary-50)',
            fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)',
            marginBottom: '0.5rem',
            lineHeight: 1.2,
          }}
        >
          {/* Amber accent bar */}
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: '3px',
              height: '1.25em',
              borderRadius: '2px',
              background: 'var(--color-cta)',
              flexShrink: 0,
              alignSelf: 'center',
            }}
          />
          {title}
        </h1>

        {/* ── Subtitle ─────────────────────────────────────── */}
        {subtitle && (
          <p style={{
            color: 'var(--color-primary-200)',
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            marginLeft: 'calc(3px + 0.875rem)', /* align with title text, past the bar */
            maxWidth: '680px',
          }}>
            {subtitle}
          </p>
        )}

        {/* ── Optional children (step indicators, etc.) ────── */}
        {children && (
          <div style={{ marginTop: '1.75rem', marginLeft: 'calc(3px + 0.875rem)' }}>
            {children}
          </div>
        )}
      </div>

      <style>{`
        .page-hero-breadcrumb-link:hover {
          color: var(--color-primary-50) !important;
        }
      `}</style>
    </section>
  );
}
