'use client';

import { useState, useRef } from 'react';
import { updateSiteSettings, uploadHeroImage } from '@/app/actions/admin/settings';
import {
  Save, Loader2, Award, Type, AlignLeft, BarChart3, Image as ImageIcon,
  Upload, CheckCircle2, AlertCircle, MousePointerClick, Link2, Sparkles, X
} from 'lucide-react';

export default function HeroSettingsForm({ initialData }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error' | null
  const [saveStatus, setSaveStatus] = useState(null);
  const [data, setData] = useState({
    accreditation: initialData?.accreditation || 'Terakreditasi Madya — RS Bhayangkara Nganjuk',
    title: initialData?.title || 'Kesehatan Anda,',
    title_accent: initialData?.title_accent || 'Prioritas Kami',
    subtitle: initialData?.subtitle || '',
    image_url: initialData?.image_url || '',
    stats_label_1: initialData?.stats?.[0]?.label || 'Dokter Spesialis',
    stats_value_1: initialData?.stats?.[0]?.value || '32+',
    stats_label_2: initialData?.stats?.[1]?.label || 'Poli Klinik',
    stats_value_2: initialData?.stats?.[1]?.value || '10',
    stats_label_3: initialData?.stats?.[2]?.label || 'IGD Siaga',
    stats_value_3: initialData?.stats?.[2]?.value || '24/7',
    cta_primary_label: initialData?.cta_primary?.label || 'Daftar Online',
    cta_primary_href: initialData?.cta_primary?.href || '/register',
    cta_secondary_label: initialData?.cta_secondary?.label || 'Lihat Jadwal',
    cta_secondary_href: initialData?.cta_secondary?.href || '/schedule',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const processAndUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (JPG, PNG, atau WebP)');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal adalah 2MB sebelum kompresi');
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxWidth = 1920;
          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(async (blob) => {
            if (!blob) throw new Error('Gagal memproses gambar');
            const uploadFormData = new FormData();
            uploadFormData.append('file', blob, 'hero_optimized.webp');
            const res = await uploadHeroImage(uploadFormData);
            if (res.success) {
              setData(prev => ({ ...prev, image_url: res.url }));
              setUploadStatus('success');
              setTimeout(() => setUploadStatus(null), 3000);
            } else {
              setUploadStatus('error');
            }
            setUploading(false);
          }, 'image/webp', 0.85);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setUploadStatus('error');
      setUploading(false);
    }
  };

  const handleFileChange = (e) => processAndUpload(e.target.files[0]);
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processAndUpload(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveStatus(null);

    const formattedData = {
      accreditation: data.accreditation,
      title: data.title,
      title_accent: data.title_accent,
      subtitle: data.subtitle,
      image_url: data.image_url,
      stats: [
        { label: data.stats_label_1, value: data.stats_value_1 },
        { label: data.stats_label_2, value: data.stats_value_2 },
        { label: data.stats_label_3, value: data.stats_value_3 },
      ],
      cta_primary: { label: data.cta_primary_label, href: data.cta_primary_href },
      cta_secondary: { label: data.cta_secondary_label, href: data.cta_secondary_href }
    };

    const res = await updateSiteSettings('hero', formattedData);
    setLoading(false);

    if (res.success) {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 4000);
    } else {
      setSaveStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="hero-form">

      {/* ── Two-Column Layout ───────────────────────────── */}
      <div className="hero-form-cols">

        {/* ── Left Column: Content ──────────────────────── */}
        <div className="hero-col-main">

          {/* Section: Teks Konten */}
          <fieldset className="settings-fieldset">
            <legend className="settings-fieldset-legend">
              <span className="settings-fieldset-icon"><Sparkles size={14} /></span>
              Konten Teks Hero
            </legend>
            <p className="settings-fieldset-hint">Teks yang tampil di bagian banner utama halaman depan.</p>

            <div className="hero-fields-body">
              {/* Akreditasi Badge */}
              <div className="settings-form-group">
                <label className="settings-label" htmlFor="accreditation">
                  Teks Badge Akreditasi
                </label>
                <div className="settings-input-wrap">
                  <span className="settings-input-icon"><Award size={14} /></span>
                  <input
                    id="accreditation"
                    className="settings-input"
                    type="text"
                    name="accreditation"
                    value={data.accreditation}
                    onChange={handleChange}
                    placeholder="Terakreditasi Madya — RS Bhayangkara Nganjuk"
                    autoComplete="off"
                  />
                </div>
                <span className="settings-helper">Label kecil di atas judul hero.</span>
              </div>

              {/* Judul */}
              <div className="settings-form-grid-2">
                <div className="settings-form-group">
                  <label className="settings-label" htmlFor="title">
                    Judul Utama <span className="settings-required">*</span>
                  </label>
                  <div className="settings-input-wrap">
                    <span className="settings-input-icon"><Type size={14} /></span>
                    <input
                      id="title"
                      className="settings-input"
                      type="text"
                      name="title"
                      value={data.title}
                      onChange={handleChange}
                      placeholder="Kesehatan Anda,"
                      required
                    />
                  </div>
                </div>
                <div className="settings-form-group">
                  <label className="settings-label" htmlFor="title_accent">
                    Judul Aksen <span className="settings-required">*</span>
                  </label>
                  <div className="settings-input-wrap">
                    <span className="settings-input-icon">
                      <Type size={14} style={{ color: 'var(--admin-primary)' }} />
                    </span>
                    <input
                      id="title_accent"
                      className="settings-input settings-input-accent"
                      type="text"
                      name="title_accent"
                      value={data.title_accent}
                      onChange={handleChange}
                      placeholder="Prioritas Kami"
                      required
                    />
                  </div>
                  <span className="settings-helper">Ditampilkan dengan warna brand.</span>
                </div>
              </div>

              {/* Sub-judul */}
              <div className="settings-form-group">
                <label className="settings-label" htmlFor="subtitle">Sub-judul / Deskripsi</label>
                <textarea
                  id="subtitle"
                  name="subtitle"
                  value={data.subtitle}
                  onChange={handleChange}
                  className="settings-textarea"
                  rows={3}
                  placeholder="Layanan kesehatan terpercaya dengan tenaga medis profesional dan fasilitas modern..."
                />
              </div>
            </div>
          </fieldset>

          {/* Section: Tombol CTA */}
          <fieldset className="settings-fieldset">
            <legend className="settings-fieldset-legend">
              <span className="settings-fieldset-icon"><MousePointerClick size={14} /></span>
              Tombol Call to Action
            </legend>
            <p className="settings-fieldset-hint">Dua tombol aksi yang tampil di bawah judul hero.</p>

            <div className="hero-cta-grid">
              {/* CTA Primary */}
              <div className="hero-cta-box hero-cta-primary">
                <div className="hero-cta-box-header">
                  <span className="hero-cta-badge hero-cta-badge-primary">Utama</span>
                  <span className="hero-cta-badge-hint">Warna penuh, prioritas tinggi</span>
                </div>
                <div className="settings-form-group">
                  <label className="settings-label" htmlFor="cta_primary_label">Label Tombol</label>
                  <input
                    id="cta_primary_label"
                    className="settings-input settings-input-no-icon"
                    type="text"
                    name="cta_primary_label"
                    value={data.cta_primary_label}
                    onChange={handleChange}
                    placeholder="Daftar Online"
                  />
                </div>
                <div className="settings-form-group">
                  <label className="settings-label" htmlFor="cta_primary_href">
                    <Link2 size={12} style={{ display: 'inline', marginRight: 4 }} />
                    URL / Link
                  </label>
                  <input
                    id="cta_primary_href"
                    className="settings-input settings-input-no-icon"
                    type="text"
                    name="cta_primary_href"
                    value={data.cta_primary_href}
                    onChange={handleChange}
                    placeholder="/register"
                  />
                </div>
              </div>

              {/* CTA Secondary */}
              <div className="hero-cta-box hero-cta-secondary">
                <div className="hero-cta-box-header">
                  <span className="hero-cta-badge hero-cta-badge-secondary">Sekunder</span>
                  <span className="hero-cta-badge-hint">Outline, prioritas rendah</span>
                </div>
                <div className="settings-form-group">
                  <label className="settings-label" htmlFor="cta_secondary_label">Label Tombol</label>
                  <input
                    id="cta_secondary_label"
                    className="settings-input settings-input-no-icon"
                    type="text"
                    name="cta_secondary_label"
                    value={data.cta_secondary_label}
                    onChange={handleChange}
                    placeholder="Lihat Jadwal"
                  />
                </div>
                <div className="settings-form-group">
                  <label className="settings-label" htmlFor="cta_secondary_href">
                    <Link2 size={12} style={{ display: 'inline', marginRight: 4 }} />
                    URL / Link
                  </label>
                  <input
                    id="cta_secondary_href"
                    className="settings-input settings-input-no-icon"
                    type="text"
                    name="cta_secondary_href"
                    value={data.cta_secondary_href}
                    onChange={handleChange}
                    placeholder="/schedule"
                  />
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        {/* ── Right Column: Image ────────────────────────── */}
        <div className="hero-col-side">
          <fieldset className="settings-fieldset">
            <legend className="settings-fieldset-legend">
              <span className="settings-fieldset-icon"><ImageIcon size={14} /></span>
              Gambar Hero
            </legend>
            <p className="settings-fieldset-hint">Maks. 2MB. Otomatis dikompresi ke WebP.</p>

            {/* Drop Zone */}
            <div className="hero-image-body">
              <div
                className={`hero-dropzone ${isDragging ? 'hero-dropzone-drag' : ''} ${data.image_url ? 'hero-dropzone-has-img' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                aria-label="Upload gambar hero"
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              >
                {data.image_url ? (
                  <>
                    <img src={data.image_url} alt="Preview gambar hero" className="hero-preview-img" />
                    <div className="hero-dropzone-overlay">
                      <Upload size={20} />
                      <span>{isDragging ? 'Lepas untuk ganti' : 'Klik atau drag untuk ganti'}</span>
                    </div>
                  </>
                ) : (
                  <div className="hero-dropzone-empty">
                    <div className="hero-dropzone-icon">
                      <Upload size={22} strokeWidth={1.5} />
                    </div>
                    <p className="hero-dropzone-label">
                      {isDragging ? 'Lepas gambar di sini' : 'Klik atau drag gambar'}
                    </p>
                    <p className="hero-dropzone-sub">JPG, PNG, WebP · Maks. 2MB</p>
                  </div>
                )}

                {/* Uploading Overlay */}
                {uploading && (
                  <div className="hero-uploading-overlay" aria-live="polite">
                    <Loader2 size={22} className="animate-spin" />
                    <p>Mengoptimasi gambar...</p>
                  </div>
                )}

                {/* Success Badge */}
                {uploadStatus === 'success' && (
                  <div className="hero-upload-badge hero-upload-badge-success">
                    <CheckCircle2 size={14} />
                    Berhasil diupload!
                  </div>
                )}
                {uploadStatus === 'error' && (
                  <div className="hero-upload-badge hero-upload-badge-error">
                    <AlertCircle size={14} />
                    Gagal upload
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hero-file-input"
                aria-label="Pilih file gambar"
              />

              {/* Manual URL Input */}
              {data.image_url && (
                <div className="hero-url-wrap">
                  <div className="settings-form-group">
                    <label className="settings-label" htmlFor="image_url">URL Gambar</label>
                    <div className="settings-input-wrap">
                      <span className="settings-input-icon"><ImageIcon size={14} /></span>
                      <input
                        id="image_url"
                        className="settings-input"
                        type="url"
                        name="image_url"
                        value={data.image_url}
                        onChange={handleChange}
                        placeholder="https://..."
                      />
                      {data.image_url && (
                        <button
                          type="button"
                          className="hero-url-clear"
                          onClick={() => setData(prev => ({ ...prev, image_url: '' }))}
                          aria-label="Hapus gambar"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Statistik ─────────────────────────────────── */}
      <fieldset className="settings-fieldset">
        <legend className="settings-fieldset-legend">
          <span className="settings-fieldset-icon"><BarChart3 size={14} /></span>
          Statistik Hero
        </legend>
        <p className="settings-fieldset-hint">Tiga angka statistik yang tampil di bawah teks hero.</p>

        <div className="hero-stats-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="hero-stat-item">
              <div className="hero-stat-number">{n}</div>
              <div className="settings-form-group">
                <label className="settings-label" htmlFor={`stats_value_${n}`}>Nilai</label>
                <input
                  id={`stats_value_${n}`}
                  className="settings-input settings-input-no-icon hero-stat-value-input"
                  type="text"
                  name={`stats_value_${n}`}
                  value={data[`stats_value_${n}`]}
                  onChange={handleChange}
                  placeholder={n === 1 ? '32+' : n === 2 ? '10' : '24/7'}
                />
              </div>
              <div className="settings-form-group">
                <label className="settings-label" htmlFor={`stats_label_${n}`}>Label</label>
                <input
                  id={`stats_label_${n}`}
                  className="settings-input settings-input-no-icon"
                  type="text"
                  name={`stats_label_${n}`}
                  value={data[`stats_label_${n}`]}
                  onChange={handleChange}
                  placeholder={n === 1 ? 'Dokter Spesialis' : n === 2 ? 'Poli Klinik' : 'IGD Siaga'}
                />
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      {/* ── Form Footer ───────────────────────────────── */}
      <div className="settings-form-footer">
        <div>
          {saveStatus === 'success' && (
            <div className="settings-status settings-status-success" role="status" aria-live="polite">
              <CheckCircle2 size={14} />
              Hero section berhasil disimpan!
            </div>
          )}
          {saveStatus === 'error' && (
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
        /* ── Hero Form Layout ──────────────────────────── */
        .hero-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .hero-form-cols {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 1024px) {
          .hero-form-cols {
            grid-template-columns: 1fr 340px;
          }
        }

        .hero-col-main {
          display: flex;
          flex-direction: column;
          gap: 20px;
          min-width: 0;
        }

        .hero-col-side {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ── Fieldset (shared) ─────────────────────────── */
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
          padding: 10px 16px 4px;
          line-height: 1.4;
          margin: 0;
        }

        /* ── Hero Fields Body ──────────────────────────── */
        .hero-fields-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 0 16px 16px;
        }

        /* ── Form Controls (shared) ────────────────────── */
        .settings-form-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 640px) {
          .settings-form-grid-2 {
            grid-template-columns: 1fr 1fr;
          }
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
          line-height: 1.3;
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

        .settings-input-no-icon {
          padding-left: 12px;
        }

        .settings-input-accent {
          color: var(--admin-primary);
          font-weight: 600;
        }

        .settings-input:focus {
          outline: none;
          border-color: var(--admin-primary);
          box-shadow: 0 0 0 3px rgba(24, 95, 165, 0.12);
        }

        .settings-input::placeholder { color: var(--admin-text-s); }

        .settings-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-sm);
          font-size: 0.875rem;
          color: var(--admin-text-b);
          background: var(--admin-surface);
          font-family: inherit;
          resize: vertical;
          transition: border-color 150ms, box-shadow 150ms;
          line-height: 1.6;
        }

        .settings-textarea:focus {
          outline: none;
          border-color: var(--admin-primary);
          box-shadow: 0 0 0 3px rgba(24, 95, 165, 0.12);
        }

        .settings-textarea::placeholder { color: var(--admin-text-s); }

        .settings-helper {
          font-size: 0.75rem;
          color: var(--admin-text-s);
          line-height: 1.4;
        }

        /* ── CTA Grid ──────────────────────────────────── */
        .hero-cta-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          padding: 0 16px 16px;
        }

        @media (min-width: 640px) {
          .hero-cta-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .hero-cta-box {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 14px;
          border-radius: var(--admin-radius-md);
          border: 1px solid var(--admin-border-soft);
        }

        .hero-cta-primary {
          background: rgba(24, 95, 165, 0.03);
          border-color: rgba(24, 95, 165, 0.12);
        }

        .hero-cta-secondary {
          background: var(--admin-surface-2);
        }

        .hero-cta-box-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 2px;
        }

        .hero-cta-badge {
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
          letter-spacing: 0.04em;
        }

        .hero-cta-badge-primary {
          background: var(--admin-primary-l);
          color: var(--admin-primary);
        }

        .hero-cta-badge-secondary {
          background: var(--admin-border-soft);
          color: var(--admin-text-m);
        }

        .hero-cta-badge-hint {
          font-size: 0.6875rem;
          color: var(--admin-text-s);
        }

        /* ── Image Upload ──────────────────────────────── */
        .hero-image-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 0 16px 16px;
        }

        .hero-dropzone {
          aspect-ratio: 4/3;
          border: 2px dashed var(--admin-border);
          border-radius: var(--admin-radius-md);
          background: var(--admin-surface-2);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          transition: border-color 150ms, background 150ms, transform 150ms;
          outline: none;
        }

        .hero-dropzone:hover,
        .hero-dropzone:focus-visible {
          border-color: var(--admin-primary);
          background: var(--admin-primary-l);
        }

        .hero-dropzone-drag {
          border-color: var(--admin-primary);
          background: var(--admin-primary-l);
          transform: scale(1.01);
        }

        .hero-dropzone-has-img {
          border-style: solid;
          border-color: var(--admin-border);
        }

        .hero-dropzone-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
          padding: 20px;
        }

        .hero-dropzone-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--admin-radius-md);
          background: var(--admin-border-soft);
          color: var(--admin-text-s);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
          transition: background 150ms, color 150ms;
        }

        .hero-dropzone:hover .hero-dropzone-icon,
        .hero-dropzone-drag .hero-dropzone-icon {
          background: rgba(24, 95, 165, 0.12);
          color: var(--admin-primary);
        }

        .hero-dropzone-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--admin-text-b);
        }

        .hero-dropzone-sub {
          font-size: 0.6875rem;
          color: var(--admin-text-s);
        }

        .hero-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-dropzone-overlay {
          position: absolute;
          inset: 0;
          background: rgba(10, 25, 60, 0.55);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #fff;
          font-size: 0.75rem;
          font-weight: 600;
          opacity: 0;
          transition: opacity 150ms;
        }

        .hero-dropzone-has-img:hover .hero-dropzone-overlay,
        .hero-dropzone-drag .hero-dropzone-overlay {
          opacity: 1;
        }

        .hero-uploading-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.88);
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

        .hero-upload-badge {
          position: absolute;
          bottom: 8px;
          right: 8px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 5px 10px;
          border-radius: 999px;
          z-index: 10;
        }

        .hero-upload-badge-success {
          background: var(--admin-success);
          color: #fff;
        }

        .hero-upload-badge-error {
          background: var(--admin-danger);
          color: #fff;
        }

        .hero-file-input { display: none; }

        .hero-url-wrap {
          margin-top: 4px;
        }

        .hero-url-clear {
          position: absolute;
          right: 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--admin-text-s);
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 4px;
          transition: color 120ms;
        }

        .hero-url-clear:hover {
          color: var(--admin-danger);
        }

        /* ── Stats Grid ────────────────────────────────── */
        .hero-stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          padding: 0 16px 16px;
        }

        @media (min-width: 480px) {
          .hero-stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .hero-stat-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 14px;
          background: var(--admin-surface-2);
          border: 1px solid var(--admin-border-soft);
          border-radius: var(--admin-radius-md);
          position: relative;
        }

        .hero-stat-number {
          position: absolute;
          top: 10px;
          right: 12px;
          width: 20px;
          height: 20px;
          background: var(--admin-primary-l);
          color: var(--admin-primary);
          border-radius: 50%;
          font-size: 0.6875rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
        }

        .hero-stat-value-input {
          font-size: 1rem !important;
          font-weight: 700 !important;
          color: var(--admin-text-h) !important;
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif) !important;
          text-align: center !important;
          letter-spacing: -0.02em;
        }

        /* ── Form Footer ───────────────────────────────── */
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
