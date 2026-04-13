import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import PendaftaranTable from './PendaftaranTable';

export const metadata = { title: 'Kelola Pendaftaran' };

export default async function AdminPendaftaranPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: registrations } = await supabase
    .from('registrations')
    .select(`
      *,
      schedules (
        time, date,
        doctors ( name, specialization )
      )
    `)
    .order('created_at', { ascending: false });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-section-hd">
        <div className="admin-section-hd-left">
          <h2 className="admin-section-title">Kelola Pendaftaran Pasien</h2>
          <p className="admin-section-desc">
            Lihat, konfirmasi, dan kelola status pendaftaran pasien online.
          </p>
        </div>
      </div>

      <div className="admin-card">
        <PendaftaranTable registrations={registrations || []} />
      </div>
    </div>
  );
}
