'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as htmlToImage from 'html-to-image';
import { verifyOldPatient, getSchedulesByDay, submitBookingRegistrasi } from '@/app/actions/pre-registration';
import { Loader2, CheckCircle2, Calendar, Clock, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, UserCheck, Stethoscope, Search, X, Download, Printer, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import Turnstile from '@/components/common/Turnstile';
import { Patient, Schedule, BookingResult } from '@/types/api';

/* ── DateOption structure ── */
interface DateOption {
  date: Date;
  iso: string;
  dayName: string;
  label: string;
  isSunday: boolean;
}

/* ── shared input style ── */
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

interface PrimaryBtnProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  style?: React.CSSProperties;
}

function PrimaryBtn({ children, disabled, onClick, type = 'button', style: extra = {} }: PrimaryBtnProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        padding: '0.875rem 1.75rem',
        background: disabled ? 'var(--color-neutral-200)' : 'var(--color-primary-600)',
        color: disabled ? 'var(--color-neutral-400)' : '#fff',
        border: 'none', borderRadius: '10px',
        fontSize: '0.9375rem', fontWeight: 700, fontFamily: 'var(--font-figtree)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 200ms ease, box-shadow 200ms ease',
        boxShadow: disabled ? 'none' : '0 4px 14px rgba(24,95,165,0.3)',
        ...extra,
      }}
      className={disabled ? '' : 'lf-primary-btn'}
    >
      {children}
    </button>
  );
}

interface GhostBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

function GhostBtn({ children, onClick, style: extra = {} }: GhostBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.875rem 1.5rem',
        background: 'transparent',
        color: 'var(--color-neutral-600)',
        border: '1.5px solid var(--color-neutral-200)', borderRadius: '10px',
        fontSize: '0.9375rem', fontWeight: 600, fontFamily: 'var(--font-figtree)',
        cursor: 'pointer',
        transition: 'border-color 200ms ease, color 200ms ease',
        ...extra,
      }}
      className="lf-ghost-btn"
    >
      {children}
    </button>
  );
}

