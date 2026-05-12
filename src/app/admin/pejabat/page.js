import { api } from '@/lib/api';
import Link from 'next/link';
import { UserPlus, Users } from 'lucide-react';
import PejabatTable from './PejabatTable';

export const metadata = { title: 'Pejabat RS — Admin RS Bhayangkara' };

async function getPejabat(search = '', page = 1) {
  const params = new URLSearchParams({ page, limit: 50 });
  if (search) params.set('search', search);
  const res = await api.get(`/pejabat?${params.toString()}`);
  if (!res.success) return { data: [], meta: null };
  const rawData = res.data.data ?? res.data;
  const data = Array.isArray(rawData) ? rawData : (rawData?.data || []);
  const meta = rawData?.meta ?? null;
  return { data, meta };
}

export default async function AdminPejabatPage({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q || '';
  const page = Number(sp?.page) || 1;
  const { data: pejabat } = await getPejabat(q, page);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div className="admin-card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--admin-primary-l)', color: 'var(--admin-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Users size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--admin-text-h)', fontFamily: 'var(--font-figtree, Figtree, sans-serif)', marginBottom: 2 }}>
                Pejabat Rumah Sakit
              </h1>
              <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-s)' }}>
                Kelola data pejabat struktural RS Bhayangkara Nganjuk
              </p>
            </div>
          </div>
          <Link href="/admin/pejabat/tambah" className="admin-btn admin-btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <UserPlus size={15} />
            Tambah Pejabat
          </Link>
        </div>
      </div>

      {/* Table Card */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <PejabatTable items={pejabat} />
      </div>
    </div>
  );
}
