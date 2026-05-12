'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createPejabat, updatePejabat } from '@/app/actions/admin/pejabat';
import { getImageUrl } from '@/lib/utils';
import { Upload, User, X, CheckCircle2 } from 'lucide-react';

export default function PejabatForm({ mode = 'create', pejabat = null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(
    pejabat?.photo ? getImageUrl(pejabat.photo) : null,
  );

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result =
        mode === 'edit'
          ? await updatePejabat(pejabat.id, formData)
          : await createPejabat(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => router.push('/admin/pejabat'), 900);
      }
    });
  }

  return (
    <div className="pejabat-form-page">
      {/* Header */}
      <div className="admin-card" style={{ marginBottom: 0 }}>
        <div className="admin-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--admin-primary-l)', color: 'var(--admin-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <User size={18} />
            </div>
            <div>
              <h1 className="admin-card-title" style={{ fontSize: '1rem' }}>
                {mode === 'edit' ? 'Edit Pejabat' : 'Tambah Pejabat Baru'}
              </h1>
              <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-s)' }}>
                {mode === 'edit' ? `Memperbarui data ${pejabat?.name}` : 'Isi detail pejabat RS Bhayangkara Nganjuk'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', alignItems: 'start' }}>

          {/* ── Left: Main Fields ── */}
          <div className="admin-card">
            <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Name */}
              <div className="admin-field">
                <label className="admin-label" htmlFor="pf-name">
                  Nama Lengkap <span style={{ color: 'var(--admin-danger)' }}>*</span>
                </label>
                <input
                  id="pf-name"
                  name="name"
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: Dr. H. Ahmad Sudirman, S.H."
                  defaultValue={pejabat?.name || ''}
                  required
                />
              </div>

              {/* Jabatan */}
              <div className="admin-field">
                <label className="admin-label" htmlFor="pf-jabatan">
                  Jabatan <span style={{ color: 'var(--admin-danger)' }}>*</span>
                </label>
                <input
                  id="pf-jabatan"
                  name="jabatan"
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: Kepala Rumah Sakit"
                  defaultValue={pejabat?.jabatan || ''}
                  required
                />
              </div>

              {/* Pangkat & NRP side by side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="admin-field">
                  <label className="admin-label" htmlFor="pf-pangkat">Pangkat / Golongan</label>
                  <input
                    id="pf-pangkat"
                    name="pangkat"
                    type="text"
                    className="admin-input"
                    placeholder="Contoh: AKBP"
                    defaultValue={pejabat?.pangkat || ''}
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label" htmlFor="pf-nrp">NRP / NIP</label>
                  <input
                    id="pf-nrp"
                    name="nrp"
                    type="text"
                    className="admin-input"
                    placeholder="Nomor Registrasi Pokok"
                    defaultValue={pejabat?.nrp || ''}
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="admin-field">
                <label className="admin-label" htmlFor="pf-bio">Biografi Singkat</label>
                <textarea
                  id="pf-bio"
                  name="bio"
                  className="admin-input"
                  placeholder="Deskripsi singkat mengenai pejabat..."
                  rows={4}
                  style={{ resize: 'vertical', minHeight: '100px' }}
                  defaultValue={pejabat?.bio || ''}
                />
              </div>
            </div>
          </div>

          {/* ── Right: Photo + Settings ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Photo upload */}
            <div className="admin-card">
              <div className="admin-card-header">
                <span className="admin-card-title" style={{ fontSize: '0.875rem' }}>Foto</span>
              </div>
              <div className="admin-card-body">
                {/* Preview */}
                <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '10px', overflow: 'hidden', background: 'var(--admin-surface-2)', border: '1px solid var(--admin-border)', marginBottom: '12px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {photoPreview ? (
                    <>
                      <Image src={photoPreview} alt="Preview foto" fill style={{ objectFit: 'cover', objectPosition: 'top' }} sizes="280px" />
                      <button
                        type="button"
                        onClick={() => setPhotoPreview(null)}
                        style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        aria-label="Hapus foto"
                      >
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--admin-text-s)' }}>
                      <User size={32} strokeWidth={1.25} style={{ margin: '0 auto 6px' }} />
                      <span style={{ fontSize: '0.75rem' }}>Belum ada foto</span>
                    </div>
                  )}
                </div>
                <label htmlFor="pf-photo" className="admin-btn admin-btn-ghost" style={{ width: '100%', justifyContent: 'center', cursor: 'pointer', textAlign: 'center' }}>
                  <Upload size={14} />
                  {photoPreview ? 'Ganti Foto' : 'Upload Foto'}
                </label>
                <input
                  id="pf-photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handlePhotoChange}
                />
                <p style={{ fontSize: '0.6875rem', color: 'var(--admin-text-s)', textAlign: 'center', marginTop: '8px' }}>
                  JPG/PNG/WebP · Maks 5 MB
                </p>
              </div>
            </div>

            {/* Settings */}
            <div className="admin-card">
              <div className="admin-card-header">
                <span className="admin-card-title" style={{ fontSize: '0.875rem' }}>Pengaturan</span>
              </div>
              <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Sort order */}
                <div className="admin-field">
                  <label className="admin-label" htmlFor="pf-sort">Urutan Tampil</label>
                  <input
                    id="pf-sort"
                    name="sortOrder"
                    type="number"
                    className="admin-input"
                    min="0"
                    defaultValue={pejabat?.sortOrder ?? 0}
                  />
                  <span style={{ fontSize: '0.6875rem', color: 'var(--admin-text-s)', marginTop: '4px' }}>Angka lebih kecil = tampil lebih awal</span>
                </div>

                {/* isActive toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--admin-text-h)' }}>Tampilkan</p>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--admin-text-s)' }}>Tampil di halaman publik</p>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: 40, height: 22, cursor: 'pointer' }}>
                    <input
                      id="pf-active"
                      name="isActive"
                      type="checkbox"
                      value="true"
                      defaultChecked={pejabat?.isActive !== false}
                      style={{ opacity: 0, width: 0, height: 0 }}
                      onChange={(e) => {
                        const slider = e.target.nextSibling;
                        if (slider) slider.style.background = e.target.checked ? 'var(--admin-primary)' : 'var(--admin-border)';
                      }}
                    />
                    <span style={{ position: 'absolute', cursor: 'pointer', inset: 0, background: pejabat?.isActive !== false ? 'var(--admin-primary)' : 'var(--admin-border)', borderRadius: '999px', transition: '0.2s' }}>
                      <span style={{ position: 'absolute', height: 16, width: 16, left: 3, bottom: 3, background: 'white', borderRadius: '50%', transition: '0.2s', transform: pejabat?.isActive !== false ? 'translateX(18px)' : 'none' }} />
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="admin-alert danger" style={{ marginTop: '16px' }} role="alert">{error}</div>
        )}
        {success && (
          <div className="admin-alert success" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }} role="status">
            <CheckCircle2 size={16} />
            {mode === 'edit' ? 'Data berhasil diperbarui.' : 'Pejabat berhasil ditambahkan.'} Mengalihkan...
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button type="button" className="admin-btn admin-btn-ghost" onClick={() => router.push('/admin/pejabat')}>
            Batal
          </button>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={isPending || success}>
            {isPending ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Tambah Pejabat'}
          </button>
        </div>
      </form>

      <style>{`
        .pejabat-form-page { display: flex; flex-direction: column; gap: 20px; }
        .admin-field { display: flex; flex-direction: column; gap: 6px; }
        .admin-card-body { padding: 20px; }
        @media (max-width: 768px) {
          .pejabat-form-page form > div { grid-template-columns: 1fr !important; }
          .pejabat-form-page form > div > div:last-child { order: -1; }
        }
      `}</style>
    </div>
  );
}
