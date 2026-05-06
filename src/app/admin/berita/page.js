import { api } from '@/lib/api';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import BeritaTable from './BeritaTable';

export const metadata = { title: 'Kelola Berita & Artikel' };

export default async function AdminBeritaPage() {
  const result = await api.get('/news');
  
  // Karena backend ada TransformInterceptor, data asli ada di dalam property 'data'
  const items = result.success ? (result.data.data || result.data) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-section-hd">
        <div className="admin-section-hd-left">
          <h2 className="admin-section-title">Kelola Berita & Artikel</h2>
          <p className="admin-section-desc">
            Buat, edit, dan kelola konten berita RS Bhayangkara Nganjuk.
          </p>
        </div>
        <Link href="/admin/berita/tambah" className="admin-btn admin-btn-primary">
          <Plus size={16} aria-hidden="true" />
          Tulis Artikel
        </Link>
      </div>

      <div className="admin-card">
        <BeritaTable articles={items} />
      </div>
    </div>
  );
}
