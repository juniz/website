'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NextImage from 'next/image';
import { createBerita, updateBerita } from '@/app/actions/admin/berita';
import TiptapEditor from '@/components/admin/TiptapEditor';
import { Upload, Image as ImageIcon, Trash2, CheckCircle2, Loader2 } from 'lucide-react';

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 800;
const COMPRESS_QUALITY = 0.8;

async function compressImage(file) {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) return resolve(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/webp',
          COMPRESS_QUALITY
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

const CATEGORIES = [
  'Informasi Kesehatan',
  'Berita Rumah Sakit',
  'Pengumuman',
  'Kegiatan',
  'Prestasi',
  'Layanan Baru',
];

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function BeritaForm({ mode = 'create', article = null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState({});
  const [toast, setToast]   = useState(null);
  const [slugEdited, setSlugEdited] = useState(!!article?.slug);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(article?.image || '');
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const [form, setForm] = useState({
    title:     article?.title     || '',
    slug:      article?.slug      || '',
    excerpt:   article?.excerpt   || '',
    content:   article?.content   || '',
    category:  article?.category  || CATEGORIES[0],
    author:    article?.author    || 'Tim RS Bhayangkara',
    read_time: article?.readTime || '3 menit baca',
    date:      article?.date
      ? new Date(article.date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  });

  async function processSelectedFile(file) {
    if (!file) return;
    setIsCompressing(true);
    try {
      const optimizedFile = await compressImage(file);
      setImageFile(optimizedFile);
      setImagePreview(URL.createObjectURL(optimizedFile));
    } catch (e) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } finally {
      setIsCompressing(false);
    }
  }

  function handleImageChange(e) {
    processSelectedFile(e.target.files[0]);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-generate slug from title if not manually edited
      if (name === 'title' && !slugEdited) {
        updated.slug = generateSlug(value);
      }
      if (name === 'slug') setSlugEdited(true);
      return updated;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.title.trim())   errs.title   = 'Judul wajib diisi.';
    if (!form.slug.trim())    errs.slug    = 'Slug wajib diisi.';
    if (!form.content.trim()) errs.content = 'Konten wajib diisi.';
    if (!form.category)       errs.category = 'Pilih kategori.';
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
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    if (article?.image) {
      formData.append('existing_image', article.image);
    }

    startTransition(async () => {
      const result = mode === 'create'
        ? await createBerita(formData)
        : await updateBerita(article.id, formData);

      if (result?.error) {
        showToast(result.error, 'danger');
      } else {
        showToast(mode === 'create' ? 'Artikel berhasil dipublikasikan.' : 'Artikel berhasil diperbarui.', 'success');
        setTimeout(() => router.push('/admin/berita'), 1000);
      }
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        aria-label="Form artikel berita">

        {/* Main Content */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Konten Artikel</span>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-grid" style={{ gap: '16px' }}>
              {/* Title */}
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="title">
                  Judul Artikel <span className="required" aria-hidden="true">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="admin-input"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Judul berita yang menarik..."
                  required
                  aria-required="true"
                  aria-invalid={!!errors.title}
                />
                {errors.title && <span className="admin-error-msg" role="alert">{errors.title}</span>}
              </div>

              {/* Slug */}
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="slug">
                  URL Slug <span className="required" aria-hidden="true">*</span>
                </label>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  className="admin-input"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="url-akhir-artikel"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.slug}
                  aria-describedby="slug-help"
                />
                <span id="slug-help" className="admin-helper">
                  Otomatis dibuat dari judul. Hanya huruf kecil, angka, dan tanda hubung.
                </span>
                {errors.slug && <span className="admin-error-msg" role="alert">{errors.slug}</span>}
              </div>

              {/* Excerpt */}
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="excerpt">Ringkasan (Excerpt)</label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  className="admin-textarea"
                  value={form.excerpt}
                  onChange={handleChange}
                  placeholder="Ringkasan singkat artikel (opsional)..."
                  style={{ minHeight: '80px' }}
                />
                <span className="admin-helper">Muncul di daftar berita. Maks 160 karakter.</span>
              </div>

              {/* Content */}
              <div className="admin-form-group">
                <label className="admin-label">
                  Konten Artikel <span className="required" aria-hidden="true">*</span>
                </label>
                <TiptapEditor 
                  value={form.content}
                  onChange={(html) => {
                    setForm(prev => ({ ...prev, content: html }));
                    if (errors.content) setErrors(prev => ({ ...prev, content: '' }));
                  }}
                />
                {errors.content && <span className="admin-error-msg" role="alert">{errors.content}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Metadata & Publikasi</span>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-grid cols-2">
              {/* Category */}
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="category">
                  Kategori <span className="required" aria-hidden="true">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  className="admin-select"
                  value={form.category}
                  onChange={handleChange}
                  required
                  aria-required="true"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && <span className="admin-error-msg" role="alert">{errors.category}</span>}
              </div>

              {/* Date */}
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="date">Tanggal Publikasi</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  className="admin-input"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>

              {/* Author */}
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="author">Penulis</label>
                <input
                  id="author"
                  name="author"
                  type="text"
                  className="admin-input"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="Tim RS Bhayangkara"
                />
              </div>

              {/* Read Time */}
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="read_time">Estimasi Baca</label>
                <input
                  id="read_time"
                  name="read_time"
                  type="text"
                  className="admin-input"
                  value={form.read_time}
                  onChange={handleChange}
                  placeholder="3 menit baca"
                />
              </div>

              {/* Beautified Image Upload (Landscape for News) */}
              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-label">Gambar Thumbnail (Berita)</label>
                
                <div 
                  className="admin-profile-upload"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={isDragging ? { borderColor: 'var(--admin-primary)', background: 'var(--admin-primary-l)', borderStyle: 'dashed' } : {}}
                >
                  <div className="admin-profile-preview-container" style={{ width: '240px', height: '160px', minWidth: '240px' }}>
                    {imagePreview ? (
                      <NextImage src={imagePreview} alt="Preview" fill style={{ objectFit: 'cover' }} unoptimized />
                    ) : (
                      <div className="admin-profile-placeholder">
                        <ImageIcon size={32} strokeWidth={1.5} />
                        <span>Tarik foto ke sini</span>
                      </div>
                    )}
                  </div>

                  <div className="admin-profile-upload-actions">
                    <div style={{ marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--admin-text-h)', marginBottom: '4px' }}>
                        {imageFile ? 'Gambar terpilih' : 'Unggah gambar baru'}
                      </h4>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-m)' }}>
                        Gambar ini akan menjadi sampul utama artikel.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div className="admin-file-custom">
                        <input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          disabled={isCompressing}
                        />
                        <div className="admin-file-trigger" style={isCompressing ? { opacity: 0.7, pointerEvents: 'none' } : {}}>
                          {isCompressing ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                          {isCompressing ? 'Mengompresi...' : (imageFile ? 'Ganti Foto' : 'Pilih File')}
                        </div>
                      </div>

                      {imageFile && !isCompressing && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--admin-success)', fontSize: '0.8125rem', fontWeight: 600 }}>
                          <CheckCircle2 size={14} />
                          <span>Siap diunggah (Teroptimasi)</span>
                        </div>
                      )}
                    </div>

                    <ul style={{ padding: 0, margin: '8px 0 0', listStyle: 'none' }}>
                      <li style={{ fontSize: '0.75rem', color: 'var(--admin-text-m)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        • Format yang didukung: JPG, PNG, WEBP (Akan dikonversi otomatis)
                      </li>
                      <li style={{ fontSize: '0.75rem', color: 'var(--admin-text-m)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        • Ukuran maks: 2 MB
                      </li>
                      <li style={{ fontSize: '0.75rem', color: 'var(--admin-text-m)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        • Rekomendasi: Rasio 16:9 atau 3:2 (Lanskap)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <Link href="/admin/berita" className="admin-btn admin-btn-ghost">Batal</Link>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={isPending || isCompressing} aria-busy={isPending}>
            {isPending
              ? (mode === 'create' ? 'Mempublikasikan...' : 'Menyimpan...')
              : (mode === 'create' ? 'Publikasikan Artikel' : 'Simpan Perubahan')}
          </button>
        </div>
      </form>

      {toast && (
        <div className="admin-toast-container" role="status" aria-live="polite">
          <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>
        </div>
      )}
    </>
  );
}
