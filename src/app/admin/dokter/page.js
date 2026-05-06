import { api } from '@/lib/api';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import DokterTable from './DokterTable';

export const metadata = { title: 'Kelola Dokter' };

export default async function AdminDokterPage() {
  const result = await api.get('/doctors');
  
  // Karena backend ada TransformInterceptor, data asli ada di dalam property 'data'
  const items = result.success ? (result.data.data || result.data) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Section Header */}
      <div className="admin-section-hd">
        <div className="admin-section-hd-left">
          <h2 className="admin-section-title">Kelola Dokter</h2>
          <p className="admin-section-desc">
            Manajemen data dokter, spesialisasi, dan ketersediaan praktek.
          </p>
        </div>
        <Link href="/admin/dokter/tambah" className="admin-btn admin-btn-primary">
          <Plus size={16} aria-hidden="true" />
          Tambah Dokter
        </Link>
      </div>

      {/* Table card */}
      <div className="admin-card">
        <DokterTable doctors={items} />
      </div>
    </div>
  );
}
