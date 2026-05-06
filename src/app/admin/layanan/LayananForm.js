'use client';

import { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { upsertService } from '@/app/actions/admin/content';
import { getImageUrl } from '@/lib/utils';
import {
  Save, Loader2, Activity, Type, Hash, Info,
  Palette, CheckCircle2, AlertCircle, ArrowLeft,
  ToggleLeft, ToggleRight, ListOrdered, Eye, Search,
  Shapes, Upload, Image as ImageIcon, Trash2, X,
} from 'lucide-react';

const MAX_ICON_SIZE = 400; // Ikon tidak perlu besar
const COMPRESS_QUALITY = 0.8;

async function compressIcon(file) {
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
          if (width > MAX_ICON_SIZE) {
            height = Math.round((height * MAX_ICON_SIZE) / width);
            width = MAX_ICON_SIZE;
          }
        } else {
          if (height > MAX_ICON_SIZE) {
            width = Math.round((width * MAX_ICON_SIZE) / height);
            height = MAX_ICON_SIZE;
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

// ── Icon catalogue — sama persis dengan ServiceGrid.js ────────────────────────
const ICON_CATALOG = [
  {
    name: 'heart',
    label: 'Jantung',
    tags: ['jantung', 'heart', 'kardio', 'cinta'],
    svg: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    name: 'users',
    label: 'Pasien / Tim',
    tags: ['pasien', 'tim', 'orang', 'rawat', 'users', 'people', 'poli umum'],
    svg: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    name: 'activity',
    label: 'Aktivitas / EKG',
    tags: ['ekg', 'ecg', 'aktivitas', 'monitor', 'jantung', 'activity', 'detak', 'poli penyakit dalam'],
    svg: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    name: 'monitor',
    label: 'Monitor / Radiologi',
    tags: ['monitor', 'radiologi', 'rontgen', 'ct scan', 'layar', 'komputer', 'imaging'],
    svg: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    name: 'zap',
    label: 'Kilat / Darurat',
    tags: ['darurat', 'igd', 'emergency', 'kilat', 'cepat', 'zap', 'urgent'],
    svg: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    name: 'shield',
    label: 'Perisai / Perlindungan',
    tags: ['perisai', 'proteksi', 'perlindungan', 'imunisasi', 'vaksin', 'shield', 'aman'],
    svg: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    name: 'eye',
    label: 'Mata / Optalmologi',
    tags: ['mata', 'optalmologi', 'eye', 'penglihatan', 'poli mata', 'vision'],
    svg: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    name: 'ear',
    label: 'Telinga / THT',
    tags: ['telinga', 'tht', 'ear', 'pendengaran', 'poli tht', 'hidung', 'tenggorokan'],
    svg: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 0 1-7 0"/><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 0 0 4 0"/>
      </svg>
    ),
  },
  {
    name: 'bone',
    label: 'Tulang / Ortopedi',
    tags: ['tulang', 'ortopedi', 'bone', 'sendi', 'reumatologi', 'poli ortopedi'],
    svg: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 5 0c0-.81-.7-1.8 0-2.5l7-7z"/>
      </svg>
    ),
  },
  {
    name: 'ambulance',
    label: 'Ambulans / UGD',
    tags: ['ambulans', 'ugd', 'ambulance', 'emergency', 'gawat darurat', 'igd', 'transport'],
    svg: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
        <path d="M8 11V7m-2 2h4" strokeWidth="1.75"/>
      </svg>
    ),
  },
];

