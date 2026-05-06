'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createFAQ, updateFAQ } from '@/app/actions/admin/faq';
import {
  Save, Loader2, MessageCircleQuestion, AlignLeft, Layers,
  ListOrdered, CheckCircle2, AlertCircle, ChevronDown, ArrowLeft,
  ToggleLeft, ToggleRight,
} from 'lucide-react';

const DEFAULT_CATEGORIES = ['Umum', 'Pendaftaran', 'Layanan', 'Jadwal & Dokter', 'Administrasi', 'Fasilitas'];

export default function FAQForm({ mode = 'create', faq = null, existingCategories = [], defaultCategory = '' }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryRef = useRef(null);

  // Merged category list (existing from DB + defaults), deduplicated
  const allCategories = [...new Set([...DEFAULT_CATEGORIES, ...existingCategories])].sort();

  const [form, setForm] = useState({
    question:   faq?.question   || '',
    answer:     faq?.answer     || '',
    category:   faq?.category   || defaultCategory || 'Umum',
    sort_order: faq?.sort_order ?? 0,
    is_active:  faq?.is_active  ?? true,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function selectCategory(cat) {
    setForm(prev => ({ ...prev, category: cat }));
    setShowCategoryDropdown(false);
    if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.question.trim()) errs.question = 'Pertanyaan wajib diisi.';
    if (!form.answer.trim())   errs.answer   = 'Jawaban wajib diisi.';
    if (!form.category.trim()) errs.category = 'Kategori wajib diisi.';
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
    formData.append('question',   form.question.trim());
    formData.append('answer',     form.answer.trim());
    formData.append('category',   form.category.trim());
    formData.append('sort_order', String(form.sort_order));
    formData.append('is_active',  String(form.is_active));

    startTransition(async () => {
      const result = mode === 'create'
        ? await createFAQ(formData)
        : await updateFAQ(faq.id, formData);

      if (result?.error) {
        showToast(result.error, 'error');
      } else {
        showToast(
          mode === 'create' ? 'FAQ berhasil ditambahkan!' : 'FAQ berhasil diperbarui!',
          'success'
        );
        setTimeout(() => router.push('/admin/faq'), 1000);
      }
    });
  }

  return (
    <div className="faq-form-page">

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="faq-form-page-header">
        <div className="faq-form-header-left">
          <Link href="/admin/faq" className="faq-back-btn" aria-label="Kembali ke daftar FAQ">
            <ArrowLeft size={16} />
          </Link>
          <div className="faq-page-icon">
            <MessageCircleQuestion size={20} />
          </div>
          <div>
            <h1 className="faq-form-title">
              {mode === 'create' ? 'Tambah FAQ Baru' : 'Edit FAQ'}
            </h1>
            <p className="faq-form-subtitle">
              {mode === 'create'
                ? 'Tambahkan pertanyaan dan jawaban untuk membantu pasien.'
                : `Mengedit: ${faq?.question?.slice(0, 60)}${faq?.question?.length > 60 ? '…' : ''}`}
            </p>
          </div>
        </div>
      </div>

      {/* ── Form ────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} noValidate className="faq-form-body">

        {/* ── Main Content ─────────────────────────── */}
        <div className="faq-form-main">

          {/* Fieldset: Pertanyaan & Jawaban */}
          <fieldset className="faq-fieldset">
            <legend className="faq-fieldset-legend">
              <span className="faq-fieldset-icon">
                <MessageCircleQuestion size={14} />
              </span>
              Konten FAQ
            </legend>
            <p className="faq-fieldset-hint">Tulis pertanyaan yang sering diajukan dan jawaban yang jelas.</p>

            <div className="faq-fieldset-body">
              {/* Question */}
              <div className="faq-form-group">
                <label className="faq-label" htmlFor="question">
                  Pertanyaan <span className="faq-required" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="question"
                  name="question"
                  value={form.question}
                  onChange={handleChange}
                  className={`faq-textarea faq-textarea-question ${errors.question ? 'faq-input-error' : ''}`}
                  rows={3}
                  placeholder="Contoh: Bagaimana cara mendaftar poli rawat jalan?"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.question}
                  aria-describedby={errors.question ? 'question-err' : undefined}
                />
                <div className="faq-input-footer">
                  {errors.question
                    ? <span id="question-err" className="faq-error-msg" role="alert"><AlertCircle size={12} />{errors.question}</span>
                    : <span className="faq-helper">Tulis pertanyaan seperti yang diajukan pasien, akhiri dengan tanda tanya.</span>
                  }
                  <span className={`faq-char-count ${form.question.length > 200 ? 'faq-char-warn' : ''}`}>
                    {form.question.length}
                  </span>
                </div>
              </div>

              {/* Answer */}
              <div className="faq-form-group">
                <label className="faq-label" htmlFor="answer">
                  Jawaban <span className="faq-required" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="answer"
                  name="answer"
                  value={form.answer}
                  onChange={handleChange}
                  className={`faq-textarea ${errors.answer ? 'faq-input-error' : ''}`}
                  rows={5}
                  placeholder="Tulis jawaban yang jelas, lengkap, dan mudah dipahami oleh pasien..."
                  required
                  aria-required="true"
                  aria-invalid={!!errors.answer}
                  aria-describedby={errors.answer ? 'answer-err' : undefined}
                />
                <div className="faq-input-footer">
                  {errors.answer
                    ? <span id="answer-err" className="faq-error-msg" role="alert"><AlertCircle size={12} />{errors.answer}</span>
                    : <span className="faq-helper">Gunakan bahasa yang sopan dan mudah dimengerti.</span>
                  }
                  <span className={`faq-char-count ${form.answer.length > 800 ? 'faq-char-warn' : ''}`}>
                    {form.answer.length}
                  </span>
                </div>
              </div>
            </div>
          </fieldset>

          {/* Fieldset: Preview */}
          {(form.question || form.answer) && (
            <div className="faq-preview-card">
              <div className="faq-preview-label">
                <span className="faq-preview-dot" />
                Preview
              </div>
              <div className="faq-preview-content">
                <p className="faq-preview-question">
                  {form.question || <em style={{ opacity: 0.4 }}>Pertanyaan belum diisi…</em>}
                </p>
                <p className="faq-preview-answer">
                  {form.answer || <em style={{ opacity: 0.4 }}>Jawaban belum diisi…</em>}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ──────────────────────────────── */}
        <div className="faq-form-sidebar">

          {/* Fieldset: Kategori */}
          <fieldset className="faq-fieldset">
            <legend className="faq-fieldset-legend">
              <span className="faq-fieldset-icon"><Layers size={14} /></span>
              Kategori
            </legend>

            <div className="faq-fieldset-body">
              <div className="faq-form-group" ref={categoryRef}>
                <label className="faq-label" htmlFor="category">
                  Nama Kategori <span className="faq-required">*</span>
                </label>

                {/* Custom input + dropdown */}
                <div className="faq-category-wrap">
                  <div className="faq-category-input-row">
                    <input
                      id="category"
                      name="category"
                      type="text"
                      className={`faq-input ${errors.category ? 'faq-input-error' : ''}`}
                      value={form.category}
                      onChange={handleChange}
                      onFocus={() => setShowCategoryDropdown(true)}
                      placeholder="Pilih atau ketik kategori baru…"
                      autoComplete="off"
                      aria-invalid={!!errors.category}
                    />
                    <button
                      type="button"
                      className="faq-category-toggle"
                      onClick={() => setShowCategoryDropdown(v => !v)}
                      aria-label="Tampilkan pilihan kategori"
                    >
                      <ChevronDown size={14} style={{ transform: showCategoryDropdown ? 'rotate(180deg)' : 'none', transition: '150ms' }} />
                    </button>
                  </div>

                  {showCategoryDropdown && (
                    <div className="faq-category-dropdown" role="listbox" aria-label="Pilihan kategori">
                      {allCategories.length > 0 && (
                        <>
                          <div className="faq-dropdown-section-label">Kategori yang ada</div>
                          {allCategories.map(cat => (
                            <button
                              key={cat}
                              type="button"
                              role="option"
                              aria-selected={form.category === cat}
                              className={`faq-dropdown-option ${form.category === cat ? 'faq-dropdown-option-active' : ''}`}
                              onClick={() => selectCategory(cat)}
                            >
                              {cat}
                              {form.category === cat && <CheckCircle2 size={13} />}
                            </button>
                          ))}
                        </>
                      )}
                      {form.category && !allCategories.includes(form.category) && (
                        <>
                          <div className="faq-dropdown-section-label">Buat baru</div>
                          <button
                            type="button"
                            className="faq-dropdown-option faq-dropdown-new"
                            onClick={() => selectCategory(form.category)}
                          >
                            + Buat &ldquo;{form.category}&rdquo;
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {errors.category && (
                  <span className="faq-error-msg" role="alert"><AlertCircle size={12} />{errors.category}</span>
                )}
                <span className="faq-helper">Bisa pilih yang sudah ada atau ketik nama kategori baru.</span>
              </div>
            </div>
          </fieldset>

          {/* Fieldset: Pengaturan */}
          <fieldset className="faq-fieldset">
            <legend className="faq-fieldset-legend">
              <span className="faq-fieldset-icon"><ListOrdered size={14} /></span>
              Pengaturan
            </legend>

            <div className="faq-fieldset-body">
              {/* Sort Order */}
              <div className="faq-form-group">
                <label className="faq-label" htmlFor="sort_order">Urutan Tampil</label>
                <input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  min="0"
                  max="999"
                  className="faq-input"
                  value={form.sort_order}
                  onChange={handleChange}
                />
                <span className="faq-helper">Angka kecil tampil lebih dulu (0 = pertama).</span>
              </div>

              {/* Status Toggle */}
              <div className="faq-toggle-row">
                <div>
                  <p className="faq-label" style={{ marginBottom: 2 }}>Status Aktif</p>
                  <p className="faq-helper">FAQ akan tampil di halaman publik jika aktif.</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.is_active}
                  className={`faq-toggle-btn ${form.is_active ? 'faq-toggle-on' : 'faq-toggle-off'}`}
                  onClick={() => setForm(prev => ({ ...prev, is_active: !prev.is_active }))}
                >
                  {form.is_active
                    ? <><ToggleRight size={20} /> Aktif</>
                    : <><ToggleLeft size={20} /> Nonaktif</>
                  }
                </button>
              </div>
            </div>
          </fieldset>

          {/* Actions */}
          <div className="faq-form-actions">
            <Link href="/admin/faq" className="faq-btn-cancel">
              Batal
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="faq-btn-submit"
              aria-busy={isPending}
            >
              {isPending
                ? <><Loader2 size={15} className="animate-spin" />{mode === 'create' ? 'Menyimpan…' : 'Memperbarui…'}</>
                : <><Save size={15} />{mode === 'create' ? 'Simpan FAQ' : 'Perbarui FAQ'}</>
              }
            </button>
          </div>
        </div>
      </form>

      {/* ── Toast Notification ──────────────────────────── */}
      {toast && (
        <div className="faq-toast-wrap" role="status" aria-live="polite">
          <div className={`faq-toast faq-toast-${toast.type}`}>
            {toast.type === 'success'
              ? <CheckCircle2 size={15} />
              : <AlertCircle size={15} />
            }
            {toast.msg}
          </div>
        </div>
      )}

      <style>{`
        /* ── Page Layout ────────────────────────────────── */
        .faq-form-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ── Page Header ────────────────────────────────── */
        .faq-form-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-lg);
          padding: 18px 24px;
          box-shadow: var(--admin-shadow-xs);
        }

        .faq-form-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .faq-back-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--admin-radius-sm);
          border: 1px solid var(--admin-border);
          background: var(--admin-surface);
          color: var(--admin-text-m);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          text-decoration: none;
          transition: all 150ms;
        }

        .faq-back-btn:hover {
          background: var(--admin-primary-l);
          border-color: var(--admin-primary);
          color: var(--admin-primary);
        }

        .faq-page-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--admin-radius-md);
          background: var(--admin-primary-l);
          color: var(--admin-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .faq-form-title {
          font-size: 1.0625rem;
          font-weight: 700;
          color: var(--admin-text-h);
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          margin-bottom: 2px;
          line-height: 1.3;
        }

        .faq-form-subtitle {
          font-size: 0.8125rem;
          color: var(--admin-text-s);
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 480px;
        }

        /* ── Form Two-Column Layout ─────────────────────── */
        .faq-form-body {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          align-items: start;
        }

        @media (min-width: 1024px) {
          .faq-form-body {
            grid-template-columns: 1fr 300px;
          }
        }

        .faq-form-main {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .faq-form-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Fieldset ───────────────────────────────────── */
        .faq-fieldset {
          border: 1px solid var(--admin-border-soft);
          border-radius: var(--admin-radius-md);
          padding: 0;
          margin: 0;
          background: var(--admin-surface);
          box-shadow: var(--admin-shadow-xs);
          /* overflow: visible untuk mencegah dropdown kategori terpotong */
          overflow: visible;
        }

        .faq-fieldset-legend {
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
          border-radius: var(--admin-radius-md) var(--admin-radius-md) 0 0;
        }

        .faq-fieldset-icon {
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

        .faq-fieldset-hint {
          font-size: 0.75rem;
          color: var(--admin-text-s);
          padding: 10px 16px 0;
          line-height: 1.4;
          margin: 0;
        }

        .faq-fieldset-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
        }

        /* ── Form Controls ──────────────────────────────── */
        .faq-form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
          position: relative;
        }

        .faq-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--admin-text-b);
          line-height: 1.3;
        }

        .faq-required {
          color: var(--admin-danger);
          margin-left: 2px;
        }

        .faq-input {
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

        .faq-input:focus {
          outline: none;
          border-color: var(--admin-primary);
          box-shadow: 0 0 0 3px rgba(24, 95, 165, 0.12);
        }

        .faq-input::placeholder { color: var(--admin-text-s); }

        .faq-input-error {
          border-color: var(--admin-danger) !important;
        }

        .faq-input-error:focus {
          box-shadow: 0 0 0 3px rgba(217, 64, 64, 0.12) !important;
        }

        .faq-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-sm);
          font-size: 0.875rem;
          color: var(--admin-text-b);
          background: var(--admin-surface);
          font-family: inherit;
          resize: vertical;
          line-height: 1.6;
          transition: border-color 150ms, box-shadow 150ms;
        }

        .faq-textarea:focus {
          outline: none;
          border-color: var(--admin-primary);
          box-shadow: 0 0 0 3px rgba(24, 95, 165, 0.12);
        }

        .faq-textarea::placeholder { color: var(--admin-text-s); }

        .faq-textarea-question {
          font-weight: 600;
          font-size: 0.9375rem;
        }

        .faq-input-footer {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
          margin-top: 1px;
        }

        .faq-helper {
          font-size: 0.75rem;
          color: var(--admin-text-s);
          line-height: 1.4;
        }

        .faq-error-msg {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--admin-danger);
          line-height: 1.4;
        }

        .faq-char-count {
          font-size: 0.6875rem;
          color: var(--admin-text-s);
          white-space: nowrap;
          font-variant-numeric: tabular-nums;
          flex-shrink: 0;
        }

        .faq-char-warn {
          color: var(--admin-warning);
          font-weight: 600;
        }

        /* ── Preview Card ───────────────────────────────── */
        .faq-preview-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border-soft);
          border-radius: var(--admin-radius-md);
          overflow: hidden;
          box-shadow: var(--admin-shadow-xs);
        }

        .faq-preview-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--admin-text-s);
          background: var(--admin-surface-2);
          border-bottom: 1px solid var(--admin-border-soft);
          padding: 8px 16px;
        }

        .faq-preview-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--admin-success);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .faq-preview-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .faq-preview-question {
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--admin-text-h);
          line-height: 1.5;
        }

        .faq-preview-answer {
          font-size: 0.8125rem;
          color: var(--admin-text-m);
          line-height: 1.7;
        }

        /* ── Category Dropdown ──────────────────────────── */
        .faq-category-wrap {
          position: relative;
        }

        .faq-category-input-row {
          display: flex;
          gap: 0;
        }

        .faq-category-input-row .faq-input {
          border-radius: var(--admin-radius-sm) 0 0 var(--admin-radius-sm);
          flex: 1;
        }

        .faq-category-toggle {
          width: 38px;
          height: 40px;
          border: 1px solid var(--admin-border);
          border-left: none;
          border-radius: 0 var(--admin-radius-sm) var(--admin-radius-sm) 0;
          background: var(--admin-surface-2);
          color: var(--admin-text-m);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 150ms;
        }

        .faq-category-toggle:hover {
          background: var(--admin-primary-l);
          color: var(--admin-primary);
        }

        .faq-category-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-md);
          box-shadow: var(--admin-shadow-md);
          z-index: 50;
          overflow: hidden;
          max-height: 220px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--admin-border) transparent;
        }

        .faq-dropdown-section-label {
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--admin-text-s);
          padding: 8px 12px 4px;
          background: var(--admin-surface-2);
        }

        .faq-dropdown-option {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 9px 12px;
          font-size: 0.875rem;
          color: var(--admin-text-b);
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          transition: background 100ms;
        }

        .faq-dropdown-option:hover {
          background: var(--admin-surface-2);
        }

        .faq-dropdown-option-active {
          color: var(--admin-primary);
          font-weight: 600;
          background: var(--admin-primary-l) !important;
        }

        .faq-dropdown-new {
          color: var(--admin-primary);
          font-weight: 600;
          border-top: 1px solid var(--admin-border-soft);
        }

        /* ── Toggle ─────────────────────────────────────── */
        .faq-toggle-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 4px 0;
        }

        .faq-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
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

        .faq-toggle-on {
          background: var(--admin-success-l);
          border-color: rgba(29, 158, 117, 0.25);
          color: #116045;
        }

        .faq-toggle-off {
          background: var(--admin-surface-2);
          color: var(--admin-text-m);
        }

        /* ── Action Buttons ─────────────────────────────── */
        .faq-form-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .faq-btn-submit {
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

        .faq-btn-submit:hover:not(:disabled) {
          background: var(--admin-primary-h);
          box-shadow: 0 3px 10px rgba(24, 95, 165, 0.28);
        }

        .faq-btn-submit:active:not(:disabled) {
          transform: scale(0.98);
        }

        .faq-btn-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .faq-btn-cancel {
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

        .faq-btn-cancel:hover {
          background: var(--admin-surface-2);
          color: var(--admin-text-b);
        }

        /* ── Toast ──────────────────────────────────────── */
        .faq-toast-wrap {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          animation: toastIn 220ms ease forwards;
        }

        @keyframes toastIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .faq-toast {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          border-radius: var(--admin-radius-md);
          font-size: 0.875rem;
          font-weight: 600;
          box-shadow: var(--admin-shadow-lg);
        }

        .faq-toast-success {
          background: #1D9E75;
          color: #fff;
        }

        .faq-toast-error {
          background: var(--admin-danger);
          color: #fff;
        }

        @media (max-width: 640px) {
          .faq-form-page-header {
            padding: 14px 16px;
          }
          .faq-form-subtitle {
            display: none;
          }
          .faq-toast-wrap {
            bottom: 16px;
            right: 16px;
            left: 16px;
          }
          .faq-toast {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
