import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import JadwalForm from '../JadwalForm';

export const metadata = { title: 'Tambah Jadwal Praktek' };

export default async function TambahJadwalPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: doctors } = await supabase
    .from('doctors')
    .select('id, name, specialization')
    .eq('is_available', true)
    .order('name');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-section-hd">
        <div className="admin-section-hd-left">
          <h2 className="admin-section-title">Tambah Jadwal Praktek</h2>
          <p className="admin-section-desc">Buat jadwal baru untuk dokter yang tersedia.</p>
        </div>
      </div>
      <JadwalForm mode="create" doctors={doctors || []} />
    </div>
  );
}