function LamaStyles() {
  return (
    <style>{`
        /* ── Base interactive ── */
        .lf-input:focus { border-color: var(--color-primary-400); box-shadow: 0 0 0 3px rgba(55,138,221,0.15); outline: none; }
        .lf-search-input:focus { border-color: var(--color-primary-400); box-shadow: 0 0 0 3px rgba(55,138,221,0.15); outline: none; }
        .lf-primary-btn:hover:not(:disabled) { background: var(--color-primary-800) !important; box-shadow: 0 6px 20px rgba(24,95,165,0.4) !important; }
        .lf-ghost-btn:hover { border-color: var(--color-primary-300); color: var(--color-primary-700); }
        @keyframes lf-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes lf-slideDown { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        /* ── Form footer ── */
        .lf-form-footer {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 0.75rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--color-neutral-100);
        }
        .lf-form-footer button {
          width: 100%;
          justify-content: center;
        }
        @media (min-width: 640px) {
          .lf-form-footer {
            flex-direction: row-reverse;
            justify-content: flex-start;
          }
          .lf-form-footer button { width: auto; }
          .lf-success-actions { flex-direction: row !important; }
        }

        /* ── Date chip shared ── */
        .lf-date-chip {
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
        .lf-date-chip:hover:not(:disabled):not(.lf-dc-sel) {
          border-color: var(--color-primary-200);
          background: var(--color-primary-50);
        }
        .lf-dc-sel {
          border-color: var(--color-primary-600) !important;
          background: var(--color-primary-600) !important;
          box-shadow: 0 4px 14px rgba(24,95,165,0.28);
        }
        .lf-dc-closed { border-color: transparent !important; background: var(--color-neutral-100) !important; opacity: 0.45; cursor: not-allowed; }
        .lf-dc-day { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.05em; color: var(--color-neutral-400); }
        .lf-dc-num { font-size: 1.25rem; font-weight: 800; font-family: var(--font-figtree); color: var(--color-neutral-800); line-height: 1; }
        .lf-dc-mon { font-size: 0.6rem; color: var(--color-neutral-400); }
        .lf-dc-sel .lf-dc-day { color: rgba(255,255,255,0.75); }
        .lf-dc-sel .lf-dc-num { color: #fff; }
        .lf-dc-sel .lf-dc-mon { color: rgba(255,255,255,0.65); }

        /* ── Mobile scroll strip (hidden ≥640px) ── */
        .lf-date-scroll-mobile {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 6px;
          scrollbar-width: none;
        }
        .lf-date-scroll-mobile::-webkit-scrollbar { display: none; }
        .lf-date-scroll-mobile .lf-date-chip {
          scroll-snap-align: start;
          min-width: calc(33.33% - 0.5rem);
        }
        @media (min-width: 380px) {
          .lf-date-scroll-mobile .lf-date-chip { min-width: calc(28% - 0.5rem); }
        }

        /* ── Desktop carousel (hidden <640px) ── */
        .lf-date-carousel-desktop { display: none; }
        @media (min-width: 640px) {
          .lf-date-scroll-mobile { display: none; }
          .lf-date-carousel-desktop {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .lf-dc-desk {
            min-width: calc(25% - 0.375rem);
          }
        }

        /* ── Date arrow buttons ── */
        .lf-date-arrow {
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
        .lf-date-arrow:not(:disabled):hover { border-color: var(--color-primary-300); background: var(--color-primary-50); }

        /* ── Schedule header ── */
        .lf-sched-header {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 0;
        }
        @media (min-width: 640px) {
          .lf-sched-header {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
          .lf-sched-header > div { max-width: 240px; }
        }

        /* ── Schedule card ── */
        .lf-sched-card {
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
        .lf-sched-card:hover:not(.lf-sched-card--sel) {
          border-color: var(--color-primary-200);
          box-shadow: 0 4px 12px rgba(24,95,165,0.08);
        }
        .lf-sched-card--sel {
          border-color: var(--color-primary-500);
          background: rgba(24,95,165,0.04);
          box-shadow: 0 0 0 4px rgba(55,138,221,0.1);
        }

        /* ── Schedule icon ── */
        .lf-sched-icon {
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
        .lf-si-sel { background: var(--color-primary-600); color: #fff; }

        /* ── Schedule meta ── */
        .lf-sched-time {
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
        .lf-sched-kuota {
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
        .lf-sched-radio {
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
        .lf-sr-sel { border-color: var(--color-primary-500); background: var(--color-primary-500); }

        /* ── Schedule text truncation ── */
        .lf-sched-poli {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-word;
        }
        .lf-sched-poli--sel {
          -webkit-line-clamp: unset;
          overflow: visible;
          display: block;
        }
        .lf-sched-dokter {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        /* ── Schedule scroll list ── */
        .lf-schedule-scroll {
          max-height: 420px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--color-neutral-200) transparent;
          padding-right: 4px;
        }
        .lf-schedule-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .lf-schedule-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .lf-schedule-scroll::-webkit-scrollbar-thumb {
          background: var(--color-neutral-200);
          border-radius: 999px;
        }
        .lf-schedule-scroll::-webkit-scrollbar-thumb:hover {
          background: var(--color-neutral-300);
        }

        /* ── Print ── */
        @media print {
          body * { visibility: hidden; }
          .lf-success-card, .lf-success-card * { visibility: visible; }
          .lf-success-card {
            position: absolute; left: 0; top: 0;
            width: 100%; padding: 20px;
            background: #fff !important; color: #000 !important;
          }
          .lf-success-card p, .lf-success-card span { color: #000 !important; }
          .lf-success-actions { display: none !important; }
        }

        @media (max-width: 380px) {
          .lf-success-actions-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
  );
}

export default function LamaForm() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [verifiedPatient, setVerifiedPatient] = useState<Patient | null>(null);
  const [selectedDate, setSelectedDate] = useState<DateOption | null>(null);
  const [availableDates, setAvailableDates] = useState<DateOption[]>([]);
  const [dateStartIndex, setDateStartIndex] = useState<number>(0);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState<boolean>(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Mounting effect: Initialise available dates, check consent guard, and restore active draft
  useEffect(() => {
    const initDates = () => {
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
      return dates;
    };

    const dates = initDates();

    if (typeof window !== 'undefined') {
      // 1. Enforce Terms Acceptance Guard
      const consentId = sessionStorage.getItem('consent_id');
      if (!consentId) {
        toast.error('Anda harus menyetujui syarat & ketentuan sebelum melakukan pendaftaran.');
        router.push('/pendaftaran');
        return;
      }

      // 2. Restore auto-saved draft if present
      const savedDraft = sessionStorage.getItem('nganjuk_registration_draft');
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          
          // Defer state updates to avoid React's synchronous cascading render warning
          setTimeout(() => {
            if (draft.step) setStep(draft.step);
            if (draft.verifiedPatient) setVerifiedPatient(draft.verifiedPatient);
            if (draft.selectedDate) {
              const matchedDate = dates.find(d => d.iso === draft.selectedDate.iso);
              setSelectedDate(matchedDate || draft.selectedDate);
            }
            if (draft.selectedSchedule) setSelectedSchedule(draft.selectedSchedule);
            if (draft.searchQuery !== undefined) setSearchQuery(draft.searchQuery);

            // If a date was restored, dynamically trigger the schedule fetching for that day
            if (draft.selectedDate) {
              setIsLoadingSchedules(true);
              getSchedulesByDay(draft.selectedDate.dayName).then(result => {
                setIsLoadingSchedules(false);
                if (result.success && result.data) {
                  setSchedules(result.data);
                }
              });
            }
          }, 0);
          
          toast.success('Melanjutkan draf pendaftaran sebelumnya.');
        } catch (e) {
          console.error('Failed to parse registration draft', e);
        }
      }
    }
  }, [router]);

  // Serialise and commit form state changes to sessionStorage (Auto-Save Wizard)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (step > 1 && step < 4 && verifiedPatient) {
        sessionStorage.setItem('nganjuk_registration_draft', JSON.stringify({
          step,
          verifiedPatient,
          selectedDate,
          selectedSchedule,
          searchQuery
        }));
      }
    }
  }, [step, verifiedPatient, selectedDate, selectedSchedule, searchQuery]);

  // Cancel registration and clean up draft state
  const handleCancel = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('nganjuk_registration_draft');
    }
    setVerifiedPatient(null);
    setSelectedDate(null);
    setSelectedSchedule(null);
    setSearchQuery('');
    setError(null);
    setStep(1);
  };

  async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!captchaToken) {
      toast.error('Silakan selesaikan captcha terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append('captcha_token', captchaToken);

    const result = await verifyOldPatient(null, formData);
    setIsSubmitting(false);
    setCaptchaToken(null); // Reset for next use
    
    if (result.success && result.data) {
      setError(null);
      toast.success('Data pasien ditemukan.');
      setVerifiedPatient(result.data);
      setStep(2);
    } else {
      setError(result.message || 'Gagal memverifikasi data.');
      toast.error(result.message || 'Gagal memverifikasi data.');
    }
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

  async function handleBooking() {
    if (!selectedDate || !selectedSchedule || !verifiedPatient) return;
    if (!captchaToken) {
      toast.error('Silakan selesaikan captcha terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    const result = await submitBookingRegistrasi({
      no_rkm_medis: verifiedPatient.no_rkm_medis,
      tanggal_periksa: selectedDate.iso,
      kd_dokter: selectedSchedule.kd_dokter,
      kd_poli: selectedSchedule.kd_poli,
      captcha_token: captchaToken,
    });
    setIsSubmitting(false);
    
    if (result.success && result.data) {
      setError(null);
      toast.success('Booking berhasil!');
      setBookingResult(result.data);
      // Evict registration draft upon successful booking completion
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('nganjuk_registration_draft');
      }
      setStep(4);
    } else {
      setError(result.message || 'Gagal melakukan booking.');
      toast.error(result.message || 'Gagal melakukan booking.');
    }
  }

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current || !bookingResult) return;
    try {
      const dataUrl = await htmlToImage.toPng(receiptRef.current, {
        backgroundColor: '#fff',
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = `booking-${bookingResult.no_reg}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      toast.error('Gagal membuat gambar bukti.');
      console.error(err);
    }
  };

  const scrollDates = (dir: 'left' | 'right') => {
    if (dir === 'left' && dateStartIndex > 0) setDateStartIndex(dateStartIndex - 1);
    else if (dir === 'right' && dateStartIndex < availableDates.length - 4) setDateStartIndex(dateStartIndex + 1);
  };

  const filteredSchedules = schedules.filter(s => 
    s.nm_poli.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.nm_dokter.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ── Step 4: Success ── */
  if (step === 4 && bookingResult && verifiedPatient && selectedDate && selectedSchedule) {
    return (
      <div className="lf-success-card" style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '50%', background: '#ECFDF5', border: '2px solid #A7F3D0', marginBottom: '1.25rem' }}>
          <CheckCircle2 size={36} style={{ color: '#059669' }} />
        </div>
        <h2 style={{ fontSize: '1.625rem', fontWeight: 800, fontFamily: 'var(--font-figtree)', color: '#065F46', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Booking Berhasil!</h2>
        <p style={{ color: 'var(--color-neutral-500)', marginBottom: '2rem', fontSize: '0.9375rem' }}>Anda telah terdaftar sebagai pasien Umum.</p>

        <div style={{ background: 'var(--color-primary-900)', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary-200)', marginBottom: '0.5rem', fontFamily: 'var(--font-figtree)' }}>Nomor Antrean Anda</p>
          <p style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--color-primary-400)', fontFamily: 'var(--font-figtree)', lineHeight: 1, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>{bookingResult.no_reg}</p>

          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', textAlign: 'left' }}>
            {[
              { label: 'No. Rekam Medis', value: verifiedPatient.no_rkm_medis },
              { label: 'Tanggal', value: selectedDate.label },
              { label: 'Poliklinik', value: selectedSchedule.nm_poli },
              { label: 'Dokter', value: selectedSchedule.nm_dokter },
            ].map(({ label, value }, i, arr) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', paddingBlock: '0.625rem', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-primary-200)', flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', textAlign: 'right' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lf-success-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="lf-success-actions-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <GhostBtn onClick={handleDownloadReceipt} style={{ border: '1.5px solid var(--color-primary-200)', color: 'var(--color-primary-700)' }}>
              <Printer size={16} /> Cetak Bukti
            </GhostBtn>
            <GhostBtn onClick={handleDownloadReceipt} style={{ border: '1.5px solid var(--color-primary-200)', color: 'var(--color-primary-700)' }}>
              <Download size={16} /> Download
            </GhostBtn>
          </div>
          
          <PrimaryBtn onClick={() => router.push('/')} style={{ width: '100%' }}>
            Selesai &amp; Kembali ke Beranda <ArrowRight size={16} />
          </PrimaryBtn>
        </div>

        {/* Hidden Thermal Receipt Template for Image Generation */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div 
            ref={receiptRef}
            style={{ 
              width: '380px', 
              padding: '40px 30px', 
              background: '#fff', 
              color: '#000', 
              fontFamily: 'monospace', 
              lineHeight: '1.4' 
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <p style={{ fontWeight: 'bold', fontSize: '18px', margin: 0 }}>RS BHAYANGKARA NGANJUK</p>
              <p style={{ fontSize: '14px', margin: '4px 0' }}>BUKTI BOOKING PENDAFTARAN</p>
              <p style={{ fontSize: '12px', margin: 0 }}>----------------------------------</p>
            </div>
            
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <p style={{ fontSize: '14px', margin: 0 }}>NOMOR ANTREAN</p>
              <p style={{ fontSize: '48px', fontWeight: 'bold', margin: '10px 0' }}>{bookingResult.no_reg}</p>
              <p style={{ fontSize: '12px', margin: 0 }}>----------------------------------</p>
            </div>

            <div style={{ fontSize: '14px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '100px', padding: '4px 0', verticalAlign: 'top' }}>NO. RM</td>
                    <td style={{ width: '10px', padding: '4px 0', verticalAlign: 'top' }}>:</td>
                    <td style={{ padding: '4px 0', fontWeight: 'bold' }}>{verifiedPatient.no_rkm_medis}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', verticalAlign: 'top' }}>NAMA</td>
                    <td style={{ padding: '4px 0', verticalAlign: 'top' }}>:</td>
                    <td style={{ padding: '4px 0', fontWeight: 'bold' }}>{verifiedPatient.nm_pasien.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', verticalAlign: 'top' }}>TANGGAL</td>
                    <td style={{ padding: '4px 0', verticalAlign: 'top' }}>:</td>
                    <td style={{ padding: '4px 0' }}>{selectedDate.label}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', verticalAlign: 'top' }}>POLI</td>
                    <td style={{ padding: '4px 0', verticalAlign: 'top' }}>:</td>
                    <td style={{ padding: '4px 0' }}>{selectedSchedule.nm_poli.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', verticalAlign: 'top' }}>DOKTER</td>
                    <td style={{ padding: '4px 0', verticalAlign: 'top' }}>:</td>
                    <td style={{ padding: '4px 0' }}>{selectedSchedule.nm_dokter.toUpperCase()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '12px' }}>
              <p style={{ margin: 0 }}>----------------------------------</p>
              <p style={{ margin: '8px 0' }}>SIMPAN BUKTI INI</p>
              <p style={{ margin: 0 }}>Harap datang 15 menit sebelum</p>
              <p style={{ margin: 0 }}>jam pelayanan dimulai.</p>
              <p style={{ marginTop: '10px' }}>Terima Kasih</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Step 2/3: Date & Schedule ── */
  if ((step === 2 || step === 3) && verifiedPatient) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        <LamaStyles />

        {error && (
          <div style={{ 
            background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', padding: '1rem', 
            display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#991b1b',
            animation: 'lf-slideDown 300ms ease'
          }}>
            <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.5 }}>{error}</div>
          </div>
        )}

        {/* ── Verified patient strip ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.875rem',
          padding: '0.875rem 1rem',
          background: 'var(--color-primary-50)',
          border: '1px solid var(--color-primary-100)',
          borderRadius: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <UserCheck size={16} style={{ color: '#fff' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary-500)', margin: 0, fontFamily: 'var(--font-figtree)' }}>Pasien Terverifikasi</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary-900)', fontFamily: 'var(--font-figtree)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '1px 0 0' }}>{verifiedPatient.nm_pasien}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-primary-600)', margin: '1px 0 0' }}>{verifiedPatient.no_rkm_medis}</p>
            </div>
          </div>
          <CheckCircle2 size={18} style={{ color: 'var(--color-primary-500)', flexShrink: 0 }} />
        </div>

        {/* ── Date picker ── */}
        <div>
          <p style={{ ...labelStyle, marginBottom: '0.875rem' }}>1. Pilih Tanggal Periksa</p>

          {/* Mobile: native horizontal scroll-snap (no JS transform) */}
          <div className="lf-date-scroll-mobile" role="listbox" aria-label="Pilih tanggal">
            {availableDates.map((d, i) => {
              const sel = selectedDate?.iso === d.iso;
              return (
                <button
                  key={i}
                  type="button"
                  role="option"
                  aria-selected={sel}
                  onClick={() => handleDateSelect(d)}
                  disabled={d.isSunday}
                  className={`lf-date-chip${sel ? ' lf-dc-sel' : ''}${d.isSunday ? ' lf-dc-closed' : ''}`}
                >
                  <span className="lf-dc-day">{d.dayName.slice(0, 3)}</span>
                  <span className="lf-dc-num">{d.date.getDate()}</span>
                  <span className="lf-dc-mon">{d.date.toLocaleDateString('id-ID', { month: 'short' })}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop: arrow-button carousel (hidden on mobile) */}
          <div className="lf-date-carousel-desktop">
            <button
              type="button"
              aria-label="Geser kiri"
              onClick={() => scrollDates('left')}
              disabled={dateStartIndex === 0}
              className="lf-date-arrow"
              style={{ opacity: dateStartIndex === 0 ? 0.35 : 1, cursor: dateStartIndex === 0 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronLeft size={16} />
            </button>

            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  transition: 'transform 300ms cubic-bezier(0.25,0.46,0.45,0.94)',
                  transform: `translateX(calc(${dateStartIndex} * (-25% - 0.375rem)))`,
                }}
              >
                {availableDates.map((d, i) => {
                  const sel = selectedDate?.iso === d.iso;
                  return (
                    <button
                      key={i}
                      type="button"
                      aria-pressed={sel}
                      onClick={() => handleDateSelect(d)}
                      disabled={d.isSunday}
                      className={`lf-date-chip lf-dc-desk${sel ? ' lf-dc-sel' : ''}${d.isSunday ? ' lf-dc-closed' : ''}`}
                    >
                      <span className="lf-dc-day">{d.dayName.slice(0, 3)}</span>
                      <span className="lf-dc-num">{d.date.getDate()}</span>
                      <span className="lf-dc-mon">{d.date.toLocaleDateString('id-ID', { month: 'short' })}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              aria-label="Geser kanan"
              onClick={() => scrollDates('right')}
              disabled={dateStartIndex >= availableDates.length - 4}
              className="lf-date-arrow"
              style={{ opacity: dateStartIndex >= availableDates.length - 4 ? 0.35 : 1, cursor: dateStartIndex >= availableDates.length - 4 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* ── Schedule Picker ── */}
        {selectedDate && (
          <div style={{ borderTop: '1px solid var(--color-neutral-100)', paddingTop: '1.75rem' }}>

            {/* Header: label + search stacked on mobile, row on ≥640 */}
            <div className="lf-sched-header">
              <p style={{ ...labelStyle, marginBottom: 0 }}>2. Pilih Jadwal &amp; Dokter</p>

              <div style={{ position: 'relative', width: '100%' }}>
                <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-400)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  placeholder="Cari poli atau dokter…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="lf-input lf-search-input"
                  style={{ ...inputStyle, padding: '0.5rem 2.25rem', fontSize: '0.8125rem', borderRadius: '8px', height: '40px' }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Hapus pencarian"
                    style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', color: 'var(--color-neutral-400)', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Schedule results */}
            {isLoadingSchedules ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 1rem', gap: '0.75rem' }}>
                <Loader2 size={30} style={{ color: 'var(--color-primary-400)', animation: 'lf-spin 1s linear infinite' }} />
                <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-400)', margin: 0 }}>Memuat jadwal…</p>
              </div>
            ) : filteredSchedules.length > 0 ? (
              <div className="lf-schedule-scroll">
                <div className="lf-schedule-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '1rem', paddingBottom: '0.25rem' }}>
                  {filteredSchedules.map((sched, i) => {
                    const sel = selectedSchedule === sched;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedSchedule(sched)}
                        className={`lf-sched-card${sel ? ' lf-sched-card--sel' : ''}`}
                      >
                        {/* Icon */}
                        <div className={`lf-sched-icon${sel ? ' lf-si-sel' : ''}`}>
                          <Stethoscope size={17} />
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                          <p className={`lf-sched-poli${sel ? ' lf-sched-poli--sel' : ''}`}
                            style={{ fontSize: '0.9375rem', fontWeight: 700, fontFamily: 'var(--font-figtree)', color: sel ? 'var(--color-primary-800)' : 'var(--color-neutral-900)', margin: 0 }}
                          >{sched.nm_poli}</p>

                          <p className="lf-sched-dokter" style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-500)', margin: '3px 0 0' }}>{sched.nm_dokter}</p>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '5px', flexWrap: 'wrap' }}>
                            <span className="lf-sched-time">
                              <Clock size={10} style={{ flexShrink: 0 }} />
                              {sched.jam_mulai.substring(0, 5)} – {sched.jam_selesai.substring(0, 5)}
                            </span>
                            {sched.kuota > 0 && (
                              <span className="lf-sched-kuota">{sched.kuota} slot</span>
                            )}
                          </div>
                        </div>

                        {/* Radio indicator */}
                        <div className={`lf-sched-radio${sel ? ' lf-sr-sel' : ''}`}>
                          {sel && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'var(--color-neutral-50)', borderRadius: '12px', border: '1.5px dashed var(--color-neutral-200)', marginTop: '1rem' }}>
                {searchQuery ? (
                  <>
                    <Search size={26} style={{ color: 'var(--color-neutral-300)', marginBottom: '0.625rem' }} />
                    <p style={{ color: 'var(--color-neutral-500)', fontSize: '0.9rem', margin: '0 0 0.75rem' }}>Tidak ada hasil untuk &quot;{searchQuery}&quot;</p>
                    <button type="button" onClick={() => setSearchQuery('')} style={{ fontSize: '0.8125rem', color: 'var(--color-primary-600)', fontWeight: 600, border: 'none', background: 'transparent', cursor: 'pointer' }}>
                      Reset Pencarian
                    </button>
                  </>
                ) : (
                  <>
                    <Calendar size={26} style={{ color: 'var(--color-neutral-300)', marginBottom: '0.625rem' }} />
                    <p style={{ color: 'var(--color-neutral-500)', fontSize: '0.9rem', margin: 0 }}>Tidak ada jadwal dokter pada tanggal ini.</p>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: '0.5rem' }}>
          <Turnstile onVerify={(token) => setCaptchaToken(token)} />
        </div>

        {/* ── Actions ── */}
        <div className="lf-form-footer">
          <PrimaryBtn onClick={handleBooking} disabled={!selectedSchedule || isSubmitting}>
            {isSubmitting ? <><Loader2 size={16} style={{ animation: 'lf-spin 1s linear infinite' }} /> Memproses…</> : <>Konfirmasi Booking <ArrowRight size={16} /></>}
          </PrimaryBtn>
          <GhostBtn onClick={handleCancel}>
            <ArrowLeft size={16} /> Batal
          </GhostBtn>
        </div>
      </div>
    );
  }

  /* ── Step 1: Verify ── */
  return (
    <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {error && (
        <div style={{ 
          background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', padding: '1rem', 
          display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#991b1b',
          animation: 'lf-slideDown 300ms ease'
        }}>
          <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.5 }}>{error}</div>
        </div>
      )}
      <FieldGroup label="Nomor KTP (NIK)" required>
        <input id="no_ktp" name="no_ktp" type="number" required placeholder="16 digit angka" style={inputStyle} className="lf-input" />
      </FieldGroup>

      <FieldGroup label="Tanggal Lahir" required hint="Sesuai data rekam medis Anda.">
        <input id="tgl_lahir" name="tgl_lahir" type="date" required style={inputStyle} className="lf-input" />
      </FieldGroup>

      <div style={{ marginTop: '0.5rem' }}>
        <Turnstile onVerify={(token) => setCaptchaToken(token)} />
      </div>

      <div className="lf-form-footer" style={{ borderTop: 'none', paddingTop: '0.5rem' }}>
        <PrimaryBtn type="submit" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 size={16} style={{ animation: 'lf-spin 1s linear infinite' }} /> Memverifikasi...</> : <>Verifikasi Data <ArrowRight size={16} /></>}
        </PrimaryBtn>
        <GhostBtn onClick={() => router.back()}><ArrowLeft size={16} /> Kembali</GhostBtn>
      </div>

      <LamaStyles />
    </form>
  );
}
