'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { agreeToConsent } from '@/app/actions/pre-registration';
import { Loader2, ArrowRight, CheckCircle2, UserPlus, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function ConsentForm() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [pasienType, setPasienType] = useState<'baru' | 'lama'>('baru');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreed) {
      toast.error('Anda harus menyetujui syarat & ketentuan.');
      return;
    }

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
    <form onSubmit={handleSubmit}>

      {/* ── Consent Toggle ── */}
      <button
        type="button"
        role="checkbox"
        aria-checked={agreed}
        onClick={() => setAgreed(!agreed)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
          padding: '1.25rem 1.5rem',
          background: agreed ? 'rgba(24, 95, 165, 0.06)' : '#fff',
          border: `2px solid ${agreed ? 'var(--color-primary-400)' : 'var(--color-neutral-200)'}`,
          borderRadius: '14px',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'border-color 200ms ease, background 200ms ease, box-shadow 200ms ease',
          boxShadow: agreed ? '0 0 0 4px rgba(55, 138, 221, 0.12)' : 'none',
          marginBottom: '1.75rem',
        }}
      >
        {/* Custom checkbox visual */}
        <div style={{
          flexShrink: 0,
          width: '22px',
          height: '22px',
          borderRadius: '6px',
          border: `2px solid ${agreed ? 'var(--color-primary-500)' : 'var(--color-neutral-300)'}`,
          background: agreed ? 'var(--color-primary-600)' : '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 200ms ease',
          marginTop: '1px',
        }}>
          {agreed && (
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
              <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: agreed ? 'var(--color-primary-800)' : 'var(--color-neutral-800)',
            fontFamily: 'var(--font-figtree)',
            margin: '0 0 0.25rem',
            transition: 'color 200ms ease',
          }}>
            Saya menyetujui Syarat dan Ketentuan di atas
          </p>
          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--color-neutral-500)',
            margin: 0,
            lineHeight: 1.5,
          }}>
            Persetujuan Anda akan dicatat dan disimpan untuk keperluan rekam medis.
          </p>
        </div>

        {agreed && (
          <CheckCircle2 size={20} style={{ color: 'var(--color-primary-500)', flexShrink: 0, marginTop: '1px' }} />
        )}
      </button>

      {/* ── Patient Type Selection ── */}
      <div
        style={{
          overflow: 'hidden',
          maxHeight: agreed ? '300px' : '0px',
          opacity: agreed ? 1 : 0,
          transition: 'max-height 350ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease',
          marginBottom: agreed ? '2rem' : '0',
        }}
      >
        <p style={{
          fontSize: '0.875rem',
          fontWeight: 700,
          color: 'var(--color-primary-900)',
          fontFamily: 'var(--font-figtree)',
          letterSpacing: '0.01em',
          marginBottom: '0.875rem',
        }}>
          Apakah Anda sudah pernah berobat di RS Bhayangkara Nganjuk?
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
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
                onClick={() => !disabled && setPasienType(value)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '1.25rem 1rem',
                  background: selected ? 'var(--color-primary-600)' : '#fff',
                  border: `2px solid ${selected ? 'var(--color-primary-600)' : 'var(--color-neutral-200)'}`,
                  borderRadius: '14px',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 200ms ease',
                  boxShadow: selected ? '0 4px 16px rgba(24, 95, 165, 0.25)' : '0 1px 3px rgba(0,0,0,0.04)',
                  textAlign: 'center',
                  opacity: disabled ? 0.6 : 1,
                  position: 'relative',
                }}
                className="patient-type-btn"
              >
                {disabled && (
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    background: 'var(--color-neutral-200)',
                    color: 'var(--color-neutral-600)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}>
                    Nonaktif
                  </span>
                )}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: selected ? 'rgba(255,255,255,0.2)' : 'var(--color-primary-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 200ms ease',
                }}>
                  <Icon size={20} style={{ color: selected ? '#fff' : 'var(--color-primary-600)' }} />
                </div>
                <div>
                  <p style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: selected ? '#fff' : 'var(--color-neutral-800)',
                    fontFamily: 'var(--font-figtree)',
                    margin: '0 0 2px',
                    transition: 'color 200ms ease',
                  }}>
                    {label}
                  </p>
                  <p style={{
                    fontSize: '0.75rem',
                    color: selected ? 'rgba(255,255,255,0.75)' : 'var(--color-neutral-500)',
                    margin: 0,
                    transition: 'color 200ms ease',
                  }}>
                    {disabled ? 'Maaf, layanan ditutup sementara' : sub}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={!agreed || isSubmitting}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.625rem',
          padding: '0.9375rem 2rem',
          background: !agreed || isSubmitting
            ? 'var(--color-neutral-200)'
            : 'var(--color-primary-600)',
          color: !agreed || isSubmitting ? 'var(--color-neutral-400)' : '#fff',
          border: 'none',
          borderRadius: '12px',
          fontSize: '0.9375rem',
          fontWeight: 700,
          fontFamily: 'var(--font-figtree)',
          letterSpacing: '0.01em',
          cursor: !agreed || isSubmitting ? 'not-allowed' : 'pointer',
          transition: 'background 200ms ease, box-shadow 200ms ease, transform 150ms ease, color 200ms ease',
          boxShadow: !agreed || isSubmitting ? 'none' : '0 4px 14px rgba(24, 95, 165, 0.35)',
        }}
        className={agreed && !isSubmitting ? 'submit-btn-active' : ''}
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

      <style>{`
        .submit-btn-active:hover {
          background: var(--color-primary-800) !important;
          box-shadow: 0 6px 20px rgba(24, 95, 165, 0.4) !important;
          transform: translateY(-1px);
        }
        .submit-btn-active:active {
          transform: translateY(0);
        }
        .patient-type-btn:focus-visible {
          outline: 2.5px solid var(--color-primary-400);
          outline-offset: 2px;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}
