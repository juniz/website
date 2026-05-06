'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createJadwal, updateJadwal } from '@/app/actions/admin/jadwal';
import { Plus, X } from 'lucide-react';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function JadwalForm({ mode = 'create', schedule = null, doctors = [] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    doctor_id: schedule?.doctorId || '',
    date: schedule?.date || '',
    dates: [], // Array for bulk insertion
    time: schedule?.time || '',
    total_quota: schedule?.totalQuota ?? 20,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (name === 'date' && mode === 'create') {
      if (errors.dates) setErrors((prev) => ({ ...prev, dates: '' }));
    }
  }

  function handleAddDate() {
    if (!form.date) return;
    if (!form.dates.includes(form.date)) {
      setForm((prev) => ({ ...prev, dates: [...prev.dates, prev.date].sort(), date: '' }));
      if (errors.dates) setErrors((prev) => ({ ...prev, dates: '' }));
    } else {
      setForm((prev) => ({ ...prev, date: '' })); // clear if already exists
    }
  }

  function handleRemoveDate(d) {
    setForm((prev) => ({ ...prev, dates: prev.dates.filter(x => x !== d) }));
  }

  function validate() {
    const errs = {};
    if (!form.doctor_id) errs.doctor_id = 'Pilih dokter.';
    if (mode === 'create') {
      if (form.dates.length === 0 && !form.date) errs.dates = 'Tambahkan setidaknya satu hari.';
    } else {
      if (!form.date) errs.date = 'Hari wajib diisi.';
    }
    if (!form.time.trim()) errs.time = 'Waktu wajib diisi.';
    if (!form.total_quota || form.total_quota < 1) errs.total_quota = 'Kuota minimal 1.';
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

    startTransition(async () => {
      // If there's an un-added date in create mode, append it
      let finalForm = { ...form };
      if (mode === 'create' && form.date && !form.dates.includes(form.date)) {
        finalForm.dates = [...form.dates, form.date];
      }

      const result = mode === 'create'
        ? await createJadwal(finalForm)
        : await updateJadwal(schedule.id, finalForm);

      if (result?.error) {
        showToast(result.error, 'danger');
      } else {
        showToast(mode === 'create' ? 'Jadwal berhasil dibuat.' : 'Jadwal berhasil diperbarui.', 'success');
        setTimeout(() => router.push('/admin/jadwal'), 1000);
      }
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        aria-label="Form jadwal praktek">
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Detail Jadwal</span>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-grid cols-2">
              {/* Doctor */}
              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-label" htmlFor="doctor_id">
                  Dokter <span className="required" aria-hidden="true">*</span>
                </label>
                <select
                  id="doctor_id"
                  name="doctor_id"
                  className="admin-select"
                  value={form.doctor_id}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.doctor_id}
                >
                  <option value="">— Pilih Dokter —</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialization}
                    </option>
                  ))}
                </select>
                {errors.doctor_id && <span className="admin-error-msg" role="alert">{errors.doctor_id}</span>}
              </div>

              {/* Day (was Date) */}
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="date">
                  Hari {mode === 'create' ? '(Bisa lebih dari satu)' : ''} <span className="required" aria-hidden="true">*</span>
                </label>
                
                {mode === 'create' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        id="date"
                        name="date"
                        className="admin-select"
                        value={form.date}
                        onChange={handleChange}
                        aria-invalid={!!errors.dates}
                        style={{ flex: 1 }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddDate();
                          }
                        }}
                      >
                        <option value="">— Pilih Hari —</option>
                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <button 
                        type="button" 
                        onClick={handleAddDate} 
                        className="admin-btn admin-btn-primary"
                        style={{ padding: '0 16px' }}
                        disabled={!form.date}
                      >
                        <Plus size={18} /> Tambah
                      </button>
                    </div>

                    {form.dates.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                        {form.dates.map((d) => (
                          <div key={d} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--admin-primary-l)', color: 'var(--admin-primary)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.8125rem', fontWeight: 600, border: '1px solid var(--admin-primary)' }}>
                            {d}
                            <button 
                              type="button" 
                              onClick={() => handleRemoveDate(d)}
                              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.dates && <span className="admin-error-msg" role="alert">{errors.dates}</span>}
                  </div>
                ) : (
                  <>
                    <select
                      id="date"
                      name="date"
                      className="admin-select"
                      value={form.date}
                      onChange={handleChange}
                      required
                      aria-required="true"
                      aria-invalid={!!errors.date}
                    >
                      <option value="">— Pilih Hari —</option>
                      {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {errors.date && <span className="admin-error-msg" role="alert">{errors.date}</span>}
                  </>
                )}
              </div>

              {/* Time */}
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="time">
                  Waktu <span className="required" aria-hidden="true">*</span>
                </label>
                <input
                  id="time"
                  name="time"
                  type="text"
                  className="admin-input"
                  value={form.time}
                  onChange={handleChange}
                  placeholder="Contoh: 08:00 - 12:00"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.time}
                />
                {errors.time && <span className="admin-error-msg" role="alert">{errors.time}</span>}
                <span className="admin-helper">Format bebas, mis: 08.00–12.00 atau Pagi</span>
              </div>

              {/* Total Quota */}
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="total_quota">
                  Total Kuota <span className="required" aria-hidden="true">*</span>
                </label>
                <input
                  id="total_quota"
                  name="total_quota"
                  type="number"
                  min="1"
                  max="200"
                  className="admin-input"
                  value={form.total_quota}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.total_quota}
                />
                {errors.total_quota && <span className="admin-error-msg" role="alert">{errors.total_quota}</span>}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <Link href="/admin/jadwal" className="admin-btn admin-btn-ghost">Batal</Link>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={isPending} aria-busy={isPending}>
            {isPending ? (mode === 'create' ? 'Menyimpan...' : 'Memperbarui...') : (mode === 'create' ? 'Simpan Jadwal' : 'Perbarui Jadwal')}
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
