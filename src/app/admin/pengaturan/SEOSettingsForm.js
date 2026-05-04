'use client';

import { useState } from 'react';
import { updatePageSEO } from '@/app/actions/admin/settings';
import { Save, Loader2, Globe, Search, Type, ExternalLink, ChevronRight, CheckCircle2, AlertCircle, Edit3, X } from 'lucide-react';

export default function SEOSettingsForm({ initialData }) {
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [seoList, setSeoList] = useState(initialData || []);
  const [formData, setFormData] = useState({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });

  const handleEdit = (item) => {
    setEditingId(item.id);
    setStatus(null);
    setFormData({
      meta_title: item.meta_title || '',
      meta_description: item.meta_description || '',
      meta_keywords: item.meta_keywords?.join(', ') || '',
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setStatus(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formattedData = {
      meta_title: formData.meta_title,
      meta_description: formData.meta_description,
      meta_keywords: formData.meta_keywords.split(',').map(k => k.trim()).filter(k => k !== ''),
    };

    const res = await updatePageSEO(editingId, formattedData);
    setLoading(false);

    if (res.success) {
      setSeoList(prev => prev.map(item => item.id === editingId ? { ...item, ...formattedData } : item));
      setStatus('success');
      setTimeout(() => {
        setEditingId(null);
        setStatus(null);
      }, 1600);
    } else {
      setStatus('error');
    }
  };

  const getRouteLabel = (route) => route === '/' ? 'Halaman Utama (/)' : route;

  return (
    <div className="seo-form-wrap">
      {/* Info Banner */}
      <div className="seo-info-banner">
        <div className="seo-info-icon">
          <Globe size={16} />
        </div>
        <div>
          <p className="seo-info-title">Optimasi SEO Per Halaman</p>
          <p className="seo-info-desc">
            Klik tombol <strong>Edit SEO</strong> di bawah untuk mengubah metadata tiap rute dan meningkatkan visibilitas di mesin pencari.
          </p>
        </div>
      </div>

      {/* SEO List */}
      <div className="seo-list">
        {seoList.length === 0 && (
          <div className="seo-empty">
            <Globe size={32} strokeWidth={1.5} />
            <p>Belum ada rute yang dikonfigurasi.</p>
          </div>
        )}

        {seoList.map((item) => (
          <div
            key={item.id}
            className={`seo-card ${editingId === item.id ? 'seo-card-editing' : ''}`}
          >
            {editingId === item.id ? (
              /* ─── Edit Mode ─────────────────────────────────── */
              <form onSubmit={handleSave} className="seo-edit-form">
                <div className="seo-edit-header">
                  <div className="seo-edit-route">
                    <ChevronRight size={12} />
                    {getRouteLabel(item.route)}
                  </div>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="seo-cancel-btn"
                    aria-label="Batal edit"
                  >
                    <X size={14} />
                    Batal
                  </button>
                </div>

                <div className="seo-edit-fields">
                  {/* Meta Title */}
                  <div className="settings-form-group">
                    <label className="settings-label" htmlFor={`meta_title_${item.id}`}>
                      Meta Title <span className="settings-required">*</span>
                    </label>
                    <div className="settings-input-wrap">
                      <span className="settings-input-icon"><Type size={14} /></span>
                      <input
                        id={`meta_title_${item.id}`}
                        className="settings-input"
                        type="text"
                        name="meta_title"
                        value={formData.meta_title}
                        onChange={handleChange}
                        placeholder="Judul Halaman · RS Bhayangkara Nganjuk"
                        required
                        maxLength={70}
                      />
                    </div>
                    <div className="seo-char-count">
                      <span className={formData.meta_title.length > 60 ? 'seo-char-warn' : ''}>
                        {formData.meta_title.length}/70 — ideal 50–60 karakter
                      </span>
                    </div>
                  </div>

                  {/* Meta Description */}
                  <div className="settings-form-group">
                    <label className="settings-label" htmlFor={`meta_desc_${item.id}`}>
                      Meta Description
                    </label>
                    <textarea
                      id={`meta_desc_${item.id}`}
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleChange}
                      className="settings-textarea"
                      rows={3}
                      placeholder="Deskripsi singkat yang muncul di hasil pencarian Google..."
                      maxLength={165}
                    />
                    <div className="seo-char-count">
                      <span className={formData.meta_description.length > 155 ? 'seo-char-warn' : ''}>
                        {formData.meta_description.length}/165 — ideal 120–155 karakter
                      </span>
                    </div>
                  </div>

                  {/* Meta Keywords */}
                  <div className="settings-form-group">
                    <label className="settings-label" htmlFor={`meta_keywords_${item.id}`}>
                      Meta Keywords
                    </label>
                    <div className="settings-input-wrap">
                      <span className="settings-input-icon"><Search size={14} /></span>
                      <input
                        id={`meta_keywords_${item.id}`}
                        className="settings-input"
                        type="text"
                        name="meta_keywords"
                        value={formData.meta_keywords}
                        onChange={handleChange}
                        placeholder="rumah sakit, poliklinik, IGD, nganjuk"
                      />
                    </div>
                    <span className="settings-helper">Pisahkan dengan koma. Keywords tidak terlalu berpengaruh di Google modern.</span>
                  </div>
                </div>

                {/* Edit Footer */}
                <div className="seo-edit-footer">
                  <div>
                    {status === 'success' && (
                      <div className="settings-status settings-status-success" role="status">
                        <CheckCircle2 size={13} />
                        SEO berhasil diperbarui!
                      </div>
                    )}
                    {status === 'error' && (
                      <div className="settings-status settings-status-error" role="alert">
                        <AlertCircle size={13} />
                        Gagal menyimpan. Coba lagi.
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="settings-btn-save settings-btn-save-sm"
                    aria-busy={loading}
                  >
                    {loading ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    {loading ? 'Menyimpan...' : 'Simpan SEO'}
                  </button>
                </div>
              </form>
            ) : (
              /* ─── View Mode ─────────────────────────────────── */
              <div className="seo-view-row">
                <div className="seo-view-info">
                  <div className="seo-view-route-wrap">
                    <span className="seo-view-route">
                      <ChevronRight size={12} />
                      {getRouteLabel(item.route)}
                    </span>
                    <a
                      href={item.route}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="seo-view-link"
                      aria-label={`Buka halaman ${item.route} di tab baru`}
                    >
                      <ExternalLink size={11} />
                    </a>
                  </div>

                  <p className="seo-view-title">
                    {item.meta_title || <em className="seo-empty-value">Belum diatur</em>}
                  </p>
                  <p className="seo-view-desc">
                    {item.meta_description || <em className="seo-empty-value">Tanpa deskripsi</em>}
                  </p>

                  {item.meta_keywords?.length > 0 && (
                    <div className="seo-view-keywords">
                      {item.meta_keywords.slice(0, 4).map((kw, i) => (
                        <span key={i} className="seo-keyword-chip">{kw}</span>
                      ))}
                      {item.meta_keywords.length > 4 && (
                        <span className="seo-keyword-chip seo-keyword-more">
                          +{item.meta_keywords.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleEdit(item)}
                  className="seo-edit-btn"
                  aria-label={`Edit SEO halaman ${item.route}`}
                >
                  <Edit3 size={13} />
                  Edit SEO
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        /* ── Wrapper ───────────────────────────────────────── */
        .seo-form-wrap {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ── Info Banner ───────────────────────────────────── */
        .seo-info-banner {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          background: var(--admin-primary-l);
          border: 1px solid rgba(24, 95, 165, 0.15);
          border-radius: var(--admin-radius-md);
        }

        .seo-info-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(24, 95, 165, 0.12);
          color: var(--admin-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .seo-info-title {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--admin-primary);
          margin-bottom: 3px;
        }

        .seo-info-desc {
          font-size: 0.75rem;
          color: var(--admin-text-m);
          line-height: 1.5;
        }

        /* ── SEO List ──────────────────────────────────────── */
        .seo-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .seo-empty {
          text-align: center;
          padding: 40px;
          color: var(--admin-text-s);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          font-size: 0.875rem;
          border: 1px dashed var(--admin-border);
          border-radius: var(--admin-radius-md);
        }

        /* ── SEO Card ──────────────────────────────────────── */
        .seo-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-md);
          overflow: hidden;
          transition: border-color 150ms, box-shadow 150ms;
        }

        .seo-card:hover:not(.seo-card-editing) {
          border-color: var(--admin-primary-t);
        }

        .seo-card-editing {
          border-color: var(--admin-primary);
          box-shadow: 0 0 0 3px rgba(24, 95, 165, 0.1);
        }

        /* ── View Row ──────────────────────────────────────── */
        .seo-view-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 16px;
        }

        .seo-view-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
          flex: 1;
        }

        .seo-view-route-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 2px;
        }

        .seo-view-route {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--admin-primary);
          background: var(--admin-primary-l);
          padding: 2px 8px;
          border-radius: 999px;
        }

        .seo-view-link {
          color: var(--admin-text-s);
          display: flex;
          align-items: center;
          transition: color 120ms;
        }

        .seo-view-link:hover {
          color: var(--admin-primary);
        }

        .seo-view-title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--admin-text-h);
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .seo-view-desc {
          font-size: 0.75rem;
          color: var(--admin-text-m);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .seo-empty-value {
          color: var(--admin-text-s);
          font-style: italic;
          font-weight: 400;
        }

        .seo-view-keywords {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 4px;
        }

        .seo-keyword-chip {
          font-size: 0.6875rem;
          color: var(--admin-text-m);
          background: var(--admin-surface-2);
          border: 1px solid var(--admin-border-soft);
          padding: 2px 8px;
          border-radius: 999px;
          line-height: 1.5;
        }

        .seo-keyword-more {
          color: var(--admin-text-s);
        }

        .seo-edit-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 13px;
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-sm);
          background: transparent;
          color: var(--admin-text-m);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 150ms;
          white-space: nowrap;
          flex-shrink: 0;
          min-height: 32px;
        }

        .seo-edit-btn:hover {
          background: var(--admin-primary-l);
          border-color: var(--admin-primary);
          color: var(--admin-primary);
        }

        /* ── Edit Form ─────────────────────────────────────── */
        .seo-edit-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .seo-edit-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: var(--admin-primary-l);
          border-bottom: 1px solid rgba(24, 95, 165, 0.1);
        }

        .seo-edit-route {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--admin-primary);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .seo-cancel-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--admin-text-m);
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: inherit;
          padding: 4px 8px;
          border-radius: var(--admin-radius-sm);
          transition: background 150ms, color 150ms;
        }

        .seo-cancel-btn:hover {
          background: rgba(0,0,0,0.05);
          color: var(--admin-text-b);
        }

        .seo-edit-fields {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 0 16px;
        }

        .seo-char-count {
          font-size: 0.6875rem;
          color: var(--admin-text-s);
          text-align: right;
        }

        .seo-char-warn {
          color: var(--admin-warning);
          font-weight: 600;
        }

        /* Shared input styles */
        .settings-form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .settings-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--admin-text-b);
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

        /* ── Edit Footer ───────────────────────────────────── */
        .seo-edit-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 16px;
          background: var(--admin-surface-2);
          border-top: 1px solid var(--admin-border-soft);
          flex-wrap: wrap;
        }

        .settings-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8125rem;
          font-weight: 500;
          padding: 6px 10px;
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
          justify-content: center;
        }

        .settings-btn-save-sm {
          padding: 8px 16px;
          font-size: 0.8125rem;
          min-height: 34px;
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
    </div>
  );
}
