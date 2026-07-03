'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { getQrStatus } from '@/app/actions/pre-registration';
import { AlertCircle, CheckCircle2, Loader2, Home, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type StatusType = 'pending' | 'scanned' | 'transferred' | 'expired' | 'error';

const STATUS = {
  PENDING: 'pending' as StatusType,
  SCANNED: 'scanned' as StatusType,
  TRANSFERRED: 'transferred' as StatusType,
  EXPIRED: 'expired' as StatusType,
  ERROR: 'error' as StatusType,
};

interface QrDisplayProps {
  token?: string;
}

export default function QrDisplay({ token }: QrDisplayProps) {
  const [status, setStatus] = useState<StatusType>(STATUS.PENDING);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (!token) {
        setStatus(STATUS.ERROR);
        setLoading(false);
        return;
      }
      const res = await getQrStatus(token);
      setStatus(res.success && res.data ? res.data.status : STATUS.ERROR);
      setLoading(false);
    };

    check();
    const iv = setInterval(() => {
      if (status === STATUS.PENDING || status === STATUS.SCANNED) check();
    }, 5000);
    return () => clearInterval(iv);
  }, [token, status]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <Loader2 size={36} style={{ color: 'var(--color-primary-400)', animation: 'qr-spin 1s linear infinite', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--color-neutral-500)', fontSize: '0.9375rem' }}>Memuat status QR Code...</p>
        <style>{`@keyframes qr-spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  /* ── Error ── */
  if (status === STATUS.ERROR) {
    return (
      <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', border: '1px solid #FECACA', boxShadow: '0 20px 60px rgba(4,44,83,0.08)' }}>
        <div style={{ background: 'linear-gradient(to bottom, #FEF2F2, #fff)', borderBottom: '1px solid #FECACA', padding: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', background: '#FEE2E2', marginBottom: '1rem' }}>
            <AlertCircle size={28} style={{ color: '#DC2626' }} />
          </div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, fontFamily: 'var(--font-figtree)', color: '#991B1B', marginBottom: '0.5rem' }}>QR Code Tidak Valid</h2>
          <p style={{ color: '#B91C1C', fontSize: '0.9375rem' }}>Token tidak ditemukan atau sudah kedaluwarsa.</p>
        </div>
        <div style={{ padding: '1.75rem' }}>
          <Link href="/pendaftaran" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.875rem', background: 'var(--color-primary-600)', color: '#fff', borderRadius: '10px', fontWeight: 700, fontFamily: 'var(--font-figtree)', textDecoration: 'none', fontSize: '0.9375rem', boxShadow: '0 4px 14px rgba(24,95,165,0.3)' }}>
            Kembali ke Pendaftaran <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  /* ── Success / Transferred ── */
  if (status === STATUS.TRANSFERRED) {
    return (
      <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', border: '1px solid #A7F3D0', boxShadow: '0 20px 60px rgba(4,44,83,0.08)' }}>
        <div style={{ background: 'linear-gradient(to bottom, #ECFDF5, #fff)', borderBottom: '1px solid #A7F3D0', padding: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '50%', background: '#D1FAE5', border: '2px solid #A7F3D0', marginBottom: '1.25rem' }}>
            <CheckCircle2 size={36} style={{ color: '#059669' }} />
          </div>
          <h2 style={{ fontSize: '1.625rem', fontWeight: 800, fontFamily: 'var(--font-figtree)', color: '#065F46', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Pendaftaran Berhasil!</h2>
          <p style={{ color: '#047857', fontSize: '0.9375rem' }}>Data Anda telah masuk ke sistem antrean Rumah Sakit.</p>
        </div>
        <div style={{ padding: '1.75rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.875rem', background: 'var(--color-primary-600)', color: '#fff', borderRadius: '10px', fontWeight: 700, fontFamily: 'var(--font-figtree)', textDecoration: 'none', fontSize: '0.9375rem', boxShadow: '0 4px 14px rgba(24,95,165,0.3)' }}>
            <Home size={16} /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  /* ── Expired ── */
  if (status === STATUS.EXPIRED) {
    return (
      <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', border: '1px solid #FECACA', boxShadow: '0 20px 60px rgba(4,44,83,0.08)' }}>
        <div style={{ background: 'linear-gradient(to bottom, #FEF2F2, #fff)', borderBottom: '1px solid #FECACA', padding: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', background: '#FEE2E2', marginBottom: '1rem' }}>
            <AlertCircle size={28} style={{ color: '#DC2626' }} />
          </div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, fontFamily: 'var(--font-figtree)', color: '#991B1B', marginBottom: '0.5rem' }}>QR Code Kedaluwarsa</h2>
          <p style={{ color: '#B91C1C', fontSize: '0.9375rem' }}>Masa berlaku QR Code ini sudah habis (maks. 3 hari). Silakan daftar ulang.</p>
        </div>
        <div style={{ padding: '1.75rem' }}>
          <Link href="/pendaftaran" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.875rem', background: 'var(--color-primary-600)', color: '#fff', borderRadius: '10px', fontWeight: 700, fontFamily: 'var(--font-figtree)', textDecoration: 'none', fontSize: '0.9375rem', boxShadow: '0 4px 14px rgba(24,95,165,0.3)' }}>
            Daftar Ulang <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  /* ── Pending / Scanned — show QR ── */
  return (
    <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(4,44,83,0.1)', border: '1px solid var(--color-neutral-200)' }}>
      {/* QR Code */}
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--color-neutral-200)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          {token && (
            <QRCodeSVG value={token} size={220} level="H" includeMargin={false} />
          )}
        </div>

        {/* Status strip */}
        {status === STATUS.PENDING && (
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1rem 1.25rem', background: 'var(--color-primary-50)', border: '1px solid var(--color-primary-100)', borderRadius: '12px' }}>
            <Loader2 size={18} style={{ color: 'var(--color-primary-500)', flexShrink: 0, animation: 'qr-spin 1s linear infinite' }} />
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary-800)', fontFamily: 'var(--font-figtree)', margin: 0 }}>Menunggu proses scan di loket...</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-primary-600)', margin: 0, marginTop: '2px' }}>Halaman ini akan otomatis diperbarui.</p>
            </div>
          </div>
        )}

        {status === STATUS.SCANNED && (
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1rem 1.25rem', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px' }}>
            <Loader2 size={18} style={{ color: '#D97706', flexShrink: 0, animation: 'qr-spin 1s linear infinite' }} />
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#92400E', fontFamily: 'var(--font-figtree)', margin: 0 }}>QR Code sedang diproses oleh petugas...</p>
              <p style={{ fontSize: '0.75rem', color: '#B45309', margin: 0, marginTop: '2px' }}>Harap tunggu sebentar.</p>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes qr-spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
