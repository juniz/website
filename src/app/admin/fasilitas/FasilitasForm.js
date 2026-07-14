'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { upsertFacilityAction } from '@/app/actions/admin/facility';
import { getImageUrl } from '@/lib/utils';
import NextImage from 'next/image';
import {
  Save, Loader2, Building2, Type, Info,
  CheckCircle2, AlertCircle, ArrowLeft,
  ToggleLeft, ToggleRight, ListOrdered, ImageIcon,
  Upload, X, Image as ImageIconLucide, Plus
} from 'lucide-react';

export default function FasilitasForm({ mode = 'create', facility = null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors]   = useState({});
  const [toast, setToast]     = useState(null);
  
  const [imagePreview, setImagePreview] = useState(facility?.image_url || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // We store the file blob from compression if any
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    title:          facility?.title          || '',
    description:    facility?.description    || '',
    category:       facility?.category       || 'Umum',
    sort_order:     facility?.sort_order     ?? 0,
    is_active:      facility?.is_active      ?? true,
  });

  /* ── Handlers ───────────────────────────────────────── */
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  /* ── Image Compression & Handling ───────────────────── */
  async function compressImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimension 1200px for facilities
          const MAX_SIZE = 1200;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            // Create a File object from the blob
            const newFile = new File([blob], 'facility.webp', { type: 'image/webp' });
            resolve(newFile);
          }, 'image/webp', 0.85); // High quality WebP
        };
      };
    });
  }

  async function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('File harus berupa gambar.', 'error');
      return;
    }

    const compressedFile = await compressImage(file);
    const previewUrl = URL.createObjectURL(compressedFile);
    setImagePreview(previewUrl);
    setImageFile(compressedFile);
  }

  function onDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Nama fasilitas wajib diisi.';
    return errs;
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    startTransition(async () => {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('sort_order', form.sort_order);
      formData.append('is_active', form.is_active);
      // Use imagePreview as source of truth. Exclude blob: URLs — those mean a new file
      // is being uploaded via imageFile, so the backend will use file.filename instead.
      const existingImagePath = imagePreview && !imagePreview.startsWith('blob:') ? imagePreview : '';
      formData.append('existing_image', existingImagePath);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const result = await upsertFacilityAction(mode === 'edit' ? facility.id : null, formData);
      
      if (result?.error) {
        showToast(result.error, 'error');
      } else {
        showToast(
          mode === 'create' ? 'Fasilitas berhasil ditambahkan!' : 'Fasilitas berhasil diperbarui!',
          'success'
        );
        setTimeout(() => router.push('/admin/fasilitas'), 900);
      }
    });
  }

  return (
    <div className="ff-page">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="ff-header">
        <div className="ff-header-left">
          <Link href="/admin/fasilitas" className="ff-back-btn">
            <ArrowLeft size={16} />
          </Link>
          <div className="ff-header-icon">
            <Building2 size={20} />
          </div>
          <div>
            <h1 className="ff-header-title">
              {mode === 'create' ? 'Tambah Fasilitas Baru' : 'Edit Fasilitas'}
            </h1>
            <p className="ff-header-subtitle">
              {mode === 'create'
                ? 'Tambahkan fasilitas medis atau gedung baru.'
                : `Mengedit: ${facility?.title}`}
            </p>
          </div>
        </div>
      </div>

      {/* ── Form ────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} noValidate className="ff-body">

        {/* ── Main content ─────────────────────────── */}
        <div className="ff-main">
          
          {/* Fieldset: Informasi Utama */}
          <fieldset className="ff-fieldset">
            <legend className="ff-legend">
              <span className="ff-legend-icon"><Type size={14} /></span>
              Informasi Fasilitas
            </legend>

            <div className="ff-fields">
              <div className="ff-form-group">
                <label className="ff-label" htmlFor="title">Nama Fasilitas <span className="ff-required">*</span></label>
                <div className="ff-input-icon-wrap">
                  <span className="ff-input-icon"><Building2 size={14} /></span>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className={`ff-input ff-input-with-icon ${errors.title ? 'ff-input-err' : ''}`}
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Contoh: Gedung Rawat Inap Teratai"
                    required
                  />
                </div>
                {errors.title && <span className="ff-error"><AlertCircle size={12} />{errors.title}</span>}
              </div>

              <div className="ff-form-group">
                <label className="ff-label" htmlFor="description">Deskripsi</label>
                <textarea
                  id="description"
                  name="description"
                  className="ff-textarea"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Jelaskan detail fasilitas, keunggulan, atau peralatan yang tersedia..."
                />
              </div>

              <div className="ff-form-group">
                <label className="ff-label" htmlFor="category">Kategori</label>
                <select
                  id="category"
                  name="category"
                  className="ff-input"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="Umum">Umum</option>
                  <option value="Rawat Inap">Rawat Inap</option>
                  <option value="Rawat Jalan">Rawat Jalan</option>
                  <option value="Penunjang Medis">Penunjang Medis</option>
                  <option value="Unggulan">Unggulan</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* Fieldset: Foto Fasilitas */}
          <fieldset className="ff-fieldset">
            <legend className="ff-legend">
              <span className="ff-legend-icon"><ImageIconLucide size={14} /></span>
              Foto Fasilitas
            </legend>
            <p className="ff-legend-hint">Gunakan foto berkualitas tinggi untuk memberikan kesan profesional.</p>

            <div className="ff-fields">
              <div 
                className={`ff-dropzone ${isDragging ? 'ff-dropzone-active' : ''} ${imagePreview ? 'ff-dropzone-has-file' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  hidden 
                  accept="image/*" 
                  onChange={(e) => handleFile(e.target.files[0])} 
                />
                
                {imagePreview ? (
                  <div className="ff-preview-container">
                    <NextImage
                      src={getImageUrl(imagePreview)}
                      alt="Preview"
                      fill
                      className="ff-preview-img"
                      style={{ objectFit: 'cover' }}
                      unoptimized
                    />
                    <div className="ff-preview-overlay">
                      <div className="ff-preview-actions">
                        <button 
                          type="button" 
                          className="ff-preview-btn" 
                          onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}
                        >
                          Ganti Foto
                        </button>
                        <button 
                          type="button" 
                          className="ff-preview-btn ff-preview-btn-danger"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setImagePreview(null); 
                            setImageFile(null);
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="ff-dropzone-content">
                    <div className="ff-dropzone-icon">
                      <Upload size={24} />
                    </div>
                    <div className="ff-dropzone-text">
                      <p className="ff-dropzone-main">Klik atau tarik foto ke sini</p>
                      <p className="ff-dropzone-sub">PNG, JPG, atau WebP (Maks. 5MB)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </fieldset>
        </div>

        {/* ── Sidebar ──────────────────────────────── */}
        <div className="ff-sidebar">
          <fieldset className="ff-fieldset">
            <legend className="ff-legend">
              <span className="ff-legend-icon"><ListOrdered size={14} /></span>
              Pengaturan
            </legend>
            <div className="ff-fields">
              <div className="ff-form-group">
                <label className="ff-label" htmlFor="sort_order">Urutan</label>
                <input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  className="ff-input"
                  value={form.sort_order}
                  onChange={handleChange}
                />
              </div>

              <div className="ff-toggle-row">
                <div>
                  <p className="ff-label">Status Aktif</p>
                  <p className="ff-helper">Tampilkan di website.</p>
                </div>
                <button
                  type="button"
                  className={`ff-toggle ${form.is_active ? 'ff-toggle-on' : 'ff-toggle-off'}`}
                  onClick={() => setForm(prev => ({ ...prev, is_active: !prev.is_active }))}
                >
                  {form.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                </button>
              </div>
            </div>
          </fieldset>

          <div className="ff-actions">
            <button type="submit" disabled={isPending} className="ff-btn-submit">
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {mode === 'create' ? 'Simpan Fasilitas' : 'Perbarui'}
            </button>
            <Link href="/admin/fasilitas" className="ff-btn-cancel">Batal</Link>
          </div>
        </div>
      </form>

      {toast && (
        <div className="ff-toast-wrap">
          <div className={`ff-toast ff-toast-${toast.type}`}>
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {toast.msg}
          </div>
        </div>
      )}

      <style>{`
        .ff-page { display: flex; flex-direction: column; gap: 20px; }
        .ff-header {
          display: flex; align-items: center; gap: 16px;
          background: var(--admin-surface); border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-lg); padding: 18px 24px; box-shadow: var(--admin-shadow-xs);
        }
        .ff-header-left { display: flex; align-items: center; gap: 14px; flex: 1; }
        .ff-back-btn {
          width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--admin-border);
          display: flex; align-items: center; justify-content: center; color: var(--admin-text-m);
          transition: 150ms;
        }
        .ff-back-btn:hover { background: var(--admin-primary-l); color: var(--admin-primary); border-color: var(--admin-primary); }
        .ff-header-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: var(--admin-primary-l); color: var(--admin-primary);
          display: flex; align-items: center; justify-content: center;
        }
        .ff-header-title { font-size: 1.0625rem; font-weight: 700; color: var(--admin-text-h); font-family: var(--font-figtree); margin-bottom: 2px; }
        .ff-header-subtitle { font-size: 0.8125rem; color: var(--admin-text-s); }

        .ff-body { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 1024px) { .ff-body { grid-template-columns: 1fr 280px; } }

        .ff-main, .ff-sidebar { display: flex; flex-direction: column; gap: 16px; }

        .ff-fieldset { border: 1px solid var(--admin-border-soft); border-radius: var(--admin-radius-md); background: var(--admin-surface); overflow: hidden; }
        .ff-legend { 
          display: flex; align-items: center; gap: 8px; padding: 12px 16px; width: 100%;
          background: var(--admin-surface-2); border-bottom: 1px solid var(--admin-border-soft);
          font-size: 0.8125rem; font-weight: 700; color: var(--admin-text-h); font-family: var(--font-figtree);
        }
        .ff-legend-icon { 
          width: 24px; height: 24px; border-radius: 6px; 
          background: var(--admin-primary-l); color: var(--admin-primary);
          display: flex; align-items: center; justify-content: center;
        }
        .ff-legend-hint { font-size: 0.75rem; color: var(--admin-text-s); padding: 10px 16px 0; }
        .ff-fields { display: flex; flex-direction: column; gap: 16px; padding: 16px; }

        .ff-form-group { display: flex; flex-direction: column; gap: 5px; }
        .ff-label { font-size: 0.8125rem; font-weight: 600; color: var(--admin-text-b); }
        .ff-required { color: var(--admin-danger); }
        
        .ff-input-icon-wrap { position: relative; display: flex; align-items: center; }
        .ff-input-icon { position: absolute; left: 12px; color: var(--admin-text-s); pointer-events: none; }
        .ff-input { 
          width: 100%; height: 40px; padding: 0 12px; border: 1px solid var(--admin-border);
          border-radius: 8px; font-size: 0.875rem; transition: 150ms;
        }
        .ff-input-with-icon { padding-left: 36px; }
        .ff-input:focus { outline: none; border-color: var(--admin-primary); box-shadow: 0 0 0 3px rgba(24,95,165,0.1); }
        .ff-input-err { border-color: var(--admin-danger); }

        .ff-textarea {
          width: 100%; padding: 10px 12px; border: 1px solid var(--admin-border);
          border-radius: 8px; font-size: 0.875rem; resize: vertical; transition: 150ms;
        }
        .ff-textarea:focus { outline: none; border-color: var(--admin-primary); box-shadow: 0 0 0 3px rgba(24,95,165,0.1); }

        /* ── Dropzone ─────────────────────────────────────── */
        .ff-dropzone {
          border: 2px dashed var(--admin-border); border-radius: 12px;
          min-height: 180px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: 150ms; background: var(--admin-surface-2); overflow: hidden;
        }
        .ff-dropzone:hover { border-color: var(--admin-primary); background: var(--admin-primary-l); }
        .ff-dropzone-active { border-color: var(--admin-primary); background: var(--admin-primary-l); }
        .ff-dropzone-has-file { border-style: solid; border-color: var(--admin-border-soft); background: var(--admin-surface); }

        .ff-dropzone-content { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .ff-dropzone-icon { color: var(--admin-primary); opacity: 0.6; }
        .ff-dropzone-main { font-size: 0.875rem; font-weight: 600; color: var(--admin-text-b); }
        .ff-dropzone-sub { font-size: 0.75rem; color: var(--admin-text-s); }

        .ff-preview-container { width: 100%; height: 100%; position: relative; min-height: 240px; }
        .ff-preview-img { width: 100%; height: 100%; object-fit: cover; }
        .ff-preview-overlay { 
          position: absolute; inset: 0; background: rgba(0,0,0,0.3); opacity: 0; 
          display: flex; align-items: center; justify-content: center; transition: 200ms;
        }
        .ff-preview-container:hover .ff-preview-overlay { opacity: 1; }
        .ff-preview-actions { display: flex; gap: 8px; }
        .ff-preview-btn {
          padding: 6px 14px; background: #fff; border-radius: 8px; font-size: 0.75rem; font-weight: 600;
          color: var(--admin-text-b); border: none; cursor: pointer;
        }
        .ff-preview-btn-danger { color: var(--admin-danger); }

        .ff-toggle-row { display: flex; align-items: center; justify-content: space-between; }
        .ff-toggle {
          width: 44px; height: 24px; border-radius: 12px; border: none; cursor: pointer;
          display: flex; align-items: center; padding: 0 3px; transition: 200ms;
        }
        .ff-toggle-on { background: var(--admin-success); color: #fff; justify-content: flex-end; }
        .ff-toggle-off { background: var(--admin-border); color: #fff; justify-content: flex-start; }
        .ff-helper { font-size: 0.75rem; color: var(--admin-text-s); }

        .ff-actions { display: flex; flex-direction: column; gap: 8px; }
        .ff-btn-submit {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          height: 42px; background: var(--admin-primary); color: #fff; border: none;
          border-radius: 8px; font-weight: 600; cursor: pointer; transition: 150ms;
        }
        .ff-btn-submit:hover { background: var(--admin-primary-h); }
        .ff-btn-cancel {
          display: flex; align-items: center; justify-content: center; height: 40px;
          border: 1px solid var(--admin-border); border-radius: 8px; color: var(--admin-text-m);
          text-decoration: none; font-size: 0.875rem; transition: 150ms;
        }
        .ff-btn-cancel:hover { background: var(--admin-surface-2); color: var(--admin-text-b); }

        .ff-toast-wrap { position: fixed; bottom: 24px; right: 24px; z-index: 1000; }
        .ff-toast { display: flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: 10px; color: #fff; box-shadow: var(--admin-shadow-lg); font-size: 0.875rem; font-weight: 600; animation: ffIn 300ms ease; }
        .ff-toast-success { background: var(--admin-success); }
        .ff-toast-error { background: var(--admin-danger); }
        @keyframes ffIn { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
