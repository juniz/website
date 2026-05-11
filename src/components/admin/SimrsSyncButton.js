'use client';

import { useState, useTransition } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { syncSimrs } from '@/app/actions/admin/simrs';
import { useRouter } from 'next/navigation';

export default function SimrsSyncButton() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const router = useRouter();

  async function handleSync() {
    startTransition(async () => {
      try {
        const result = await syncSimrs();
        if (result.success) {
          setStatus({ 
            type: 'success', 
            message: `Berhasil sinkronisasi ${result.count} jadwal dari SIMRS.` 
          });
          router.refresh();
        } else {
          setStatus({ 
            type: 'error', 
            message: result.error || 'Gagal sinkronisasi dengan SIMRS.' 
          });
        }
      } catch (error) {
        setStatus({ 
          type: 'error', 
          message: 'Terjadi kesalahan jaringan atau server.' 
        });
      }
      
      setTimeout(() => setStatus(null), 5000);
    });
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {status && (
        <div 
          className={`admin-badge ${status.type === 'success' ? 'success' : 'danger'}`} 
          style={{ 
            padding: '8px 12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontSize: '0.8125rem',
            fontWeight: 500
          }}
        >
          {status.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          {status.message}
        </div>
      )}
      <button
        onClick={handleSync}
        disabled={isPending}
        className="admin-btn admin-btn-ghost"
        style={{ 
          border: '1px solid var(--admin-border)',
          background: 'white',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}
      >
        <RefreshCw size={16} className={isPending ? 'animate-spin' : ''} />
        {isPending ? 'Sinkronisasi...' : 'Sinkron SIMRS'}
      </button>
    </div>
  );
}
