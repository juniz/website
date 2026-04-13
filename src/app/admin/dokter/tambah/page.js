import DokterForm from '../DokterForm';

export const metadata = { title: 'Tambah Dokter' };

export default function TambahDokterPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-section-hd">
        <div className="admin-section-hd-left">
          <h2 className="admin-section-title">Tambah Dokter Baru</h2>
          <p className="admin-section-desc">Isi data lengkap dokter yang akan ditambahkan.</p>
        </div>
      </div>
      <DokterForm mode="create" />
    </div>
  );
}
