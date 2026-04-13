import BeritaForm from '../BeritaForm';

export const metadata = { title: 'Tulis Artikel' };

export default function TambahBeritaPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-section-hd">
        <div className="admin-section-hd-left">
          <h2 className="admin-section-title">Tulis Artikel Baru</h2>
          <p className="admin-section-desc">Publikasikan berita dan informasi terbaru dari rumah sakit.</p>
        </div>
      </div>
      <BeritaForm mode="create" />
    </div>
  );
}
