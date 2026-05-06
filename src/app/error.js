'use client';

/* ============================================================
   error.js — Root-level Error Boundary (500 / uncaught errors)
   Must be 'use client' — Next.js requirement.
   Receives: error (Error object), unstable_retry (retry fn)
   ============================================================ */

import { useEffect } from 'react';

export default function Error({ error, unstable_retry }) {
  useEffect(() => {
    // Log to error reporting service in production
    console.error('[App Error]', error);
  }, [error]);

  return (
    <div className="ep-container">
      <div className="ep-blob ep-blob-1" aria-hidden="true" />
      <div className="ep-blob ep-blob-2" aria-hidden="true" />

      <main className="ep-card" id="main-content" role="main">
        <div className="ep-icon-wrap ep-danger" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <div className="ep-icon-ring" />
        </div>

        <div className="ep-code-badge ep-danger" aria-label="Kode error 500">500</div>

        <h1 className="ep-title">Terjadi Kesalahan Server</h1>
        <p className="ep-message">
          Sistem kami mengalami gangguan sementara. Tim teknis kami sedang bekerja
          untuk memperbaikinya. Silakan coba beberapa saat lagi.
        </p>

        <div className="ep-actions" role="group" aria-label="Pilihan tindakan">
          <button
            type="button"
            onClick={() => unstable_retry?.()}
            className="ep-btn ep-btn-primary"
            id="ep-retry-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M23 4v6h-6"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Coba Lagi
          </button>
          <a href="/" className="ep-btn ep-btn-secondary" id="ep-home-btn">
            Kembali ke Beranda
          </a>
        </div>

        <hr className="ep-divider" aria-hidden="true" />

        <div className="ep-contact">
          <p className="ep-contact-label">Butuh bantuan segera?</p>
          <div className="ep-contact-grid">
            <a href="tel:0358321111" className="ep-contact-item" aria-label="Telepon IGD">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.2 2 2 0 0 1 3.56 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.51a16 16 0 0 0 6.12 6.12l1.87-1.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>IGD: (0358) 321111</span>
            </a>
            <a href="mailto:info@rsbhayangkara-nganjuk.id" className="ep-contact-item" aria-label="Email RS Bhayangkara">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>info@rsbhayangkara-nganjuk.id</span>
            </a>
          </div>
        </div>
      </main>

      <style>{`
        .ep-container {
          min-height: 100dvh; width: 100%;
          background: var(--color-neutral-50, #F1EFE8);
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
          font-family: var(--font-inter, 'Inter', system-ui, sans-serif);
          position: relative; overflow: hidden;
        }
        .ep-blob { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(80px); opacity: 0.35; }
        .ep-blob-1 { width: 500px; height: 500px; top: -150px; right: -100px; background: radial-gradient(circle, #FEC9C9 0%, #E24B4A 60%, transparent 100%); animation: epFloat 8s ease-in-out infinite; }
        .ep-blob-2 { width: 350px; height: 350px; bottom: -100px; left: -80px; background: radial-gradient(circle, #B5D4F4 0%, #85B7EB 80%, transparent 100%); animation: epFloat 10s ease-in-out infinite reverse; }
        @keyframes epFloat { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-24px) scale(1.04); } }
        .ep-card {
          position: relative; z-index: 1;
          max-width: 520px; width: 100%;
          background: #ffffff;
          border: 1px solid var(--color-neutral-200, #D3D1C7);
          border-radius: 24px; padding: 52px 44px; text-align: center;
          box-shadow: 0 4px 6px -1px rgba(4,44,83,0.04), 0 20px 40px -8px rgba(4,44,83,0.1), 0 0 0 1px rgba(133,183,235,0.12);
          animation: epSlideIn 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        @keyframes epSlideIn { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .ep-icon-wrap { width: 88px; height: 88px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; position: relative; }
        .ep-danger { background: var(--color-danger-light, #FCEBEB); color: var(--color-danger, #E24B4A); }
        .ep-icon-ring { position: absolute; inset: -6px; border-radius: 50%; border: 1.5px dashed currentColor; opacity: 0.25; animation: epSpin 20s linear infinite; }
        @keyframes epSpin { to { transform: rotate(360deg); } }
        .ep-code-badge {
          display: inline-block;
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          font-size: 4.5rem; font-weight: 800; letter-spacing: -0.04em; line-height: 1; margin-bottom: 8px;
          background: linear-gradient(135deg, #991B1B 0%, var(--color-danger, #E24B4A) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ep-title { font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif); font-size: 1.375rem; font-weight: 700; color: var(--color-neutral-900, #2C2C2A); margin-bottom: 12px; letter-spacing: -0.01em; line-height: 1.3; }
        .ep-message { font-size: 0.9375rem; color: var(--color-neutral-600, #5F5E5A); line-height: 1.65; margin-bottom: 32px; max-width: 380px; margin-inline: auto; }
        .ep-actions { display: flex; flex-direction: column; gap: 10px; margin-bottom: 32px; }
        .ep-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 0.75rem 1.5rem; border-radius: 10px; font-size: 0.9375rem; font-weight: 600; text-decoration: none; cursor: pointer; border: none; min-height: 48px; transition: background-color 150ms ease-out, box-shadow 150ms ease-out, transform 150ms ease-out; touch-action: manipulation; }
        .ep-btn:active { transform: scale(0.97); }
        .ep-btn-primary { background-color: var(--color-danger, #E24B4A); color: #fff; box-shadow: 0 4px 14px rgba(226,75,74,0.3); }
        .ep-btn-primary:hover { background-color: #c73b3a; box-shadow: 0 6px 20px rgba(226,75,74,0.4); }
        .ep-btn-secondary { background-color: var(--color-primary-50, #E6F1FB); color: var(--color-primary-600, #185FA5); border: 1.5px solid var(--color-primary-100, #B5D4F4); }
        .ep-btn-secondary:hover { background-color: var(--color-primary-100, #B5D4F4); }
        .ep-divider { border: none; border-top: 1px solid var(--color-neutral-200, #D3D1C7); margin-bottom: 24px; }
        .ep-contact-label { font-size: 0.8125rem; font-weight: 600; color: var(--color-neutral-600, #5F5E5A); margin-bottom: 12px; }
        .ep-contact-grid { display: flex; flex-direction: column; gap: 8px; align-items: center; }
        .ep-contact-item { display: inline-flex; align-items: center; gap: 6px; font-size: 0.8125rem; color: var(--color-neutral-600, #5F5E5A); text-decoration: none; transition: color 150ms ease-out; }
        .ep-contact-item:hover { color: var(--color-primary-600, #185FA5); }
        @media (min-width: 480px) { .ep-actions { flex-direction: row; } .ep-btn { flex: 1; } }
        @media (max-width: 479px) { .ep-card { padding: 36px 24px; border-radius: 20px; } .ep-code-badge { font-size: 3.5rem; } .ep-title { font-size: 1.25rem; } .ep-icon-wrap { width: 72px; height: 72px; } }
        @media (prefers-reduced-motion: reduce) { .ep-card, .ep-blob-1, .ep-blob-2, .ep-icon-ring { animation: none !important; } .ep-btn { transition: none !important; } }
      `}</style>
    </div>
  );
}
