import { api } from '@/lib/api';
import { notFound } from 'next/navigation';
import JadwalForm from '../../JadwalForm';

export const metadata = { title: 'Edit Jadwal' };

export default async function EditJadwalPage({ params }) {
  const { id } = await params;

  const [scheduleRes, doctorsRes] = await Promise.all([
    api.get(`/schedules/${id}`),
    api.get('/doctors')
  ]);

  const schedule = scheduleRes.success ? (scheduleRes.data.data || scheduleRes.data) : null;
  const doctors = doctorsRes.success ? (doctorsRes.data.data || doctorsRes.data) : [];

  if (!schedule) notFound();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-section-hd">
        <div className="admin-section-hd-left">
          <h2 className="admin-section-title">Edit Jadwal Praktek</h2>
          <p className="admin-section-desc">Perbarui informasi jadwal.</p>
        </div>
      </div>
      <JadwalForm mode="edit" schedule={schedule} doctors={doctors} />
    </div>
  );
}
