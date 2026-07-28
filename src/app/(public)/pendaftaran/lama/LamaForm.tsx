'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as htmlToImage from 'html-to-image';
import { verifyOldPatient, getSchedulesByDay, submitBookingRegistrasi } from '@/app/actions/pre-registration';
import { Loader2, CheckCircle2, Calendar, Clock, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, UserCheck, Stethoscope, Search, X, Download, Printer, AlertTriangle, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import Turnstile from '@/components/common/Turnstile';
import MobileStepHeader from '@/components/pendaftaran/MobileStepHeader';
import MobileBottomSheet from '@/components/pendaftaran/MobileBottomSheet';
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
  padding: '0.875rem 1rem',
  fontSize: '0.9375rem',
  border: '1.5px solid var(--color-neutral-200)',
  borderRadius: '12px',
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

const reqMark = <span style={{ color: 'var(--color-danger)', marginLeft: '2px' }}>*</span>;

interface FieldGroupProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

function FieldGroup({ label, required, hint, children }: FieldGroupProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={labelStyle} className="lf-label">{label}{required && reqMark}</label>
      {children}
      {hint && <p style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)', marginTop: '0.375rem' }} className="lf-hint">{hint}</p>}
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
        background: disabled ? 'var(--color-neutral-200)' : 'var(--color-cta)',
        color: disabled ? 'var(--color-neutral-400)' : 'var(--color-cta-text)',
        border: 'none', borderRadius: '12px',
        fontSize: '0.9375rem', fontWeight: 800, fontFamily: 'var(--font-figtree)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 200ms ease',
        boxShadow: disabled ? 'none' : '0 4px 14px rgba(255, 183, 3, 0.35)',
        minHeight: '48px',
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
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        padding: '0.875rem 1.5rem',
        background: 'transparent',
        color: 'var(--color-neutral-700)',
        border: '1.5px solid var(--color-neutral-200)', borderRadius: '12px',
        fontSize: '0.9375rem', fontWeight: 700, fontFamily: 'var(--font-figtree)',
        cursor: 'pointer',
        transition: 'all 200ms ease',
        minHeight: '48px',
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
        .lf-primary-btn:hover:not(:disabled) { background: var(--color-cta-dark) !important; box-shadow: 0 6px 20px rgba(208, 149, 0, 0.4) !important; }
        .lf-primary-btn:active:not(:disabled) { transform: scale(0.98); }
        .lf-ghost-btn:hover { border-color: var(--color-primary-300); color: var(--color-primary-800); }
        .lf-ghost-btn:active { transform: scale(0.98); }

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

        @media (max-width: 639px) {
          .lf-form-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 50;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-top: 1px solid var(--color-neutral-200);
            padding: 0.75rem 1rem max(0.875rem, env(safe-area-inset-bottom));
            box-shadow: 0 -4px 20px rgba(2, 48, 71, 0.08);
          }
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
          padding: 0.75rem 0.5rem;
          border-radius: 12px;
          border: 2px solid var(--color-neutral-200);
          background: #fff;
          cursor: pointer;
          transition: all 200ms ease;
          flex-shrink: 0;
          min-height: 64px;
          justify-content: center;
        }
        .lf-date-chip:active:not(.lf-dc-closed) {
          transform: scale(0.95);
        }
        .lf-date-chip:hover:not(:disabled):not(.lf-dc-sel) {
          border-color: var(--color-primary-300);
          background: var(--color-primary-50);
        }
        .lf-dc-sel {
          border-color: var(--color-primary-600) !important;
          background: var(--color-primary-600) !important;
          box-shadow: 0 4px 14px rgba(33,158,188,0.28);
        }
        .lf-dc-closed { border-color: transparent !important; background: var(--color-neutral-100) !important; opacity: 0.45; cursor: not-allowed; }
        .lf-dc-day { font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.05em; color: var(--color-neutral-500); }
        .lf-dc-num { font-size: 1.25rem; font-weight: 800; font-family: var(--font-figtree); color: var(--color-neutral-900); line-height: 1; }
        .lf-dc-mon { font-size: 0.6875rem; color: var(--color-neutral-500); }
        .lf-dc-sel .lf-dc-day { color: rgba(255,255,255,0.8); }
        .lf-dc-sel .lf-dc-num { color: #fff; }
        .lf-dc-sel .lf-dc-mon { color: rgba(255,255,255,0.75); }

        /* ── Mobile scroll strip ── */
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

        /* ── Desktop carousel ── */
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

        /* ── Mobile Sheet Trigger ── */
        .mobile-sheet-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid var(--color-neutral-200);
          border-radius: 12px;
          background: #fff;
          cursor: pointer;
          text-align: left;
          transition: all 150ms ease;
          margin-top: 0.5rem;
        }
        .mobile-sheet-trigger:active {
          transform: scale(0.98);
          background: var(--color-primary-50);
        }
        @media (min-width: 640px) {
          .mobile-sheet-trigger { display: none; }
        }

        /* ── Desktop Schedule Grid ── */
        .desktop-schedule-view {
          display: none;
        }
        @media (min-width: 640px) {
          .desktop-schedule-view {
            display: block;
          }
        }

        /* ── Schedule card ── */
        .lf-sched-card {
          display: flex;
          align-items: flex-start;
          gap: 0.875rem;
          padding: 1rem 1.125rem;
          border-radius: 14px;
          border: 2px solid var(--color-neutral-200);
          background: #fff;
          cursor: pointer;
          text-align: left;
          width: 100%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          transition: all 200ms ease;
        }
        .lf-sched-card:active {
          transform: scale(0.98);
        }
        .lf-sched-card:hover:not(.lf-sched-card--sel) {
          border-color: var(--color-primary-300);
          box-shadow: 0 4px 12px rgba(33,158,188,0.1);
        }
        .lf-sched-card--sel {
          border-color: var(--color-primary-600);
          background: var(--color-primary-50);
          box-shadow: 0 0 0 4px rgba(33,158,188,0.12);
        }

        .lf-sched-icon {
          width: 40px;
          height: 40px;
          min-width: 40px;
          border-radius: 12px;
          background: var(--color-primary-100);
          color: var(--color-primary-600);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 200ms ease, color 200ms ease;
        }
        .lf-si-sel { background: var(--color-primary-600); color: #fff; }

        .lf-sched-time {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-primary-600);
        }
        .lf-sched-kuota {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #059669;
          background: #d1fae5;
          padding: 1px 6px;
          border-radius: 4px;
        }
        .lf-sched-radio {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid var(--color-neutral-300);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
          flex-shrink: 0;
          transition: all 200ms ease;
        }
        .lf-sr-sel { border-color: var(--color-primary-600); background: var(--color-primary-600); }

        /* ── Mobile Compact Verification Form ── */
        @media (max-width: 639px) {
          .lf-verify-card {
            background: transparent;
            border-radius: 0;
            border: none;
            padding: 0;
            box-shadow: none;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .lf-label {
            font-size: 0.75rem !important;
            font-weight: 700 !important;
            margin-bottom: 0.375rem !important;
          }
          .lf-hint {
            font-size: 0.6875rem !important;
            margin-top: 0.25rem !important;
          }
          .lf-input {
            padding: 0.75rem 0.875rem !important;
            font-size: 0.9375rem !important;
            border-radius: 10px !important;
          }
          .lf-turnstile-wrapper {
            background: var(--color-neutral-50);
            border: 1px solid var(--color-neutral-100);
            border-radius: 12px;
            padding: 0.75rem;
            display: flex;
            justify-content: center;
          }
        }
    `}</style>
  );
}

export default function LamaForm() {
  const router = useRouter();

  /* Draft recovery helper */
  const getInitialDraft = () => {
    if (typeof window !== 'undefined') {
      try {
        const savedDraft = sessionStorage.getItem('nganjuk_registration_draft');
        if (savedDraft) {
          return JSON.parse(savedDraft);
        }
      } catch {
        // ignore
      }
    }
    return null;
  };

  const [step, setStep] = useState<1 | 2 | 4>(() => {
    const draft = getInitialDraft();
    return draft?.verifiedPatient ? 2 : 1;
  });

  /* Verification state */
  const [verifiedPatient, setVerifiedPatient] = useState<Patient | null>(() => {
    const draft = getInitialDraft();
    return draft?.verifiedPatient || null;
  });

  /* Schedule selection state */
  const [availableDates] = useState<DateOption[]>(() => {
    const days: DateOption[] = [];
    const now = new Date();
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');

      const isSunday = d.getDay() === 0;
      const dayName = dayNames[d.getDay()];

      days.push({
        date: d,
        iso: `${yyyy}-${mm}-${dd}`,
        dayName,
        label: `${dayName}, ${d.getDate()} ${d.toLocaleDateString('id-ID', { month: 'short' })} ${yyyy}`,
        isSunday,
      });
    }
    return days;
  });
  const [selectedDate, setSelectedDate] = useState<DateOption | null>(null);
  const [dateStartIndex, setDateStartIndex] = useState(0);

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  /* Submission & feedback state */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  /* Mobile Bottom Sheet State */
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  /* Ref for PDF/Receipt image generation */
  const receiptRef = useRef<HTMLDivElement>(null);

  const triggerHaptic = (ms = 10) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // ignore
      }
    }
  };



  /* Serialize draft on state update */
  useEffect(() => {
    if (typeof window !== 'undefined' && verifiedPatient) {
      sessionStorage.setItem(
        'nganjuk_registration_draft',
        JSON.stringify({
          verifiedPatient,
          selectedDate,
          selectedSchedule,
        })
      );
    }
  }, [verifiedPatient, selectedDate, selectedSchedule]);

  const handleCancel = () => {
    triggerHaptic();
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

    triggerHaptic();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append('captcha_token', captchaToken);

    const result = await verifyOldPatient(null, formData);
    setIsSubmitting(false);
    setCaptchaToken(null);

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
    triggerHaptic(15);
    if (dateObj.isSunday) {
      toast.error('Pendaftaran tutup pada hari Minggu.');
      return;
    }
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
      toast.error('Gagal mengambil jadwal.');
      setSchedules([]);
    }
  }

  async function handleBooking() {
    if (!selectedDate || !selectedSchedule || !verifiedPatient) return;
    if (!captchaToken) {
      toast.error('Silakan selesaikan captcha terlebih dahulu.');
      return;
    }

    triggerHaptic(20);
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
    triggerHaptic();
    if (dir === 'left' && dateStartIndex > 0) setDateStartIndex(dateStartIndex - 1);
    else if (dir === 'right' && dateStartIndex < availableDates.length - 4) setDateStartIndex(dateStartIndex + 1);
  };

  const filteredSchedules = schedules.filter((s) =>
    s.nm_poli.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nm_dokter.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ── Step 4: Booking Success (Pass View) ── */
  if (step === 4 && bookingResult && verifiedPatient && selectedDate && selectedSchedule) {
    return (
      <div className="lf-success-card" style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '50%', background: '#ECFDF5', border: '2px solid #A7F3D0', marginBottom: '1.25rem' }}>
          <CheckCircle2 size={36} style={{ color: '#059669' }} />
        </div>
        <h2 style={{ fontSize: '1.625rem', fontWeight: 800, fontFamily: 'var(--font-figtree)', color: '#065F46', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Booking Berhasil!</h2>
        <p style={{ color: 'var(--color-neutral-600)', marginBottom: '2rem', fontSize: '0.9375rem' }}>Anda telah terdaftar sebagai pasien Umum.</p>

        <div style={{ background: 'var(--color-primary-900)', borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem', textAlign: 'center', boxShadow: '0 12px 30px rgba(2,48,71,0.2)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary-200)', marginBottom: '0.5rem', fontFamily: 'var(--font-figtree)' }}>Nomor Antrean Anda</p>
          <p style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--color-primary-400)', fontFamily: 'var(--font-figtree)', lineHeight: 1, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>{bookingResult.no_reg}</p>

          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem', textAlign: 'left' }}>
            {[
              { label: 'No. Rekam Medis', value: verifiedPatient.no_rkm_medis },
              { label: 'Tanggal Periksa', value: selectedDate.label },
              { label: 'Poliklinik', value: selectedSchedule.nm_poli },
              { label: 'Dokter Spesialis', value: selectedSchedule.nm_dokter },
            ].map(({ label, value }, i, arr) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', paddingBlock: '0.625rem', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-primary-200)', flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', textAlign: 'right' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lf-success-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <GhostBtn onClick={handleDownloadReceipt} style={{ border: '1.5px solid var(--color-primary-200)', color: 'var(--color-primary-900)' }}>
              <Printer size={16} /> Cetak Bukti
            </GhostBtn>
            <GhostBtn onClick={handleDownloadReceipt} style={{ border: '1.5px solid var(--color-primary-200)', color: 'var(--color-primary-900)' }}>
              <Download size={16} /> Simpan QR
            </GhostBtn>
          </div>

          <PrimaryBtn onClick={() => router.push('/')} style={{ width: '100%' }}>
            Selesai &amp; Kembali ke Beranda <ArrowRight size={16} />
          </PrimaryBtn>
        </div>

        {/* Hidden Thermal Receipt Template for PNG Export */}
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
                    <td style={{ padding: '4px 0' }}>{selectedSchedule.nm_poli}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', verticalAlign: 'top' }}>DOKTER</td>
                    <td style={{ padding: '4px 0', verticalAlign: 'top' }}>:</td>
                    <td style={{ padding: '4px 0' }}>{selectedSchedule.nm_dokter}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '11px', color: '#555' }}>
              <p style={{ margin: 0 }}>Tunjukkan bukti ini di Loket Pendaftaran</p>
              <p style={{ margin: '4px 0 0' }}>Terima kasih atas kepercayaan Anda</p>
            </div>
          </div>
        </div>
        <LamaStyles />
      </div>
    );
  }

  /* ── Step 2: Schedule & Doctor Selection ── */
  if (step === 2 && verifiedPatient) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <MobileStepHeader
          currentStep={2}
          totalSteps={2}
          stepTitle="Pilih Jadwal & Dokter"
          onBack={handleCancel}
        />

        {/* ── Verified Patient Card Header ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.875rem 1rem',
          background: 'var(--color-primary-50)',
          border: '1px solid var(--color-primary-100)',
          borderRadius: '14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <UserCheck size={16} style={{ color: '#fff' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary-600)', margin: 0, fontFamily: 'var(--font-figtree)' }}>Pasien Terverifikasi</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary-900)', fontFamily: 'var(--font-figtree)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '1px 0 0' }}>{verifiedPatient.nm_pasien}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-primary-600)', margin: '1px 0 0' }}>No. RM: {verifiedPatient.no_rkm_medis}</p>
            </div>
          </div>
          <CheckCircle2 size={18} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
        </div>

        {/* ── Date Picker ── */}
        <div>
          <p style={{ ...labelStyle, marginBottom: '0.75rem' }}>1. Pilih Tanggal Periksa</p>

          {/* Mobile horizontal scroll chip */}
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

          {/* Desktop carousel */}
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

        {/* ── Doctor & Poli Selection Section ── */}
        {selectedDate && (
          <div style={{ borderTop: '1px solid var(--color-neutral-100)', paddingTop: '1.5rem' }}>
            <p style={{ ...labelStyle, marginBottom: '0.75rem' }}>2. Pilih Poliklinik &amp; Dokter Spesialis</p>

            {/* Mobile Sheet Trigger Button */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                setIsBottomSheetOpen(true);
              }}
              className="mobile-sheet-trigger"
            >
              {selectedSchedule ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--color-primary-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Stethoscope size={18} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary-900)', margin: 0, fontFamily: 'var(--font-figtree)' }}>{selectedSchedule.nm_poli}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-neutral-600)', margin: '1px 0 0' }}>{selectedSchedule.nm_dokter}</p>
                  </div>
                </div>
              ) : (
                <span style={{ fontSize: '0.875rem', color: 'var(--color-neutral-500)', fontWeight: 500 }}>
                  Ketuk untuk memilih Poli &amp; Dokter...
                </span>
              )}
              <ChevronDown size={18} style={{ color: 'var(--color-neutral-500)', flexShrink: 0 }} />
            </button>

            {/* Desktop Schedule List View */}
            <div className="desktop-schedule-view">
              <div className="lf-sched-header" style={{ marginBottom: '1rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  height: '40px',
                  padding: '0 0.75rem',
                  borderRadius: '8px',
                  border: '1.5px solid var(--color-neutral-200)',
                  background: '#fff',
                  boxSizing: 'border-box',
                }}>
                  <Search size={14} style={{ color: 'var(--color-neutral-400)', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Cari poli atau dokter…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontSize: '0.8125rem',
                      fontFamily: 'inherit',
                      color: 'var(--color-neutral-900)',
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Hapus pencarian"
                      style={{ border: 'none', background: 'transparent', color: 'var(--color-neutral-400)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {isLoadingSchedules ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', gap: '0.75rem' }}>
                  <Loader2 size={28} style={{ color: 'var(--color-primary-600)', animation: 'lf-spin 1s linear infinite' }} />
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-500)', margin: 0 }}>Memuat jadwal dokter…</p>
                </div>
              ) : filteredSchedules.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {filteredSchedules.map((sched, i) => {
                    const sel = selectedSchedule === sched;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          triggerHaptic();
                          setSelectedSchedule(sched);
                        }}
                        className={`lf-sched-card${sel ? ' lf-sched-card--sel' : ''}`}
                      >
                        <div className={`lf-sched-icon${sel ? ' lf-si-sel' : ''}`}>
                          <Stethoscope size={18} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                          <p style={{ fontSize: '0.9375rem', fontWeight: 700, fontFamily: 'var(--font-figtree)', color: sel ? 'var(--color-primary-900)' : 'var(--color-neutral-900)', margin: 0 }}>{sched.nm_poli}</p>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-600)', margin: '2px 0 0' }}>{sched.nm_dokter}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '4px' }}>
                            <span className="lf-sched-time">
                              <Clock size={11} /> {sched.jam_mulai.substring(0, 5)} – {sched.jam_selesai.substring(0, 5)}
                            </span>
                            {sched.kuota > 0 && <span className="lf-sched-kuota">{sched.kuota} slot</span>}
                          </div>
                        </div>
                        <div className={`lf-sched-radio${sel ? ' lf-sr-sel' : ''}`}>
                          {sel && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--color-neutral-50)', borderRadius: '12px', border: '1.5px dashed var(--color-neutral-200)' }}>
                  <Calendar size={24} style={{ color: 'var(--color-neutral-400)', marginBottom: '0.5rem' }} />
                  <p style={{ color: 'var(--color-neutral-600)', fontSize: '0.875rem', margin: 0 }}>Tidak ada jadwal dokter pada tanggal ini.</p>
                </div>
              )}
            </div>

            {/* Mobile Bottom Sheet Modal Component */}
            <MobileBottomSheet
              isOpen={isBottomSheetOpen}
              onClose={() => setIsBottomSheetOpen(false)}
              title="Pilih Poliklinik & Dokter"
              searchQuery={searchQuery}
              onSearchChange={(q) => setSearchQuery(q)}
              schedules={filteredSchedules}
              selectedSchedule={selectedSchedule}
              onSelectSchedule={(sched) => setSelectedSchedule(sched)}
              isLoading={isLoadingSchedules}
            />
          </div>
        )}

        <div style={{ marginTop: '0.5rem' }}>
          <Turnstile onVerify={(token) => setCaptchaToken(token)} />
        </div>

        {/* ── Form Actions Sticky Mobile Footer ── */}
        <div className="lf-form-footer">
          <PrimaryBtn onClick={handleBooking} disabled={!selectedSchedule || isSubmitting}>
            {isSubmitting ? (
              <><Loader2 size={16} style={{ animation: 'lf-spin 1s linear infinite' }} /> Memproses…</>
            ) : (
              <>Konfirmasi Booking <ArrowRight size={16} /></>
            )}
          </PrimaryBtn>
          <GhostBtn onClick={handleCancel}>
            <ArrowLeft size={16} /> Batal
          </GhostBtn>
        </div>

        <LamaStyles />
      </div>
    );
  }

  /* ── Step 1: Patient Verification ── */
  return (
    <form onSubmit={handleVerify} className="lf-verify-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <MobileStepHeader
        currentStep={1}
        totalSteps={2}
        stepTitle="Verifikasi Identitas Pasien"
        showBack={false}
      />

      <div className="lf-verify-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FieldGroup label="Nomor KTP (NIK)" required hint="16 digit NIK sesuai e-KTP.">
            <input
              id="no_ktp"
              name="no_ktp"
              type="number"
              required
              placeholder="16 digit angka NIK"
              style={inputStyle}
              className="lf-input"
            />
          </FieldGroup>

          <FieldGroup label="Tanggal Lahir" required hint="Sesuai data rekam medis Anda.">
            <input
              id="tgl_lahir"
              name="tgl_lahir"
              type="date"
              required
              style={inputStyle}
              className="lf-input"
            />
          </FieldGroup>
        </div>

        <div className="lf-turnstile-wrapper">
          <Turnstile onVerify={(token) => setCaptchaToken(token)} />
        </div>

        {error && (
          <div className="lf-error-banner" style={{
            background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '10px', padding: '0.625rem 0.875rem',
            display: 'flex', alignItems: 'center', gap: '0.625rem', color: '#991b1b',
            animation: 'lf-slideDown 300ms ease', marginTop: '0.25rem'
          }}>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, lineHeight: 1.4 }}>{error}</div>
          </div>
        )}
      </div>

      <div className="lf-form-footer">
        <PrimaryBtn type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <><Loader2 size={16} style={{ animation: 'lf-spin 1s linear infinite' }} /> Memverifikasi...</>
          ) : (
            <>Verifikasi Data <ArrowRight size={16} /></>
          )}
        </PrimaryBtn>
        <GhostBtn onClick={() => router.back()}>
          <ArrowLeft size={16} /> Kembali
        </GhostBtn>
      </div>

      <LamaStyles />
    </form>
  );
}
