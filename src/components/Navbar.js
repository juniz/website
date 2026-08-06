'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const defaultNavLinks = [
  { href: '/', label: 'Beranda', key: 'home', showInNavbar: true, order: 1 },
  { href: '/about', label: 'Profil', key: 'about', showInNavbar: true, order: 2 },
  { href: '/doctors', label: 'Dokter', key: 'doctors', showInNavbar: true, order: 3 },
  { href: '/schedule', label: 'Jadwal', key: 'schedule', showInNavbar: true, order: 4 },
  { href: '/news', label: 'Berita', key: 'news', showInNavbar: true, order: 5 },
  { href: '/pejabat', label: 'Pejabat', key: 'pejabat', showInNavbar: true, order: 6 },
  { href: '/faq', label: 'FAQ', key: 'faq', showInNavbar: true, order: 7 },
];

export default function Navbar({ data, pageStatuses = [] }) {
  const pathname = usePathname();

  // Helper to check if a route is active
  const isPageActive = (href) => {
    const status = pageStatuses.find(s => s.route === href);
    return status ? status.isActive : true; // Default to true if not found
  };

  // Build navLinks from dynamic data.menu or defaultNavLinks
  const rawLinks = (data?.menu && Array.isArray(data.menu) && data.menu.length > 0)
    ? data.menu.map(item => ({
      href: item.route,
      label: item.label,
      key: item.route,
      showInNavbar: item.showInNavbar ?? true,
      order: item.order ?? 10,
    }))
    : defaultNavLinks;

  const filteredNavLinks = rawLinks
    .filter(link => link.showInNavbar && isPageActive(link.href))
    .sort((a, b) => a.order - b.order);
  const showRegisterCTA = isPageActive('/pendaftaran');

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for subtle shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [pathname]);

  // Close menu on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      {/* Skip link */}
      <a href="#main-content" className="skip-link">
        Lewati ke konten utama
      </a>

      <header
        role="banner"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'var(--color-primary-800)',
          boxShadow: scrolled
            ? '0 2px 20px rgba(4, 44, 83, 0.5)'
            : '0 1px 0 rgba(255,255,255,0.08)',
          transition: 'box-shadow 200ms ease-out',
        }}
      >
        <div
          className="container-site"
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '64px',
            gap: '2rem',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="RS Bhayangkara Nganjuk — Halaman Utama"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            {/* Medical cross SVG / Logo RS */}
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                overflow: 'hidden'
              }}
              aria-hidden="true"
            >
              <Image
                src="/images/logo/rs.png"
                alt=""
                width={34}
                height={34}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--color-primary-50)',
                  fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)',
                  lineHeight: 1.2,
                }}
              >
                {data?.logo_text || 'RS Bhayangkara'}
              </div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--color-primary-200)',
                  lineHeight: 1.2,
                }}
              >
                {data?.logo_subtext || 'Nganjuk'}
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Navigasi utama"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}
            className="desktop-nav"
          >
            {filteredNavLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: isActive ? 'var(--color-primary-50)' : 'var(--color-primary-200)',
                    textDecoration: 'none',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    borderBottom: isActive ? '1.5px solid var(--color-primary-400)' : '1.5px solid transparent',
                    transition: 'color 150ms ease-out, border-color 150ms ease-out, background 150ms ease-out',
                    display: 'flex',
                    minHeight: '44px',
                    alignItems: 'center',
                  }}
                  className="nav-link"
                >
                  {link.label}
                </Link>
              );
            })}


            {/* CTA */}
            {showRegisterCTA && (
              <Link
                href="/pendaftaran"
                style={{
                  marginLeft: '0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-primary-600)',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'background-color 150ms ease-out, box-shadow 150ms ease-out',
                  minHeight: '44px',
                }}
                className="nav-cta"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Daftar Sekarang
              </Link>
            )}
          </nav>

          {/* Hamburger button (mobile only) */}
          <button
            type="button"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              background: 'transparent',
              border: '1px solid rgba(133, 183, 235, 0.25)',
              borderRadius: '8px',
              cursor: 'pointer',
              color: 'var(--color-primary-50)',
              marginLeft: 'auto',
              flexShrink: 0,
              transition: 'background 150ms ease-out',
            }}
            className="hamburger-btn"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="3" y1="8" x2="21" y2="8" />
                <line x1="3" y1="16" x2="21" y2="16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Menu navigasi"
        aria-modal="true"
        aria-hidden={!menuOpen}
        style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'var(--color-primary-900)',
          zIndex: 99,
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden',
          transform: menuOpen ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'opacity 200ms ease-out, transform 200ms ease-out, visibility 200ms',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          gap: '0.5rem',
          overflowY: 'auto',
        }}
        className="mobile-menu-overlay"
      >
        {filteredNavLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.key}
              href={link.href}
              aria-current={isActive ? 'page' : undefined}
              style={{
                fontSize: '1rem',
                fontWeight: 500,
                color: isActive ? 'var(--color-primary-50)' : 'var(--color-primary-200)',
                textDecoration: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: isActive ? 'rgba(133, 183, 235, 0.1)' : 'transparent',
                boxShadow: isActive ? 'inset 3px 0 var(--color-primary-400)' : 'none',
                transition: 'background 150ms ease-out, color 150ms ease-out',
                display: 'flex',
                alignItems: 'center',
                minHeight: '44px',
              }}
            >
              {link.label}
            </Link>
          );
        })}

        {showRegisterCTA && (
          <Link
            href="/pendaftaran"
            style={{
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.875rem 1rem',
              borderRadius: '10px',
              backgroundColor: 'var(--color-primary-600)',
              color: 'var(--color-primary-50)',
              fontSize: '0.9375rem',
              fontWeight: 600,
              textDecoration: 'none',
              minHeight: '48px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Daftar Sekarang
          </Link>
        )}

        {/* RS info in mobile menu */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '1.5rem',
            borderTop: '0.5px solid rgba(133, 183, 235, 0.2)',
            fontSize: '0.75rem',
            color: 'var(--color-primary-200)',
            lineHeight: 1.6,
          }}
        >
          {data?.address && <div>Alamat: {data.address}</div>}
          {data?.phone && <div style={{ marginTop: '0.25rem' }}>Telepon: {data.phone}</div>}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
        @media (min-width: 768px) {
          .mobile-menu-overlay { display: none !important; }
        }
        .nav-link:hover {
          color: var(--color-primary-50) !important;
          background: rgba(133, 183, 235, 0.08);
        }
        .nav-cta:hover {
          background-color: var(--color-primary-600) !important;
          box-shadow: 0 4px 16px rgba(55, 138, 221, 0.4);
        }
      `}</style>
    </>
  );
}
