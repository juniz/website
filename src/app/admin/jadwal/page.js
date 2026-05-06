import { api } from '@/lib/api';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import JadwalTable from './JadwalTable';

export const metadata = { title: 'Kelola Jadwal Praktek' };

export default async function AdminJadwalPage() {
  const [schedulesRes, doctorsRes] = await Promise.all([
    api.get('/schedules'),
    api.get('/doctors')
  ]);

  const schedules = schedulesRes.success ? (schedulesRes.data.data || schedulesRes.data) : [];
  const doctors = doctorsRes.success ? (doctorsRes.data.data || doctorsRes.data) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-section-hd">
        <div className="admin-section-hd-left">
          <h2 className="admin-section-title">Kelola Jadwal Praktek</h2>
          <p className="admin-section-desc">
            Atur jadwal dan kuota praktek dokter.
          </p>
        </div>
        <Link href="/admin/jadwal/tambah" className="admin-btn admin-btn-primary">
          <Plus size={16} aria-hidden="true" />
          Tambah Jadwal
        </Link>
      </div>

      <div className="admin-card">
        <JadwalTable schedules={schedules} doctors={doctors} />
      </div>
    </div>
  );
}
