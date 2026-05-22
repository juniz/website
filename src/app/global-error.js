'use client';

/* ============================================================
   global-error.js — Catastrophic root layout error fallback
   Must be 'use client'. Must include its own <html> + <body>.
   This replaces the root layout entirely when it crashes.
   ============================================================ */

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, unstable_retry }) {
  useEffect(() => {
    console.error('[Global Error]', error);
  }, [error]);

  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Terjadi Kesalahan — RS Bhayangkara Nganjuk</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#F1EFE8' }}>
        <div className="ep-container">
          <div className="ep-blob ep-blob-1" aria-hidden="true" />
          <div className="ep-blob ep-blob-2" aria-hidden="true" />

          <main className="ep-card" role="main">
            <div className="ep-icon-wrap" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <div className="ep-icon-ring" />
            </div>

            {/* RS Brand */}
            <div className="ep-brand">
              <span className="ep-brand-name">RS Bhayangkara</span>
              <span className="ep-brand-sub">Nganjuk</span>
            </div>

            <div className="ep-code" aria-label="Kode error">Kesalahan Sistem</div>
            <h1 className="ep-title">Terjadi Masalah Tak Terduga</h1>
            <p className="ep-message">
              Sistem kami mengalami gangguan serius. Kami mohon maaf atas ketidaknyamanan ini.
              Silakan coba memuat ulang halaman atau hubungi kami jika masalah berlanjut.
            </p>

            <div className="ep-actions">
              <button
                type="button"
                onClick={() => unstable_retry?.()}
                className="ep-btn ep-btn-primary"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Coba Lagi
              </button>
              <Link href="/" className="ep-btn ep-btn-secondary">Kembali ke Beranda</Link>
            </div>

            <hr className="ep-divider" aria-hidden="true" />

            <div className="ep-contact">
              <p className="ep-contact-label">Hubungi kami:</p>
              <div className="ep-contact-grid">
                <a href="tel:0358321111" className="ep-contact-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.2 2 2 0 0 1 3.56 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.51a16 16 0 0 0 6.12 6.12l1.87-1.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  IGD: (0358) 321111
                </a>
                <a href="mailto:info@rsbhayangkara-nganjuk.id" className="ep-contact-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  info@rsbhayangkara-nganjuk.id
                </a>
              </div>
            </div>
          </main>
        </div>

        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          .ep-container {
            min-height: 100dvh; width: 100%;
            background: #F1EFE8;
            display: flex; align-items: center; justify-content: center;
            padding: 1.5rem;
            font-family: 'Inter', system-ui, sans-serif;
            position: relative; overflow: hidden;
          }
          .ep-blob { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(80px); opacity: 0.35; }
          .ep-blob-1 { width: 500px; height: 500px; top: -150px; right: -100px; background: radial-gradient(circle, #FEC9C9, #E24B4A 60%, transparent); animation: epFloat 8s ease-in-out infinite; }
          .ep-blob-2 { width: 350px; height: 350px; bottom: -100px; left: -80px; background: radial-gradient(circle, #B5D4F4, #85B7EB 80%, transparent); animation: epFloat 10s ease-in-out infinite reverse; }
          @keyframes epFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-24px) scale(1.04)} }
          .ep-card {
            position: relative; z-index: 1; max-width: 520px; width: 100%;
            background: #fff; border: 1px solid #D3D1C7; border-radius: 24px;
            padding: 52px 44px; text-align: center;
            box-shadow: 0 4px 6px -1px rgba(4,44,83,0.04), 0 20px 40px -8px rgba(4,44,83,0.1);
            animation: epSlideIn 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
          }
          @keyframes epSlideIn { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
          .ep-icon-wrap { width: 88px; height: 88px; border-radius: 50%; background: #FCEBEB; color: #E24B4A; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; position: relative; }
          .ep-icon-ring { position: absolute; inset: -6px; border-radius: 50%; border: 1.5px dashed currentColor; opacity: 0.25; animation: epSpin 20s linear infinite; }
          @keyframes epSpin { to{transform:rotate(360deg)} }
          .ep-brand { display: flex; align-items: baseline; justify-content: center; gap: 4px; margin-bottom: 8px; }
          .ep-brand-name { font-family: 'Figtree', system-ui, sans-serif; font-size: 1rem; font-weight: 700; color: #042C53; }
          .ep-brand-sub { font-size: 0.75rem; color: #5F5E5A; }
          .ep-code { font-family: 'Figtree', system-ui, sans-serif; font-size: 1.25rem; font-weight: 800; margin-bottom: 8px; background: linear-gradient(135deg, #991B1B, #E24B4A); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: -0.02em; }
          .ep-title { font-family: 'Figtree', system-ui, sans-serif; font-size: 1.375rem; font-weight: 700; color: #2C2C2A; margin-bottom: 12px; letter-spacing: -0.01em; }
          .ep-message { font-size: 0.9375rem; color: #5F5E5A; line-height: 1.65; margin-bottom: 32px; max-width: 380px; margin-inline: auto; }
          .ep-actions { display: flex; flex-direction: column; gap: 10px; margin-bottom: 32px; }
          .ep-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 0.75rem 1.5rem; border-radius: 10px; font-size: 0.9375rem; font-weight: 600; text-decoration: none; cursor: pointer; border: none; min-height: 48px; transition: background-color 150ms ease-out; touch-action: manipulation; }
          .ep-btn-primary { background: #E24B4A; color: #fff; box-shadow: 0 4px 14px rgba(226,75,74,0.3); }
          .ep-btn-primary:hover { background: #c73b3a; }
          .ep-btn-secondary { background: #E6F1FB; color: #185FA5; border: 1.5px solid #B5D4F4; }
          .ep-btn-secondary:hover { background: #B5D4F4; }
          .ep-divider { border: none; border-top: 1px solid #D3D1C7; margin-bottom: 24px; }
          .ep-contact-label { font-size: 0.8125rem; font-weight: 600; color: #5F5E5A; margin-bottom: 12px; }
          .ep-contact-grid { display: flex; flex-direction: column; gap: 8px; align-items: center; }
          .ep-contact-item { display: inline-flex; align-items: center; gap: 6px; font-size: 0.8125rem; color: #5F5E5A; text-decoration: none; }
          .ep-contact-item:hover { color: #185FA5; }
          @media (min-width: 480px) { .ep-actions { flex-direction: row; } .ep-btn { flex: 1; } }
          @media (max-width: 479px) { .ep-card { padding: 36px 24px; border-radius: 20px; } .ep-title { font-size: 1.25rem; } .ep-icon-wrap { width: 72px; height: 72px; } }
          @media (prefers-reduced-motion: reduce) { .ep-card, .ep-blob-1, .ep-blob-2, .ep-icon-ring { animation: none !important; } }
        `}</style>
      </body>
    </html>
  );
}
