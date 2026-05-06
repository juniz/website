import { api } from '@/lib/api';
import { notFound } from 'next/navigation';
import DokterForm from '../../DokterForm';

export const metadata = { title: 'Edit Dokter' };

export default async function EditDokterPage({ params }) {
  const { id } = await params;
  
  const result = await api.get(`/doctors/${id}`);
  
  // Karena backend ada TransformInterceptor, data asli ada di dalam property 'data'
  const doctor = result.success ? (result.data.data || result.data) : null;

  if (!doctor) notFound();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-section-hd">
        <div className="admin-section-hd-left">
          <h2 className="admin-section-title">Edit Dokter</h2>
          <p className="admin-section-desc">Perbarui informasi {doctor.name}.</p>
        </div>
      </div>
      <DokterForm mode="edit" doctor={doctor} />
    </div>
  );
}
