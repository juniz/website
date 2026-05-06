'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* ============================================================
   Error Page Config — per status code
   ============================================================ */
const ERROR_CONFIGS = {
  404: {
    code: '404',
    title: 'Halaman Tidak Ditemukan',
    message: 'Halaman yang Anda cari tidak tersedia atau mungkin telah dipindahkan. Silakan kembali ke halaman utama.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
        <path d="M8 11h6M11 8v6"/>
      </svg>
    ),
    colorClass: 'ep-blue',
    primaryAction: { label: 'Kembali ke Beranda', href: '/' },
    secondaryAction: { label: 'Cari Dokter', href: '/doctors' },
  },
  403: {
    code: '403',
    title: 'Akses Ditolak',
    message: 'Anda tidak memiliki izin untuk mengakses halaman ini. Silakan masuk dengan akun yang sesuai atau hubungi administrator.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        <line x1="12" y1="15" x2="12" y2="17"/>
      </svg>
    ),
    colorClass: 'ep-warning',
    primaryAction: { label: 'Masuk ke Akun', href: '/login' },
    secondaryAction: { label: 'Kembali ke Beranda', href: '/' },
  },
  500: {
    code: '500',
    title: 'Terjadi Kesalahan Server',
    message: 'Sistem kami mengalami gangguan sementara. Tim teknis kami sedang bekerja untuk memperbaikinya. Silakan coba beberapa saat lagi.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    colorClass: 'ep-danger',
    primaryAction: { label: 'Coba Lagi', href: null, isRetry: true },
    secondaryAction: { label: 'Kembali ke Beranda', href: '/' },
  },
  503: {
    code: '503',
    title: 'Layanan Tidak Tersedia',
    message: 'Layanan sedang dalam pemeliharaan atau mengalami beban tinggi. Silakan kembali dalam beberapa menit.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    colorClass: 'ep-warning',
    primaryAction: { label: 'Muat Ulang Halaman', href: null, isRetry: true },
    secondaryAction: { label: 'Kembali ke Beranda', href: '/' },
  },
};

const DEFAULT_CONFIG = {
  code: 'Error',
  title: 'Terjadi Kesalahan',
  message: 'Sesuatu yang tidak terduga terjadi. Silakan coba lagi atau hubungi kami jika masalah berlanjut.',
  icon: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  colorClass: 'ep-blue',
  primaryAction: { label: 'Coba Lagi', href: null, isRetry: true },
  secondaryAction: { label: 'Kembali ke Beranda', href: '/' },
};

/* ============================================================
   Contact Info (bottom of card)
   ============================================================ */
function ContactInfo() {
  return (
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
  );
}

/* ============================================================
   Main Component
   ============================================================ */
