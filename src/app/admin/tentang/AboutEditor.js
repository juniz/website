'use client';

import { useState, useTransition, useRef } from 'react';
import {
  upsertAboutProfile, upsertAboutVisiMisi,
  upsertAboutStat, deleteAboutStat,
  upsertAboutValue, deleteAboutValue,
  upsertAboutMilestone, deleteAboutMilestone,
  upsertAboutContact, deleteAboutContact,
  uploadAccreditationCertificate, removeAccreditationCertificate,
} from '@/app/actions/admin/about';
import { getImageUrl } from '@/lib/utils';
import {
  Save, Loader2, Plus, Trash2, Edit2, CheckCircle2,
  AlertCircle, FileText, Target, Award, BarChart2,
  Clock, Phone, X as XIcon, Upload, FileCheck, ExternalLink, Trash,
} from 'lucide-react';

/* ─── Toast helper ─────────────────────────────────────── */
function useToast() {
  const [toast, setToast] = useState(null);
  function show(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }
  return { toast, show };
}

/* ─── Reusable section wrapper ─────────────────────────── */
function Section({ icon: Icon, title, children }) {
  return (
    <section className="ab-section">
      <div className="ab-section-hd">
        <span className="ab-section-icon"><Icon size={15} /></span>
        <h2 className="ab-section-title">{title}</h2>
      </div>
      <div className="ab-section-body">{children}</div>
    </section>
  );
}

