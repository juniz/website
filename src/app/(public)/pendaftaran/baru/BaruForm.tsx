'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { submitPreRegistration, getSchedulesByDay } from '@/app/actions/pre-registration';
import { Loader2, ArrowLeft, ArrowRight, AlertTriangle, UserCheck, X, Calendar, Search, Stethoscope, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Turnstile from '@/components/common/Turnstile';
import { Schedule } from '@/types/api';

interface DateOption {
  date: Date;
  iso: string;
  dayName: string;
  label: string;
  isSunday: boolean;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  fontSize: '0.9375rem',
  border: '1.5px solid var(--color-neutral-200)',
  borderRadius: '10px',
  background: '#fff',
  color: 'var(--color-neutral-900)',
  outline: 'none',
  transition: 'border-color 200ms ease, box-shadow 200ms ease',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8125rem',
  fontWeight: 700,
  color: 'var(--color-primary-900)',
  marginBottom: '0.5rem',
  fontFamily: 'var(--font-figtree)',
  letterSpacing: '0.01em',
};

const reqMark = <span style={{ color: 'var(--color-accent)', marginLeft: '2px' }}>*</span>;

interface FieldGroupProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

function FieldGroup({ label, required, hint, children }: FieldGroupProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={labelStyle}>{label}{required && reqMark}</label>
      {children}
      {hint && <p style={{ fontSize: '0.75rem', color: 'var(--color-neutral-400)', marginTop: '0.375rem' }}>{hint}</p>}
    </div>
  );
}