export default function ErrorPage({ statusCode, onRetry }) {
  const router = useRouter();
  const config = ERROR_CONFIGS[statusCode] || DEFAULT_CONFIG;

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      router.refresh();
    }
  };

  return (
    <div className="ep-container">
      {/* Decorative background blobs */}
      <div className="ep-blob ep-blob-1" aria-hidden="true" />
      <div className="ep-blob ep-blob-2" aria-hidden="true" />

      <main className="ep-card" id="main-content" role="main" tabIndex={-1}>
        {/* Icon */}
        <div className={`ep-icon-wrap ${config.colorClass}`} aria-hidden="true">
          {config.icon}
          <div className="ep-icon-ring" />
        </div>

        {/* Code badge */}
        <div className={`ep-code-badge ${config.colorClass}`} aria-label={`Kode error ${config.code}`}>
          {config.code}
        </div>

        {/* Text */}
        <h1 className="ep-title">{config.title}</h1>
        <p className="ep-message">{config.message}</p>

        {/* Actions */}
        <div className="ep-actions" role="group" aria-label="Pilihan tindakan">
          {config.primaryAction.isRetry ? (
            <button
              type="button"
              onClick={handleRetry}
              className="ep-btn ep-btn-primary"
              id="ep-retry-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M23 4v6h-6"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              {config.primaryAction.label}
            </button>
          ) : (
            <Link href={config.primaryAction.href} className="ep-btn ep-btn-primary" id="ep-primary-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              {config.primaryAction.label}
            </Link>
          )}

          {config.secondaryAction.isRetry ? (
            <button
              type="button"
              onClick={handleRetry}
              className="ep-btn ep-btn-secondary"
              id="ep-secondary-btn"
            >
              {config.secondaryAction.label}
            </button>
          ) : (
            <Link href={config.secondaryAction.href} className="ep-btn ep-btn-secondary" id="ep-secondary-btn">
              {config.secondaryAction.label}
            </Link>
          )}
        </div>

        {/* Divider */}
        <hr className="ep-divider" aria-hidden="true" />

        {/* Contact */}
        <ContactInfo />
      </main>

      <style>{`
        /* ── Layout ── */
        .ep-container {
          min-height: 100dvh;
          width: 100%;
          background: var(--color-neutral-50, #F1EFE8);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: var(--font-inter, 'Inter', system-ui, sans-serif);
          position: relative;
          overflow: hidden;
        }

        /* ── Decorative blobs ── */
        .ep-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
          opacity: 0.35;
        }
        .ep-blob-1 {
          width: 500px;
          height: 500px;
          top: -150px;
          right: -100px;
          background: radial-gradient(circle, #B5D4F4 0%, #85B7EB 60%, transparent 100%);
          animation: epFloat 8s ease-in-out infinite;
        }
        .ep-blob-2 {
          width: 350px;
          height: 350px;
          bottom: -100px;
          left: -80px;
          background: radial-gradient(circle, #E1F5EE 0%, #1D9E75 80%, transparent 100%);
          animation: epFloat 10s ease-in-out infinite reverse;
        }

        @keyframes epFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-24px) scale(1.04); }
        }

        /* ── Card ── */
        .ep-card {
          position: relative;
          z-index: 1;
          max-width: 520px;
          width: 100%;
          background: #ffffff;
          border: 1px solid var(--color-neutral-200, #D3D1C7);
          border-radius: 24px;
          padding: 52px 44px;
          text-align: center;
          box-shadow:
            0 4px 6px -1px rgba(4, 44, 83, 0.04),
            0 20px 40px -8px rgba(4, 44, 83, 0.1),
            0 0 0 1px rgba(133, 183, 235, 0.12);
          animation: epSlideIn 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }

        @keyframes epSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Icon wrapper ── */
        .ep-icon-wrap {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          position: relative;
        }

        /* Color variants */
        .ep-blue   { background: var(--color-primary-50, #E6F1FB); color: var(--color-primary-600, #185FA5); }
        .ep-warning{ background: #FFF7ED; color: #C2410C; }
        .ep-danger { background: var(--color-danger-light, #FCEBEB); color: var(--color-danger, #E24B4A); }

        .ep-icon-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1.5px dashed currentColor;
          opacity: 0.25;
          animation: epSpin 20s linear infinite;
        }

        @keyframes epSpin {
          to { transform: rotate(360deg); }
        }

        /* ── Code badge ── */
        .ep-code-badge {
          display: inline-block;
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          font-size: 4.5rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 8px;
          background: linear-gradient(135deg, var(--color-primary-900, #042C53) 0%, var(--color-primary-600, #185FA5) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ep-code-badge.ep-warning {
          background: linear-gradient(135deg, #92400E 0%, #D97706 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ep-code-badge.ep-danger {
          background: linear-gradient(135deg, #991B1B 0%, var(--color-danger, #E24B4A) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Typography ── */
        .ep-title {
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          font-size: 1.375rem;
          font-weight: 700;
          color: var(--color-neutral-900, #2C2C2A);
          margin-bottom: 12px;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }

        .ep-message {
          font-size: 0.9375rem;
          color: var(--color-neutral-600, #5F5E5A);
          line-height: 1.65;
          margin-bottom: 32px;
          max-width: 380px;
          margin-inline: auto;
        }

        /* ── Actions ── */
        .ep-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 32px;
        }

        .ep-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-size: 0.9375rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          border: none;
          min-height: 48px;
          transition:
            background-color 150ms ease-out,
            box-shadow 150ms ease-out,
            transform 150ms ease-out;
          touch-action: manipulation;
        }

        .ep-btn:active {
          transform: scale(0.97);
        }

        .ep-btn-primary {
          background-color: var(--color-primary-600, #185FA5);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(24, 95, 165, 0.3);
        }

        .ep-btn-primary:hover {
          background-color: var(--color-primary-800, #0C447C);
          box-shadow: 0 6px 20px rgba(24, 95, 165, 0.4);
        }

        .ep-btn-secondary {
          background-color: var(--color-primary-50, #E6F1FB);
          color: var(--color-primary-600, #185FA5);
          border: 1.5px solid var(--color-primary-100, #B5D4F4);
        }

        .ep-btn-secondary:hover {
          background-color: var(--color-primary-100, #B5D4F4);
        }

        /* ── Divider ── */
        .ep-divider {
          border: none;
          border-top: 1px solid var(--color-neutral-200, #D3D1C7);
          margin-bottom: 24px;
        }

        /* ── Contact ── */
        .ep-contact {}

        .ep-contact-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-neutral-600, #5F5E5A);
          margin-bottom: 12px;
        }

        .ep-contact-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: center;
        }

        .ep-contact-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8125rem;
          color: var(--color-neutral-600, #5F5E5A);
          text-decoration: none;
          transition: color 150ms ease-out;
        }

        .ep-contact-item:hover {
          color: var(--color-primary-600, #185FA5);
        }

        /* ── Responsive ── */
        @media (min-width: 480px) {
          .ep-actions {
            flex-direction: row;
          }

          .ep-btn {
            flex: 1;
          }
        }

        @media (max-width: 479px) {
          .ep-card {
            padding: 36px 24px;
            border-radius: 20px;
          }

          .ep-code-badge {
            font-size: 3.5rem;
          }

          .ep-title {
            font-size: 1.25rem;
          }

          .ep-icon-wrap {
            width: 72px;
            height: 72px;
          }
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .ep-card, .ep-blob-1, .ep-blob-2, .ep-icon-ring {
            animation: none !important;
          }
          .ep-btn {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
