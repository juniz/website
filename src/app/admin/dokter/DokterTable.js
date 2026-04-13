'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Search, CheckCircle2, XCircle, Stethoscope } from 'lucide-react';
import { deleteDokter } from '@/app/actions/admin/dokter';

function getInitials(name) {
  if (!name) return '?';
  const clean = name.replace(/dr\.\s/i, '').trim();
  const parts = clean.split(' ');
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

export default function DokterTable({ doctors }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState(null);

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleDelete(doctor) {
    setConfirmDelete(doctor);
  }

  function confirmDeleteAction() {
    if (!confirmDelete) return;
    startTransition(async () => {
      const result = await deleteDokter(confirmDelete.id);
      setConfirmDelete(null);
      if (result?.error) {
        showToast('Gagal menghapus dokter.', 'danger');
      } else {
        showToast('Dokter berhasil dihapus.', 'success');
        router.refresh();
      }
    });
  }

  return (
    <>
      {/* Toolbar */}
      <div className="admin-toolbar" style={{ padding: '14px 16px 0' }}>
        <div className="admin-toolbar-left">
          <div className="admin-search-wrap">
            <Search size={14} className="admin-search-icon" aria-hidden="true" />
            <input
              type="search"
              className="admin-input"
              placeholder="Cari nama atau spesialisasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Cari dokter"
            />
          </div>
        </div>
        <span style={{ fontSize: '0.8125rem', color: 'var(--admin-text-m)' }}>
          {filtered.length} dokter
        </span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">
            <Stethoscope size={24} aria-hidden="true" />
          </div>
          <p className="admin-empty-title">Tidak ada dokter ditemukan</p>
          <p className="admin-empty-desc">
            {search ? 'Coba ubah kata kunci pencarian.' : 'Mulai dengan menambahkan dokter baru.'}
          </p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table" aria-label="Daftar Dokter">
            <thead>
              <tr>
                <th scope="col">Dokter</th>
                <th scope="col">Spesialisasi</th>
                <th scope="col">Status</th>
                <th scope="col">Foto</th>
                <th scope="col" style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: 'var(--admin-primary-l)', color: 'var(--admin-primary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.8125rem', fontWeight: 700, flexShrink: 0,
                          overflow: 'hidden',
                        }}
                      >
                        {doc.image ? (
                          <img src={doc.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          getInitials(doc.name)
                        )}
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--admin-text-h)' }}>
                        {doc.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--admin-text-m)' }}>{doc.specialization}</td>
                  <td>
                    {doc.is_available ? (
                      <span className="admin-badge success">
                        <CheckCircle2 size={10} aria-hidden="true" /> Aktif
                      </span>
                    ) : (
                      <span className="admin-badge neutral">
                        <XCircle size={10} aria-hidden="true" /> Tidak Aktif
                      </span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-s)' }}>
                      {doc.image ? 'Ada' : '—'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                      <Link
                        href={`/admin/dokter/${doc.id}/edit`}
                        className="admin-btn admin-btn-ghost admin-btn-icon"
                        title={`Edit ${doc.name}`}
                        aria-label={`Edit ${doc.name}`}
                      >
                        <Pencil size={14} aria-hidden="true" />
                      </Link>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-icon"
                        onClick={() => handleDelete(doc)}
                        title={`Hapus ${doc.name}`}
                        aria-label={`Hapus ${doc.name}`}
                      >
                        <Trash2 size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
          <div className="admin-modal" style={{ maxWidth: '400px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title" id="delete-modal-title">Konfirmasi Hapus</h3>
            </div>
            <div className="admin-modal-body">
              <p style={{ color: 'var(--admin-text-b)', lineHeight: 1.6, fontSize: '0.875rem' }}>
                Apakah Anda yakin ingin menghapus{' '}
                <strong>{confirmDelete.name}</strong>?{' '}
                Tindakan ini tidak dapat dibatalkan dan akan menghapus semua jadwal terkait.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => setConfirmDelete(null)}
                autoFocus
              >
                Batal
              </button>
              <button
                className="admin-btn admin-btn-danger"
                onClick={confirmDeleteAction}
                disabled={isPending}
                style={{ background: 'var(--admin-danger)', color: '#fff' }}
              >
                {isPending ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="admin-toast-container" role="status" aria-live="polite">
          <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>
        </div>
      )}
    </>
  );
}
