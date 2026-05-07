'use client';

import { useActionState, useState } from 'react';
import { checkLogin } from '@/app/actions/auth';
import Image from 'next/image';

/* ─── Trustworthy Split-Layout Login (Style 2) ───────────────────────────────
   Design System: Trust & Authority · Minimalism & Swiss Style
   Color: Navy #1E3A5F · Accent #0369A1 · White #F8FAFC
   Typography: Inter (heading) · system-ui (body)
   Layout: Two-column split — brand panel left, form panel right
   Responsive: collapses to single-column on mobile
── ─────────────────────────────────────────────────────────────────────────── */

const TRUST_ITEMS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    label: 'Akses Terenkripsi',
    desc: 'Koneksi SSL/TLS 256-bit',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    label: 'Autentikasi JWT',
    desc: 'Token aman berbasis waktu',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    label: 'Akses Berbasis Peran',
    desc: 'Kontrol hak administrator',
  },
];

export default function LoginPageClient() {
  const [errorMessage, formAction, isPending] = useActionState(checkLogin, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        /* ── Reset & Container ─────────────────────────────── */
        .lp-root {
          min-height: 100dvh;
          display: flex;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background: #F8FAFC;
          overflow: hidden;
        }

        /* ── Left brand panel ──────────────────────────────── */
        .lp-brand {
          flex: 0 0 46%;
          background: linear-gradient(160deg, #0F172A 0%, #1E3A5F 55%, #1a4a7a 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px 52px;
          position: relative;
          overflow: hidden;
        }

        /* subtle grid texture */
        .lp-brand::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        /* decorative circle */
        .lp-brand-circle {
          position: absolute;
          bottom: -120px;
          right: -100px;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(3,105,161,.35) 0%, transparent 70%);
          pointer-events: none;
        }
        .lp-brand-circle2 {
          position: absolute;
          top: -80px;
          left: -80px;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,.05) 0%, transparent 70%);
          pointer-events: none;
        }

        /* brand logo */
        .lp-logo-wrap {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .lp-logo-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.18);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
          backdrop-filter: blur(8px);
        }
        .lp-logo-name {
          font-size: 0.8125rem;
          font-weight: 700;
          color: rgba(255,255,255,.9);
          line-height: 1.3;
          letter-spacing: .02em;
        }
        .lp-logo-sub {
          font-size: 0.6875rem;
          color: rgba(255,255,255,.45);
          font-weight: 500;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        /* hero text */
        .lp-hero {
          position: relative;
          z-index: 1;
        }
        .lp-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          border: 1px solid rgba(3,105,161,.6);
          background: rgba(3,105,161,.15);
          color: #7DD3FC;
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .lp-hero-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #38BDF8;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .4; }
        }
        .lp-hero-title {
          font-size: 2.625rem;
          font-weight: 900;
          color: #fff;
          line-height: 1.12;
          letter-spacing: -.02em;
          margin-bottom: 18px;
        }
        .lp-hero-title em {
          font-style: normal;
          color: #7DD3FC;
        }
        .lp-hero-desc {
          font-size: 0.9375rem;
          color: rgba(255,255,255,.55);
          line-height: 1.65;
          max-width: 340px;
          margin-bottom: 40px;
        }

        /* trust items */
        .lp-trust-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .lp-trust-item {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .lp-trust-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #93C5FD;
          flex-shrink: 0;
        }
        .lp-trust-text-label {
          font-size: 0.8125rem;
          font-weight: 700;
          color: rgba(255,255,255,.9);
        }
        .lp-trust-text-desc {
          font-size: 0.6875rem;
          color: rgba(255,255,255,.4);
          margin-top: 1px;
        }

        /* footer */
        .lp-brand-footer {
          position: relative;
          z-index: 1;
          font-size: 0.6875rem;
          color: rgba(255,255,255,.25);
          font-weight: 500;
          letter-spacing: .05em;
        }

        /* ── Right form panel ──────────────────────────────── */
        .lp-form-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 48px 52px;
          background: #fff;
          position: relative;
        }

        @keyframes lp-fadein {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .lp-form-inner {
          width: 100%;
          max-width: 400px;
          animation: lp-fadein .55s ease-out both;
        }

        /* form heading */
        .lp-form-heading {
          margin-bottom: 36px;
        }
        .lp-form-kicker {
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: #0369A1;
          margin-bottom: 10px;
        }
        .lp-form-title {
          font-size: 1.875rem;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -.025em;
          line-height: 1.2;
          margin-bottom: 8px;
        }
        .lp-form-subtitle {
          font-size: 0.875rem;
          color: #64748B;
          line-height: 1.55;
        }

        /* divider */
        .lp-divider {
          width: 40px;
          height: 3px;
          background: linear-gradient(90deg, #1E3A5F, #0369A1);
          border-radius: 99px;
          margin: 16px 0 32px;
        }

        /* form fields */
        .lp-field {
          margin-bottom: 20px;
        }
        .lp-label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #1E293B;
          margin-bottom: 7px;
        }
        .lp-input-wrap {
          position: relative;
        }
        .lp-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
          pointer-events: none;
          transition: color .2s;
          display: flex;
          align-items: center;
        }
        .lp-input-wrap:focus-within .lp-input-icon {
          color: #0369A1;
        }
        .lp-input {
          width: 100%;
          height: 48px;
          padding: 0 44px 0 44px;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          font-size: 0.9375rem;
          font-family: inherit;
          color: #0F172A;
          background: #FAFBFC;
          transition: border-color .2s, box-shadow .2s, background .2s;
          outline: none;
          touch-action: manipulation;
          box-sizing: border-box;
        }
        .lp-input::placeholder { color: #CBD5E1; }
        .lp-input:hover { border-color: #CBD5E1; background: #fff; }
        .lp-input:focus {
          border-color: #0369A1;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(3,105,161,.12);
        }
        .lp-pw-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #94A3B8;
          padding: 6px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          transition: color .2s;
        }
        .lp-pw-toggle:hover { color: #0369A1; }
        .lp-pw-toggle:focus-visible {
          outline: 2px solid #0369A1;
          outline-offset: 2px;
        }

        /* error */
        .lp-error {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 10px;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          margin-bottom: 20px;
          animation: slideDown .25s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .lp-error-icon {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #FCA5A5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
          color: #DC2626;
        }
        .lp-error-msg {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #B91C1C;
          line-height: 1.45;
        }

        /* submit */
        .lp-submit {
          width: 100%;
          height: 50px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #1E3A5F 0%, #0369A1 100%);
          color: #fff;
          font-family: inherit;
          font-size: 0.9375rem;
          font-weight: 700;
          letter-spacing: .01em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: opacity .2s, transform .15s, box-shadow .2s;
          box-shadow: 0 4px 14px rgba(3,105,161,.35);
          margin-top: 8px;
          touch-action: manipulation;
        }
        .lp-submit:hover:not(:disabled) {
          opacity: .92;
          box-shadow: 0 6px 20px rgba(3,105,161,.45);
          transform: translateY(-1px);
        }
        .lp-submit:active:not(:disabled) {
          transform: scale(.98);
          box-shadow: 0 2px 8px rgba(3,105,161,.3);
        }
        .lp-submit:disabled { opacity: .65; cursor: not-allowed; }
        .lp-submit:focus-visible {
          outline: 3px solid #0369A1;
          outline-offset: 2px;
        }

        /* spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .lp-spinner {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255,255,255,.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }

        /* form footer */
        .lp-form-footer {
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid #F1F5F9;
          text-align: center;
        }
        .lp-form-footer p {
          font-size: 0.75rem;
          color: #94A3B8;
          line-height: 1.5;
        }
        .lp-form-footer strong {
          color: #475569;
          font-weight: 600;
        }

        /* ── Responsive ────────────────────────────────────── */
        @media (max-width: 900px) {
          .lp-brand { display: none; }
          .lp-form-panel { padding: 32px 24px; }
        }
        @media (max-width: 480px) {
          .lp-form-panel { padding: 24px 20px; }
          .lp-form-title { font-size: 1.5rem; }
        }

        /* ── Reduced motion ────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .lp-form-inner, .lp-error, .lp-hero-badge-dot { animation: none !important; transition: none !important; }
        }
      `}</style>

      <div className="lp-root" role="main">
        {/* ── Left: Brand panel ── */}
        <aside className="lp-brand" aria-hidden="true">
          <div className="lp-brand-circle" />
          <div className="lp-brand-circle2" />

          {/* Logo */}
          <div className="lp-logo-wrap">
            <div className="lp-logo-icon">
              <Image src="/images/logo/rs.png" alt="Logo RS" width={32} height={32} style={{ objectFit: 'contain' }} />
            </div>
            <div>
              <div className="lp-logo-name">RS Bhayangkara Nganjuk</div>
              <div className="lp-logo-sub">Admin Portal</div>
            </div>
          </div>

          {/* Hero */}
          <div className="lp-hero">
            <div className="lp-hero-badge">
              <span className="lp-hero-badge-dot" />
              Sistem Aktif
            </div>
            <h2 className="lp-hero-title">
              Panel<br />
              Manajemen<br />
              <em>Terpercaya</em>
            </h2>
            <p className="lp-hero-desc">
              Kelola dokter, jadwal, pendaftaran, dan konten berita RS Bhayangkara Nganjuk dari satu dasbor yang aman dan efisien.
            </p>

            {/* Trust signals */}
            <ul className="lp-trust-list" role="list">
              {TRUST_ITEMS.map((item) => (
                <li key={item.label} className="lp-trust-item">
                  <div className="lp-trust-icon">{item.icon}</div>
                  <div>
                    <div className="lp-trust-text-label">{item.label}</div>
                    <div className="lp-trust-text-desc">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand footer */}
          <div className="lp-brand-footer">
            © 2025 TI RS Bhayangkara Nganjuk · Secure Admin Portal v1.0
          </div>
        </aside>

        {/* ── Right: Form panel ── */}
        <section className="lp-form-panel">
          <div className="lp-form-inner">

            {/* Heading */}
            <div className="lp-form-heading">
              <p className="lp-form-kicker">Administrator Login</p>
              <h1 className="lp-form-title">Selamat Datang</h1>
              <div className="lp-divider" />
              <p className="lp-form-subtitle">
                Masukkan kredensial administrator Anda untuk mengakses panel manajemen.
              </p>
            </div>

            {/* Form */}
            <form action={formAction} noValidate>
              {/* Error */}
              {errorMessage && (
                <div className="lp-error" role="alert" aria-live="assertive">
                  <div className="lp-error-icon">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" aria-hidden="true">
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  </div>
                  <p className="lp-error-msg">{errorMessage}</p>
                </div>
              )}

              {/* Email */}
              <div className="lp-field">
                <label htmlFor="login-email" className="lp-label">
                  Email Administrator <span aria-hidden="true" style={{ color: '#DC2626' }}>*</span>
                </label>
                <div className="lp-input-wrap">
                  <span className="lp-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="lp-input"
                    placeholder="admin@rsbhayangkara.com"
                    aria-required="true"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="lp-field">
                <label htmlFor="login-password" className="lp-label">
                  Kata Sandi <span aria-hidden="true" style={{ color: '#DC2626' }}>*</span>
                </label>
                <div className="lp-input-wrap">
                  <span className="lp-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="lp-input"
                    placeholder="••••••••"
                    aria-required="true"
                  />
                  <button
                    type="button"
                    className="lp-pw-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="lp-submit"
                disabled={isPending}
                aria-busy={isPending}
              >
                {isPending ? (
                  <>
                    <span className="lp-spinner" aria-hidden="true" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    Masuk ke Sistem
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="lp-form-footer">
              <p>
                Akses hanya untuk <strong>administrator resmi</strong>.<br />
                Hubungi IT jika mengalami masalah login.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
