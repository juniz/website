'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { submitPreRegistration } from '@/app/actions/pre-registration';
import { Loader2, ArrowLeft, ArrowRight, AlertTriangle, UserCheck, X } from 'lucide-react';
import { toast } from 'sonner';
import Turnstile from '@/components/common/Turnstile';

const inputStyle = {
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

const labelStyle = {
  display: 'block',
  fontSize: '0.8125rem',
  fontWeight: 700,
  color: 'var(--color-primary-900)',
  marginBottom: '0.5rem',
  fontFamily: 'var(--font-figtree)',
  letterSpacing: '0.01em',
};

const reqMark = <span style={{ color: 'var(--color-accent)', marginLeft: '2px' }}>*</span>;

function FieldGroup({ label, required, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={labelStyle}>{label}{required && reqMark}</label>
      {children}
      {hint && <p style={{ fontSize: '0.75rem', color: 'var(--color-neutral-400)', marginTop: '0.375rem' }}>{hint}</p>}
    </div>
  );
}

export default function BaruForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentId, setConsentId] = useState(null);
  const [jk, setJk] = useState('L');
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!consentId) return;
    if (!captchaToken) {
      toast.error('Silakan selesaikan captcha terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.target);
    formData.append('consent_id', consentId);
    formData.append('captcha_token', captchaToken);

    const result = await submitPreRegistration(null, formData);
    setIsSubmitting(false);
    if (result.success) {
      toast.success('Pendaftaran berhasil!');
      sessionStorage.removeItem('consent_id');
      router.push(`/pendaftaran/qr?token=${result.data.qr_token}`);
    } else {
      // Check if duplicate NIK error (usually contains "sudah terdaftar")
      if (result.message && result.message.toLowerCase().includes('sudah terdaftar')) {
        setShowDuplicateAlert(true);
      } else {
        toast.error(result.message || 'Gagal mengirim data.');
      }
    }
  }

  if (!consentId) return null;

  return (
    <>
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      <FieldGroup label="Nama Lengkap Pasien" required>
        <input id="nm_pasien" name="nm_pasien" required placeholder="Sesuai KTP" style={inputStyle} className="bf-input" />
      </FieldGroup>

      <FieldGroup label="Nomor KTP (NIK)" required>
        <input id="no_ktp" name="no_ktp" type="number" required placeholder="16 digit angka" style={inputStyle} className="bf-input" />
      </FieldGroup>

      <div className="bf-grid-row">
        <FieldGroup label="Tanggal Lahir" required>
          <input id="tgl_lahir" name="tgl_lahir" type="date" required style={inputStyle} className="bf-input" />
        </FieldGroup>

        <FieldGroup label="Jenis Kelamin" required>
          {/* Hidden input carries the value */}
          <input type="hidden" name="jk" value={jk} />
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            {[{ value: 'L', label: 'Laki-laki' }, { value: 'P', label: 'Perempuan' }].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setJk(opt.value)}
                style={{
                  flex: 1,
                  padding: '0.75rem 0.5rem',
                  borderRadius: '10px',
                  border: `2px solid ${jk === opt.value ? 'var(--color-primary-500)' : 'var(--color-neutral-200)'}`,
                  background: jk === opt.value ? 'rgba(24,95,165,0.06)' : '#fff',
                  color: jk === opt.value ? 'var(--color-primary-800)' : 'var(--color-neutral-600)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-figtree)',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  boxShadow: jk === opt.value ? '0 0 0 3px rgba(55,138,221,0.12)' : 'none',
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

      <FieldGroup label="Nomor WhatsApp" required hint="QR Code antrean akan dikirimkan ke nomor ini.">
        <input id="no_wa" name="no_wa" type="tel" required placeholder="Contoh: 08123456789" style={inputStyle} className="bf-input" />
      </FieldGroup>

      <FieldGroup label="Alamat Lengkap">
        <textarea
          id="alamat"
          name="alamat"
          placeholder="Alamat sesuai domisili"
          rows={3}
          style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }}
          className="bf-input"
        />
      </FieldGroup>

      <div style={{ marginTop: '0.5rem' }}>
        <Turnstile onVerify={(token) => setCaptchaToken(token)} />
      </div>

      <div className="bf-form-footer">
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.875rem 1.5rem',
            background: 'transparent',
            color: 'var(--color-neutral-600)',
            border: '1.5px solid var(--color-neutral-200)', borderRadius: '10px',
            fontSize: '0.9375rem', fontWeight: 600, fontFamily: 'var(--font-figtree)',
            cursor: 'pointer', transition: 'border-color 200ms ease, color 200ms ease',
          }}
          className="bf-ghost-btn"
        >
          <ArrowLeft size={16} /> Kembali
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.875rem 1.75rem',
            background: isSubmitting ? 'var(--color-neutral-200)' : 'var(--color-primary-600)',
            color: isSubmitting ? 'var(--color-neutral-400)' : '#fff',
            border: 'none', borderRadius: '10px',
            fontSize: '0.9375rem', fontWeight: 700, fontFamily: 'var(--font-figtree)',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'background 200ms ease, box-shadow 200ms ease',
            boxShadow: isSubmitting ? 'none' : '0 4px 14px rgba(24,95,165,0.3)',
          }}
          className={isSubmitting ? '' : 'bf-primary-btn'}
        >
          {isSubmitting
            ? <><Loader2 size={16} style={{ animation: 'bf-spin 1s linear infinite' }} /> Menyimpan...</>
            : <>Simpan Data <ArrowRight size={16} /></>
          }
        </button>
      </div>
      </form>

    {/* Duplicate NIK Alert Dialog */}
    {showDuplicateAlert && (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem', background: 'rgba(4,44,83,0.6)',
        backdropFilter: 'blur(4px)',
        animation: 'bf-fadein 200ms ease'
      }}>
        <div style={{
          background: '#fff', width: '100%', maxWidth: '440px',
          borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          overflow: 'hidden', animation: 'bf-slideup 300ms ease'
        }}>
          {/* Header */}
          <div style={{
            background: '#FFFBEB', padding: '1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '4px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}>
              <AlertTriangle size={32} style={{ color: '#D97706' }} />
            </div>
            <button 
              onClick={() => setShowDuplicateAlert(false)}
              style={{
                position: 'absolute', right: '1rem', top: '1rem',
                border: 'none', background: 'rgba(0,0,0,0.05)',
                width: '32px', height: '32px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#92400E'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '1.5rem 2rem', textAlign: 'center' }}>
            <h3 style={{
              fontSize: '1.375rem', fontWeight: 800, color: '#92400E',
              fontFamily: 'var(--font-figtree)', marginBottom: '0.75rem', letterSpacing: '-0.02em'
            }}>
              NIK Sudah Terdaftar
            </h3>
            <p style={{ fontSize: '0.9375rem', color: '#B45309', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Data Anda sudah ada dalam sistem kami. Silakan pilih menu <strong>Pasien Lama</strong> untuk melakukan booking jadwal dokter secara langsung.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => router.push('/pendaftaran/lama')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                  padding: '1rem', background: 'var(--color-primary-600)', color: '#fff',
                  border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700,
                  fontFamily: 'var(--font-figtree)', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(24,95,165,0.3)', transition: 'all 200ms ease'
                }}
                className="bf-primary-btn"
              >
                <UserCheck size={20} /> Ke Pendaftaran Pasien Lama
              </button>
              
              <button
                onClick={() => setShowDuplicateAlert(false)}
                style={{
                  padding: '0.875rem', background: 'transparent', color: 'var(--color-neutral-500)',
                  border: 'none', fontSize: '0.875rem', fontWeight: 600,
                  fontFamily: 'var(--font-figtree)', cursor: 'pointer'
                }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

      <style>{`
        @keyframes bf-fadein { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bf-slideup { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .bf-input:focus { border-color: var(--color-primary-400); box-shadow: 0 0 0 3px rgba(55,138,221,0.15); }
        .bf-primary-btn:hover { background: var(--color-primary-800) !important; box-shadow: 0 6px 20px rgba(24,95,165,0.4) !important; }
        .bf-ghost-btn:hover { border-color: var(--color-primary-300); color: var(--color-primary-700); }
        
        .bf-grid-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        .bf-form-footer {
          display: flex;
          flex-direction: column-reverse;
          gap: 0.75rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--color-neutral-100);
        }

        @media (min-width: 640px) {
          .bf-grid-row {
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
          .bf-form-footer {
            flex-direction: row;
            justify-content: space-between;
          }
          .bf-form-footer button {
            width: auto;
          }
        }

        .bf-form-footer button {
          width: 100%;
          justify-content: center;
        }

        @keyframes bf-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