function BookingStyles() {
  return (
    <style>{`
        /* ── Base interactive ── */
        .bf-input:focus { border-color: var(--color-primary-400); box-shadow: 0 0 0 3px rgba(55,138,221,0.15); outline: none; }
        .bf-primary-btn:hover:not(:disabled) { background: var(--color-primary-800) !important; box-shadow: 0 6px 20px rgba(24,95,165,0.4) !important; }
        .bf-ghost-btn:hover { border-color: var(--color-primary-300); color: var(--color-primary-700); }
        @keyframes bf-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* ── Form footer ── */
        .bf-form-footer {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 0.75rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--color-neutral-100);
        }
        .bf-form-footer button {
          width: 100%;
          justify-content: center;
        }
        @media (min-width: 640px) {
          .bf-form-footer {
            flex-direction: row-reverse;
            justify-content: flex-start;
          }
          .bf-form-footer button { width: auto; }
        }

        /* ── Date chip shared ── */
        .bf-date-chip {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 0.625rem 0.375rem;
          border-radius: 10px;
          border: 2px solid var(--color-neutral-200);
          background: #fff;
          cursor: pointer;
          transition: border-color 200ms ease, background 200ms ease, box-shadow 200ms ease, opacity 200ms ease;
          flex-shrink: 0;
        }
        .bf-date-chip:hover:not(:disabled):not(.bf-dc-sel) {
          border-color: var(--color-primary-200);
          background: var(--color-primary-50);
        }
        .bf-dc-sel {
          border-color: var(--color-primary-600) !important;
          background: var(--color-primary-600) !important;
          box-shadow: 0 4px 14px rgba(24,95,165,0.28);
        }
        .bf-dc-closed { border-color: transparent !important; background: var(--color-neutral-100) !important; opacity: 0.45; cursor: not-allowed; }
        .bf-dc-day { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.05em; color: var(--color-neutral-400); }
        .bf-dc-num { font-size: 1.25rem; font-weight: 800; font-family: var(--font-figtree); color: var(--color-neutral-800); line-height: 1; }
        .bf-dc-mon { font-size: 0.6rem; color: var(--color-neutral-400); }
        .bf-dc-sel .bf-dc-day { color: rgba(255,255,255,0.75); }
        .bf-dc-sel .bf-dc-num { color: #fff; }
        .bf-dc-sel .bf-dc-mon { color: rgba(255,255,255,0.65); }

        /* ── Mobile scroll strip (hidden ≥640px) ── */
        .bf-date-scroll-mobile {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 6px;
          scrollbar-width: none;
        }
        .bf-date-scroll-mobile::-webkit-scrollbar { display: none; }
        .bf-date-scroll-mobile .bf-date-chip {
          scroll-snap-align: start;
          min-width: calc(33.33% - 0.5rem);
        }
        @media (min-width: 380px) {
          .bf-date-scroll-mobile .bf-date-chip { min-width: calc(28% - 0.5rem); }
        }

        /* ── Desktop carousel (hidden <640px) ── */
        .bf-date-carousel-desktop { display: none; }
        @media (min-width: 640px) {
          .bf-date-scroll-mobile { display: none; }
          .bf-date-carousel-desktop {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .bf-dc-desk {
            min-width: calc(25% - 0.375rem);
          }
        }

        /* ── Date arrow buttons ── */
        .bf-date-arrow {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1.5px solid var(--color-neutral-200);
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 200ms ease, background 200ms ease;
        }
        .bf-date-arrow:not(:disabled):hover { border-color: var(--color-primary-300); background: var(--color-primary-50); }

        /* ── Schedule header ── */
        .bf-sched-header {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 0;
        }
        @media (min-width: 640px) {
          .bf-sched-header {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
          .bf-sched-header > div { max-width: 240px; }
        }

        /* ── Schedule card ── */
        .bf-sched-card {
          display: flex;
          align-items: flex-start;
          gap: 0.875rem;
          padding: 1rem 1.125rem;
          border-radius: 12px;
          border: 2px solid var(--color-neutral-200);
          background: #fff;
          cursor: pointer;
          text-align: left;
          width: 100%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          transition: border-color 200ms ease, background 200ms ease, box-shadow 200ms ease;
        }
        .bf-sched-card:hover:not(.bf-sched-card--sel) {
          border-color: var(--color-primary-200);
          box-shadow: 0 4px 12px rgba(24,95,165,0.08);
        }
        .bf-sched-card--sel {
          border-color: var(--color-primary-500);
          background: rgba(24,95,165,0.04);
          box-shadow: 0 0 0 4px rgba(55,138,221,0.1);
        }

        /* ── Schedule icon ── */
        .bf-sched-icon {
          width: 38px;
          height: 38px;
          min-width: 38px;
          border-radius: 10px;
          background: var(--color-primary-50);
          color: var(--color-primary-600);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 200ms ease, color 200ms ease;
        }
        .bf-si-sel { background: var(--color-primary-600); color: #fff; }

        /* ── Schedule meta ── */
        .bf-sched-time {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-neutral-500);
          background: var(--color-neutral-100);
          border-radius: 999px;
          padding: 2px 9px;
        }
        .bf-sched-kuota {
          display: inline-flex;
          align-items: center;
          font-size: 0.7rem;
          font-weight: 700;
          color: #065f46;
          background: #d1fae5;
          border-radius: 999px;
          padding: 2px 8px;
          letter-spacing: 0.01em;
        }

        /* ── Schedule radio dot ── */
        .bf-sched-radio {
          width: 20px;
          height: 20px;
          min-width: 20px;
          border-radius: 50%;
          border: 2px solid var(--color-neutral-300);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 200ms ease, background 200ms ease;
          margin-top: 2px;
        }
        .bf-sr-sel { border-color: var(--color-primary-500); background: var(--color-primary-500); }

        /* ── Schedule text truncation ── */
        .bf-sched-poli {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-word;
        }
        .bf-sched-poli--sel {
          -webkit-line-clamp: unset;
          overflow: visible;
          display: block;
        }
        .bf-sched-dokter {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          max-width: 100%;
        }
      `}</style>
  );
}

