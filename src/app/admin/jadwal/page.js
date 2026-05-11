import { api } from '@/lib/api';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import JadwalTable from './JadwalTable';
import SimrsSyncButton from '@/components/admin/SimrsSyncButton';

export const metadata = { title: 'Kelola Jadwal Praktek' };

export default async function AdminJadwalPage({ searchParams }) {
  const { page = 1, limit = 10, q = '' } = await searchParams;
  const [schedulesRes, doctorsRes] = await Promise.all([
    api.get(`/schedules?page=${page}&limit=${limit}&search=${q}`),
    api.get('/doctors?limit=1000') // Fetch all doctors for the select options
  ]);

  const schedules = schedulesRes.success ? (schedulesRes.data.data?.data || schedulesRes.data.data || schedulesRes.data) : [];
  const meta = schedulesRes.success ? (schedulesRes.data.data?.meta || schedulesRes.data.meta) : null;
  const doctors = doctorsRes.success ? (doctorsRes.data.data?.data || doctorsRes.data.data || doctorsRes.data) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-section-hd">
        <div className="admin-section-hd-left">
          <h2 className="admin-section-title">Kelola Jadwal Praktek</h2>
          <p className="admin-section-desc">
            Atur jadwal dan kuota praktek dokter.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <SimrsSyncButton />
          <Link href="/admin/jadwal/tambah" className="admin-btn admin-btn-primary">
            <Plus size={16} aria-hidden="true" />
            Tambah Jadwal
          </Link>
        </div>
      </div>

      <div className="admin-card">
        <JadwalTable schedules={schedules} doctors={doctors} meta={meta} />
      </div>
    </div>
  );
}