/* ─── Inline edit row for list items ──────────────────── */
function ItemRow({ item, fields, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [vals, setVals] = useState(item);
  const [isPending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      await onSave(item.id, vals);
      setEditing(false);
    });
  }

  if (!editing) {
    return (
      <div className="ab-item-row">
        <div className="ab-item-preview">
          {fields.map((f) => (
            <span key={f.key} className={`ab-item-preview-${f.type || 'text'}`}>
              {f.prefix}{vals[f.key] || <em style={{ opacity: 0.4 }}>kosong</em>}
            </span>
          ))}
        </div>
        <div className="ab-item-actions">
          <button className="ab-btn-icon" onClick={() => setEditing(true)} title="Edit">
            <Edit2 size={13} />
          </button>
          <button className="ab-btn-icon ab-btn-icon-danger" onClick={() => onDelete(item.id)} title="Hapus">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ab-item-edit">
      {fields.map((f) => (
        <div key={f.key} className="ab-mini-group">
          <label className="ab-label-sm">{f.label}</label>
          <input
            className="ab-input-sm"
            value={vals[f.key] || ''}
            onChange={(e) => setVals((p) => ({ ...p, [f.key]: e.target.value }))}
            placeholder={f.placeholder}
          />
        </div>
      ))}
      <div className="ab-item-edit-actions">
        <button className="ab-btn-sm ab-btn-primary" onClick={save} disabled={isPending}>
          {isPending ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          Simpan
        </button>
        <button className="ab-btn-sm" onClick={() => setEditing(false)}>Batal</button>
      </div>
    </div>
  );
}

/* ─── Add row ──────────────────────────────────────────── */
function AddRow({ fields, defaults, onAdd, placeholder }) {
  const [open, setOpen] = useState(false);
  const [vals, setVals] = useState(defaults || {});
  const [isPending, startTransition] = useTransition();

  function add() {
    startTransition(async () => {
      await onAdd(null, vals);
      setVals(defaults || {});
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <button className="ab-add-row-btn" onClick={() => setOpen(true)}>
        <Plus size={14} /> {placeholder || 'Tambah Item'}
      </button>
    );
  }

  return (
    <div className="ab-item-edit ab-item-edit-new">
      {fields.map((f) => (
        <div key={f.key} className="ab-mini-group">
          <label className="ab-label-sm">{f.label}</label>
          <input
            className="ab-input-sm"
            value={vals[f.key] || ''}
            onChange={(e) => setVals((p) => ({ ...p, [f.key]: e.target.value }))}
            placeholder={f.placeholder}
          />
        </div>
      ))}
      <div className="ab-item-edit-actions">
        <button className="ab-btn-sm ab-btn-primary" onClick={add} disabled={isPending}>
          {isPending ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
          Tambah
        </button>
        <button className="ab-btn-sm" onClick={() => setOpen(false)}>Batal</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function AboutEditor({ profile, visiMisi, stats, values, milestones, contact }) {
  const { toast, show } = useToast();

  /* ── Certificate state ──────────────────────── */
  const [certUrl, setCertUrl] = useState(profile?.accreditation_certificate_url || null);
  const [localFile, setLocalFile] = useState(null); // File yang sedang diupload/dipilih
  const [localPreview, setLocalPreview] = useState(null); // URL.createObjectURL
  const [certPending, startCertTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);
  const certInputRef = useRef(null);

  const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
  const isImage = certUrl && IMAGE_EXTS.some(ext => certUrl.toLowerCase().split('?')[0].endsWith(ext));
  // Also treat local blob previews from image files as images
  const effectivePreview = localPreview || (isImage ? getImageUrl(certUrl) : null);

  const CERT_MAX_BYTES = 10 * 1024 * 1024; // 10 MB
  const CERT_ALLOWED   = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];

  function validateCertFile(file) {
    if (!file) return 'File tidak ditemukan.';
    if (!CERT_ALLOWED.includes(file.type)) {
      return `Format "${file.type || file.name.split('.').pop()}" tidak didukung. Gunakan PDF, PNG, JPG, atau WebP.`;
    }
    if (file.size > CERT_MAX_BYTES) {
      const mb = (file.size / 1024 / 1024).toFixed(1);
      return `Ukuran file ${mb} MB melebihi batas 10 MB.`;
    }
    return null; // valid
  }

  function triggerCertUpload(file) {
    if (!file) return;
    const validationError = validateCertFile(file);
    if (validationError) { show(validationError, 'error'); return; }

    // Tampilkan preview lokal segera sebelum upload selesai
    const isImg = file.type.startsWith('image/');
    setLocalFile(file);
    if (isImg) {
      setLocalPreview(URL.createObjectURL(file));
    } else {
      setLocalPreview(null);
    }

    startCertTransition(async () => {
      const fd = new FormData();
      fd.append('certificate', file);
      const res = await uploadAccreditationCertificate(fd);
      if (res.error) {
        show(res.error, 'error');
        setLocalFile(null);
        setLocalPreview(null);
      } else {
        setCertUrl(res.url);
        setLocalFile(null);
        // localPreview tetap tampil — akan di-clear saat user klik Ganti/Hapus
        // atau ketika server image sudah pasti bisa dimuat
        show('Sertifikat berhasil diunggah!');
      }
      if (certInputRef.current) certInputRef.current.value = '';
    });
  }

  function handleCertFile(e) { triggerCertUpload(e.target.files[0]); }

  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }
  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }
  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    // Only leave if exiting the zone entirely (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false);
  }
  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    triggerCertUpload(file);
  }

  const getFileName = (url) => {
    if (!url) return 'Sertifikat_Akreditasi';
    const parts = url.split('/');
    return decodeURIComponent(parts[parts.length - 1]);
  };

  async function handleRemoveCert() {
    if (!confirm('Hapus sertifikat akreditasi?')) return;
    startCertTransition(async () => {
      const res = await removeAccreditationCertificate();
      if (res.error) show(res.error, 'error');
      else {
        setCertUrl(null);
        setLocalPreview(null); // clear preview saat hapus
        setLocalFile(null);
        show('Sertifikat dihapus.');
      }
    });
  }

  /* ── Profil state ────────────────────────────────────── */
  const [prof, setProf] = useState({
    header_title:        profile?.header_title        || 'Tentang Kami',
    header_subtitle:     profile?.header_subtitle     || '',
    paragraph_1:         profile?.paragraph_1         || '',
    paragraph_2:         profile?.paragraph_2         || '',
    accreditation_title: profile?.accreditation_title || 'TERAKREDITASI MADYA',
    accreditation_body:  profile?.accreditation_body  || '',
    accreditation_valid: profile?.accreditation_valid || '',
  });
  const [profPending, startProfTransition] = useTransition();

  async function saveProfile(e) {
    e.preventDefault();
    startProfTransition(async () => {
      const fd = new FormData();
      Object.entries(prof).forEach(([k, v]) => fd.append(k, v));
      const res = await upsertAboutProfile(fd);
      res.error ? show(res.error, 'error') : show('Profil berhasil disimpan!');
    });
  }

  /* ── Visi Misi state ─────────────────────────────────── */
  const [vm, setVm] = useState({
    visi: visiMisi?.visi || '',
    misi: (visiMisi?.misi || []).join('\n'),
  });
  const [vmPending, startVmTransition] = useTransition();

  async function saveVisiMisi(e) {
    e.preventDefault();
    startVmTransition(async () => {
      const fd = new FormData();
      fd.append('visi', vm.visi);
      fd.append('misi', vm.misi);
      const res = await upsertAboutVisiMisi(fd);
      res.error ? show(res.error, 'error') : show('Visi & Misi berhasil disimpan!');
    });
  }

  /* ── Inline list actions ─────────────────────────────── */
  function listAction(saveFn, deleteFn) {
    return {
      onSave: async (id, payload) => {
        const res = await saveFn(id, payload);
        res.error ? show(res.error, 'error') : show('Tersimpan!');
      },
      onDelete: async (id) => {
        if (!confirm('Hapus item ini?')) return;
        const res = await deleteFn(id);
        res.error ? show(res.error, 'error') : show('Dihapus!');
      },
    };
  }

  const statActions      = listAction(upsertAboutStat,      deleteAboutStat);
  const valueActions     = listAction(upsertAboutValue,     deleteAboutValue);
  const milestoneActions = listAction(upsertAboutMilestone, deleteAboutMilestone);
  const contactActions   = listAction(upsertAboutContact,   deleteAboutContact);

  return (
    <div className="ab-editor">

      {/* ── 1. Header & Profil ─────────────────────────── */}
      <Section icon={FileText} title="Profil & Header Halaman">
        <form onSubmit={saveProfile} className="ab-form">
          <div className="ab-grid-2">
            <div className="ab-form-group">
              <label className="ab-label">Judul Header</label>
              <input className="ab-input" value={prof.header_title}
                onChange={(e) => setProf(p => ({ ...p, header_title: e.target.value }))}
                placeholder="Tentang Kami" />
            </div>
            <div className="ab-form-group">
              <label className="ab-label">Subjudul Header</label>
              <input className="ab-input" value={prof.header_subtitle}
                onChange={(e) => setProf(p => ({ ...p, header_subtitle: e.target.value }))}
                placeholder="Melayani masyarakat Nganjuk..." />
            </div>
          </div>

          <div className="ab-form-group">
            <label className="ab-label">Paragraf Profil 1</label>
            <textarea className="ab-textarea" rows={3} value={prof.paragraph_1}
              onChange={(e) => setProf(p => ({ ...p, paragraph_1: e.target.value }))} />
          </div>

          <div className="ab-form-group">
            <label className="ab-label">Paragraf Profil 2</label>
            <textarea className="ab-textarea" rows={3} value={prof.paragraph_2}
              onChange={(e) => setProf(p => ({ ...p, paragraph_2: e.target.value }))} />
          </div>

          <div className="ab-fieldset-sub">
            <p className="ab-label-group">Badge Akreditasi</p>
            <div className="ab-grid-3">
              <div className="ab-form-group">
                <label className="ab-label">Judul Badge</label>
                <input className="ab-input" value={prof.accreditation_title}
                  onChange={(e) => setProf(p => ({ ...p, accreditation_title: e.target.value }))} />
              </div>
              <div className="ab-form-group">
                <label className="ab-label">Lembaga</label>
                <input className="ab-input" value={prof.accreditation_body}
                  onChange={(e) => setProf(p => ({ ...p, accreditation_body: e.target.value }))} />
              </div>
              <div className="ab-form-group">
                <label className="ab-label">Masa Berlaku</label>
                <input className="ab-input" value={prof.accreditation_valid}
                  onChange={(e) => setProf(p => ({ ...p, accreditation_valid: e.target.value }))} />
              </div>
            </div>

            {/* ── Certificate Upload ────────────────── */}
            {/* ── Certificate Preview & Upload Area (Match LayananForm Style) ── */}
            <div className="ab-cert-section">
              <p className="ab-label" style={{ marginBottom: 10 }}>
                Sertifikat Akreditasi
                <span className="ab-label-note"> — PDF / JPG / PNG (maks. 10 MB)</span>
              </p>

              <div className={`ab-upload-container ${(certUrl || localFile || localPreview) ? 'ab-has-file' : ''} ${isDragging ? 'ab-dragging' : ''} ${certPending ? 'ab-loading' : ''}`}>
                {/* 1. Preview State */}
                {(certUrl || localFile || localPreview) ? (
                  <div className="ab-upload-preview">
                    {effectivePreview ? (
                      /* Gambar: tampilkan thumbnail (local blob atau server URL) */
                      <div className="ab-preview-img-box">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={effectivePreview} alt="Sertifikat Akreditasi" />
                        {certUrl && !localPreview && (
                          <a href={getImageUrl(certUrl)} target="_blank" rel="noopener noreferrer" className="ab-preview-overlay">
                            <ExternalLink size={16} /> Lihat Ukuran Penuh
                          </a>
                        )}
                        {localPreview && (
                          <div className="ab-preview-badge">
                            {certPending ? 'Sedang mengunggah...' : 'Berhasil diunggah ✓'}
                          </div>
                        )}
                      </div>
                    ) : localFile ? (
                      /* PDF sedang diupload */
                      <div className="ab-preview-file-box">
                        <div className="ab-file-icon-wrap"><FileText size={32} /></div>
                        <div className="ab-preview-file-info">
                          <p className="ab-filename">{localFile.name}</p>
                          <p className="ab-status">{certPending ? 'Sedang mengunggah...' : 'Selesai'}</p>
                        </div>
                      </div>
                    ) : (
                      /* PDF sudah tersimpan di server */
                      <div className="ab-preview-file-box">
                        <div className="ab-file-icon-wrap"><FileCheck size={28} /></div>
                        <div className="ab-preview-file-info">
                          <p className="ab-filename">{getFileName(certUrl)}</p>
                          <a href={getImageUrl(certUrl)} target="_blank" rel="noopener noreferrer" className="ab-file-link">
                            Buka / Preview File <ExternalLink size={11} />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Actions on Card */}
                    {!certPending && (
                      <div className="ab-upload-actions">
                        <button type="button" className="ab-action-btn" onClick={() => { setLocalPreview(null); certInputRef.current?.click(); }} title="Ganti File">
                          <Upload size={14} /> Ganti
                        </button>
                        <button type="button" className="ab-action-btn ab-action-danger" onClick={handleRemoveCert} title="Hapus">
                          <Trash2 size={14} /> Hapus
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* 2. Empty / Dropzone State */
                  <label
                    className="ab-upload-dropzone"
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="ab-dz-icon">
                      <Upload size={24} className={isDragging ? 'animate-bounce' : ''} />
                    </div>
                    <div className="ab-dz-text">
                      <p className="ab-dz-title">Tarik file ke sini atau <span className="ab-dz-browse">pilih file</span></p>
                      <p className="ab-dz-sub">PDF, PNG, atau JPG (Maks. 10MB)</p>
                    </div>
                    <input
                      ref={certInputRef}
                      type="file"
                      style={{ display: 'none' }}
                      accept="application/pdf,image/png,image/jpeg,image/webp"
                      onChange={handleCertFile}
                    />
                  </label>
                )}

                {/* Loading Overlay */}
                {certPending && (
                  <div className="ab-upload-loader">
                    <Loader2 size={24} className="animate-spin" />
                    <p>Memproses file...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="ab-form-footer">
            <button className="ab-btn-primary-full" disabled={profPending}>
              {profPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              Simpan Profil
            </button>
          </div>
        </form>
      </Section>

      {/* ── 2. Statistik ───────────────────────────────── */}
      <Section icon={BarChart2} title="Statistik (Stats Bar)">
        <p className="ab-hint">Ditampilkan sebagai 4 angka di bawah header. Icon: award, bed, users, grid.</p>
        <div className="ab-list">
          {stats.map((s) => (
            <ItemRow
              key={s.id} item={s}
              fields={[
                { key: 'value',     label: 'Angka',    placeholder: '40+' },
                { key: 'label',     label: 'Keterangan', placeholder: 'Tahun Melayani' },
                { key: 'icon_name', label: 'Ikon',     placeholder: 'award | bed | users | grid' },
                { key: 'sort_order',label: 'Urutan',   placeholder: '1' },
              ]}
              {...statActions}
            />
          ))}
          <AddRow
            fields={[
              { key: 'value',     label: 'Angka',    placeholder: '40+' },
              { key: 'label',     label: 'Keterangan', placeholder: 'Tahun Melayani' },
              { key: 'icon_name', label: 'Ikon',     placeholder: 'award' },
              { key: 'sort_order',label: 'Urutan',   placeholder: '5' },
            ]}
            defaults={{ value: '', label: '', icon_name: 'award', sort_order: stats.length + 1 }}
            onAdd={statActions.onSave}
            placeholder="Tambah Statistik"
          />
        </div>
      </Section>

      {/* ── 3. Visi & Misi ─────────────────────────────── */}
      <Section icon={Target} title="Visi & Misi">
        <form onSubmit={saveVisiMisi} className="ab-form">
          <div className="ab-form-group">
            <label className="ab-label">Visi</label>
            <textarea className="ab-textarea" rows={3} value={vm.visi}
              onChange={(e) => setVm(p => ({ ...p, visi: e.target.value }))}
              placeholder="Menjadi rumah sakit..." />
          </div>
          <div className="ab-form-group">
            <label className="ab-label">Misi <span className="ab-label-note">(satu poin per baris)</span></label>
            <textarea className="ab-textarea" rows={6} value={vm.misi}
              onChange={(e) => setVm(p => ({ ...p, misi: e.target.value }))}
              placeholder={"Memberikan pelayanan medis bermutu tinggi\nMengembangkan SDM profesional\n..."} />
          </div>
          <div className="ab-form-footer">
            <button className="ab-btn-primary-full" disabled={vmPending}>
              {vmPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              Simpan Visi & Misi
            </button>
          </div>
        </form>
      </Section>

      {/* ── 4. Nilai-Nilai ─────────────────────────────── */}
      <Section icon={Award} title="Nilai-Nilai Kami">
        <div className="ab-list">
          {values.map((v) => (
            <ItemRow
              key={v.id} item={v}
              fields={[
                { key: 'title',       label: 'Judul',      placeholder: 'Profesional' },
                { key: 'description', label: 'Deskripsi',  placeholder: 'Tenaga medis bersertifikat...' },
                { key: 'sort_order',  label: 'Urutan',     placeholder: '1' },
              ]}
              {...valueActions}
            />
          ))}
          <AddRow
            fields={[
              { key: 'title',       label: 'Judul',     placeholder: 'Profesional' },
              { key: 'description', label: 'Deskripsi', placeholder: 'Tenaga medis...' },
              { key: 'sort_order',  label: 'Urutan',    placeholder: String(values.length + 1) },
            ]}
            defaults={{ title: '', description: '', sort_order: values.length + 1, is_active: true }}
            onAdd={valueActions.onSave}
            placeholder="Tambah Nilai"
          />
        </div>
      </Section>

      {/* ── 5. Timeline / Milestones ───────────────────── */}
      <Section icon={Clock} title="Perjalanan Kami (Timeline)">
        <div className="ab-list">
          {milestones.map((m) => (
            <ItemRow
              key={m.id} item={m}
              fields={[
                { key: 'year',       label: 'Tahun',       placeholder: '1985' },
                { key: 'event',      label: 'Keterangan',  placeholder: 'Rumah sakit didirikan...' },
                { key: 'sort_order', label: 'Urutan',      placeholder: '1' },
              ]}
              {...milestoneActions}
            />
          ))}
          <AddRow
            fields={[
              { key: 'year',       label: 'Tahun',      placeholder: '2026' },
              { key: 'event',      label: 'Keterangan', placeholder: 'Pencapaian baru...' },
              { key: 'sort_order', label: 'Urutan',     placeholder: String(milestones.length + 1) },
            ]}
            defaults={{ year: '', event: '', sort_order: milestones.length + 1, is_active: true }}
            onAdd={milestoneActions.onSave}
            placeholder="Tambah Tonggak Sejarah"
          />
        </div>
      </Section>

      {/* ── 6. Kontak ──────────────────────────────────── */}
      <Section icon={Phone} title="Informasi Kontak">
        <div className="ab-list">
          {contact.map((c) => (
            <ItemRow
              key={c.id} item={c}
              fields={[
                { key: 'icon',       label: 'Emoji',   placeholder: '📍' },
                { key: 'text',       label: 'Teks',    placeholder: 'Nganjuk, Jawa Timur 64418' },
                { key: 'sort_order', label: 'Urutan',  placeholder: '1' },
              ]}
              {...contactActions}
            />
          ))}
          <AddRow
            fields={[
              { key: 'icon',       label: 'Emoji',  placeholder: '📞' },
              { key: 'text',       label: 'Teks',   placeholder: '(0358) XXXXXX' },
              { key: 'sort_order', label: 'Urutan', placeholder: String(contact.length + 1) },
            ]}
            defaults={{ icon: '📍', text: '', sort_order: contact.length + 1 }}
            onAdd={contactActions.onSave}
            placeholder="Tambah Info Kontak"
          />
        </div>
      </Section>

      {/* Toast */}
      {toast && (
        <div className="ab-toast-wrap">
          <div className={`ab-toast ab-toast-${toast.type}`}>
            {toast.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
            {toast.msg}
          </div>
        </div>
      )}

      <style>{`
        .ab-editor { display: flex; flex-direction: column; gap: 20px; }

        /* ── Section ────────────────────────────────── */
        .ab-section {
          background: var(--admin-surface); border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-lg); overflow: hidden; box-shadow: var(--admin-shadow-xs);
        }
        .ab-section-hd {
          display: flex; align-items: center; gap: 10px;
          padding: 13px 18px; background: var(--admin-surface-2);
          border-bottom: 1px solid var(--admin-border-soft);
        }
        .ab-section-icon {
          width: 26px; height: 26px; border-radius: 7px;
          background: var(--admin-primary-l); color: var(--admin-primary);
          display: flex; align-items: center; justify-content: center;
        }
        .ab-section-title { font-size: 0.875rem; font-weight: 700; color: var(--admin-text-h); font-family: var(--font-figtree); }
        .ab-section-body { padding: 18px; }
        .ab-hint { font-size: 0.75rem; color: var(--admin-text-s); margin-bottom: 12px; }

        /* ── Form ───────────────────────────────────── */
        .ab-form { display: flex; flex-direction: column; gap: 14px; }
        .ab-form-group { display: flex; flex-direction: column; gap: 4px; }
        .ab-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .ab-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        @media (max-width: 768px) { .ab-grid-2, .ab-grid-3 { grid-template-columns: 1fr; } }

        .ab-label { font-size: 0.8rem; font-weight: 600; color: var(--admin-text-b); }
        .ab-label-note { font-size: 0.7rem; font-weight: 400; color: var(--admin-text-s); }
        .ab-label-group { font-size: 0.75rem; font-weight: 700; color: var(--admin-text-s); text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em; }

        .ab-input, .ab-textarea {
          width: 100%; height: 38px; padding: 0 10px;
          border: 1px solid var(--admin-border); border-radius: 7px; font-size: 0.875rem;
          transition: 150ms; background: var(--admin-surface);
        }
        .ab-textarea { height: auto; padding: 8px 10px; resize: vertical; }
        .ab-input:focus, .ab-textarea:focus {
          outline: none; border-color: var(--admin-primary);
          box-shadow: 0 0 0 3px rgba(24,95,165,0.09);
        }

        .ab-fieldset-sub {
          padding: 12px; background: var(--admin-surface-2);
          border: 1px solid var(--admin-border-soft); border-radius: 8px;
        }

        .ab-form-footer { padding-top: 4px; text-align: right; }
        .ab-btn-primary-full {
          display: inline-flex; align-items: center; gap: 7px; padding: 9px 20px;
          background: var(--admin-primary); color: #fff; border: none; border-radius: 8px;
          font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: 150ms;
        }
        .ab-btn-primary-full:hover { background: var(--admin-primary-h); }
        .ab-btn-primary-full:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── List items ─────────────────────────────── */
        .ab-list { display: flex; flex-direction: column; gap: 6px; }

        .ab-item-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 12px; border: 1px solid var(--admin-border-soft);
          border-radius: 8px; transition: 120ms;
        }
        .ab-item-row:hover { background: var(--admin-surface-2); }
        .ab-item-preview { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; flex: 1; min-width: 0; }
        .ab-item-preview-text { font-size: 0.8125rem; color: var(--admin-text-b); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .ab-item-actions { display: flex; gap: 4px; flex-shrink: 0; }
        .ab-btn-icon {
          width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--admin-border-soft);
          display: flex; align-items: center; justify-content: center; cursor: pointer;
          color: var(--admin-text-m); background: transparent; transition: 120ms;
        }
        .ab-btn-icon:hover { background: var(--admin-primary-l); color: var(--admin-primary); border-color: var(--admin-primary); }
        .ab-btn-icon-danger:hover { background: #FEE2E2; color: var(--admin-danger); border-color: var(--admin-danger); }

        .ab-item-edit {
          padding: 12px; border: 1px solid var(--admin-primary);
          border-radius: 8px; display: flex; flex-direction: column; gap: 8px;
          background: var(--admin-primary-l);
        }
        .ab-item-edit-new { border-color: var(--admin-border-soft); background: var(--admin-surface-2); }
        .ab-mini-group { display: flex; flex-direction: column; gap: 3px; }
        .ab-label-sm { font-size: 0.71875rem; font-weight: 600; color: var(--admin-text-m); }
        .ab-input-sm {
          height: 32px; padding: 0 9px; border: 1px solid var(--admin-border);
          border-radius: 6px; font-size: 0.8125rem; background: #fff;
        }
        .ab-input-sm:focus { outline: none; border-color: var(--admin-primary); }

        .ab-item-edit-actions { display: flex; gap: 6px; padding-top: 4px; }
        .ab-btn-sm {
          display: inline-flex; align-items: center; gap: 5px; height: 30px; padding: 0 12px;
          border: 1px solid var(--admin-border); border-radius: 6px; font-size: 0.75rem;
          font-weight: 600; color: var(--admin-text-m); background: #fff; cursor: pointer; transition: 120ms;
        }
        .ab-btn-sm:hover { background: var(--admin-surface-2); }
        .ab-btn-primary { background: var(--admin-primary); color: #fff; border-color: var(--admin-primary); }
        .ab-btn-primary:hover { background: var(--admin-primary-h); }
        .ab-btn-sm:disabled { opacity: 0.6; cursor: not-allowed; }

        .ab-add-row-btn {
          display: flex; align-items: center; gap: 6px; padding: 9px 12px;
          border: 1.5px dashed var(--admin-border); border-radius: 8px;
          font-size: 0.8125rem; font-weight: 600; color: var(--admin-text-s);
          background: transparent; cursor: pointer; transition: 150ms; width: 100%;
        }
        .ab-add-row-btn:hover { border-color: var(--admin-primary); color: var(--admin-primary); background: var(--admin-primary-l); }

        /* ── Certificate ─────────────────────────────── */
        .ab-cert-section { margin-top: 14px; padding-top: 14px; border-top: 1px dashed var(--admin-border); }

        .ab-cert-preview {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 14px; border: 1px solid var(--admin-success);
          border-radius: 8px; background: var(--admin-success-l); flex-wrap: wrap; gap: 8px;
        }
        .ab-cert-preview-left { display: flex; align-items: center; gap: 10px; }
        .ab-cert-icon {
          width: 36px; height: 36px; border-radius: 8px;
          background: var(--admin-success); color: #fff;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .ab-cert-name { font-size: 0.8125rem; font-weight: 700; color: #116045; margin-bottom: 2px; }
        /* ── New Robust Upload Container (Match LayananForm) ── */
        .ab-cert-section { margin-top: 16px; padding-top: 16px; border-top: 1px dashed var(--admin-border); }
        
        .ab-upload-container {
          position: relative; width: 100%; min-height: 140px;
          border: 2px dashed var(--admin-border); border-radius: 12px;
          background: var(--admin-surface-2); transition: 200ms;
          display: flex; flex-direction: column; overflow: hidden;
        }
        .ab-upload-container.ab-has-file { border-style: solid; border-color: var(--admin-border-soft); background: #fff; }
        .ab-upload-container.ab-dragging { border-color: var(--admin-primary); background: var(--admin-primary-l); transform: scale(1.01); }
        .ab-upload-container.ab-loading { opacity: 0.8; pointer-events: none; }

        .ab-upload-dropzone {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 30px 20px; cursor: pointer; height: 100%; gap: 10px;
        }
        .ab-dz-icon { color: var(--admin-text-s); transition: 150ms; }
        .ab-upload-dropzone:hover .ab-dz-icon { color: var(--admin-primary); transform: translateY(-2px); }
        .ab-dz-title { font-size: 0.875rem; font-weight: 600; color: var(--admin-text-b); text-align: center; }
        .ab-dz-browse { color: var(--admin-primary); text-decoration: underline; }
        .ab-dz-sub { font-size: 0.75rem; color: var(--admin-text-s); margin-top: 2px; }

        .ab-upload-preview { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; }
        
        .ab-preview-img-box {
          position: relative; width: 100%; height: 160px; background: #f8fafc;
          display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        .ab-preview-img-box img { width: 100%; height: 100%; object-fit: contain; }
        .ab-preview-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.4);
          display: flex; align-items: center; justify-content: center;
          color: #fff; text-decoration: none; font-size: 0.75rem; font-weight: 600; gap: 6px;
          opacity: 0; transition: 200ms;
        }
        .ab-preview-img-box:hover .ab-preview-overlay { opacity: 1; }
        
        .ab-preview-badge {
          position: absolute; top: 8px; left: 8px; padding: 4px 8px;
          background: rgba(0,0,0,0.6); color: #fff; font-size: 0.65rem; border-radius: 4px; font-weight: 600;
        }

        .ab-preview-file-box {
          padding: 24px; display: flex; align-items: center; gap: 16px;
          background: var(--admin-primary-l); flex: 1;
        }
        .ab-file-icon-wrap {
          width: 48px; height: 48px; background: #fff; color: var(--admin-primary);
          display: flex; align-items: center; justify-content: center; border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .ab-preview-file-info { flex: 1; min-width: 0; }
        .ab-filename { font-size: 0.875rem; font-weight: 700; color: var(--admin-text-h); margin-bottom: 2px; word-break: break-all; }
        .ab-status { font-size: 0.75rem; color: var(--admin-primary); font-weight: 500; }
        .ab-file-link { font-size: 0.75rem; color: var(--admin-primary); text-decoration: underline; display: inline-flex; align-items: center; gap: 4px; }

        .ab-upload-actions {
          padding: 10px 16px; background: #fff; border-top: 1px solid var(--admin-border-soft);
          display: flex; gap: 8px; justify-content: flex-end;
        }
        .ab-action-btn {
          height: 28px; padding: 0 10px; font-size: 0.75rem; font-weight: 600;
          border: 1px solid var(--admin-border); border-radius: 6px;
          background: #fff; color: var(--admin-text-m); cursor: pointer;
          display: flex; align-items: center; gap: 5px; transition: 120ms;
        }
        .ab-action-btn:hover { background: var(--admin-surface-2); border-color: var(--admin-text-s); }
        .ab-action-danger { color: var(--admin-danger); }
        .ab-action-danger:hover { background: #fee2e2; border-color: var(--admin-danger); }

        .ab-upload-loader {
          position: absolute; inset: 0; background: rgba(255,255,255,0.8);
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
          font-size: 0.75rem; color: var(--admin-primary); font-weight: 600;
        }

        /* ── Toast ──────────────────────────────────── */
        .ab-toast-wrap { position: fixed; bottom: 24px; right: 24px; z-index: 1000; }
        .ab-toast {
          display: flex; align-items: center; gap: 8px; padding: 11px 18px;
          border-radius: 10px; color: #fff; font-size: 0.875rem; font-weight: 600;
          box-shadow: var(--admin-shadow-lg); animation: abIn 280ms ease;
        }
        .ab-toast-success { background: var(--admin-success); }
        .ab-toast-error { background: var(--admin-danger); }
        @keyframes abIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: none; } }
      `}</style>
    </div>
  );
}
