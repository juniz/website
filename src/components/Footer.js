import Link from 'next/link';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const quickLinks = [
  { href: '/doctors',  label: 'Profil Dokter' },
  { href: '/schedule', label: 'Jadwal Dokter' },
  { href: '/register', label: 'Daftar Online' },
  { href: '/news',     label: 'Berita & Info' },
  { href: '/about',    label: 'Tentang Kami' },
];

const services = [
  'Poli Jantung',
  'Poli Anak',
  'Poli Bedah',
  'Poli Kandungan',
  'Poli Saraf',
  'Radiologi',
  'IGD 24 Jam',
];

export default function Footer({ data, pageStatuses = [] }) {
  const currentYear = new Date().getFullYear();

  // Helper to check if a route is active
  const isPageActive = (href) => {
    const status = pageStatuses.find(s => s.route === href);
    return status ? status.isActive : true; // Default to true if not found
  };

  const filteredQuickLinks = quickLinks.filter(link => isPageActive(link.href));

  const footerInfo = [
    {
      icon: <MapPin size={14} />,
      text: data?.address || 'Nganjuk, Jawa Timur 64418',
    },
    {
      icon: <Phone size={14} />,
      text: data?.phone || '(0358) XXXXXX',
    },
    {
      icon: <Mail size={14} />,
      text: data?.email || 'info@rsbhayangkara-nganjuk.id',
    },
    {
      icon: <Clock size={14} />,
      text: data?.business_hours || 'IGD: 24 Jam · Poli: Sen–Jum 07.00–21.00',
    },
  ];

  return (
    <footer
      role="contentinfo"
      style={{
        backgroundColor: 'var(--color-primary-900)',
        borderTop: '1px solid rgba(133, 183, 235, 0.15)',
      }}
    >
      {/* Main footer content */}
      <div
        className="container-site"
        style={{
          paddingBlock: '3rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {/* Column 1: RS Info */}
          <div>
            {/* Logo */}
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.625rem',
                textDecoration: 'none',
                marginBottom: '1rem',
              }}
              aria-label="RS Bhayangkara Nganjuk — Halaman Utama"
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'var(--color-primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C11.45 2 11 2.45 11 3V11H3C2.45 11 2 11.45 2 12C2 12.55 2.45 13 3 13H11V21C11 21.55 11.45 22 12 22C12.55 22 13 21.55 13 21V13H21C21.55 13 22 12.55 22 12C22 11.45 21.55 11 21 11H13V3C13 2.45 12.55 2 12 2Z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-primary-50)', fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)', lineHeight: 1.2 }}>
                  {data?.logo_text || 'RS Bhayangkara'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-200)', lineHeight: 1.2 }}>
                  {data?.logo_subtext || 'Nganjuk'}
                </div>
              </div>
            </Link>

            <p style={{ fontSize: '0.8125rem', color: 'var(--color-primary-200)', lineHeight: 1.65, marginBottom: '1.25rem', maxWidth: '260px' }}>
              {data?.tagline || 'Rumah sakit terakreditasi Madya yang melayani masyarakat Nganjuk dengan standar medis terpercaya.'}
            </p>

            {/* Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {footerInfo.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--color-primary-200)', fontSize: '0.8125rem', lineHeight: 1.5 }}>
                  <span style={{ marginTop: '1px', flexShrink: 0 }}>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-50)', marginBottom: '1rem', fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)' }}>
              Tautan Cepat
            </h3>
            <nav aria-label="Tautan footer">
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {filteredQuickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-primary-200)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        transition: 'color 150ms ease-out',
                      }}
                      className="footer-link"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 3: Layanan */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-50)', marginBottom: '1rem', fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)' }}>
              Layanan Kami
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {services.map((service) => (
                <li key={service} style={{ fontSize: '0.8125rem', color: 'var(--color-primary-200)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span
                    aria-hidden="true"
                    style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--color-primary-400)', flexShrink: 0 }}
                  />
                  {service}
                </li>
              ))}
            </ul>

            {/* Accreditation badge */}
            <div
              style={{
                marginTop: '1.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.875rem',
                background: 'rgba(24, 95, 165, 0.3)',
                border: '1px solid rgba(55, 138, 221, 0.3)',
                borderRadius: '8px',
              }}
              aria-label="Status akreditasi: Terakreditasi Madya"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-400)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
              <div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-primary-400)', fontWeight: 600 }}>TERAKREDITASI</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--color-primary-200)' }}>Madya — KARS</div>
              </div>
            </div>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-50)', marginBottom: '1rem', fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)' }}>
              Ikuti Kami
            </h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {data?.instagram && (
                <a href={data.instagram} target="_blank" rel="noopener noreferrer" className="social-link" title="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              )}
              {data?.facebook && (
                <a href={data.facebook} target="_blank" rel="noopener noreferrer" className="social-link" title="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
              )}
              {data?.twitter && (
                <a href={data.twitter} target="_blank" rel="noopener noreferrer" className="social-link" title="Twitter / X">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
              )}
              {data?.youtube && (
                <a href={data.youtube} target="_blank" rel="noopener noreferrer" className="social-link" title="YouTube">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.4 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.4-5.58z"></path><path d="M9.75 15.02l5.75-3.02-5.75-3.02v6.04z"></path></svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div
        style={{
          borderTop: '1px solid rgba(133, 183, 235, 0.1)',
          backgroundColor: 'rgba(0,0,0,0.2)',
        }}
      >
        <div
          className="container-site"
          style={{
            paddingBlock: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <p style={{ fontSize: '0.75rem', color: 'var(--color-primary-200)' }}>
            © {currentYear} RS Bhayangkara Nganjuk. Hak cipta dilindungi.
          </p>
        </div>
      </div>

      <style>{`
        .footer-link:hover {
          color: var(--color-primary-50) !important;
        }
        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(255,255,255,0.08);
          color: var(--color-primary-200);
          transition: all 150ms ease-out;
        }
        .social-link:hover {
          background: var(--color-primary-400);
          color: #fff;
          transform: translateY(-2px);
        }
      `}</style>
    </footer>
  );
}
