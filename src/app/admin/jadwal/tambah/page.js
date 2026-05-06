import { api } from '@/lib/api';
import JadwalForm from '../JadwalForm';

export const metadata = { title: 'Tambah Jadwal Praktek' };

async function getDoctors() {
  const res = await api.get('/doctors');
  if (!res.success) return [];
  
  const items = res.data.data || res.data || [];
  // Filter available doctors
  return items.filter(d => d.isAvailable);
}

export default async function TambahJadwalPage() {
  const doctors = await getDoctors();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-section-hd">
        <div className="admin-section-hd-left">
          <h2 className="admin-section-title">Tambah Jadwal Praktek</h2>
          <p className="admin-section-desc">Buat jadwal baru untuk dokter yang tersedia.</p>
        </div>
      </div>
      <JadwalForm mode="create" doctors={doctors} />
    </div>
  );
}
