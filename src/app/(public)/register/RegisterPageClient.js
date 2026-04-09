'use client';

import { useState } from 'react';
import Link from 'next/link';
import { submitRegistration } from '@/app/actions/register';

/** Form field wrapper — declared outside render to avoid the
 *  "Cannot create components during render" lint error. */
function Field({ label, id, error, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <label htmlFor={id} style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-neutral-900)' }}>
        {label}{required && <span style={{ color: 'var(--color-danger)', marginLeft: '2px' }}>*</span>}
      </label>
      {children}
      {error && <span role="alert" style={{ fontSize: '0.75rem', color: 'var(--color-danger)' }}>{error}</span>}
    </div>
  );
}

const STEPS = [
  { id: 1, label: 'Pilih Jadwal' },
  { id: 2, label: 'Data Pasien' },
  { id: 3, label: 'Konfirmasi' },
];

const insuranceOptions = [
  { value: 'bpjs',   label: 'BPJS Kesehatan' },
  { value: 'umum',   label: 'Umum / Bayar Mandiri' },
  { value: 'swasta', label: 'Asuransi Swasta' },
];

function StepIndicator({ currentStep }) {
  return (
    <ol aria-label="Langkah pendaftaran" style={{ display: 'flex', alignItems: 'center', gap: 0, listStyle: 'none', marginBottom: '2rem' }}>
      {STEPS.map((step, idx) => {
        const done   = currentStep > step.id;
        const active = currentStep === step.id;
        return (
          <li key={step.id} style={{ display: 'flex', alignItems: 'center', flex: idx < STEPS.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
              <div aria-current={active ? 'step' : undefined}
                style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.8125rem', background: done ? 'var(--color-accent-teal)' : active ? 'var(--color-primary-400)' : 'var(--color-neutral-200)', color: (!done && !active) ? 'var(--color-neutral-600)' : '#fff', transition: 'background 250ms' }}>
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                ) : step.id}
              </div>
              <span style={{ fontSize: '0.6875rem', fontWeight: active ? 600 : 400, color: active ? 'var(--color-primary-800)' : 'var(--color-neutral-600)', whiteSpace: 'nowrap' }}>{step.label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div style={{ flex: 1, height: '2px', background: done ? 'var(--color-accent-teal)' : 'var(--color-neutral-200)', marginInline: '0.5rem', marginBottom: '1.25rem', transition: 'background 250ms' }} aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function RegisterPageClient({ initialDoctors = [], initialSchedules = [] }) {
  const [step, setStep]             = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);

  const [form, setForm] = useState({
    doctorId: '', scheduleId: '', insurance: 'umum',
    name: '', dob: '', phone: '', complaint: '', bpjsNumber: '', agreeTerms: false,
  });
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const selectedDoctor   = initialDoctors.find((d) => d.id === form.doctorId);
  const selectedSchedule = initialSchedules.find((s) => s.id === form.scheduleId);

  const validateStep1 = () => {
    const e = {};
    if (!form.doctorId)   e.doctorId   = 'Pilih dokter terlebih dahulu';
    if (!form.scheduleId) e.scheduleId = 'Pilih jadwal terlebih dahulu';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Nama lengkap wajib diisi';
    if (!form.dob)          e.dob   = 'Tanggal lahir wajib diisi';
    if (!form.phone.trim()) e.phone = 'Nomor WhatsApp wajib diisi';
    else if (!/^(\+62|62|0)[0-9]{8,12}$/.test(form.phone.replace(/\s/g, '')))
                            e.phone = 'Format nomor tidak valid (contoh: 0812xxxxxxxx)';
    if (form.insurance === 'bpjs' && !form.bpjsNumber.trim())
                            e.bpjsNumber = 'Nomor BPJS wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.agreeTerms) {
      setErrors({ agreeTerms: 'Anda harus menyetujui syarat & ketentuan' });
      return;
    }
    setSubmitting(true);
    
    // Convert current form to FormData
    const formData = new FormData();
    formData.append('patientName', form.name);
    formData.append('dob', form.dob);
    formData.append('phone', form.phone);
    formData.append('doctor', form.doctorId);
    formData.append('schedule', form.scheduleId);
    formData.append('insurance', form.insurance);
    formData.append('bpjsNumber', form.bpjsNumber);
    formData.append('complaint', form.complaint);
    
    // Call server action
    const res = await submitRegistration(null, formData);
    
    setSubmitting(false);
    if (res.success) {
      setSuccess(res.ticket);
    } else {
      setErrors({ agreeTerms: res.message || 'Pendaftaran Gagal' });
    }
  };

  const inputStyle = (hasError) => ({
    padding: '0.625rem 0.875rem', borderRadius: '8px',
    border: `1.5px solid ${hasError ? 'var(--color-danger)' : 'var(--color-neutral-200)'}`,
    fontSize: '0.875rem', color: 'var(--color-neutral-900)',
    background: '#fff', outline: 'none', width: '100%',
    transition: 'border-color 150ms', fontFamily: 'inherit',
  });


  /* ── Success screen ── */
  if (success) {
    return (
      <section className="section-py" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', background: 'var(--color-neutral-50)' }}>
        <div className="container-site" style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
          <div aria-hidden="true" style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--color-accent-teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-teal)" strokeWidth="2" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-neutral-900)', fontFamily: 'var(--font-figtree, Figtree, sans-serif)', marginBottom: '0.75rem' }}>
            Pendaftaran Berhasil!
          </h1>
          <p style={{ color: 'var(--color-neutral-600)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
            Konfirmasi jadwal dan tiket antrean <strong>{success}</strong> telah dikirim ke nomor WhatsApp <strong>{form.phone}</strong>. Harap tunjukkan konfirmasi saat registrasi di loket.
          </p>
          <div style={{ background: '#fff', border: '1px solid var(--color-neutral-200)', borderRadius: '10px', padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-neutral-900)', marginBottom: '0.625rem' }}>Ringkasan Pendaftaran</p>
            {[
              ['Dokter',   selectedDoctor?.name ?? '-'],
              ['Jadwal',   selectedSchedule?.time ?? '-'],
              ['Pasien',   form.name],
              ['Asuransi', insuranceOptions.find(o => o.value === form.insurance)?.label ?? '-'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBlock: '0.375rem', borderBottom: '0.5px solid var(--color-neutral-200)', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--color-neutral-600)' }}>{k}</span>
                <span style={{ fontWeight: 500, color: 'var(--color-neutral-900)' }}>{v}</span>
              </div>
            ))}
          </div>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'var(--color-primary-400)', color: '#fff', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
            Kembali ke Beranda
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Header */}
      <section style={{ background: 'var(--color-primary-800)', paddingBlock: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container-site">
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1rem' }}>
            <ol style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', listStyle: 'none', fontSize: '0.75rem', color: 'var(--color-primary-200)' }}>
              <li><Link href="/" style={{ color: 'var(--color-primary-200)', textDecoration: 'none' }}>Beranda</Link></li>
              <li aria-hidden="true"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></li>
              <li aria-current="page" style={{ color: 'var(--color-primary-50)' }}>Daftar Online</li>
            </ol>
          </nav>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--color-primary-50)', fontFamily: 'var(--font-figtree, Figtree, sans-serif)', marginBottom: '0.375rem' }}>
            Pendaftaran Online
          </h1>
          <p style={{ color: 'var(--color-primary-200)', fontSize: '0.9375rem' }}>
            Daftar berobat tanpa antri panjang — konfirmasi via WhatsApp
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="section-py" style={{ background: 'var(--color-neutral-50)' }}>
        <div className="container-site" style={{ maxWidth: '680px', margin: '0 auto' }}>
          <StepIndicator currentStep={step} />

          <div style={{ background: '#fff', border: '1px solid var(--color-neutral-200)', borderRadius: '16px', padding: '2rem' }}>

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <Field label="Pilih Dokter" id="doctorId" error={errors.doctorId} required>
                  <select id="doctorId" value={form.doctorId} onChange={(e) => { set('doctorId', e.target.value); set('scheduleId', ''); }}
                    style={inputStyle(errors.doctorId)} aria-required="true" aria-invalid={!!errors.doctorId}>
                    <option value="">— Pilih dokter spesialis —</option>
                    {initialDoctors.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} · {d.specialization}</option>
                    ))}
                  </select>
                </Field>

                {form.doctorId && (
                  <Field label="Pilih Jadwal" id="scheduleId" error={errors.scheduleId} required>
                    {initialSchedules.filter(s => s.doctorId === form.doctorId).length === 0 ? (
                      <p style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-600)', padding: '0.75rem', background: 'var(--color-neutral-50)', borderRadius: '8px', border: '1px dashed var(--color-neutral-200)' }}>
                        Tidak ada jadwal hari ini untuk dokter ini. Hubungi kami atau pilih dokter lain.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {initialSchedules.filter(s => s.doctorId === form.doctorId).map((s) => {
                          const isFull    = s.filledQuota >= s.totalQuota;
                          const isSelected = form.scheduleId === s.id;
                          return (
                            <button key={s.id} type="button" disabled={isFull} onClick={() => set('scheduleId', s.id)} aria-pressed={isSelected}
                              style={{ padding: '0.875rem 1rem', borderRadius: '8px', border: isSelected ? '2px solid var(--color-primary-400)' : '1.5px solid var(--color-neutral-200)', background: isSelected ? 'var(--color-primary-50)' : isFull ? 'var(--color-neutral-50)' : '#fff', cursor: isFull ? 'not-allowed' : 'pointer', opacity: isFull ? 0.55 : 1, textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 150ms', fontFamily: 'inherit' }}>
                              <span>
                                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-neutral-900)', fontVariantNumeric: 'tabular-nums' }}>{s.time}</span>
                                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-neutral-600)', marginTop: '0.125rem' }}>{s.filledQuota}/{s.totalQuota} kuota terisi</span>
                              </span>
                              {isFull ? (
                                <span style={{ fontSize: '0.6875rem', background: '#FCEBEB', color: '#791F1F', padding: '0.2rem 0.625rem', borderRadius: '999px', fontWeight: 500 }}>Penuh</span>
                              ) : isSelected ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-400)" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {errors.scheduleId && <span role="alert" style={{ fontSize: '0.75rem', color: 'var(--color-danger)' }}>{errors.scheduleId}</span>}
                  </Field>
                )}

                <Field label="Jenis Pembayaran" id="insurance" required>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {insuranceOptions.map((opt) => (
                      <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', border: form.insurance === opt.value ? '1.5px solid var(--color-primary-400)' : '1.5px solid var(--color-neutral-200)', background: form.insurance === opt.value ? 'var(--color-primary-50)' : '#fff', transition: 'all 150ms' }}>
                        <input type="radio" name="insurance" value={opt.value} checked={form.insurance === opt.value} onChange={(e) => set('insurance', e.target.value)}
                          style={{ accentColor: 'var(--color-primary-400)', width: '16px', height: '16px' }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: form.insurance === opt.value ? 500 : 400, color: 'var(--color-neutral-900)' }}>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <Field label="Nama Lengkap Pasien" id="name" error={errors.name} required>
                  <input id="name" type="text" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Sesuai KTP"
                    style={inputStyle(errors.name)} aria-required="true" aria-invalid={!!errors.name}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary-400)')}
                    onBlur={(e) => (e.target.style.borderColor = errors.name ? 'var(--color-danger)' : 'var(--color-neutral-200)')} />
                </Field>
                <Field label="Tanggal Lahir" id="dob" error={errors.dob} required>
                  <input id="dob" type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    style={inputStyle(errors.dob)} aria-required="true" aria-invalid={!!errors.dob}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary-400)')}
                    onBlur={(e) => (e.target.style.borderColor = errors.dob ? 'var(--color-danger)' : 'var(--color-neutral-200)')} />
                </Field>
                <Field label="Nomor WhatsApp" id="phone" error={errors.phone} required>
                  <input id="phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="08xx-xxxx-xxxx"
                    style={inputStyle(errors.phone)} aria-required="true" aria-invalid={!!errors.phone}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary-400)')}
                    onBlur={(e) => (e.target.style.borderColor = errors.phone ? 'var(--color-danger)' : 'var(--color-neutral-200)')} />
                </Field>
                {form.insurance === 'bpjs' && (
                  <Field label="Nomor BPJS" id="bpjsNumber" error={errors.bpjsNumber} required>
                    <input id="bpjsNumber" type="text" value={form.bpjsNumber} onChange={(e) => set('bpjsNumber', e.target.value)}
                      placeholder="13 digit nomor kartu BPJS" maxLength={13}
                      style={inputStyle(errors.bpjsNumber)} aria-required="true" aria-invalid={!!errors.bpjsNumber}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary-400)')}
                      onBlur={(e) => (e.target.style.borderColor = errors.bpjsNumber ? 'var(--color-danger)' : 'var(--color-neutral-200)')} />
                  </Field>
                )}
                <Field label="Keluhan Utama" id="complaint">
                  <textarea id="complaint" value={form.complaint} onChange={(e) => set('complaint', e.target.value)} rows={3}
                    placeholder="Deskripsikan keluhan Anda (opsional)…"
                    style={{ ...inputStyle(false), resize: 'vertical', minHeight: '80px' }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary-400)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--color-neutral-200)')} />
                </Field>
              </div>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-neutral-900)', fontFamily: 'var(--font-figtree, Figtree, sans-serif)' }}>Ringkasan Pendaftaran</h2>
                <div style={{ background: 'var(--color-neutral-50)', border: '1px solid var(--color-neutral-200)', borderRadius: '10px', overflow: 'hidden' }}>
                  {[
                    ['Dokter',       selectedDoctor?.name ?? '-'],
                    ['Spesialisasi', selectedDoctor?.specialization ?? '-'],
                    ['Jadwal',       selectedSchedule?.time ?? '-'],
                    ['Poli',         selectedSchedule?.specialization ?? '-'],
                    ['Pembayaran',   insuranceOptions.find(o => o.value === form.insurance)?.label ?? '-'],
                    ['Nama Pasien',  form.name],
                    ['Tanggal Lahir', form.dob ? new Date(form.dob).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'],
                    ['No. WhatsApp', form.phone],
                    ...(form.insurance === 'bpjs' ? [['No. BPJS', form.bpjsNumber]] : []),
                    ...(form.complaint ? [['Keluhan', form.complaint]] : []),
                  ].map(([k, v], i, arr) => (
                    <div key={k} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '0.5rem', padding: '0.75rem 1rem', borderBottom: i < arr.length - 1 ? '0.5px solid var(--color-neutral-200)' : 'none', background: i % 2 === 0 ? '#fff' : 'var(--color-neutral-50)' }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-600)' }}>{k}</span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-neutral-900)', wordBreak: 'break-word' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'var(--color-primary-50)', border: '1px solid var(--color-primary-100)', borderRadius: '8px', padding: '0.875rem 1rem', fontSize: '0.8125rem', color: 'var(--color-primary-800)', lineHeight: 1.6 }}>
                  Konfirmasi jadwal akan dikirim otomatis ke nomor WhatsApp <strong>{form.phone}</strong>. Hadir 15 menit sebelum waktu praktik.
                </div>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.agreeTerms} onChange={(e) => set('agreeTerms', e.target.checked)}
                    style={{ accentColor: 'var(--color-primary-400)', width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }} aria-required="true" />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-600)', lineHeight: 1.6 }}>
                    Saya menyetujui{' '}
                    <Link href="#" style={{ color: 'var(--color-primary-600)', textDecoration: 'underline' }}>syarat & ketentuan</Link>
                    {' '}pendaftaran online RS Bhayangkara Nganjuk.
                  </span>
                </label>
                {errors.agreeTerms && <span role="alert" style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '-0.75rem' }}>{errors.agreeTerms}</span>}
                <button type="submit" disabled={submitting} aria-busy={submitting}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem 1.5rem', borderRadius: '10px', background: 'var(--color-primary-400)', color: '#fff', fontSize: '0.9375rem', fontWeight: 600, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, minHeight: '52px', transition: 'background 150ms, opacity 150ms', fontFamily: 'inherit' }}
                  className="submit-btn">
                  {submitting ? (
                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></path></svg>Memproses…</>
                  ) : (
                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>Konfirmasi Pendaftaran</>
                  )}
                </button>
              </form>
            )}

            {/* Nav buttons */}
            {step < 3 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '0.5px solid var(--color-neutral-200)' }}>
                {step > 1 ? (
                  <button type="button" onClick={handleBack} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.625rem 1.25rem', borderRadius: '8px', border: '1.5px solid var(--color-neutral-200)', background: '#fff', color: 'var(--color-neutral-600)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>Kembali
                  </button>
                ) : <span />}
                <button type="button" onClick={handleNext} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.625rem 1.5rem', borderRadius: '8px', background: 'var(--color-primary-400)', color: '#fff', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }} className="next-btn">
                  {step === 2 ? 'Periksa Kembali' : 'Lanjut'}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .next-btn:hover { background: var(--color-primary-600) !important; }
        .submit-btn:not(:disabled):hover { background: var(--color-primary-600) !important; }
      `}</style>
    </>
  );
}
