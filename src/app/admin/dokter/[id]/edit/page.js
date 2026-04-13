import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import DokterForm from '../../DokterForm';

export const metadata = { title: 'Edit Dokter' };

export default async function EditDokterPage({ params }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: doctor } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', id)
    .single();

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
