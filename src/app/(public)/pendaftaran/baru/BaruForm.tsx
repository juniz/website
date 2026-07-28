'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { submitPreRegistration, getSchedulesByDay } from '@/app/actions/pre-registration';
import { Loader2, ArrowLeft, ArrowRight, AlertTriangle, UserCheck, X, Calendar, Search, Stethoscope, Clock, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import Turnstile from '@/components/common/Turnstile';
import MobileStepHeader from '@/components/pendaftaran/MobileStepHeader';
import MobileBottomSheet from '@/components/pendaftaran/MobileBottomSheet';
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
      <label style={labelStyle}>{label}{required && reqMark}</label>
      {children}
      {hint && <p style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)', marginTop: '0.375rem' }}>{hint}</p>}
    </div>
  );
}

function BookingStyles() {
  return (
    <style>{`
        .bf-input:focus { border-color: var(--color-primary-400); box-shadow: 0 0 0 3px rgba(55,138,221,0.15); outline: none; }
        .bf-primary-btn:hover:not(:disabled) { background: var(--color-cta-dark) !important; box-shadow: 0 6px 20px rgba(208,149,0,0.4) !important; }
        .bf-primary-btn:active:not(:disabled) { transform: scale(0.98); }
        .bf-ghost-btn:hover { border-color: var(--color-primary-300); color: var(--color-primary-800); }
        .bf-ghost-btn:active { transform: scale(0.98); }
        @keyframes bf-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .bf-form-footer {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 0.75rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--color-neutral-100);
        }

        @media (max-width: 639px) {
          .bf-form-footer {
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
        .bf-date-chip:active:not(.bf-dc-closed) {
          transform: scale(0.95);
        }
        .bf-date-chip:hover:not(:disabled):not(.bf-dc-sel) {
          border-color: var(--color-primary-300);
          background: var(--color-primary-50);
        }
        .bf-dc-sel {
          border-color: var(--color-primary-600) !important;
          background: var(--color-primary-600) !important;
          box-shadow: 0 4px 14px rgba(33,158,188,0.28);
        }
        .bf-dc-closed { border-color: transparent !important; background: var(--color-neutral-100) !important; opacity: 0.45; cursor: not-allowed; }
        .bf-dc-day { font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.05em; color: var(--color-neutral-500); }
        .bf-dc-num { font-size: 1.25rem; font-weight: 800; font-family: var(--font-figtree); color: var(--color-neutral-900); line-height: 1; }
        .bf-dc-mon { font-size: 0.6875rem; color: var(--color-neutral-500); }
        .bf-dc-sel .bf-dc-day { color: rgba(255,255,255,0.8); }
        .bf-dc-sel .bf-dc-num { color: #fff; }
        .bf-dc-sel .bf-dc-mon { color: rgba(255,255,255,0.75); }

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

        .bf-date-arrow {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1.5px solid var(--color-neutral-200);
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 200ms ease, background 200ms ease;
        }
        .bf-date-arrow:not(:disabled):hover { border-color: var(--color-primary-300); background: var(--color-primary-50); }

        .mobile-sheet-trigger-bf {
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
        .mobile-sheet-trigger-bf:active {
          transform: scale(0.98);
          background: var(--color-primary-50);
        }
        @media (min-width: 640px) {
          .mobile-sheet-trigger-bf { display: none; }
        }

        .desktop-schedule-view-bf {
          display: none;
        }
        @media (min-width: 640px) {
          .desktop-schedule-view-bf {
            display: block;
          }
        }

        .bf-sched-card {
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
        .bf-sched-card:active {
          transform: scale(0.98);
        }
        .bf-sched-card:hover:not(.bf-sched-card--sel) {
          border-color: var(--color-primary-300);
          box-shadow: 0 4px 12px rgba(33,158,188,0.1);
        }
        .bf-sched-card--sel {
          border-color: var(--color-primary-600);
          background: var(--color-primary-50);
          box-shadow: 0 0 0 4px rgba(33,158,188,0.12);
        }

        .bf-sched-icon {
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
        .bf-si-sel { background: var(--color-primary-600); color: #fff; }

        .bf-sched-time {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-primary-600);
        }
        .bf-sched-radio {
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
        .bf-sr-sel { border-color: var(--color-primary-600); background: var(--color-primary-600); }
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
  const [availableDates] = useState<DateOption[]>(() => {
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
    return dates;
  });
  const [dateStartIndex, setDateStartIndex] = useState<number>(0);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState<boolean>(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mobile Bottom Sheet State
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // Saved form data from Step 1
  const [savedData, setSavedData] = useState<Record<string, string>>({});

  const triggerHaptic = (ms = 10) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // ignore
      }
    }
  };

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
  }, [router]);

  async function handleNextStep(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    triggerHaptic();
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
    triggerHaptic(15);
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
    triggerHaptic();
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

    triggerHaptic(20);
    setIsSubmitting(true);

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

  // Service disabled notice rendering
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
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-neutral-600)', lineHeight: 1.6, margin: 0 }}>
          Maaf, saat ini pendaftaran online untuk pasien baru sedang tidak tersedia. <br />
          Silakan datang langsung ke pendaftaran RS Bhayangkara Nganjuk untuk mendaftar.
        </p>
      </div>
      <button
        onClick={() => router.push('/pendaftaran')}
        style={{
          marginTop: '0.5rem', padding: '0.875rem 1.75rem', background: 'var(--color-cta)',
          color: 'var(--color-cta-text)', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(255,183,3,0.35)', minHeight: '48px'
        }}
      >
        Kembali ke Beranda
      </button>
    </div>
  );
}
