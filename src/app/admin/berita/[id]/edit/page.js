import { api } from '@/lib/api';
import { notFound } from 'next/navigation';
import BeritaForm from '../../BeritaForm';

export const metadata = { title: 'Edit Artikel' };

export default async function EditBeritaPage({ params }) {
  const { id } = await params;
  
  const result = await api.get(`/news/${id}`);
  
  // Karena backend ada TransformInterceptor, data asli ada di dalam property 'data'
  const article = result.success ? (result.data.data || result.data) : null;

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