export default function BaruForm() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [consentId, setConsentId] = useState<string | null>(null);
  const [jk, setJk] = useState<'L' | 'P'>('L');
  const [showDuplicateAlert, setShowDuplicateAlert] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  // Schedule States
  const [selectedDate, setSelectedDate] = useState<DateOption | null>(null);
  const [availableDates, setAvailableDates] = useState<DateOption[]>([]);
  const [dateStartIndex, setDateStartIndex] = useState<number>(0);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState<boolean>(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Saved form data from Step 1
  const [savedData, setSavedData] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkConsent = () => {
      const stored = sessionStorage.getItem('consent_id');
      if (!stored) {
        toast.error('Sesi pendaftaran tidak valid. Silakan ulangi.');
        router.push('/pendaftaran');
      } else {
        setConsentId(stored);
      }
    };
    checkConsent();

    // Init dates
    const dates: DateOption[] = [];
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const dayNames = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      dates.push({
        date: d,
        iso: d.toISOString().split('T')[0]!,
        dayName: dayNames[d.getDay()]!,
        label: d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }),
        isSunday: d.getDay() === 0,
      });
    }
    setAvailableDates(dates);
  }, [router]);

  async function handleNextStep(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        data[key] = value;
      }
    });
    setSavedData(data);
    setStep(2);
  }

  async function handleDateSelect(dateObj: DateOption) {
    if (dateObj.isSunday) { toast.error('Pendaftaran tutup pada hari Minggu.'); return; }
    setSelectedDate(dateObj);
    setSelectedSchedule(null);
    setSearchQuery('');
    setIsLoadingSchedules(true);
    const result = await getSchedulesByDay(dateObj.dayName);
    setIsLoadingSchedules(false);
    if (result.success && result.data) {
      if (result.data.length === 0) toast.info(`Tidak ada jadwal untuk hari ${dateObj.dayName}.`);
      setSchedules(result.data);
    } else {
      toast.error('Gagal mengambil jadwal.'); setSchedules([]);
    }
  }

  const scrollDates = (dir: 'left' | 'right') => {
    if (dir === 'left' && dateStartIndex > 0) setDateStartIndex(dateStartIndex - 1);
    else if (dir === 'right' && dateStartIndex < availableDates.length - 4) setDateStartIndex(dateStartIndex + 1);
  };

  const filteredSchedules = schedules.filter(s => 
    s.nm_poli.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.nm_dokter.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleFinalSubmit() {
    if (!consentId) return;
    if (!selectedDate || !selectedSchedule) {
      toast.error('Silakan pilih tanggal dan jadwal terlebih dahulu.');
      return;
    }
    if (!captchaToken) {
      toast.error('Silakan selesaikan captcha terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    
    // Construct final form data
    const finalFormData = new FormData();
    Object.keys(savedData).forEach(key => finalFormData.append(key, savedData[key]!));
    finalFormData.append('consent_id', consentId);
    finalFormData.append('captcha_token', captchaToken);
    finalFormData.append('tgl_booking', selectedDate.iso);
    finalFormData.append('kd_dokter', selectedSchedule.kd_dokter);
    finalFormData.append('kd_poli', selectedSchedule.kd_poli);

    const result = await submitPreRegistration(null, finalFormData);
    setIsSubmitting(false);
    
    if (result.success && result.data) {
      toast.success('Pendaftaran berhasil!');
      sessionStorage.removeItem('consent_id');
      router.push(`/pendaftaran/qr?token=${result.data.qr_token}`);
    } else {
      if (result.message && result.message.toLowerCase().includes('sudah terdaftar')) {
        setShowDuplicateAlert(true);
      } else {
        toast.error(result.message || 'Gagal mengirim data.');
      }
    }
  }

  // Service disabled notice
  return (
    <div style={{ 
      textAlign: 'center', padding: '3rem 1.5rem', background: '#fff', 
      borderRadius: '20px', border: '1px solid var(--color-neutral-200)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem'
    }}>
      <div style={{ 
        width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-neutral-100)', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-neutral-400)' 
      }}>
        <Clock size={32} />
      </div>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-900)', margin: '0 0 0.5rem' }}>Pendaftaran Baru Ditutup Sementara</h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-neutral-500)', lineHeight: 1.6, margin: 0 }}>
          Maaf, saat ini pendaftaran untuk pasien baru sedang tidak tersedia. <br />
          Silakan hubungi bagian pendaftaran RS Bhayangkara Nganjuk untuk informasi lebih lanjut.
        </p>
      </div>
      <button 
        onClick={() => router.push('/pendaftaran')}
        style={{ 
          marginTop: '0.5rem', padding: '0.75rem 1.5rem', background: 'var(--color-primary-600)', 
          color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' 
        }}
      >
        Kembali ke Beranda
      </button>
    </div>
  );

  /* ── Step 1: Personal Data ── */
  if (step === 1) {
    return (
      <>
        <form onSubmit={handleNextStep} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <FieldGroup label="Nama Lengkap Pasien" required>
            <input id="nm_pasien" name="nm_pasien" required placeholder="Sesuai KTP" style={inputStyle} className="bf-input" />
          </FieldGroup>

          <FieldGroup label="Nomor KTP (NIK)" required>
            <input id="no_ktp" name="no_ktp" type="number" required placeholder="16 digit angka" style={inputStyle} className="bf-input" />
          </FieldGroup>

          <div className="bf-grid-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <FieldGroup label="Tanggal Lahir" required>
              <input id="tgl_lahir" name="tgl_lahir" type="date" required style={inputStyle} className="bf-input" />
            </FieldGroup>

            <FieldGroup label="Jenis Kelamin" required>
              <input type="hidden" name="jk" value={jk} />
              <div style={{ display: 'flex', gap: '0.625rem' }}>
                {[{ value: 'L' as const, label: 'Laki-laki' }, { value: 'P' as const, label: 'Perempuan' }].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setJk(opt.value)}
                    style={{
                      flex: 1, padding: '0.75rem 0.5rem', borderRadius: '10px',
                      border: `2px solid ${jk === opt.value ? 'var(--color-primary-500)' : 'var(--color-neutral-200)'}`,
                      background: jk === opt.value ? 'rgba(24,95,165,0.06)' : '#fff',
                      color: jk === opt.value ? 'var(--color-primary-800)' : 'var(--color-neutral-600)',
                      fontSize: '0.8125rem', fontWeight: 700, fontFamily: 'var(--font-figtree)', cursor: 'pointer',
                      transition: 'all 200ms ease', boxShadow: jk === opt.value ? '0 0 0 3px rgba(55,138,221,0.12)' : 'none',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </FieldGroup>
          </div>

          <FieldGroup label="Nama Ibu Kandung" required>
            <input id="nm_ibu" name="nm_ibu" required placeholder="Untuk keperluan rekam medis" style={inputStyle} className="bf-input" />
          </FieldGroup>

          <FieldGroup label="Nomor WhatsApp" required hint="Pemberitahuan akan dikirimkan ke nomor ini.">
            <input id="no_wa" name="no_wa" type="tel" required placeholder="Contoh: 08123456789" style={inputStyle} className="bf-input" />
          </FieldGroup>

          <FieldGroup label="Alamat Lengkap">
            <textarea id="alamat" name="alamat" placeholder="Alamat sesuai domisili" rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }} className="bf-input" />
          </FieldGroup>

          <div className="bf-form-footer" style={{ borderTop: 'none', paddingTop: '0.5rem' }}>
            <button type="submit" className="bf-primary-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem', background: 'var(--color-primary-600)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.9375rem', fontWeight: 700, fontFamily: 'var(--font-figtree)', cursor: 'pointer', transition: 'all 200ms ease', boxShadow: '0 4px 14px rgba(24,95,165,0.3)' }}>
              Lanjut ke Pilih Jadwal <ArrowRight size={16} />
            </button>
            <button type="button" onClick={() => router.back()} className="bf-ghost-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.5rem', background: 'transparent', color: 'var(--color-neutral-600)', border: '1.5px solid var(--color-neutral-200)', borderRadius: '10px', fontSize: '0.9375rem', fontWeight: 600, fontFamily: 'var(--font-figtree)', cursor: 'pointer' }}>
              <ArrowLeft size={16} /> Kembali
            </button>
          </div>
        </form>
        <BookingStyles />
      </>
    );
  }

  /* ── Step 2: Date & Schedule Selection ── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <BookingStyles />

      {/* ── Summary strip ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', background: 'var(--color-primary-50)', border: '1px solid var(--color-primary-100)', borderRadius: '12px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <UserCheck size={16} style={{ color: '#fff' }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary-500)', margin: 0, fontFamily: 'var(--font-figtree)' }}>Calon Pasien Baru</p>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary-900)', fontFamily: 'var(--font-figtree)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '1px 0 0' }}>{savedData.nm_pasien}</p>
        </div>
      </div>

      {/* ── Date picker ── */}
      <div>
        <p style={{ ...labelStyle, marginBottom: '0.875rem' }}>1. Pilih Tanggal Booking</p>
        <div className="bf-date-scroll-mobile" role="listbox">
          {availableDates.map((d, i) => {
            const sel = selectedDate?.iso === d.iso;
            return (
              <button key={i} type="button" onClick={() => handleDateSelect(d)} disabled={d.isSunday} className={`bf-date-chip${sel ? ' bf-dc-sel' : ''}${d.isSunday ? ' bf-dc-closed' : ''}`}>
                <span className="bf-dc-day">{d.dayName.slice(0, 3)}</span>
                <span className="bf-dc-num">{d.date.getDate()}</span>
                <span className="bf-dc-mon">{d.date.toLocaleDateString('id-ID', { month: 'short' })}</span>
              </button>
            );
          })}
        </div>

        <div className="bf-date-carousel-desktop">
          <button type="button" onClick={() => scrollDates('left')} disabled={dateStartIndex === 0} className="bf-date-arrow" style={{ opacity: dateStartIndex === 0 ? 0.35 : 1 }}>
            <ChevronLeft size={16} />
          </button>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: '0.5rem', transition: 'transform 300ms cubic-bezier(0.25,0.46,0.45,0.94)', transform: `translateX(calc(${dateStartIndex} * (-25% - 0.375rem)))` }}>
              {availableDates.map((d, i) => {
                const sel = selectedDate?.iso === d.iso;
                return (
                  <button key={i} type="button" onClick={() => handleDateSelect(d)} disabled={d.isSunday} className={`bf-date-chip bf-dc-desk${sel ? ' bf-dc-sel' : ''}${d.isSunday ? ' bf-dc-closed' : ''}`}>
                    <span className="bf-dc-day">{d.dayName.slice(0, 3)}</span>
                    <span className="bf-dc-num">{d.date.getDate()}</span>
                    <span className="bf-dc-mon">{d.date.toLocaleDateString('id-ID', { month: 'short' })}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <button type="button" onClick={() => scrollDates('right')} disabled={dateStartIndex >= availableDates.length - 4} className="bf-date-arrow" style={{ opacity: dateStartIndex >= availableDates.length - 4 ? 0.35 : 1 }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ── Schedule Picker ── */}
      {selectedDate && (
        <div style={{ borderTop: '1px solid var(--color-neutral-100)', paddingTop: '1.75rem' }}>
          <div className="bf-sched-header">
            <p style={{ ...labelStyle, marginBottom: 0 }}>2. Pilih Poliklinik &amp; Dokter</p>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-400)' }} />
              <input type="text" placeholder="Cari poli atau dokter…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ ...inputStyle, padding: '0.5rem 2.25rem', fontSize: '0.8125rem', borderRadius: '8px', height: '40px' }} className="bf-input" />
            </div>
          </div>

          {isLoadingSchedules ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 0', gap: '0.75rem' }}>
              <Loader2 size={30} style={{ color: 'var(--color-primary-400)', animation: 'bf-spin 1s linear infinite' }} />
              <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-400)' }}>Memuat jadwal…</p>
            </div>
          ) : filteredSchedules.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '1rem' }}>
              {filteredSchedules.map((sched, i) => {
                const sel = selectedSchedule === sched;
                return (
                  <button key={i} type="button" onClick={() => setSelectedSchedule(sched)} className={`bf-sched-card${sel ? ' bf-sched-card--sel' : ''}`}>
                    <div className={`bf-sched-icon${sel ? ' bf-si-sel' : ''}`}><Stethoscope size={17} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className={`bf-sched-poli${sel ? ' bf-sched-poli--sel' : ''}`} style={{ fontSize: '0.9375rem', fontWeight: 700, color: sel ? 'var(--color-primary-800)' : 'var(--color-neutral-900)', margin: 0 }}>{sched.nm_poli}</p>
                      <p className="bf-sched-dokter" style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-500)', margin: '3px 0 0' }}>{sched.nm_dokter}</p>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '5px' }}>
                        <span className="bf-sched-time"><Clock size={10} /> {sched.jam_mulai.substring(0, 5)} – {sched.jam_selesai.substring(0, 5)}</span>
                      </div>
                    </div>
                    <div className={`bf-sched-radio${sel ? ' bf-sr-sel' : ''}`}>{sel && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />}</div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--color-neutral-50)', borderRadius: '12px', marginTop: '1rem', border: '1.5px dashed var(--color-neutral-200)' }}>
              <p style={{ color: 'var(--color-neutral-500)', fontSize: '0.9rem' }}>Tidak ada jadwal dokter tersedia.</p>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '0.5rem' }}>
        <Turnstile onVerify={(token) => setCaptchaToken(token)} />
      </div>

      <div className="bf-form-footer">
        <button type="button" onClick={handleFinalSubmit} disabled={isSubmitting || !selectedSchedule} className="bf-primary-btn" style={{ background: (isSubmitting || !selectedSchedule) ? 'var(--color-neutral-200)' : 'var(--color-primary-600)', color: (isSubmitting || !selectedSchedule) ? 'var(--color-neutral-400)' : '#fff', border: 'none', borderRadius: '10px', padding: '0.875rem 1.75rem', fontSize: '0.9375rem', fontWeight: 700, fontFamily: 'var(--font-figtree)', cursor: (isSubmitting || !selectedSchedule) ? 'not-allowed' : 'pointer', boxShadow: (isSubmitting || !selectedSchedule) ? 'none' : '0 4px 14px rgba(24,95,165,0.3)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          {isSubmitting ? <><Loader2 size={16} style={{ animation: 'bf-spin 1s linear infinite' }} /> Memproses…</> : <>Konfirmasi Pendaftaran <ArrowRight size={16} /></>}
        </button>
        <button type="button" onClick={() => setStep(1)} className="bf-ghost-btn" style={{ padding: '0.875rem 1.5rem', background: 'transparent', color: 'var(--color-neutral-600)', border: '1.5px solid var(--color-neutral-200)', borderRadius: '10px', fontSize: '0.9375rem', fontWeight: 600, fontFamily: 'var(--font-figtree)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={16} /> Batal &amp; Ubah Data
        </button>
      </div>

      {/* Duplicate NIK Alert */}
      {showDuplicateAlert && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'rgba(4,44,83,0.6)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '440px', borderRadius: '24px', padding: '2rem', textAlign: 'center' }}>
            <AlertTriangle size={48} style={{ color: '#D97706', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#92400E', marginBottom: '0.75rem' }}>NIK Sudah Terdaftar</h3>
            <p style={{ fontSize: '0.9375rem', color: '#B45309', lineHeight: 1.6, marginBottom: '1.5rem' }}>Data Anda sudah ada dalam sistem kami. Silakan pilih menu Pasien Lama untuk booking jadwal secara langsung.</p>
            <button onClick={() => router.push('/pendaftaran/lama')} style={{ width: '100%', padding: '1rem', background: 'var(--color-primary-600)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Ke Pendaftaran Pasien Lama</button>
            <button onClick={() => setShowDuplicateAlert(false)} style={{ marginTop: '0.75rem', background: 'transparent', border: 'none', color: 'var(--color-neutral-500)', cursor: 'pointer' }}>Batal</button>
          </div>
        </div>
      )}
    </div>
  );
}
