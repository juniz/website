'use client';

import { useState } from 'react';
import { updateSiteSettings } from '@/app/actions/admin/settings';
import {
  Save,
  Loader2,
  Power,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Clock,
  MessageSquare,
  ShieldAlert,
  Globe,
  Wifi,
  WifiOff,
} from 'lucide-react';

/**
 * StatusSettingsForm — Mengelola status aktif/nonaktif website (Maintenance Mode).
 * Redesigned for premium admin UX — azure-blue + danger-red design system.
 */
export default function StatusSettingsForm({ initialData }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [data, setData] = useState({
    isMaintenance: initialData?.isMaintenance ?? false,
    message:
      initialData?.message ||
      'Mohon maaf, saat ini website kami sedang dalam pemeliharaan rutin untuk meningkatkan layanan bagi Anda. Silakan hubungi kami melalui telepon atau datang langsung untuk kebutuhan darurat.',
    estimatedFinish: initialData?.estimatedFinish || '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const res = await updateSiteSettings('maintenance', data);
    setLoading(false);

    if (res.success) {
      setStatus('success');
      setTimeout(() => setStatus(null), 4000);
    } else {
      setStatus('error');
    }
  };

  const isMaintenance = data.isMaintenance;

  return (
    <form onSubmit={handleSubmit} className="sf-form">

      {/* ── Live Status Banner ───────────────────────────── */}
      <div className={`sf-status-banner ${isMaintenance ? 'sf-banner-offline' : 'sf-banner-online'}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="sf-banner-icon-wrap">
          {isMaintenance ? <WifiOff size={22} /> : <Wifi size={22} />}
        </div>
        <div className="sf-banner-text">
          <span className="sf-banner-title">
            {isMaintenance ? 'Website Sedang Offline' : 'Website Aktif & Online'}
          </span>
          <span className="sf-banner-desc">
            {isMaintenance
              ? 'Pengunjung dialihkan ke halaman pemeliharaan saat ini.'
              : 'Semua pengunjung dapat mengakses website secara normal.'}
          </span>
        </div>
        <div className="sf-banner-pulse" aria-hidden="true">
          <span className="sf-pulse-dot" />
        </div>
      </div>

      {/* ── Danger Zone: Maintenance Toggle ─────────────── */}
      <fieldset className={`settings-fieldset sf-danger-zone ${isMaintenance ? 'sf-danger-active' : ''}`}>
        <legend className="settings-fieldset-legend sf-legend-danger">
          <span className="settings-fieldset-icon sf-icon-danger">
            <ShieldAlert size={14} />
          </span>
          Kontrol Akses Website
        </legend>

        <p className="settings-fieldset-hint">
          Gunakan fitur ini jika Anda ingin melakukan pemeliharaan sistem atau menonaktifkan sementara akses publik ke website.
        </p>

        <div className="sf-toggle-row">
          <div className="sf-toggle-icon-col">
            <span className={`sf-toggle-status-icon ${isMaintenance ? 'sf-toggle-status-off' : 'sf-toggle-status-on'}`}>
              <Power size={18} />
            </span>
          </div>
          <div className="sf-toggle-info">
            <span className="sf-toggle-title">Mode Pemeliharaan</span>
            <span className="sf-toggle-desc">
              Jika diaktifkan, semua pengunjung akan dialihkan ke halaman pemeliharaan
              dan tidak dapat mengakses konten website.
            </span>
            {isMaintenance && (
              <div className="sf-toggle-warning" role="alert">
                <AlertTriangle size={12} />
                Website sedang tidak dapat diakses oleh publik!
              </div>
            )}
          </div>

          {/* iOS-style toggle switch */}
          <label className="sf-switch" aria-label="Toggle mode pemeliharaan">
            <input
              type="checkbox"
              name="isMaintenance"
              checked={isMaintenance}
              onChange={handleChange}
              className="sf-switch-input"
              role="switch"
              aria-checked={isMaintenance}
            />
            <span className="sf-switch-track">
              <span className="sf-switch-thumb" />
            </span>
          </label>
        </div>
      </fieldset>

      {/* ── Maintenance Message ──────────────────────────── */}
      <fieldset
        className="settings-fieldset"
        disabled={!isMaintenance}
        style={{ opacity: isMaintenance ? 1 : 0.5, transition: 'opacity 250ms ease' }}
      >
        <legend className="settings-fieldset-legend">
          <span className="settings-fieldset-icon">
            <MessageSquare size={14} />
          </span>
          Pesan Halaman Pemeliharaan
        </legend>
        <p className="settings-fieldset-hint">
          Pesan yang akan ditampilkan kepada pengunjung saat mode pemeliharaan aktif.
        </p>

        <div className="sf-fields">
          <div className="settings-form-group">
            <label className="settings-label" htmlFor="sf-message">
              Pesan Pemberitahuan
            </label>
            <div className="sf-textarea-wrap">
              <span className="sf-textarea-icon">
                <MessageSquare size={14} />
              </span>
              <textarea
                id="sf-message"
                name="message"
                className="sf-textarea"
                value={data.message}
                onChange={handleChange}
                placeholder="Tuliskan alasan pemeliharaan yang informatif untuk pengunjung..."
                rows={4}
                disabled={!isMaintenance}
                aria-disabled={!isMaintenance}
              />
            </div>
            <span className="settings-helper">
              Gunakan kalimat yang sopan dan informatif. Sebutkan cara kontak darurat jika perlu.
            </span>
          </div>

          <div className="settings-form-group">
            <label className="settings-label" htmlFor="sf-estimated">
              <span>Estimasi Selesai</span>
              <span className="sf-label-optional">Opsional</span>
            </label>
            <div className="settings-input-wrap">
              <span className="settings-input-icon">
                <Clock size={15} />
              </span>
              <input
                id="sf-estimated"
                className="settings-input"
                type="text"
                name="estimatedFinish"
                value={data.estimatedFinish}
                onChange={handleChange}
                placeholder="Contoh: Senin, 10 Mei pukul 12:00 WIB"
                disabled={!isMaintenance}
                aria-disabled={!isMaintenance}
              />
            </div>
            <span className="settings-helper">
              Akan ditampilkan di halaman pemeliharaan agar pengunjung tahu kapan bisa kembali.
            </span>
          </div>
        </div>
      </fieldset>

      {/* ── Info Card ────────────────────────────────────── */}
      <div className="sf-info-card">
        <Globe size={15} className="sf-info-icon" />
        <p className="sf-info-text">
          Perubahan status berlaku <strong>segera setelah disimpan</strong>. Pastikan Anda sudah
          menyiapkan konten halaman pemeliharaan sebelum mengaktifkan mode ini.
        </p>
      </div>

      {/* ── Form Footer ──────────────────────────────────── */}
      <div className="settings-form-footer">
        <div>
          {status === 'success' && (
            <div className="settings-status settings-status-success" role="status" aria-live="polite">
              <CheckCircle2 size={14} />
              Pengaturan status berhasil disimpan!
            </div>
          )}
          {status === 'error' && (
            <div className="settings-status settings-status-error" role="alert">
              <AlertCircle size={14} />
              Gagal menyimpan. Coba lagi.
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="settings-btn-save"
          aria-busy={loading}
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      <style>{`
        /* ── Form Layout ───────────────────────────────────── */
        .sf-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ── Live Status Banner ────────────────────────────── */
        .sf-status-banner {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          border-radius: var(--admin-radius-md);
          border: 1px solid;
          position: relative;
          overflow: hidden;
          transition: background 350ms ease, border-color 350ms ease;
        }

        .sf-banner-online {
          background: linear-gradient(135deg, #edfcf4 0%, #d2f5e3 100%);
          border-color: #a4e8c1;
          color: #0d6b3f;
        }

        .sf-banner-offline {
          background: linear-gradient(135deg, #fff4f4 0%, #ffe2e2 100%);
          border-color: #f9bcbc;
          color: #b12a2a;
        }

        .sf-banner-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 350ms ease;
        }

        .sf-banner-online .sf-banner-icon-wrap {
          background: rgba(16, 124, 65, 0.12);
          color: #107c41;
        }

        .sf-banner-offline .sf-banner-icon-wrap {
          background: rgba(185, 28, 28, 0.12);
          color: #b91c1c;
        }

        .sf-banner-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }

        .sf-banner-title {
          font-size: 0.9375rem;
          font-weight: 700;
          line-height: 1.3;
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
        }

        .sf-banner-desc {
          font-size: 0.8125rem;
          font-weight: 400;
          opacity: 0.8;
          line-height: 1.4;
        }

        /* Pulsing dot */
        .sf-banner-pulse {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sf-pulse-dot {
          display: block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          position: relative;
        }

        .sf-banner-online .sf-pulse-dot {
          background: #22c55e;
          box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5);
          animation: sfPulse 2s ease-out infinite;
        }

        .sf-banner-offline .sf-pulse-dot {
          background: #ef4444;
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5);
          animation: sfPulse 2s ease-out infinite;
        }

        @keyframes sfPulse {
          0%   { box-shadow: 0 0 0 0 currentColor; opacity: 1; }
          70%  { box-shadow: 0 0 0 8px transparent; opacity: 0.8; }
          100% { box-shadow: 0 0 0 0 transparent; opacity: 1; }
        }

        /* ── Fieldset Base (shared) ───────────────────────── */
        .settings-fieldset {
          border: 1px solid var(--admin-border-soft);
          border-radius: var(--admin-radius-md);
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0;
          overflow: hidden;
        }

        .settings-fieldset-legend {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--admin-text-h);
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          background: var(--admin-surface-2);
          border-bottom: 1px solid var(--admin-border-soft);
          padding: 12px 16px;
          width: 100%;
          float: left;
        }

        .settings-fieldset-icon {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: var(--admin-primary-l);
          color: var(--admin-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .settings-fieldset-hint {
          font-size: 0.75rem;
          color: var(--admin-text-s);
          padding: 10px 16px 0;
          line-height: 1.5;
        }

        /* ── Danger Zone ──────────────────────────────────── */
        .sf-danger-zone {
          border-color: var(--admin-border-soft);
          transition: border-color 300ms ease, box-shadow 300ms ease;
        }

        .sf-danger-zone.sf-danger-active {
          border-color: #f9bcbc;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.07);
        }

        .sf-legend-danger {
          transition: background 300ms ease;
        }

        .sf-danger-active .sf-legend-danger {
          background: #fff4f4;
          border-bottom-color: #f9bcbc;
        }

        .sf-icon-danger {
          background: var(--admin-danger-l, #ffe2e2);
          color: var(--admin-danger, #d94040);
          transition: background 300ms ease, color 300ms ease;
        }

        /* ── Toggle Row ───────────────────────────────────── */
        .sf-toggle-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px;
        }

        .sf-toggle-icon-col {
          flex-shrink: 0;
          padding-top: 2px;
        }

        .sf-toggle-status-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          transition: background 300ms ease, color 300ms ease;
        }

        .sf-toggle-status-on {
          background: #edfcf4;
          color: #107c41;
        }

        .sf-toggle-status-off {
          background: #fff4f4;
          color: #b91c1c;
        }

        .sf-toggle-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .sf-toggle-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--admin-text-h);
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          line-height: 1.3;
        }

        .sf-toggle-desc {
          font-size: 0.8125rem;
          color: var(--admin-text-s);
          line-height: 1.5;
        }

        .sf-toggle-warning {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 6px;
          padding: 4px 10px;
          background: #fff0f0;
          border: 1px solid #f9bcbc;
          border-radius: 999px;
          font-size: 0.6875rem;
          font-weight: 700;
          color: #b91c1c;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          animation: sfWarnIn 280ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes sfWarnIn {
          from { opacity: 0; transform: translateY(4px) scale(0.95); }
          to   { opacity: 1; transform: none; }
        }

        /* ── iOS-style Switch ─────────────────────────────── */
        .sf-switch {
          flex-shrink: 0;
          cursor: pointer;
          position: relative;
          display: inline-block;
          padding-top: 2px;
        }

        .sf-switch-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .sf-switch-track {
          display: block;
          width: 50px;
          height: 28px;
          border-radius: 999px;
          background: var(--admin-border, #d4d4d8);
          transition: background 280ms cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .sf-switch-thumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2), 0 0 0 0.5px rgba(0,0,0,0.05);
          transition: transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .sf-switch-input:checked ~ .sf-switch-track {
          background: #ef4444;
        }

        .sf-switch-input:checked ~ .sf-switch-track .sf-switch-thumb {
          transform: translateX(22px);
        }

        .sf-switch-input:focus-visible ~ .sf-switch-track {
          outline: 2.5px solid var(--admin-primary);
          outline-offset: 2px;
        }

        /* ── Maintenance Fields ─────────────────────────────── */
        .sf-fields {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
        }

        .settings-form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .settings-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--admin-text-b);
          line-height: 1.4;
        }

        .sf-label-optional {
          font-size: 0.6875rem;
          font-weight: 500;
          color: var(--admin-text-s);
          background: var(--admin-surface-2);
          border: 1px solid var(--admin-border-soft);
          border-radius: 4px;
          padding: 1px 6px;
        }

        .sf-textarea-wrap {
          position: relative;
        }

        .sf-textarea-icon {
          position: absolute;
          top: 11px;
          left: 11px;
          color: var(--admin-text-s);
          display: flex;
          align-items: center;
          pointer-events: none;
        }

        .sf-textarea {
          width: 100%;
          padding: 10px 12px 10px 34px;
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-sm);
          font-size: 0.875rem;
          color: var(--admin-text-b);
          background: var(--admin-surface);
          font-family: inherit;
          line-height: 1.6;
          resize: vertical;
          min-height: 100px;
          transition: border-color 150ms, box-shadow 150ms;
        }

        .sf-textarea:focus {
          outline: none;
          border-color: var(--admin-primary);
          box-shadow: 0 0 0 3px rgba(24, 95, 165, 0.12);
        }

        .sf-textarea::placeholder {
          color: var(--admin-text-s);
        }

        .sf-textarea:disabled {
          background: var(--admin-surface-2);
          cursor: not-allowed;
        }

        /* Shared input styles (reused across the page) */
        .settings-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .settings-input-icon {
          position: absolute;
          left: 11px;
          color: var(--admin-text-s);
          display: flex;
          align-items: center;
          pointer-events: none;
          flex-shrink: 0;
        }

        .settings-input {
          width: 100%;
          height: 40px;
          padding: 0 12px 0 36px;
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-sm);
          font-size: 0.875rem;
          color: var(--admin-text-b);
          background: var(--admin-surface);
          font-family: inherit;
          transition: border-color 150ms, box-shadow 150ms;
        }

        .settings-input:focus {
          outline: none;
          border-color: var(--admin-primary);
          box-shadow: 0 0 0 3px rgba(24, 95, 165, 0.12);
        }

        .settings-input::placeholder {
          color: var(--admin-text-s);
        }

        .settings-input:disabled {
          background: var(--admin-surface-2);
          cursor: not-allowed;
        }

        .settings-helper {
          font-size: 0.75rem;
          color: var(--admin-text-s);
          line-height: 1.4;
        }

        /* ── Info Card ──────────────────────────────────────── */
        .sf-info-card {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          background: var(--admin-primary-l, #EBF4FF);
          border: 1px solid rgba(24, 95, 165, 0.15);
          border-radius: var(--admin-radius-md);
        }

        .sf-info-icon {
          color: var(--admin-primary);
          flex-shrink: 0;
          margin-top: 1px;
        }

        .sf-info-text {
          font-size: 0.8125rem;
          color: var(--admin-primary);
          line-height: 1.55;
        }

        .sf-info-text strong {
          font-weight: 700;
        }

        /* ── Footer / Save Action ───────────────────────────── */
        .settings-form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding-top: 4px;
          flex-wrap: wrap;
        }

        .settings-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8125rem;
          font-weight: 500;
          padding: 7px 12px;
          border-radius: var(--admin-radius-sm);
          animation: sfWarnIn 280ms ease both;
        }

        .settings-status-success {
          background: var(--admin-success-l, #edfcf4);
          color: #116045;
        }

        .settings-status-error {
          background: var(--admin-danger-l, #fff4f4);
          color: var(--admin-danger, #d94040);
        }

        .settings-btn-save {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          background: var(--admin-primary);
          color: #fff;
          border: none;
          border-radius: var(--admin-radius-sm);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 150ms, box-shadow 150ms, transform 100ms;
          min-height: 40px;
          min-width: 160px;
          justify-content: center;
        }

        .settings-btn-save:hover:not(:disabled) {
          background: var(--admin-primary-h);
          box-shadow: 0 3px 10px rgba(24, 95, 165, 0.28);
        }

        .settings-btn-save:active:not(:disabled) {
          transform: scale(0.98);
        }

        .settings-btn-save:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* ── Reduced motion ─────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .sf-pulse-dot,
          .sf-toggle-warning,
          .settings-status {
            animation: none !important;
          }
          .sf-switch-track,
          .sf-switch-thumb,
          .sf-status-banner,
          .sf-toggle-status-icon,
          .sf-danger-zone {
            transition: none !important;
          }
        }
      `}</style>
    </form>
  );
}
