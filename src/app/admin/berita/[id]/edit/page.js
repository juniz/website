import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import BeritaForm from '../../BeritaForm';

export const metadata = { title: 'Edit Artikel' };

export default async function EditBeritaPage({ params }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: article } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (!article) notFound();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-section-hd">
        <div className="admin-section-hd-left">
          <h2 className="admin-section-title">Edit Artikel</h2>
          <p className="admin-section-desc">Perbarui konten artikel berita.</p>
        </div>
      </div>
      <BeritaForm mode="edit" article={article} />
    </div>
  );
}
