'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { agreeToConsent } from '@/app/actions/pre-registration';
import { Loader2, ArrowRight, CheckCircle2, UserPlus, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function ConsentForm() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [pasienType, setPasienType] = useState<'baru' | 'lama'>('lama');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // ignore
      }
    }
  };

  const handleAgreeToggle = () => {
    triggerHaptic();
    setAgreed(!agreed);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreed) {
      toast.error('Anda harus menyetujui syarat & ketentuan.');
      return;
    }

    triggerHaptic();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('pasien_type', pasienType);

    const result = await agreeToConsent(null, formData);
    setIsSubmitting(false);

    if (result.success && result.data) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('consent_id', result.data.id);
      }
      router.push(pasienType === 'baru' ? '/pendaftaran/baru' : '/pendaftaran/lama');
    } else {
      toast.error(result.message || 'Terjadi kesalahan.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="consent-form-wrapper">

      {/* ── Consent Toggle Card ── */}
      <button
        type="button"
        role="checkbox"
        aria-checked={agreed}
        onClick={handleAgreeToggle}
        className={`consent-card ${agreed ? 'consent-card--active' : ''}`}
      >
        {/* Custom checkbox visual */}
        <div className={`consent-checkbox ${agreed ? 'consent-checkbox--checked' : ''}`}>
          {agreed && (
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
              <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <p className="consent-card-title">
            Saya menyetujui Syarat dan Ketentuan di atas
          </p>
          <p className="consent-card-desc">
            Persetujuan Anda akan dicatat dan disimpan untuk keperluan rekam medis.
          </p>
        </div>

        {agreed && (
          <CheckCircle2 size={20} style={{ color: 'var(--color-primary-600)', flexShrink: 0, marginTop: '1px' }} />
        )}
      </button>

      {/* ── Patient Type Selection ── */}
      <div
        className="patient-type-section"
        style={{
          maxHeight: agreed ? '340px' : '0px',
          opacity: agreed ? 1 : 0,
          marginBottom: agreed ? '2rem' : '0',
        }}
      >
        <p className="patient-type-label">
          Apakah Anda sudah pernah berobat di RS Bhayangkara Nganjuk?
        </p>

        <div className="patient-type-grid">
          {[
            {
              value: 'baru' as const,
              icon: UserPlus,
              label: 'Belum Pernah',
              sub: 'Pasien Baru',
              disabled: true,
            },
            {
              value: 'lama' as const,
              icon: UserCheck,
              label: 'Sudah Pernah',
              sub: 'Pasien Lama',
              disabled: false,
            },
          ].map(({ value, icon: Icon, label, sub, disabled }) => {
            const selected = pasienType === value;
            return (
              <button
                key={value}
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (!disabled) {
                    triggerHaptic();
                    setPasienType(value);
                  }
                }}
                className={`patient-type-btn ${selected ? 'patient-type-btn--selected' : ''} ${disabled ? 'patient-type-btn--disabled' : ''}`}
              >
                {disabled && (
                  <span className="disabled-badge">
                    Nonaktif
                  </span>
                )}
                <div className={`patient-type-icon-box ${selected ? 'patient-type-icon-box--selected' : ''}`}>
                  <Icon size={20} style={{ color: selected ? '#fff' : 'var(--color-primary-600)' }} />
                </div>
                <div>
                  <p className="patient-type-btn-title">
                    {label}
                  </p>
                  <p className="patient-type-btn-sub">
                    {disabled ? 'Layanan ditutup sementara' : sub}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Sticky Mobile Action Bar Container ── */}
      <div className="mobile-action-sticky-bar">
        <button
          type="submit"
          disabled={!agreed || isSubmitting}
          className={`submit-btn ${agreed && !isSubmitting ? 'submit-btn-active' : ''}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              Memproses...
            </>
          ) : (
            <>
              Lanjutkan Pendaftaran
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        .consent-form-wrapper {
          display: flex;
          flex-direction: column;
        }

        .consent-card {
          width: 100%;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          background: #fff;
          border: 2px solid var(--color-neutral-200);
          border-radius: 16px;
          cursor: pointer;
          text-align: left;
          box-sizing: border-box;
          transition: all 200ms ease;
          margin-bottom: 1.75rem;
        }

        .consent-card:active {
          transform: scale(0.985);
        }

        .consent-card--active {
          background: var(--color-primary-50);
          border-color: var(--color-primary-600);
          box-shadow: 0 4px 16px rgba(33, 158, 188, 0.12);
        }

        .consent-checkbox {
          flex-shrink: 0;
          width: 22px;
          height: 22px;
          border-radius: 6px;
          border: 2px solid var(--color-neutral-300);
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 200ms ease;
          margin-top: 1px;
        }

        .consent-checkbox--checked {
          border-color: var(--color-primary-600);
          background: var(--color-primary-600);
        }

        .consent-card-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--color-primary-900);
          font-family: var(--font-figtree);
          margin: 0 0 0.25rem;
        }

        .consent-card-desc {
          font-size: 0.8125rem;
          color: var(--color-neutral-600);
          margin: 0;
          line-height: 1.5;
        }

        .patient-type-section {
          overflow: hidden;
          transition: max-height 350ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease;
        }

        .patient-type-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--color-primary-900);
          font-family: var(--font-figtree);
          margin-bottom: 0.875rem;
        }

        .patient-type-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.875rem;
        }

        .patient-type-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.625rem;
          padding: 1.25rem 1rem;
          background: #fff;
          border: 2px solid var(--color-neutral-200);
          border-radius: 16px;
          cursor: pointer;
          transition: all 200ms ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          text-align: center;
          position: relative;
        }

        .patient-type-btn:active:not(.patient-type-btn--disabled) {
          transform: scale(0.96);
        }

        .patient-type-btn--selected {
          background: var(--color-primary-600);
          border-color: var(--color-primary-600);
          box-shadow: 0 6px 20px rgba(33, 158, 188, 0.3);
        }

        .patient-type-btn--disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .disabled-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 0.625rem;
          font-weight: 800;
          background: var(--color-neutral-200);
          color: var(--color-neutral-600);
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .patient-type-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--color-primary-50);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 200ms ease;
        }

        .patient-type-icon-box--selected {
          background: rgba(255, 255, 255, 0.2);
        }

        .patient-type-btn-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--color-neutral-900);
          font-family: var(--font-figtree);
          margin: 0 0 2px;
        }

        .patient-type-btn--selected .patient-type-btn-title {
          color: #ffffff;
        }

        .patient-type-btn-sub {
          font-size: 0.75rem;
          color: var(--color-neutral-600);
          margin: 0;
        }

        .patient-type-btn--selected .patient-type-btn-sub {
          color: rgba(255, 255, 255, 0.85);
        }

        .mobile-action-sticky-bar {
          margin-top: 1rem;
        }

        @media (max-width: 639px) {
          .mobile-action-sticky-bar {
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
            margin: 0;
          }
        }

        .submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.625rem;
          padding: 0.9375rem 2rem;
          background: var(--color-neutral-200);
          color: var(--color-neutral-400);
          border: none;
          border-radius: 14px;
          font-size: 0.9375rem;
          font-weight: 800;
          font-family: var(--font-figtree);
          cursor: not-allowed;
          transition: all 200ms ease;
          box-sizing: border-box;
          min-height: 48px;
        }

        .submit-btn-active {
          background: var(--color-cta) !important;
          color: var(--color-cta-text) !important;
          cursor: pointer !important;
          box-shadow: 0 4px 16px rgba(255, 183, 3, 0.35) !important;
        }

        .submit-btn-active:active {
          transform: scale(0.98);
          background: var(--color-cta-dark) !important;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}
