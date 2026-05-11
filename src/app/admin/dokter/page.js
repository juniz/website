import { api } from '@/lib/api';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import DokterTable from './DokterTable';
import SimrsSyncButton from '@/components/admin/SimrsSyncButton';

export const metadata = { title: 'Kelola Dokter' };

export default async function AdminDokterPage({ searchParams }) {
  const { page = 1, limit = 10, q = '' } = await searchParams;
  const result = await api.get(`/doctors?page=${page}&limit=${limit}&search=${q}`);
  
  const items = result.success ? (result.data.data?.data || result.data.data || result.data) : [];
  const meta = result.success ? (result.data.data?.meta || result.data.meta) : null;

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
        <div style={{ display: 'flex', gap: '10px' }}>
          <SimrsSyncButton />
          <Link href="/admin/dokter/tambah" className="admin-btn admin-btn-primary">
            <Plus size={16} aria-hidden="true" />
            Tambah Dokter
          </Link>
        </div>
      </div>

      {/* Table card */}
      <div className="admin-card">
        <DokterTable doctors={items} meta={meta} />
      </div>
    </div>
  );
}
