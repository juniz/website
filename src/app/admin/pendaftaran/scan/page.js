'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { scanQrCode, updatePreRegStatus } from '@/app/actions/admin/pendaftaran';
import { 
  QrCode, 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowLeft,
  Stethoscope,
  Clock,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

export default function QrScannerPage() {
  const router = useRouter();
  const [scannedData, setScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);

  const handleProcessToken = useCallback(async (token) => {
    setIsLoading(true);
    setError(null);
    
    const result = await scanQrCode(token);
    setIsLoading(false);

    if (result.success) {
      setScannedData(result.data);
      toast.success('QR Berhasil dipindai');
    } else {
      setError(result.error);
      toast.error(result.error);
    }
  }, []);

  const onScanSuccess = useCallback(async (decodedText) => {
    // Try to extract token from URL if it's a link
    let token = decodedText;
    if (decodedText.includes('token=')) {
      const url = new URL(decodedText);
      token = url.searchParams.get('token');
    }

    if (scannerRef.current) {
      try {
        await scannerRef.current.clear();
        setIsScanning(false);
      } catch (err) {
        console.error(err);
      }
    }

    handleProcessToken(token);
  }, [handleProcessToken]);

  const onScanFailure = (error) => {
    // Too much noise, ignore failures
  };

  useEffect(() => {
    if (isScanning && !scannedData) {
      const scanner = new Html5QrcodeScanner("reader", { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ]
      });

      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    };
  }, [isScanning, scannedData, onScanSuccess]);

  async function handleUpdateStatus(newStatus) {
    if (!scannedData) return;
    
    setIsLoading(true);
    const result = await updatePreRegStatus(scannedData.id, newStatus);
    setIsLoading(false);

    if (result.success) {
      toast.success(`Status berhasil diupdate ke: ${newStatus}`);
      setScannedData(null);
      setIsScanning(true);
    } else {
      toast.error(result.error);
    }
  }

  function resetScanner() {
    setScannedData(null);
    setError(null);
    setIsScanning(true);
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={() => router.back()}
          style={{ 
            background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#1e293b' }}>Scan QR Pendaftaran</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '4px 0 0' }}>Arahkan kamera ke QR Code bukti pendaftaran pasien</p>
        </div>
      </header>

      {/* Error State */}
      {error && (
        <div style={{ 
          background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', padding: '1rem', 
          display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#991b1b', marginBottom: '1.5rem' 
        }}>
          <AlertCircle size={20} />
          <div style={{ flex: 1 }}>{error}</div>
          <button 
            onClick={resetScanner}
            style={{ background: '#991b1b', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Scanner Container */}
      {isScanning && !scannedData && (
        <div style={{ 
          background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
          border: '1px solid #f1f5f9', position: 'relative'
        }}>
          <div id="reader" style={{ width: '100%' }}></div>
          <div style={{ 
            position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.5)', 
            color: '#fff', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', backdropFilter: 'blur(4px)' 
          }}>
            Kamera Aktif
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
          padding: '4rem 0', gap: '1rem' 
        }}>
          <Loader2 size={40} style={{ color: '#2563eb', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#64748b', fontWeight: 600 }}>Memproses data...</p>
        </div>
      )}

      {/* Result Card */}
      {scannedData && !isLoading && (
        <div style={{ 
          background: '#fff', borderRadius: '24px', border: '1px solid #f1f5f9', 
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden',
          animation: 'slideUp 300ms ease'
        }}>
          {/* Card Header */}
          <div style={{ 
            background: '#f8fafc', padding: '1.5rem', borderBottom: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '12px', background: '#2563eb', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' 
              }}>
                <User size={24} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{scannedData.nm_pasien}</h2>
                <span style={{ 
                  fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px',
                  background: scannedData.status === 'pending' ? '#fef3c7' : '#dcfce7',
                  color: scannedData.status === 'pending' ? '#92400e' : '#166534',
                  textTransform: 'uppercase'
                }}>
                  Status: {scannedData.status}
                </span>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>NIK (KTP)</label>
                <p style={{ margin: 0, fontWeight: 700, color: '#334155' }}>{scannedData.no_ktp_raw}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>WhatsApp</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <p style={{ margin: 0, fontWeight: 700, color: '#334155' }}>{scannedData.no_wa}</p>
                  <a href={`https://wa.me/${scannedData.no_wa}`} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}><ExternalLink size={14} /></a>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Tgl Lahir</label>
                <p style={{ margin: 0, fontWeight: 700, color: '#334155' }}>{new Date(scannedData.tgl_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Jenis Kelamin</label>
                <p style={{ margin: 0, fontWeight: 700, color: '#334155' }}>{scannedData.jk === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #e0f2fe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0369a1', marginBottom: '0.75rem' }}>
                <Stethoscope size={18} />
                <span style={{ fontWeight: 800, fontSize: '0.875rem' }}>Informasi Booking</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.625rem', color: '#0369a1', margin: 0, fontWeight: 700 }}>TANGGAL</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0 }}>{scannedData.tgl_booking ? new Date(scannedData.tgl_booking).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' }) : '-'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.625rem', color: '#0369a1', margin: 0, fontWeight: 700 }}>DOKTER / POLI</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0 }}>{scannedData.kd_dokter || '-'} / {scannedData.kd_poli || '-'}</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Alamat</label>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#334155', lineHeight: 1.5 }}>{scannedData.alamat || '-'}</p>
            </div>
          </div>

          {/* Card Footer Actions */}
          <div style={{ padding: '1.5rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={() => handleUpdateStatus('scanned')}
              disabled={scannedData.status === 'scanned'}
              style={{ 
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                padding: '12px', background: scannedData.status === 'scanned' ? '#e2e8f0' : '#2563eb', 
                color: scannedData.status === 'scanned' ? '#94a3b8' : '#fff', border: 'none', borderRadius: '12px', 
                fontWeight: 700, cursor: scannedData.status === 'scanned' ? 'not-allowed' : 'pointer'
              }}
            >
              <CheckCircle2 size={18} /> Konfirmasi Kehadiran
            </button>
            <button 
              onClick={() => handleUpdateStatus('transferred')}
              style={{ 
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                padding: '12px', background: '#fff', color: '#334155', border: '1px solid #e2e8f0', borderRadius: '12px', 
                fontWeight: 700, cursor: 'pointer'
              }}
            >
              <CheckCircle2 size={18} /> Selesai & Input SIMRS
            </button>
            <button 
              onClick={resetScanner}
              style={{ 
                padding: '12px', background: 'none', color: '#64748b', border: 'none', cursor: 'pointer', fontWeight: 600
              }}
            >
              Batal
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
