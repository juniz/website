import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import JadwalForm from '../../JadwalForm';

export const metadata = { title: 'Edit Jadwal' };

export default async function EditJadwalPage({ params }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [{ data: schedule }, { data: doctors }] = await Promise.all([
    supabase.from('schedules').select('*').eq('id', id).single(),
    supabase.from('doctors').select('id, name, specialization').eq('is_available', true).order('name'),
  ]);

  if (!schedule) notFound();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-section-hd">
        <div className="admin-section-hd-left">
          <h2 className="admin-section-title">Edit Jadwal Praktek</h2>
          <p className="admin-section-desc">Perbarui informasi jadwal.</p>
        </div>
      </div>
      <JadwalForm mode="edit" schedule={schedule} doctors={doctors || []} />
    </div>
  );
}
