import { api } from '@/lib/api';
import PendaftaranTable from './PendaftaranTable';
import Link from 'next/link';
import { QrCode } from 'lucide-react';
import { getAuthToken } from '@/lib/auth-utils';

export const metadata = { title: 'Kelola Pendaftaran' };

async function getRegistrations() {
  const token = await getAuthToken();
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  const res = await api.get('/registrations', { headers });
  
  if (!res.success) {
    console.error('Error fetching registrations:', res.error);
    return [];
  }

  const items = res.data.data || res.data || [];
  
  // Map camelCase backend ke snake_case yang diharapkan PendaftaranTable
  // Dan struktur nested (schedule -> doctor)
  return items.map(r => ({
    ...r,
    patient_name: r.patientName,
    nik: r.nik,
    phone_number: r.phoneNumber,
    birth_date: r.birthDate,
    status: r.status,
    created_at: r.createdAt,
    schedules: r.schedule ? {
      time: r.schedule.time,
      date: r.schedule.date,
      doctors: r.schedule.doctor ? {
        name: r.schedule.doctor.name,
        specialization: r.schedule.doctor.specialization
      } : null
    } : null
  }));
}

export default async function AdminPendaftaranPage() {
  const registrations = await getRegistrations();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-section-hd" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="admin-section-hd-left">
          <h2 className="admin-section-title">Kelola Pendaftaran Pasien</h2>
          <p className="admin-section-desc">
            Lihat, konfirmasi, dan kelola status pendaftaran pasien online.
          </p>
        </div>
        <Link 
          href="/admin/pendaftaran/scan" 
          className="admin-btn admin-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
        >
          <QrCode size={16} /> Scan QR Pendaftaran
        </Link>
      </div>

      <div className="admin-card">
        <PendaftaranTable registrations={registrations} />
      </div>
    </div>
  );
}