// Warna-warna yang umum dipakai untuk icon layanan
const COLOR_PRESETS = [
  { label: 'Biru'       , color: '#185FA5', bg: '#EBF2FA' },
  { label: 'Teal'       , color: '#0D9488', bg: '#CCFBF1' },
  { label: 'Hijau'      , color: '#16A34A', bg: '#DCFCE7' },
  { label: 'Ungu'       , color: '#7C3AED', bg: '#EDE9FE' },
  { label: 'Rose'       , color: '#E11D48', bg: '#FFE4E6' },
  { label: 'Amber'      , color: '#D97706', bg: '#FEF3C7' },
  { label: 'Indigo'     , color: '#4F46E5', bg: '#E0E7FF' },
  { label: 'Cyan'       , color: '#0891B2', bg: '#CFFAFE' },
  { label: 'Orange'     , color: '#EA580C', bg: '#FFEDD5' },
  { label: 'Slate'      , color: '#475569', bg: '#F1F5F9' },
];

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function LayananForm({ mode = 'create', service = null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors]   = useState({});
  const [toast, setToast]     = useState(null);
  const [slugEdited, setSlugEdited] = useState(mode === 'edit');

  const [iconSearch, setIconSearch] = useState('');
  const [useCustomIcon, setUseCustomIcon] = useState(!!service?.imageUrl);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(getImageUrl(service?.imageUrl) || '');
  const [isCompressing, setIsCompressing] = useState(false);

  const [form, setForm] = useState({
    name:           service?.name           || '',
    slug:           service?.slug           || '',
    description:    service?.description    || '',
    count_info:     service?.count_info     || '',
    icon_name:      service?.icon_name      || 'heart',
    image_url:      service?.imageUrl       || '',
    color_code:     service?.color_code     || '#185FA5',
    bg_color_code:  service?.bg_color_code  || '#EBF2FA',
    sort_order:     service?.sort_order     ?? 0,
    is_active:      service?.is_active      ?? true,
  });

  const filteredIcons = useMemo(() => {
    const q = iconSearch.toLowerCase().trim();
    if (!q) return ICON_CATALOG;
    return ICON_CATALOG.filter(
      (ic) => ic.label.toLowerCase().includes(q) || ic.tags.some((t) => t.includes(q))
    );
  }, [iconSearch]);

  const selectedIcon = ICON_CATALOG.find((ic) => ic.name === form.icon_name) ?? ICON_CATALOG[0];

  /* ── Handlers ───────────────────────────────────────── */
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'name' && !slugEdited) {
        updated.slug = generateSlug(value);
      }
      if (name === 'slug') setSlugEdited(true);
      return updated;
    });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function applyColorPreset(preset) {
    setForm(prev => ({ ...prev, color_code: preset.color, bg_color_code: preset.bg }));
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const optimizedFile = await compressIcon(file);
      setImageFile(optimizedFile);
      setImagePreview(URL.createObjectURL(optimizedFile));
      setForm(prev => ({ ...prev, image_url: '' })); // Reset URL as we have a new file
    } catch (err) {
      console.error('Compression error:', err);
    } finally {
      setIsCompressing(false);
    }
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview('');
    setForm(prev => ({ ...prev, image_url: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nama layanan wajib diisi.';
    if (!form.slug.trim()) errs.slug = 'Slug wajib diisi.';
    if (!/^[a-z0-9-]+$/.test(form.slug)) errs.slug = 'Slug hanya boleh huruf kecil, angka, dan tanda hubung.';
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

    const payload = {
      name:          form.name.trim(),
      slug:          form.slug.trim(),
      description:   form.description.trim() || null,
      countInfo:     form.count_info.trim()  || null,
      iconName:      form.icon_name,
      imageUrl:      imageFile || form.image_url || null,
      colorCode:     form.color_code,
      bgColorCode:   form.bg_color_code,
      sortOrder:     Number(form.sort_order),
      isActive:      form.is_active,
    };

    startTransition(async () => {
      const result = await upsertService(mode === 'edit' ? service.id : null, payload);
      if (result?.error || !result?.success) {
        showToast(result?.error || 'Terjadi kesalahan.', 'error');
      } else {
        showToast(
          mode === 'create' ? 'Layanan berhasil ditambahkan!' : 'Layanan berhasil diperbarui!',
          'success'
        );
        setTimeout(() => router.push('/admin/layanan'), 900);
      }
    });
  }

  /* ── Preview icon ───────────────────────────────────── */
  const previewStyle = {
    background: form.bg_color_code || '#EBF2FA',
    color: form.color_code || '#185FA5',
  };

  /* ── Scroll close dropdown on outside click ─────────── */

  return (
    <div className="lf-page">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="lf-header">
        <div className="lf-header-left">
          <Link href="/admin/layanan" className="lf-back-btn" aria-label="Kembali ke daftar layanan">
            <ArrowLeft size={16} />
          </Link>
          <div className="lf-header-icon">
            <Activity size={20} />
          </div>
          <div>
            <h1 className="lf-header-title">
              {mode === 'create' ? 'Tambah Layanan Baru' : 'Edit Layanan'}
            </h1>
            <p className="lf-header-subtitle">
              {mode === 'create'
                ? 'Tambahkan layanan medis atau poli klinik.'
                : `Mengedit: ${service?.name}`}
            </p>
          </div>
        </div>
      </div>

      {/* ── Form ────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} noValidate className="lf-body">

        {/* ── Main ─────────────────────────────────── */}
        <div className="lf-main">

          {/* Fieldset: Informasi Utama */}
          <fieldset className="lf-fieldset">
            <legend className="lf-legend">
              <span className="lf-legend-icon"><Activity size={14} /></span>
              Informasi Layanan
            </legend>
            <p className="lf-legend-hint">Nama dan slug URL yang akan tampil di halaman publik.</p>

            <div className="lf-fields">
              {/* Nama */}
              <div className="lf-form-group">
                <label className="lf-label" htmlFor="name">
                  Nama Layanan <span className="lf-required">*</span>
                </label>
                <div className="lf-input-icon-wrap">
                  <span className="lf-input-icon"><Type size={14} /></span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={`lf-input lf-input-with-icon ${errors.name ? 'lf-input-err' : ''}`}
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Contoh: Poli Jantung & Pembuluh Darah"
                    required
                    aria-invalid={!!errors.name}
                  />
                </div>
                {errors.name && <span className="lf-error" role="alert"><AlertCircle size={12} />{errors.name}</span>}
              </div>

              {/* Slug */}
              <div className="lf-form-group">
                <label className="lf-label" htmlFor="slug">
                  Slug URL <span className="lf-required">*</span>
                </label>
                <div className="lf-input-prefix-wrap">
                  <span className="lf-input-prefix">/layanan/</span>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    className={`lf-input lf-input-prefixed ${errors.slug ? 'lf-input-err' : ''}`}
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="poli-jantung"
                    aria-invalid={!!errors.slug}
                  />
                </div>
                {errors.slug
                  ? <span className="lf-error" role="alert"><AlertCircle size={12} />{errors.slug}</span>
                  : <span className="lf-helper">Otomatis dari nama. Hanya huruf kecil, angka, dan tanda hubung.</span>
                }
              </div>

              {/* Deskripsi */}
              <div className="lf-form-group">
                <label className="lf-label" htmlFor="description">Deskripsi Singkat</label>
                <textarea
                  id="description"
                  name="description"
                  className="lf-textarea"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Penjelasan singkat tentang layanan ini untuk ditampilkan di website..."
                />
                <span className="lf-helper">Opsional. Tampil sebagai sub-teks di kartu layanan.</span>
              </div>

              {/* Info singkat (count_info) */}
              <div className="lf-form-group">
                <label className="lf-label" htmlFor="count_info">
                  <Info size={12} style={{ display: 'inline', marginRight: 4 }} />
                  Info Tambahan
                </label>
                <div className="lf-input-icon-wrap">
                  <span className="lf-input-icon"><Info size={14} /></span>
                  <input
                    id="count_info"
                    name="count_info"
                    type="text"
                    className="lf-input lf-input-with-icon"
                    value={form.count_info}
                    onChange={handleChange}
                    placeholder="Contoh: 5 Dokter Spesialis"
                  />
                </div>
                <span className="lf-helper">Muncul di kolom info pada tabel daftar layanan.</span>
              </div>
            </div>
          </fieldset>

          {/* ── Fieldset: Pilih Ikon ────────────────── */}
          <fieldset className="lf-fieldset">
            <legend className="lf-legend">
              <span className="lf-legend-icon"><Shapes size={14} /></span>
              Ikon Layanan
            </legend>
            <p className="lf-legend-hint">Gunakan ikon dari katalog atau unggah ikon kustom (PNG/WebP transparan).</p>

            <div className="lf-fields">
              {/* Tab Toggle */}
              <div className="lf-icon-type-tabs">
                <button
                  type="button"
                  className={`lf-icon-tab ${!useCustomIcon ? 'lf-icon-tab-active' : ''}`}
                  onClick={() => setUseCustomIcon(false)}
                >
                  Katalog Ikon
                </button>
                <button
                  type="button"
                  className={`lf-icon-tab ${useCustomIcon ? 'lf-icon-tab-active' : ''}`}
                  onClick={() => setUseCustomIcon(true)}
                >
                  Ikon Kustom (Gambar)
                </button>
              </div>

              {!useCustomIcon ? (
                <>
                  {/* Search */}
                  <div className="lf-form-group">
                    <label className="lf-label" htmlFor="icon-search">Cari Ikon</label>
                    <div className="lf-input-icon-wrap">
                      <span className="lf-input-icon"><Search size={14} /></span>
                      <input
                        id="icon-search"
                        type="text"
                        className="lf-input lf-input-with-icon"
                        value={iconSearch}
                        onChange={(e) => setIconSearch(e.target.value)}
                        placeholder="Cari: jantung, mata, IGD, ortopedi…"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  {/* Icon Grid */}
                  <div className="lf-icon-grid" role="listbox" aria-label="Pilih ikon layanan">
                    {filteredIcons.length === 0 ? (
                      <p className="lf-icon-no-result">Tidak ada ikon yang cocok dengan pencarian &ldquo;{iconSearch}&rdquo;</p>
                    ) : (
                      filteredIcons.map((icon) => {
                        const isActive = form.icon_name === icon.name;
                        return (
                          <button
                            key={icon.name}
                            type="button"
                            role="option"
                            aria-selected={isActive}
                            className={`lf-icon-card ${isActive ? 'lf-icon-card-active' : ''}`}
                            onClick={() => setForm(prev => ({ ...prev, icon_name: icon.name }))}
                            title={icon.label}
                          >
                            <div
                              className="lf-icon-card-preview"
                              style={{
                                background: isActive ? form.bg_color_code : 'var(--admin-surface-2)',
                                color: isActive ? form.color_code : 'var(--admin-text-m)',
                              }}
                            >
                              {icon.svg(isActive ? form.color_code : 'currentColor')}
                            </div>
                            <span className="lf-icon-card-label">{icon.label}</span>
                            {isActive && (
                              <span className="lf-icon-card-check">
                                <CheckCircle2 size={12} />
                              </span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </>
              ) : (
                <div className="lf-custom-icon-upload">
                  <div className="lf-form-group">
                    <label className="lf-label">Unggah Gambar Ikon</label>
                    <div className="lf-upload-container">
                      {imagePreview ? (
                        <div className="lf-preview-box">
                          <img src={imagePreview} alt="Preview Ikon" className="lf-custom-icon-preview-img" />
                          <button type="button" className="lf-remove-img" onClick={clearImage}>
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <label className="lf-upload-label">
                          <Upload size={24} />
                          <span>Pilih Gambar PNG/WebP</span>
                          <span className="lf-helper">Direkomendasikan latar belakang transparan</span>
                          <input
                            type="file"
                            accept="image/png,image/webp"
                            onChange={handleImageChange}
                            className="lf-hidden-input"
                          />
                        </label>
                      )}
                      {isCompressing && (
                        <div className="lf-compress-overlay">
                          <Loader2 size={16} className="animate-spin" />
                          <span>Mengoptimalkan...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Selected badge */}
              <div className="lf-icon-selected-info">
                <div
                  className="lf-icon-selected-preview"
                  style={{ background: form.bg_color_code, color: form.color_code }}
                >
                  {useCustomIcon && imagePreview ? (
                    <img src={imagePreview} alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} />
                  ) : (
                    selectedIcon.svg(form.color_code)
                  )}
                </div>
                <div>
                  <p className="lf-label" style={{ marginBottom: 1 }}>Ikon Aktif</p>
                  <p className="lf-helper">
                    {useCustomIcon ? (
                      imagePreview ? 'Ikon Gambar Kustom' : 'Belum ada gambar'
                    ) : (
                      <>
                        <code style={{ fontFamily: 'monospace', background: 'var(--admin-border-soft)', padding: '1px 5px', borderRadius: 4 }}>{form.icon_name}</code>
                        &nbsp;·&nbsp;{selectedIcon.label}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </fieldset>

          {/* Fieldset: Warna & Ikon */}
          <fieldset className="lf-fieldset">
            <legend className="lf-legend">
              <span className="lf-legend-icon"><Palette size={14} /></span>
              Warna Ikon
            </legend>
            <p className="lf-legend-hint">Tentukan warna tampilan ikon layanan pada halaman publik.</p>

            <div className="lf-fields">
              {/* Preset Pills */}
              <div className="lf-form-group">
                <label className="lf-label">Pilih Preset Warna</label>
                <div className="lf-color-presets">
                  {COLOR_PRESETS.map((preset) => {
                    const isActive = form.color_code === preset.color;
                    return (
                      <button
                        key={preset.color}
                        type="button"
                        className={`lf-color-pill ${isActive ? 'lf-color-pill-active' : ''}`}
                        style={{ background: preset.bg, color: preset.color, borderColor: isActive ? preset.color : 'transparent' }}
                        onClick={() => applyColorPreset(preset)}
                        title={preset.label}
                        aria-pressed={isActive}
                      >
                        <span className="lf-color-dot" style={{ background: preset.color }} />
                        {preset.label}
                        {isActive && <CheckCircle2 size={11} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Manual hex + Preview */}
              <div className="lf-color-manual-row">
                <div className="lf-form-group lf-flex-1">
                  <label className="lf-label" htmlFor="color_code">
                    <Hash size={11} style={{ display: 'inline', marginRight: 3 }} />
                    Warna Ikon
                  </label>
                  <div className="lf-color-input-wrap">
                    <input
                      type="color"
                      value={form.color_code}
                      onChange={(e) => setForm(prev => ({ ...prev, color_code: e.target.value }))}
                      className="lf-color-swatch"
                      aria-label="Pilih warna ikon"
                    />
                    <input
                      id="color_code"
                      name="color_code"
                      type="text"
                      className="lf-input lf-input-code"
                      value={form.color_code}
                      onChange={handleChange}
                      placeholder="#185FA5"
                      maxLength={7}
                    />
                  </div>
                </div>

                <div className="lf-form-group lf-flex-1">
                  <label className="lf-label" htmlFor="bg_color_code">
                    <Hash size={11} style={{ display: 'inline', marginRight: 3 }} />
                    Warna Background
                  </label>
                  <div className="lf-color-input-wrap">
                    <input
                      type="color"
                      value={form.bg_color_code}
                      onChange={(e) => setForm(prev => ({ ...prev, bg_color_code: e.target.value }))}
                      className="lf-color-swatch"
                      aria-label="Pilih warna background"
                    />
                    <input
                      id="bg_color_code"
                      name="bg_color_code"
                      type="text"
                      className="lf-input lf-input-code"
                      value={form.bg_color_code}
                      onChange={handleChange}
                      placeholder="#EBF2FA"
                      maxLength={7}
                    />
                  </div>
                </div>

                {/* Live Preview */}
                <div className="lf-form-group lf-icon-preview-wrap">
                  <label className="lf-label">
                    <Eye size={11} style={{ display: 'inline', marginRight: 3 }} />
                    Preview
                  </label>
                  <div className="lf-icon-preview" style={previewStyle} aria-label="Preview ikon layanan">
                    {useCustomIcon && imagePreview ? (
                      <img src={imagePreview} alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} />
                    ) : (
                      selectedIcon.svg(form.color_code || '#185FA5')
                    )}
                    <span className="lf-preview-name">
                      {form.name || 'Nama Layanan'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        {/* ── Sidebar ──────────────────────────────── */}
        <div className="lf-sidebar">

          {/* Fieldset: Pengaturan */}
          <fieldset className="lf-fieldset">
            <legend className="lf-legend">
              <span className="lf-legend-icon"><ListOrdered size={14} /></span>
              Pengaturan
            </legend>

            <div className="lf-fields">
              {/* Sort order */}
              <div className="lf-form-group">
                <label className="lf-label" htmlFor="sort_order">Urutan Tampil</label>
                <input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  min="0"
                  max="999"
                  className="lf-input"
                  value={form.sort_order}
                  onChange={handleChange}
                />
                <span className="lf-helper">Angka kecil tampil lebih dulu (0 = pertama).</span>
              </div>

              {/* Status */}
              <div className="lf-toggle-row">
                <div>
                  <p className="lf-label" style={{ marginBottom: 2 }}>Status Aktif</p>
                  <p className="lf-helper">Layanan tampil di halaman publik jika aktif.</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.is_active}
                  className={`lf-toggle ${form.is_active ? 'lf-toggle-on' : 'lf-toggle-off'}`}
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

          {/* Actions */}
          <div className="lf-actions">
            <button
              type="submit"
              disabled={isPending}
              className="lf-btn-submit"
              aria-busy={isPending}
            >
              {isPending
                ? <><Loader2 size={15} className="animate-spin" />{mode === 'create' ? 'Menyimpan…' : 'Memperbarui…'}</>
                : <><Save size={15} />{mode === 'create' ? 'Simpan Layanan' : 'Perbarui Layanan'}</>
              }
            </button>
            <Link href="/admin/layanan" className="lf-btn-cancel">Batal</Link>
          </div>
        </div>
      </form>

      {/* ── Toast ───────────────────────────────────────── */}
      {toast && (
        <div className="lf-toast-wrap" role="status" aria-live="polite">
          <div className={`lf-toast lf-toast-${toast.type}`}>
            {toast.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
            {toast.msg}
          </div>
        </div>
      )}

      <style>{`
        /* ── Layout ───────────────────────────────────────── */
        .lf-page { display: flex; flex-direction: column; gap: 20px; }

        .lf-icon-type-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
          border-bottom: 1px solid var(--admin-border-soft);
          padding-bottom: 8px;
        }

        .lf-icon-tab {
          padding: 6px 12px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--admin-text-s);
          background: transparent;
          border: none;
          cursor: pointer;
          border-radius: var(--admin-radius-sm);
          transition: all 150ms;
        }

        .lf-icon-tab:hover {
          color: var(--admin-text-h);
          background: var(--admin-surface-2);
        }

        .lf-icon-tab-active {
          color: var(--admin-primary) !important;
          background: var(--admin-primary-l) !important;
        }

        .lf-upload-container {
          position: relative;
          width: 100%;
          min-height: 120px;
          border: 2px dashed var(--admin-border);
          border-radius: var(--admin-radius-md);
          background: var(--admin-surface-2);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .lf-upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          color: var(--admin-text-m);
          width: 100%;
          height: 100%;
          padding: 20px;
        }

        .lf-hidden-input {
          display: none;
        }

        .lf-preview-box {
          position: relative;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lf-custom-icon-preview-img {
          max-width: 80px;
          max-height: 80px;
          object-fit: contain;
        }

        .lf-remove-img {
          position: absolute;
          top: 0px;
          right: 0px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--admin-danger);
          color: #fff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .lf-compress-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.75rem;
          color: var(--admin-primary);
        }

        /* ── Header ───────────────────────────────────────── */
        .lf-header {
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-lg);
          padding: 18px 24px;
          box-shadow: var(--admin-shadow-xs);
          flex-wrap: wrap;
        }

        .lf-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
          flex: 1;
        }

        .lf-back-btn {
          width: 36px; height: 36px;
          border-radius: var(--admin-radius-sm);
          border: 1px solid var(--admin-border);
          background: var(--admin-surface);
          color: var(--admin-text-m);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; text-decoration: none;
          transition: all 150ms;
        }

        .lf-back-btn:hover {
          background: var(--admin-primary-l);
          border-color: var(--admin-primary);
          color: var(--admin-primary);
        }

        .lf-header-icon {
          width: 44px; height: 44px;
          border-radius: var(--admin-radius-md);
          background: var(--admin-primary-l);
          color: var(--admin-primary);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .lf-header-title {
          font-size: 1.0625rem;
          font-weight: 700;
          color: var(--admin-text-h);
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          margin-bottom: 2px;
        }

        .lf-header-subtitle {
          font-size: 0.8125rem;
          color: var(--admin-text-s);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 420px;
        }

        /* ── Form Grid ────────────────────────────────────── */
        .lf-body {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          align-items: start;
        }

        @media (min-width: 1024px) {
          .lf-body { grid-template-columns: 1fr 280px; }
        }

        .lf-main, .lf-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Fieldset ─────────────────────────────────────── */
        .lf-fieldset {
          border: 1px solid var(--admin-border-soft);
          border-radius: var(--admin-radius-md);
          padding: 0; margin: 0;
          overflow: hidden;
          background: var(--admin-surface);
          box-shadow: var(--admin-shadow-xs);
        }

        .lf-legend {
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

        .lf-legend-icon {
          width: 24px; height: 24px;
          border-radius: 6px;
          background: var(--admin-primary-l);
          color: var(--admin-primary);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .lf-legend-hint {
          font-size: 0.75rem;
          color: var(--admin-text-s);
          padding: 10px 16px 0;
          line-height: 1.4;
          margin: 0;
        }

        .lf-fields {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
        }

        /* ── Form Controls ────────────────────────────────── */
        .lf-form-group { display: flex; flex-direction: column; gap: 5px; }
        .lf-flex-1 { flex: 1; min-width: 0; }

        .lf-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--admin-text-b);
        }

        .lf-required { color: var(--admin-danger); margin-left: 2px; }

        /* Icon wrap */
        .lf-input-icon-wrap { position: relative; display: flex; align-items: center; }
        .lf-input-icon {
          position: absolute; left: 11px;
          color: var(--admin-text-s);
          display: flex; align-items: center;
          pointer-events: none;
        }

        /* Prefix wrap */
        .lf-input-prefix-wrap { display: flex; }
        .lf-input-prefix {
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

        .lf-input {
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

        .lf-input-with-icon  { padding-left: 36px; }
        .lf-input-prefixed { border-radius: 0 var(--admin-radius-sm) var(--admin-radius-sm) 0; }
        .lf-input-code { font-family: 'Courier New', monospace; font-size: 0.875rem; }

        .lf-input:focus {
          outline: none;
          border-color: var(--admin-primary);
          box-shadow: 0 0 0 3px rgba(24, 95, 165, 0.12);
        }

        .lf-input::placeholder { color: var(--admin-text-s); }
        .lf-input-err { border-color: var(--admin-danger) !important; }
        .lf-input-err:focus { box-shadow: 0 0 0 3px rgba(217,64,64,0.12) !important; }

        .lf-textarea {
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

        .lf-textarea:focus {
          outline: none;
          border-color: var(--admin-primary);
          box-shadow: 0 0 0 3px rgba(24, 95, 165, 0.12);
        }

        .lf-textarea::placeholder { color: var(--admin-text-s); }

        .lf-helper { font-size: 0.75rem; color: var(--admin-text-s); line-height: 1.4; }
        .lf-error {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--admin-danger);
        }

        /* ── Icon Picker ──────────────────────────────────── */
        .lf-icon-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          gap: 8px;
        }

        .lf-icon-no-result {
          grid-column: 1 / -1;
          text-align: center;
          font-size: 0.8125rem;
          color: var(--admin-text-s);
          padding: 20px 0;
        }

        .lf-icon-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 10px 6px;
          border: 1.5px solid var(--admin-border-soft);
          border-radius: var(--admin-radius-md);
          background: var(--admin-surface);
          cursor: pointer;
          font-family: inherit;
          transition: border-color 150ms, box-shadow 150ms, transform 150ms;
          text-align: center;
        }

        .lf-icon-card:hover {
          border-color: var(--admin-primary-t);
          transform: translateY(-1px);
          box-shadow: var(--admin-shadow-sm);
        }

        .lf-icon-card-active {
          border-color: var(--admin-primary) !important;
          box-shadow: 0 0 0 3px rgba(24, 95, 165, 0.12), var(--admin-shadow-sm) !important;
        }

        .lf-icon-card-preview {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 200ms, color 200ms;
          flex-shrink: 0;
        }

        .lf-icon-card-label {
          font-size: 0.625rem;
          font-weight: 600;
          color: var(--admin-text-m);
          line-height: 1.3;
          text-align: center;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .lf-icon-card-active .lf-icon-card-label {
          color: var(--admin-primary);
        }

        .lf-icon-card-check {
          position: absolute;
          top: 4px;
          right: 4px;
          color: var(--admin-primary);
          display: flex;
          align-items: center;
        }

        .lf-icon-selected-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: var(--admin-surface-2);
          border: 1px solid var(--admin-border-soft);
          border-radius: var(--admin-radius-md);
        }

        .lf-icon-selected-preview {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 200ms, color 200ms;
        }

        /* ── Color Presets ────────────────────────────────── */
        .lf-color-presets {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .lf-color-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border-radius: 999px;
          border: 1.5px solid transparent;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 150ms;
        }

        .lf-color-pill:hover { opacity: 0.85; transform: translateY(-1px); }
        .lf-color-pill-active { box-shadow: 0 2px 8px rgba(0,0,0,0.15); }

        .lf-color-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* ── Manual Color Inputs ──────────────────────────── */
        .lf-color-manual-row {
          display: flex;
          gap: 12px;
          align-items: flex-end;
          flex-wrap: wrap;
        }

        .lf-color-input-wrap {
          display: flex;
          gap: 0;
          align-items: stretch;
        }

        .lf-color-swatch {
          width: 40px;
          height: 40px;
          border: 1px solid var(--admin-border);
          border-right: none;
          border-radius: var(--admin-radius-sm) 0 0 var(--admin-radius-sm);
          cursor: pointer;
          background: transparent;
          padding: 2px;
          flex-shrink: 0;
        }

        .lf-color-swatch::-webkit-color-swatch-wrapper { padding: 0; border-radius: 4px; }
        .lf-color-swatch::-webkit-color-swatch { border: none; border-radius: 4px; }

        .lf-color-input-wrap .lf-input {
          border-radius: 0 var(--admin-radius-sm) var(--admin-radius-sm) 0;
          flex: 1;
        }

        /* ── Icon Preview ────────────────────────────────── */
        .lf-icon-preview-wrap {
          flex-shrink: 0;
        }

        .lf-icon-preview {
          width: 100%;
          min-height: 80px;
          border-radius: var(--admin-radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px 16px;
          transition: background 200ms, color 200ms;
        }

        .lf-preview-name {
          font-size: 0.6875rem;
          font-weight: 700;
          text-align: center;
          line-height: 1.3;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        /* ── Toggle ───────────────────────────────────────── */
        .lf-toggle-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 2px 0;
        }

        .lf-toggle {
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

        .lf-toggle-on {
          background: var(--admin-success-l);
          border-color: rgba(29, 158, 117, 0.25);
          color: #116045;
        }

        .lf-toggle-off {
          background: var(--admin-surface-2);
          color: var(--admin-text-m);
        }

        /* ── Actions ──────────────────────────────────────── */
        .lf-actions { display: flex; flex-direction: column; gap: 8px; }

        .lf-btn-submit {
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

        .lf-btn-submit:hover:not(:disabled) {
          background: var(--admin-primary-h);
          box-shadow: 0 3px 10px rgba(24, 95, 165, 0.28);
        }

        .lf-btn-submit:active:not(:disabled) { transform: scale(0.98); }
        .lf-btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }

        .lf-btn-cancel {
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

        .lf-btn-cancel:hover {
          background: var(--admin-surface-2);
          color: var(--admin-text-b);
        }

        /* ── Toast ────────────────────────────────────────── */
        .lf-toast-wrap {
          position: fixed;
          bottom: 24px; right: 24px;
          z-index: 1000;
          animation: lfToastIn 220ms ease forwards;
        }

        @keyframes lfToastIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .lf-toast {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          border-radius: var(--admin-radius-md);
          font-size: 0.875rem;
          font-weight: 600;
          box-shadow: var(--admin-shadow-lg);
        }

        .lf-toast-success { background: #1D9E75; color: #fff; }
        .lf-toast-error   { background: var(--admin-danger); color: #fff; }

        @media (max-width: 640px) {
          .lf-header { padding: 14px 16px; }
          .lf-header-subtitle { display: none; }
          .lf-color-manual-row { flex-direction: column; }
          .lf-icon-preview-wrap { width: 100%; }
          .lf-icon-preview { flex-direction: row; min-height: 56px; }
          .lf-toast-wrap { bottom: 16px; right: 16px; left: 16px; }
          .lf-toast { width: 100%; }
        }
      `}</style>
    </div>
  );
}
