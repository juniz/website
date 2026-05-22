'use client';

import { useState } from 'react';
import { updateSiteSettings } from '@/app/actions/admin/settings';
import Input from '@/components/ui/Input';
import { Save, Loader2, MapPin, Phone, Clock, Type, CheckCircle2, AlertCircle, Building2, Mail } from 'lucide-react';

export default function HeaderSettingsForm({ initialData }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [data, setData] = useState({
    logo_text: initialData?.logo_text || 'RS Bhayangkara',
    logo_subtext: initialData?.logo_subtext || 'Nganjuk',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    business_hours: initialData?.business_hours || '',
    instagram: initialData?.instagram || '',
    facebook: initialData?.facebook || '',
    twitter: initialData?.twitter || '',
    youtube: initialData?.youtube || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const res = await updateSiteSettings('header', data);
    setLoading(false);

    if (res.success) {
      setStatus('success');
      setTimeout(() => setStatus(null), 4000);
    } else {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="hdr-form">

      {/* Section: Identitas Brand */}
      <fieldset className="settings-fieldset">
        <legend className="settings-fieldset-legend">
          <span className="settings-fieldset-icon">
            <Building2 size={14} />
          </span>
          Identitas Brand
        </legend>
        <p className="settings-fieldset-hint">Nama dan subtext yang tampil pada logo di header website.</p>

        <div className="settings-form-grid-2">
          <div className="settings-form-group">
            <label className="settings-label" htmlFor="logo_text">
              Nama Brand (Logo) <span className="settings-required" aria-hidden="true">*</span>
            </label>
            <div className="settings-input-wrap">
              <span className="settings-input-icon"><Type size={15} /></span>
              <input
                id="logo_text"
                className="settings-input"
                type="text"
                name="logo_text"
                value={data.logo_text}
                onChange={handleChange}
                placeholder="RS Bhayangkara"
                required
                autoComplete="organization"
              />
            </div>
          </div>

          <div className="settings-form-group">
            <label className="settings-label" htmlFor="logo_subtext">
              Subtext Logo
            </label>
            <div className="settings-input-wrap">
              <span className="settings-input-icon"><Type size={15} /></span>
              <input
                id="logo_subtext"
                className="settings-input"
                type="text"
                name="logo_subtext"
                value={data.logo_subtext}
                onChange={handleChange}
                placeholder="Nganjuk"
                autoComplete="off"
              />
            </div>
            <span className="settings-helper">Kota atau tagline singkat di bawah nama brand.</span>
          </div>
        </div>
      </fieldset>

      {/* Section: Informasi Kontak */}
      <fieldset className="settings-fieldset">
        <legend className="settings-fieldset-legend">
          <span className="settings-fieldset-icon">
            <Phone size={14} />
          </span>
          Informasi Kontak
        </legend>
        <p className="settings-fieldset-hint">Tampil di footer dan halaman kontak website.</p>

        <div className="settings-form-group">
          <label className="settings-label" htmlFor="address">
            Alamat Lengkap <span className="settings-required" aria-hidden="true">*</span>
          </label>
          <div className="settings-input-wrap">
            <span className="settings-input-icon"><MapPin size={15} /></span>
            <input
              id="address"
              className="settings-input"
              type="text"
              name="address"
              value={data.address}
              onChange={handleChange}
              placeholder="Jl. Ahmad Yani No. 1, Nganjuk, Jawa Timur"
              required
              autoComplete="street-address"
            />
          </div>
        </div>

        <div className="settings-form-grid-2">
          <div className="settings-form-group">
            <label className="settings-label" htmlFor="phone">
              Nomor Telepon / Kontak <span className="settings-required" aria-hidden="true">*</span>
            </label>
            <div className="settings-input-wrap">
              <span className="settings-input-icon"><Phone size={15} /></span>
              <input
                id="phone"
                className="settings-input"
                type="tel"
                name="phone"
                value={data.phone}
                onChange={handleChange}
                placeholder="(0358) XXXXXX"
                required
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="settings-form-group">
            <label className="settings-label" htmlFor="email">
              Email Resmi
            </label>
            <div className="settings-input-wrap">
              <span className="settings-input-icon"><Mail size={15} /></span>
              <input
                id="email"
                className="settings-input"
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="info@rsbhayangkara-nganjuk.id"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="settings-form-group">
            <label className="settings-label" htmlFor="business_hours">
              Jam Operasional <span className="settings-required" aria-hidden="true">*</span>
            </label>
            <div className="settings-input-wrap">
              <span className="settings-input-icon"><Clock size={15} /></span>
              <input
                id="business_hours"
                className="settings-input"
                type="text"
                name="business_hours"
                value={data.business_hours}
                onChange={handleChange}
                placeholder="IGD: 24 Jam · Poli: Sen–Jum 07.00–21.00"
                required
                autoComplete="off"
              />
            </div>
            <span className="settings-helper">Gunakan &quot;·&quot; (middle dot) sebagai pemisah.</span>
          </div>
        </div>
      </fieldset>

      {/* Section: Media Sosial */}
      <fieldset className="settings-fieldset">
        <legend className="settings-fieldset-legend">
          <span className="settings-fieldset-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </span>
          Media Sosial
        </legend>
        <p className="settings-fieldset-hint">Tautkan akun media sosial resmi untuk ditampilkan di footer.</p>

        <div className="settings-form-grid-2">
          <div className="settings-form-group">
            <label className="settings-label" htmlFor="instagram">
              Instagram
            </label>
            <div className="settings-input-wrap">
              <span className="settings-input-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </span>
              <input
                id="instagram"
                className="settings-input"
                type="url"
                name="instagram"
                value={data.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/rsbhayangkara_nganjuk"
              />
            </div>
          </div>

          <div className="settings-form-group">
            <label className="settings-label" htmlFor="facebook">
              Facebook
            </label>
            <div className="settings-input-wrap">
              <span className="settings-input-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </span>
              <input
                id="facebook"
                className="settings-input"
                type="url"
                name="facebook"
                value={data.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/rsbhayangkara_nganjuk"
              />
            </div>
          </div>

          <div className="settings-form-group">
            <label className="settings-label" htmlFor="twitter">
              Twitter / X
            </label>
            <div className="settings-input-wrap">
              <span className="settings-input-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </span>
              <input
                id="twitter"
                className="settings-input"
                type="url"
                name="twitter"
                value={data.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/rsbhayangkara"
              />
            </div>
          </div>

          <div className="settings-form-group">
            <label className="settings-label" htmlFor="youtube">
              YouTube
            </label>
            <div className="settings-input-wrap">
              <span className="settings-input-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.4 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.4-5.58z"></path><path d="M9.75 15.02l5.75-3.02-5.75-3.02v6.04z"></path></svg>
              </span>
              <input
                id="youtube"
                className="settings-input"
                type="url"
                name="youtube"
                value={data.youtube}
                onChange={handleChange}
                placeholder="https://youtube.com/@rsbhayangkara_nganjuk"
              />
            </div>
          </div>
        </div>
      </fieldset>

      {/* Footer: Status + Submit */}
      <div className="settings-form-footer">
        <div>
          {status === 'success' && (
            <div className="settings-status settings-status-success" role="status" aria-live="polite">
              <CheckCircle2 size={14} />
              Pengaturan header berhasil disimpan!
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
        .hdr-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* ── Fieldset ──────────────────────────────────────── */
        .settings-fieldset {
          border: 1px solid var(--admin-border-soft);
          border-radius: var(--admin-radius-md);
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
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
          padding: 0 16px;
          margin-top: -8px;
        }

        /* ── Form Controls ─────────────────────────────────── */
        .settings-form-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          padding: 0 16px 16px;
        }

        @media (min-width: 640px) {
          .settings-form-grid-2 {
            grid-template-columns: 1fr 1fr;
          }
        }

        .settings-form-group:not(:last-child):not(:only-child) {
          /* ensure spacing in standalone form groups */
        }
        
        .settings-fieldset > .settings-form-group {
          padding: 0 16px;
        }

        .settings-fieldset > .settings-form-group + .settings-form-group {
          padding-bottom: 0;
        }

        .settings-form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .settings-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--admin-text-b);
          line-height: 1.4;
        }

        .settings-required {
          color: var(--admin-danger);
          margin-left: 2px;
        }

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

        .settings-helper {
          font-size: 0.75rem;
          color: var(--admin-text-s);
          line-height: 1.4;
        }

        /* ── Footer ────────────────────────────────────────── */
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
        }

        .settings-status-success {
          background: var(--admin-success-l);
          color: #116045;
        }

        .settings-status-error {
          background: var(--admin-danger-l);
          color: var(--admin-danger);
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
      `}</style>
    </form>
  );
}
