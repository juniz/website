'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createPartner, updatePartner } from '@/app/actions/admin/partner';
import {
  Save, Loader2, Handshake, Globe, Upload, Image as ImageIcon,
  CheckCircle2, AlertCircle, ArrowLeft, ToggleLeft, ToggleRight,
  ListOrdered, X, Link2,
} from 'lucide-react';

async function compressLogo(file) {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) return resolve(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 400;
        let { width, height } = img;
        if (width > MAX) { height = Math.round((height * MAX) / width); width = MAX; }
        if (height > MAX) { width = Math.round((width * MAX) / height); height = MAX; }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => blob
            ? resolve(new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.webp', { type: 'image/webp' }))
            : resolve(file),
          'image/webp', 0.88
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export default function PartnerForm({ mode = 'create', partner = null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(partner?.logo_url || '');
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name:        partner?.name        || '',
    website_url: partner?.website_url || '',
    sort_order:  partner?.sort_order  ?? 0,
    is_active:   partner?.is_active   ?? true,
  });

  /* ── File handling ──────────────────────────────── */
  async function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('File harus berupa gambar (PNG, JPG, SVG, WebP)', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast('Ukuran file maksimal 2MB', 'error');
      return;
    }
    setIsCompressing(true);
    const optimized = await compressLogo(file);
    setLogoFile(optimized);
    setLogoPreview(URL.createObjectURL(optimized));
    setIsCompressing(false);
  }

  function handleFileChange(e) { handleFile(e.target.files[0]); }
  function handleDragOver(e) { e.preventDefault(); setIsDragging(true); }
  function handleDragLeave() { setIsDragging(false); }
  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }
  function clearLogo() {
    setLogoFile(null);
    setLogoPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  /* ── Form handling ──────────────────────────────── */
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nama partner wajib diisi.';
    if (form.website_url && !/^https?:\/\/.+/.test(form.website_url)) {
      errs.website_url = 'URL harus diawali https:// atau http://';
    }
    return errs;
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const formData = new FormData();
    formData.append('name',       form.name.trim());
    formData.append('website_url', form.website_url.trim());
    formData.append('sort_order', String(form.sort_order));
    formData.append('is_active',  String(form.is_active));
    if (partner?.logo_url) formData.append('existing_logo', partner.logo_url);
    if (logoFile) formData.append('logo', logoFile);

    startTransition(async () => {
      const result = mode === 'create'
        ? await createPartner(formData)
        : await updatePartner(partner.id, formData);

      if (result?.error) {
        showToast(result.error, 'error');
      } else {
        showToast(
          mode === 'create' ? 'Partner berhasil ditambahkan!' : 'Partner berhasil diperbarui!',
          'success'
        );
        setTimeout(() => router.push('/admin/partner'), 900);
      }
    });
  }

  return (
    <div className="pf-page">

      {/* ── Page Header ─────────────────────────────── */}
      <div className="pf-header">
        <div className="pf-header-left">
          <Link href="/admin/partner" className="pf-back-btn" aria-label="Kembali ke daftar partner">
            <ArrowLeft size={16} />
          </Link>
          <div className="pf-header-icon">
            <Handshake size={20} />
          </div>
          <div>
            <h1 className="pf-header-title">
              {mode === 'create' ? 'Tambah Partner Baru' : 'Edit Partner'}
            </h1>
            <p className="pf-header-subtitle">
              {mode === 'create'
                ? 'Tambahkan mitra asuransi atau kerjasama rumah sakit.'
                : `Mengedit: ${partner?.name}`}
            </p>
          </div>
        </div>
      </div>

      {/* ── Form ────────────────────────────────────── */}
      <form onSubmit={handleSubmit} noValidate className="pf-body">

        {/* ── Main ─────────────────────────────── */}
        <div className="pf-main">

          {/* Fieldset: Informasi */}
          <fieldset className="pf-fieldset">
            <legend className="pf-legend">
              <span className="pf-legend-icon"><Handshake size={14} /></span>
              Informasi Partner
            </legend>
            <p className="pf-legend-hint">Nama dan website yang akan ditampilkan pada halaman publik.</p>

            <div className="pf-fields">
              {/* Name */}
              <div className="pf-form-group">
                <label className="pf-label" htmlFor="name">
                  Nama Partner <span className="pf-required">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`pf-input ${errors.name ? 'pf-input-err' : ''}`}
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Contoh: BPJS Kesehatan"
                  required
                  autoComplete="organization"
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <span className="pf-error" role="alert"><AlertCircle size={12} />{errors.name}</span>
                )}
              </div>

              {/* Website */}
              <div className="pf-form-group">
                <label className="pf-label" htmlFor="website_url">
                  <Link2 size={12} style={{ display: 'inline', marginRight: 4 }} />
                  Website URL
                </label>
                <div className="pf-input-wrap">
                  <span className="pf-input-prefix">https://</span>
                  <input
                    id="website_url"
                    name="website_url"
                    type="url"
                    className={`pf-input pf-input-prefixed ${errors.website_url ? 'pf-input-err' : ''}`}
                    value={form.website_url}
                    onChange={handleChange}
                    placeholder="www.bpjs-kesehatan.go.id"
                    autoComplete="url"
                    aria-invalid={!!errors.website_url}
                  />
                </div>
                {errors.website_url
                  ? <span className="pf-error" role="alert"><AlertCircle size={12} />{errors.website_url}</span>
                  : <span className="pf-helper">Opsional. Tampil sebagai link di kartu partner.</span>
                }
              </div>
            </div>
          </fieldset>

          {/* Fieldset: Logo */}
          <fieldset className="pf-fieldset">
            <legend className="pf-legend">
              <span className="pf-legend-icon"><ImageIcon size={14} /></span>
              Logo Partner
            </legend>
            <p className="pf-legend-hint">PNG atau SVG transparan direkomendasikan. Maks. 2MB, otomatis dikompres ke WebP.</p>

            <div className="pf-fields">
              <div
                className={`pf-dropzone ${isDragging ? 'pf-dropzone-drag' : ''} ${logoPreview ? 'pf-dropzone-filled' : ''}`}
                onClick={() => !isCompressing && fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                aria-label="Upload logo partner"
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              >
                {logoPreview ? (
                  <>
                    {/* Preview */}
                    <div className="pf-logo-preview-wrap">
                      <img src={logoPreview} alt="Preview logo" className="pf-logo-preview" />
                    </div>
                    <div className="pf-dropzone-overlay">
                      <Upload size={18} />
                      <span>{isDragging ? 'Lepas untuk ganti' : 'Klik atau drag untuk ganti'}</span>
                    </div>
                    {/* Clear button */}
                    <button
                      type="button"
                      className="pf-logo-clear"
                      onClick={(e) => { e.stopPropagation(); clearLogo(); }}
                      aria-label="Hapus logo"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <div className="pf-dropzone-empty">
                    <div className="pf-dropzone-icon-wrap">
                      <Upload size={22} strokeWidth={1.5} />
                    </div>
                    <p className="pf-dropzone-label">
                      {isDragging ? 'Lepas logo di sini' : 'Klik atau drag logo'}
                    </p>
                    <p className="pf-dropzone-sub">PNG, SVG, JPG, WebP · Maks. 2MB</p>
                  </div>
                )}

                {isCompressing && (
                  <div className="pf-uploading-overlay">
                    <Loader2 size={20} className="animate-spin" />
                    <p>Mengoptimasi…</p>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="pf-file-hidden"
                aria-label="Pilih file logo"
              />

              {/* Checkmark jika logo sudah ada */}
              {logoFile && !isCompressing && (
                <div className="pf-logo-ready">
                  <CheckCircle2 size={14} />
                  Logo siap diupload · Teroptimasi
                </div>
              )}
            </div>
          </fieldset>
        </div>

        {/* ── Sidebar ──────────────────────────────── */}
        <div className="pf-sidebar">

          {/* Fieldset: Pengaturan */}
          <fieldset className="pf-fieldset">
            <legend className="pf-legend">
              <span className="pf-legend-icon"><ListOrdered size={14} /></span>
              Pengaturan
            </legend>

            <div className="pf-fields">
              {/* Sort order */}
              <div className="pf-form-group">
                <label className="pf-label" htmlFor="sort_order">Urutan Tampil</label>
                <input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  min="0"
                  max="999"
                  className="pf-input"
                  value={form.sort_order}
                  onChange={handleChange}
                />
                <span className="pf-helper">Angka kecil tampil lebih dulu (0 = pertama).</span>
              </div>

              {/* Status toggle */}
              <div className="pf-toggle-row">
                <div>
                  <p className="pf-label" style={{ marginBottom: 2 }}>Status Aktif</p>
                  <p className="pf-helper">Logo tampil di website jika aktif.</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.is_active}
                  className={`pf-toggle ${form.is_active ? 'pf-toggle-on' : 'pf-toggle-off'}`}
                  onClick={() => setForm(prev => ({ ...prev, is_active: !prev.is_active }))}
                >
                  {form.is_active
                    ? <><ToggleRight size={18} />Aktif</>
                    : <><ToggleLeft size={18} />Nonaktif</>
                  }
                </button>
              </div>
            </div>
          </fieldset>

          {/* Action buttons */}
          <div className="pf-actions">
            <button
              type="submit"
              disabled={isPending || isCompressing}
              className="pf-btn-submit"
              aria-busy={isPending}
            >
              {isPending
                ? <><Loader2 size={15} className="animate-spin" />{mode === 'create' ? 'Menyimpan…' : 'Memperbarui…'}</>
                : <><Save size={15} />{mode === 'create' ? 'Simpan Partner' : 'Perbarui Partner'}</>
              }
            </button>
            <Link href="/admin/partner" className="pf-btn-cancel">Batal</Link>
          </div>
        </div>
      </form>

      {/* ── Toast ──────────────────────────────────── */}
      {toast && (
        <div className="pf-toast-wrap" role="status" aria-live="polite">
          <div className={`pf-toast pf-toast-${toast.type}`}>
            {toast.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
            {toast.msg}
          </div>
        </div>
      )}

      <style>{`
        /* ── Layout ─────────────────────────────────────── */
        .pf-page { display: flex; flex-direction: column; gap: 20px; }

        /* ── Header ─────────────────────────────────────── */
        .pf-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-lg);
          padding: 18px 24px;
          box-shadow: var(--admin-shadow-xs);
          flex-wrap: wrap;
        }

        .pf-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .pf-back-btn {
          width: 36px; height: 36px;
          border-radius: var(--admin-radius-sm);
          border: 1px solid var(--admin-border);
          background: var(--admin-surface);
          color: var(--admin-text-m);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          text-decoration: none;
          transition: all 150ms;
        }

        .pf-back-btn:hover {
          background: var(--admin-primary-l);
          border-color: var(--admin-primary);
          color: var(--admin-primary);
        }

        .pf-header-icon {
          width: 44px; height: 44px;
          border-radius: var(--admin-radius-md);
          background: var(--admin-primary-l);
          color: var(--admin-primary);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .pf-header-title {
          font-size: 1.0625rem;
          font-weight: 700;
          color: var(--admin-text-h);
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          margin-bottom: 2px;
        }

        .pf-header-subtitle {
          font-size: 0.8125rem;
          color: var(--admin-text-s);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 420px;
        }

        /* ── Form body ──────────────────────────────────── */
        .pf-body {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          align-items: start;
        }

        @media (min-width: 1024px) {
          .pf-body { grid-template-columns: 1fr 280px; }
        }

        .pf-main, .pf-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Fieldset ───────────────────────────────────── */
        .pf-fieldset {
          border: 1px solid var(--admin-border-soft);
          border-radius: var(--admin-radius-md);
          padding: 0;
          margin: 0;
          overflow: hidden;
          background: var(--admin-surface);
          box-shadow: var(--admin-shadow-xs);
        }

        .pf-legend {
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

        .pf-legend-icon {
          width: 24px; height: 24px;
          border-radius: 6px;
          background: var(--admin-primary-l);
          color: var(--admin-primary);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .pf-legend-hint {
          font-size: 0.75rem;
          color: var(--admin-text-s);
          padding: 10px 16px 0;
          line-height: 1.4;
          margin: 0;
        }

        .pf-fields {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
        }

        /* ── Controls ───────────────────────────────────── */
        .pf-form-group { display: flex; flex-direction: column; gap: 5px; }

        .pf-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--admin-text-b);
        }

        .pf-required { color: var(--admin-danger); margin-left: 2px; }

        .pf-input-wrap { position: relative; display: flex; }

        .pf-input-prefix {
          display: flex;
          align-items: center;
          padding: 0 10px;
          background: var(--admin-surface-2);
          border: 1px solid var(--admin-border);
          border-right: none;
          border-radius: var(--admin-radius-sm) 0 0 var(--admin-radius-sm);
          font-size: 0.8125rem;
          color: var(--admin-text-s);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .pf-input {
          width: 100%;
          height: 40px;
          padding: 0 12px;
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-sm);
          font-size: 0.875rem;
          color: var(--admin-text-b);
          background: var(--admin-surface);
          font-family: inherit;
          transition: border-color 150ms, box-shadow 150ms;
        }

        .pf-input-prefixed {
          border-radius: 0 var(--admin-radius-sm) var(--admin-radius-sm) 0;
        }

        .pf-input:focus {
          outline: none;
          border-color: var(--admin-primary);
          box-shadow: 0 0 0 3px rgba(24, 95, 165, 0.12);
        }

        .pf-input::placeholder { color: var(--admin-text-s); }

        .pf-input-err { border-color: var(--admin-danger) !important; }
        .pf-input-err:focus { box-shadow: 0 0 0 3px rgba(217, 64, 64, 0.12) !important; }

        .pf-helper {
          font-size: 0.75rem;
          color: var(--admin-text-s);
          line-height: 1.4;
        }

        .pf-error {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--admin-danger);
        }

        /* ── Logo Dropzone ──────────────────────────────── */
        .pf-dropzone {
          border: 2px dashed var(--admin-border);
          border-radius: var(--admin-radius-md);
          background: var(--admin-surface-2);
          min-height: 160px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          transition: border-color 150ms, background 150ms;
          outline: none;
        }

        .pf-dropzone:hover,
        .pf-dropzone:focus-visible {
          border-color: var(--admin-primary);
          background: var(--admin-primary-l);
        }

        .pf-dropzone-drag {
          border-color: var(--admin-primary);
          background: var(--admin-primary-l);
        }

        .pf-dropzone-filled {
          border-style: solid;
          border-color: var(--admin-border);
          background: var(--admin-surface);
          min-height: 140px;
        }

        .pf-dropzone-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 24px;
          text-align: center;
        }

        .pf-dropzone-icon-wrap {
          width: 48px; height: 48px;
          border-radius: var(--admin-radius-md);
          background: var(--admin-border-soft);
          color: var(--admin-text-s);
          display: flex; align-items: center; justify-content: center;
          transition: background 150ms, color 150ms;
        }

        .pf-dropzone:hover .pf-dropzone-icon-wrap,
        .pf-dropzone-drag .pf-dropzone-icon-wrap {
          background: rgba(24, 95, 165, 0.12);
          color: var(--admin-primary);
        }

        .pf-dropzone-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--admin-text-b);
        }

        .pf-dropzone-sub {
          font-size: 0.75rem;
          color: var(--admin-text-s);
        }

        /* Logo preview */
        .pf-logo-preview-wrap {
          width: 100%;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .pf-logo-preview {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          mix-blend-mode: multiply;
        }

        .pf-dropzone-overlay {
          position: absolute;
          inset: 0;
          background: rgba(10, 25, 60, 0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #fff;
          font-size: 0.75rem;
          font-weight: 600;
          opacity: 0;
          transition: opacity 150ms;
        }

        .pf-dropzone-filled:hover .pf-dropzone-overlay,
        .pf-dropzone-drag .pf-dropzone-overlay {
          opacity: 1;
        }

        .pf-logo-clear {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: rgba(0,0,0,0.55);
          border: none;
          color: #fff;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 150ms;
          z-index: 10;
        }

        .pf-logo-clear:hover { background: var(--admin-danger); }

        .pf-uploading-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.88);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          z-index: 10;
          color: var(--admin-primary);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .pf-file-hidden { display: none; }

        .pf-logo-ready {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--admin-success);
          padding: 6px 10px;
          background: var(--admin-success-l);
          border-radius: var(--admin-radius-sm);
        }

        /* ── Toggle ─────────────────────────────────────── */
        .pf-toggle-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 2px 0;
        }

        .pf-toggle {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: var(--admin-radius-sm);
          border: 1px solid var(--admin-border);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 150ms;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .pf-toggle-on {
          background: var(--admin-success-l);
          border-color: rgba(29, 158, 117, 0.25);
          color: #116045;
        }

        .pf-toggle-off {
          background: var(--admin-surface-2);
          color: var(--admin-text-m);
        }

        /* ── Actions ────────────────────────────────────── */
        .pf-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .pf-btn-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          width: 100%;
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
          min-height: 42px;
        }

        .pf-btn-submit:hover:not(:disabled) {
          background: var(--admin-primary-h);
          box-shadow: 0 3px 10px rgba(24, 95, 165, 0.28);
        }

        .pf-btn-submit:active:not(:disabled) { transform: scale(0.98); }
        .pf-btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }

        .pf-btn-cancel {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 9px 20px;
          background: transparent;
          color: var(--admin-text-m);
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-sm);
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 150ms;
          min-height: 40px;
        }

        .pf-btn-cancel:hover {
          background: var(--admin-surface-2);
          color: var(--admin-text-b);
        }

        /* ── Toast ──────────────────────────────────────── */
        .pf-toast-wrap {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          animation: pfToastIn 220ms ease forwards;
        }

        @keyframes pfToastIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .pf-toast {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          border-radius: var(--admin-radius-md);
          font-size: 0.875rem;
          font-weight: 600;
          box-shadow: var(--admin-shadow-lg);
        }

        .pf-toast-success { background: #1D9E75; color: #fff; }
        .pf-toast-error   { background: var(--admin-danger); color: #fff; }

        @media (max-width: 640px) {
          .pf-header { padding: 14px 16px; }
          .pf-header-subtitle { display: none; }
          .pf-toast-wrap { bottom: 16px; right: 16px; left: 16px; }
          .pf-toast { width: 100%; }
        }
      `}</style>
    </div>
  );
}
