'use client';

import { useState, useRef } from 'react';
import { updatePageSEO, uploadSEOImage, updateSiteSettings } from '@/app/actions/admin/settings';
import { getImageUrl } from '@/lib/utils';
import { Save, Loader2, Globe, Search, Type, ExternalLink, ChevronRight, CheckCircle2, AlertCircle, Edit3, X, Image as ImageIcon, Upload, Trash2, Plus } from 'lucide-react';

export default function SEOSettingsForm({ initialData, headerData }) {
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [seoList, setSeoList] = useState(initialData || []);
  const [headerSettings, setHeaderSettings] = useState(headerData || {});
  const [menuItems, setMenuItems] = useState(headerData?.menu || []);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newRouteData, setNewRouteData] = useState({
    route: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });

  const [formData, setFormData] = useState({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_image: '',
    show_in_navbar: false,
    menu_label: '',
    menu_order: 10,
    is_active: true,
  });
  const [ogPreview, setOgPreview] = useState(null);
  const [ogUploading, setOgUploading] = useState(false);
  const [ogDragging, setOgDragging] = useState(false);
  const ogInputRef = useRef(null);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setStatus(null);
    setOgPreview(null);
    const existingMenu = menuItems.find(m => m.route === item.route) || {};
    setFormData({
      meta_title: item.meta_title || '',
      meta_description: item.meta_description || '',
      meta_keywords: item.meta_keywords?.join(', ') || '',
      is_active: item.is_active ?? true,
      og_image: item.og_image || '',
      show_in_navbar: existingMenu.showInNavbar ?? false,
      menu_label: existingMenu.label || item.meta_title || '',
      menu_order: existingMenu.order ?? 10,
    });
  };

  const handleOgUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Hanya file gambar yang diperbolehkan.'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Ukuran file maksimal 5 MB.'); return; }

    setOgPreview(URL.createObjectURL(file));
    setOgUploading(true);

    const fd = new FormData();
    fd.append('file', file);
    const res = await uploadSEOImage(fd);
    setOgUploading(false);

    if (res.success) {
      setFormData(p => ({ ...p, og_image: res.url }));
    } else {
      setOgPreview(null);
      alert('Gagal upload gambar: ' + res.error);
    }
    if (ogInputRef.current) ogInputRef.current.value = '';
  };

  const handleOgDragEnter  = (e) => { e.preventDefault(); e.stopPropagation(); setOgDragging(true); };
  const handleOgDragOver   = (e) => { e.preventDefault(); e.stopPropagation(); setOgDragging(true); };
  const handleOgDragLeave  = (e) => { e.preventDefault(); e.stopPropagation(); setOgDragging(false); };
  const handleOgDrop       = (e) => {
    e.preventDefault(); e.stopPropagation();
    setOgDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleOgUpload(file);
  };

  const handleCancel = () => {
    setEditingId(null);
    setStatus(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();
    if (!newRouteData.route.startsWith('/')) {
      alert('Rute harus diawali dengan "/" (misal: /layanan)');
      return;
    }
    setLoading(true);
    
    const formattedData = {
      meta_title: newRouteData.meta_title,
      meta_description: newRouteData.meta_description,
      meta_keywords: newRouteData.meta_keywords.split(',').map(k => k.trim()).filter(k => k !== ''),
      is_active: true,
      og_image: null,
    };

    const res = await updatePageSEO(newRouteData.route, formattedData);
    setLoading(false);

    if (res.success) {
      const newSeoItem = {
        id: newRouteData.route,
        route: newRouteData.route,
        ...formattedData,
      };
      setSeoList(prev => [...prev, newSeoItem]);
      setNewRouteData({
        route: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
      });
      setShowAddForm(false);
    } else {
      alert('Gagal menambahkan rute: ' + res.error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formattedData = {
      meta_title: formData.meta_title,
      meta_description: formData.meta_description,
      meta_keywords: formData.meta_keywords.split(',').map(k => k.trim()).filter(k => k !== ''),
      is_active: formData.is_active,
      og_image: formData.og_image || null,
    };

    const res = await updatePageSEO(editingId, formattedData);

    if (res.success) {
      const menuLabel = formData.menu_label || formData.meta_title || editingId;
      const menuOrder = Number(formData.menu_order) || 10;
      const showInNavbar = formData.show_in_navbar ?? false;

      const exists = menuItems.some(m => m.route === editingId);
      let updatedMenu;
      if (exists) {
        updatedMenu = menuItems.map(m => m.route === editingId ? {
          ...m,
          label: menuLabel,
          order: menuOrder,
          showInNavbar
        } : m);
      } else {
        updatedMenu = [
          ...menuItems,
          {
            route: editingId,
            label: menuLabel,
            order: menuOrder,
            showInNavbar
          }
        ];
      }

      updatedMenu.sort((a, b) => a.order - b.order);

      const updatedHeader = {
        ...headerSettings,
        menu: updatedMenu
      };

      const settingsRes = await updateSiteSettings('header', updatedHeader);
      
      setLoading(false);
      if (settingsRes.success) {
        setHeaderSettings(updatedHeader);
        setMenuItems(updatedMenu);
        setSeoList(prev => prev.map(item => item.id === editingId ? { ...item, ...formattedData } : item));
        setStatus('success');
        setTimeout(() => {
          setEditingId(null);
          setStatus(null);
        }, 1600);
      } else {
        setStatus('error');
      }
    } else {
      setLoading(false);
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

      {/* Add Custom Route Form */}
      <div style={{
        background: 'var(--admin-surface)',
        border: '1px solid var(--admin-border)',
        borderRadius: 'var(--admin-radius-lg)',
        padding: '16px',
        boxShadow: 'var(--admin-shadow-xs)',
        marginBottom: '16px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0, color: 'var(--admin-text-h)' }}>
              Rute & Halaman Kustom
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-s)', margin: '2px 0 0 0' }}>
              Tambahkan halaman baru ke website untuk dikelola SEO dan Navigasinya.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="seo-edit-btn"
            style={{
              backgroundColor: showAddForm ? 'var(--admin-surface-2)' : 'var(--admin-primary)',
              color: showAddForm ? 'var(--admin-text-b)' : '#ffffff',
              border: showAddForm ? '1px solid var(--admin-border)' : 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              minHeight: '36px'
            }}
          >
            {showAddForm ? <X size={14} /> : <span style={{ fontSize: '1.1rem', lineHeight: 0, fontWeight: 'bold' }}>+</span>}
            {showAddForm ? 'Batal' : 'Tambah Halaman'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddRoute} style={{
            marginTop: '16px',
            borderTop: '1px solid var(--admin-border-soft)',
            paddingTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="settings-form-group">
                <label className="settings-label" htmlFor="new_route_path">
                  Rute Halaman (Path URL) <span className="settings-required">*</span>
                </label>
                <div className="settings-input-wrap">
                  <input
                    id="new_route_path"
                    className="settings-input"
                    style={{ paddingLeft: '12px' }}
                    type="text"
                    name="route"
                    value={newRouteData.route}
                    onChange={(e) => setNewRouteData(p => ({ ...p, route: e.target.value }))}
                    placeholder="/halaman-baru"
                    required
                  />
                </div>
                <span className="settings-helper">Harus diawali slash (misal: /layanan-unggul)</span>
              </div>

              <div className="settings-form-group">
                <label className="settings-label" htmlFor="new_route_title">
                  Meta Title (Judul Halaman) <span className="settings-required">*</span>
                </label>
                <div className="settings-input-wrap">
                  <input
                    id="new_route_title"
                    className="settings-input"
                    style={{ paddingLeft: '12px' }}
                    type="text"
                    name="meta_title"
                    value={newRouteData.meta_title}
                    onChange={(e) => setNewRouteData(p => ({ ...p, meta_title: e.target.value }))}
                    placeholder="Judul Halaman · RS Bhayangkara"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="settings-form-group">
              <label className="settings-label" htmlFor="new_route_desc">
                Meta Description (Deskripsi)
              </label>
              <textarea
                id="new_route_desc"
                className="settings-textarea"
                rows={2}
                name="meta_description"
                value={newRouteData.meta_description}
                onChange={(e) => setNewRouteData(p => ({ ...p, meta_description: e.target.value }))}
                placeholder="Deskripsi untuk penelusuran search engine..."
              />
            </div>

            <div className="settings-form-group">
              <label className="settings-label" htmlFor="new_route_keywords">
                Meta Keywords
              </label>
              <div className="settings-input-wrap">
                <input
                  id="new_route_keywords"
                  className="settings-input"
                  style={{ paddingLeft: '12px' }}
                  type="text"
                  name="meta_keywords"
                  value={newRouteData.meta_keywords}
                  onChange={(e) => setNewRouteData(p => ({ ...p, meta_keywords: e.target.value }))}
                  placeholder="keyword1, keyword2"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
              <button
                type="submit"
                disabled={loading}
                className="settings-btn-save settings-btn-save-sm"
                style={{ minHeight: '36px' }}
              >
                {loading ? <Loader2 size={13} className="animate-spin" /> : 'Simpan Halaman Baru'}
              </button>
            </div>
          </form>
        )}
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
                  {/* Status Toggle */}
                  <div className="seo-status-toggle-row">
                    <div className="seo-status-info">
                      <span className="seo-status-label">Status Halaman</span>
                      <span className="seo-status-hint">Jika dimatikan, halaman ini tidak bisa diakses publik.</span>
                    </div>
                    <label className="seo-switch">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData(p => ({ ...p, is_active: e.target.checked }))}
                      />
                      <span className="seo-slider"></span>
                    </label>
                  </div>

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

                  {/* Navbar Menu Settings */}
                  <div className="seo-navbar-section" style={{
                    border: '1px solid var(--admin-border-soft)',
                    borderRadius: '8px',
                    padding: '16px',
                    backgroundColor: 'var(--admin-surface-2)',
                    marginTop: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <h4 style={{
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: 'var(--admin-text-h)',
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Globe size={14} style={{ color: 'var(--admin-primary)' }} />
                      Pengaturan Menu Navigasi (Header)
                    </h4>
                    
                    <div className="seo-status-toggle-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <div className="seo-status-info">
                        <span className="seo-status-label" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Tampilkan di Navbar</span>
                        <span className="seo-status-hint" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-text-s)' }}>Munculkan halaman ini di menu header publik.</span>
                      </div>
                      <label className="seo-switch">
                        <input
                          type="checkbox"
                          name="show_in_navbar"
                          checked={formData.show_in_navbar}
                          onChange={handleChange}
                        />
                        <span className="seo-slider"></span>
                      </label>
                    </div>

                    {formData.show_in_navbar && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
                        <div className="settings-form-group">
                          <label className="settings-label" htmlFor={`menu_label_${item.id}`}>
                            Label Menu Navigasi
                          </label>
                          <div className="settings-input-wrap">
                            <input
                              id={`menu_label_${item.id}`}
                              className="settings-input"
                              style={{ paddingLeft: '12px' }}
                              type="text"
                              name="menu_label"
                              value={formData.menu_label}
                              onChange={handleChange}
                              placeholder={formData.meta_title || "Label Menu"}
                            />
                          </div>
                        </div>

                        <div className="settings-form-group">
                          <label className="settings-label" htmlFor={`menu_order_${item.id}`}>
                            Urutan Menu
                          </label>
                          <div className="settings-input-wrap">
                            <input
                              id={`menu_order_${item.id}`}
                              className="settings-input"
                              style={{ paddingLeft: '12px' }}
                              type="number"
                              name="menu_order"
                              value={formData.menu_order}
                              onChange={handleChange}
                              min={1}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* OG Image Upload */}
                  <div className="settings-form-group">
                    <label className="settings-label">
                      <ImageIcon size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
                      Open Graph Image
                      <span className="settings-helper" style={{ fontWeight: 400, marginLeft: 6 }}>— gambar pratinjau saat link dibagikan di WhatsApp / sosial media</span>
                    </label>

                    {/* Preview */}
                    {(ogPreview || formData.og_image) ? (
                      <div className="og-preview-wrap">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ogPreview || getImageUrl(formData.og_image)}
                          alt="OG Preview"
                          className="og-preview-img"
                        />
                        {ogUploading && (
                          <div className="og-uploading-badge"><Loader2 size={11} className="animate-spin" /> Mengunggah...</div>
                        )}
                        <div className="og-preview-actions">
                          <button type="button" className="og-action-btn" onClick={() => ogInputRef.current?.click()} disabled={ogUploading}>
                            <Upload size={11} /> Ganti
                          </button>
                          <button type="button" className="og-action-btn og-action-remove" onClick={() => { setOgPreview(null); setFormData(p => ({ ...p, og_image: '' })); }} disabled={ogUploading}>
                            <Trash2 size={11} /> Hapus
                          </button>
                        </div>

                        {/* Social media link preview card */}
                        <div className="og-card-preview">
                          <div className="og-card-site">rsbhayangkarnganjuk.id</div>
                          <div className="og-card-title">{formData.meta_title || 'Judul Halaman'}</div>
                          <div className="og-card-desc">{formData.meta_description || 'Deskripsi singkat halaman...'}</div>
                        </div>
                      </div>
                    ) : (
                      <label
                        className={`og-dropzone${ogDragging ? ' og-dropzone-active' : ''}`}
                        onClick={() => ogInputRef.current?.click()}
                        onDragEnter={handleOgDragEnter}
                        onDragOver={handleOgDragOver}
                        onDragLeave={handleOgDragLeave}
                        onDrop={handleOgDrop}
                      >
                        <Upload size={20} className={ogDragging ? 'og-dz-icon-bounce' : ''} style={{ color: ogDragging ? 'var(--admin-primary)' : 'var(--admin-text-s)' }} />
                        <span className="og-dz-text">{ogDragging ? 'Lepaskan file di sini' : 'Klik atau seret gambar ke sini'}</span>
                        <span className="og-dz-sub">PNG, JPG, WebP · Rasio ideal 1200×630 px (1.91:1) · Maks. 5 MB</span>
                      </label>
                    )}

                    <input
                      ref={ogInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      style={{ display: 'none' }}
                      onChange={(e) => handleOgUpload(e.target.files[0])}
                    />
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
              <div className={`seo-view-row ${!item.is_active ? 'seo-view-inactive' : ''}`}>
                <div className="seo-view-info">
                  <div className="seo-view-route-wrap">
                    <span className="seo-view-route">
                      <ChevronRight size={12} />
                      {getRouteLabel(item.route)}
                    </span>
                    {!item.is_active && (
                      <span className="seo-badge-inactive">Non-aktif</span>
                    )}
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
                  {item.og_image && (
                    <div className="seo-view-og-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={getImageUrl(item.og_image)} alt="OG" className="seo-view-og-thumb" />
                      <span className="seo-og-badge">OG Image</span>
                    </div>
                  )}

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
        .seo-view-inactive {
          opacity: 0.7;
          background: var(--admin-surface-2);
        }

        .seo-badge-inactive {
          font-size: 0.625rem;
          font-weight: 700;
          color: #d94040;
          background: #fff0f0;
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          border: 1px solid #f9d8d8;
        }

        .seo-status-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: var(--admin-surface-2);
          border: 1px solid var(--admin-border-soft);
          border-radius: var(--admin-radius-md);
          margin-bottom: 20px;
        }

        .seo-status-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .seo-status-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--admin-text-b);
        }

        .seo-status-hint {
          font-size: 0.6875rem;
          color: var(--admin-text-s);
        }

        .seo-switch {
          position: relative;
          width: 38px;
          height: 20px;
          flex-shrink: 0;
        }

        .seo-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .seo-slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background-color: var(--admin-border);
          transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 20px;
        }

        .seo-slider:before {
          position: absolute;
          content: "";
          height: 14px;
          width: 14px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 50%;
        }

        .seo-switch input:checked + .seo-slider {
          background-color: var(--admin-primary);
        }

        .seo-switch input:checked + .seo-slider:before {
          transform: translateX(18px);
        }

        /* ── OG Image Upload ────────────────────────────────── */
        .og-dropzone {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 24px 16px;
          border: 2px dashed var(--admin-border);
          border-radius: var(--admin-radius-md);
          cursor: pointer;
          text-align: center;
          transition: border-color 150ms, background 150ms;
          background: var(--admin-surface-2);
        }
        .og-dropzone:hover {
          border-color: var(--admin-primary);
          background: var(--admin-primary-l);
        }
        .og-dropzone-active {
          border-color: var(--admin-primary) !important;
          background: var(--admin-primary-l) !important;
          box-shadow: 0 0 0 3px rgba(24, 95, 165, 0.15);
        }
        @keyframes ogIconBounce {
          0%, 100% { transform: translateY(0); }
          40%       { transform: translateY(-6px); }
          70%       { transform: translateY(-3px); }
        }
        .og-dz-icon-bounce {
          animation: ogIconBounce 0.9s ease infinite;
        }
        .og-dz-text {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--admin-text-m);
        }
        .og-dz-sub {
          font-size: 0.6875rem;
          color: var(--admin-text-s);
        }
        .og-preview-wrap {
          position: relative;
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-md);
          overflow: hidden;
          background: #000;
        }
        .og-preview-img {
          width: 100%;
          aspect-ratio: 1200 / 630;
          object-fit: cover;
          display: block;
          opacity: 0.92;
        }
        .og-uploading-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.6875rem;
          font-weight: 600;
          background: rgba(0,0,0,0.65);
          color: #fff;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .og-preview-actions {
          display: flex;
          gap: 6px;
          padding: 8px;
          background: var(--admin-surface-2);
          border-top: 1px solid var(--admin-border-soft);
        }
        .og-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 10px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-sm);
          background: var(--admin-surface);
          color: var(--admin-text-m);
          cursor: pointer;
          font-family: inherit;
          transition: all 150ms;
        }
        .og-action-btn:hover:not(:disabled) {
          border-color: var(--admin-primary);
          color: var(--admin-primary);
          background: var(--admin-primary-l);
        }
        .og-action-remove:hover:not(:disabled) {
          border-color: var(--admin-danger) !important;
          color: var(--admin-danger) !important;
          background: var(--admin-danger-l) !important;
        }
        .og-action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        /* Social preview card */
        .og-card-preview {
          padding: 10px 12px;
          background: var(--admin-surface-2);
          border-top: 1px solid var(--admin-border-soft);
        }
        .og-card-site { font-size: 0.6875rem; color: var(--admin-text-s); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 2px; }
        .og-card-title { font-size: 0.8125rem; font-weight: 700; color: var(--admin-text-h); line-height: 1.3; margin-bottom: 2px; }
        .og-card-desc { font-size: 0.75rem; color: var(--admin-text-m); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        /* View mode OG thumb */
        .seo-view-og-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
        }
        .seo-view-og-thumb {
          width: 72px;
          height: 38px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid var(--admin-border);
          flex-shrink: 0;
        }
        .seo-og-badge {
          font-size: 0.625rem;
          font-weight: 700;
          color: var(--admin-primary);
          background: var(--admin-primary-l);
          padding: 2px 7px;
          border-radius: 999px;
          border: 1px solid rgba(24,95,165,0.15);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}
