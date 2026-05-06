'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createDokter, updateDokter } from '@/app/actions/admin/dokter';
import { Upload, Image as ImageIcon, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';

const MAX_WIDTH = 800;
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

export default function DokterForm({ mode = 'create', doctor = null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(doctor?.image ? getImageUrl(doctor.image) : '');
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const [form, setForm] = useState({
    name: doctor?.name || '',
    specialization: doctor?.specialization || '',
    isAvailable: doctor?.isAvailable ?? true,
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
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nama dokter wajib diisi.';
    if (!form.specialization.trim()) errs.specialization = 'Spesialisasi wajib diisi.';
    return errs;
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (imageFile) {
      formData.append('image', imageFile);
    }
    if (doctor?.image) {
      formData.append('existing_image', doctor.image);
    }

    startTransition(async () => {
      const result = mode === 'create'
        ? await createDokter(formData)
        : await updateDokter(doctor.id, formData);

      if (result?.error) {
        showToast(result.error, 'danger');
      } else {
        showToast(
          mode === 'create' ? 'Dokter berhasil ditambahkan.' : 'Dokter berhasil diperbarui.',
          'success'
        );
        setTimeout(() => router.push('/admin/dokter'), 1000);
      }
    });
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        aria-label={mode === 'create' ? 'Form tambah dokter' : 'Form edit dokter'}
      >
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Data Utama</span>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-grid cols-2">
              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-label" htmlFor="name">
                  Nama Dokter <span className="required" aria-hidden="true">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="admin-input"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Contoh: dr. Budi Santoso, Sp.JP"
                  required
                  aria-required="true"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <span id="name-error" className="admin-error-msg" role="alert">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-label" htmlFor="specialization">
                  Spesialisasi <span className="required" aria-hidden="true">*</span>
                </label>
                <input
                  id="specialization"
                  name="specialization"
                  type="text"
                  className="admin-input"
                  value={form.specialization}
                  onChange={handleChange}
                  placeholder="Contoh: Spesialis Jantung & Pembuluh Darah"
                  required
                  aria-required="true"
                  aria-describedby={errors.specialization ? 'spec-error' : undefined}
                  aria-invalid={!!errors.specialization}
                />
                {errors.specialization && (
                  <span id="spec-error" className="admin-error-msg" role="alert">
                    {errors.specialization}
                  </span>
                )}
              </div>

              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-label">Foto Profil Dokter</label>
                
                <div 
                  className="admin-profile-upload"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={isDragging ? { borderColor: 'var(--admin-primary)', background: 'var(--admin-primary-l)', borderStyle: 'dashed' } : {}}
                >
                  <div className="admin-profile-preview-container">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" />
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
                        {imageFile ? 'Foto terpilih' : 'Unggah foto baru'}
                      </h4>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-m)' }}>
                        Foto ini akan muncul di profil dokter dan jadwal praktek.
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
                        • Rekomendasi: Rasio 3:4 atau 1:1
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label" htmlFor="isAvailable">Status Ketersediaan</label>
                <label className="admin-toggle" style={{ marginTop: '4px' }}>
                  <div className="admin-toggle-track">
                    <input
                      id="isAvailable"
                      name="isAvailable"
                      type="checkbox"
                      className="admin-toggle-input"
                      checked={form.isAvailable}
                      onChange={handleChange}
                      aria-describedby="avail-help"
                    />
                    <span className="admin-toggle-thumb" />
                  </div>
                  <span style={{ fontSize: '0.875rem', color: 'var(--admin-text-b)' }}>
                    {form.isAvailable ? 'Tersedia untuk praktek' : 'Sedang tidak tersedia'}
                  </span>
                </label>
                <span id="avail-help" className="admin-helper">
                  Dokter yang tidak aktif tidak akan muncul di jadwal publik.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <Link href="/admin/dokter" className="admin-btn admin-btn-ghost">
            Batal
          </Link>
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={isPending || isCompressing}
            aria-busy={isPending}
          >
            {isPending
              ? (mode === 'create' ? 'Menyimpan...' : 'Memperbarui...')
              : (mode === 'create' ? 'Simpan Dokter' : 'Perbarui Dokter')
            }
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
