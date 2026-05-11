'use client';

import { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Pencil, Trash2, Search, CheckCircle2, XCircle, Stethoscope, AlertTriangle } from 'lucide-react';
import { deleteDokter, bulkDeleteDokter } from '@/app/actions/admin/dokter';
import { getImageUrl } from '@/lib/utils';
import Pagination from '@/components/admin/Pagination';

function getInitials(name) {
  if (!name) return '?';
  const clean = name.replace(/dr\.\s/i, '').trim();
  const parts = clean.split(' ');
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

export default function DokterTable({ doctors, meta }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState(null);

  // Sync search input with URL query param (Server-side search)
  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    if (search === currentQ) return;

    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('q', search);
    } else {
      params.delete('q');
    }
    params.set('page', '1'); // Reset to page 1 when searching

    const timeoutId = setTimeout(() => {
      router.push(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, router, pathname, searchParams]);

  const filtered = doctors;
  const allSelected = filtered.length > 0 && selectedIds.length === filtered.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < filtered.length;

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleSelectAll() {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((d) => d.id));
    }
  }

  function handleSelectRow(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
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

  function confirmBulkDeleteAction() {
    if (selectedIds.length === 0) return;
    startTransition(async () => {
      const result = await bulkDeleteDokter(selectedIds);
      setConfirmBulkDelete(false);
      if (result?.error) {
        showToast('Gagal menghapus beberapa dokter.', 'danger');
      } else {
        showToast(`${selectedIds.length} dokter berhasil dihapus.`, 'success');
        setSelectedIds([]);
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
          {selectedIds.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px', borderLeft: '1px solid var(--admin-border)', paddingLeft: '12px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--admin-primary)' }}>
                {selectedIds.length} terpilih
              </span>
              <button 
                className="admin-btn admin-btn-danger" 
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                onClick={() => setConfirmBulkDelete(true)}
              >
                <Trash2 size={12} /> Hapus Masal
              </button>
            </div>
          )}
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
                <th scope="col" style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    className="admin-checkbox"
                    checked={allSelected}
                    ref={(el) => el && (el.indeterminate = someSelected)}
                    onChange={handleSelectAll}
                  />
                </th>
                <th scope="col">Dokter</th>
                <th scope="col">Spesialisasi</th>
                <th scope="col">Status</th>
                <th scope="col">Foto</th>
                <th scope="col" style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id} className={selectedIds.includes(doc.id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      className="admin-checkbox"
                      checked={selectedIds.includes(doc.id)}
                      onChange={() => handleSelectRow(doc.id)}
                    />
                  </td>
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
                          <img src={getImageUrl(doc.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                    {doc.isAvailable ? (
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
                        onClick={() => setConfirmDelete(doc)}
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

      {/* Pagination */}
      {meta && <Pagination meta={meta} />}

      {/* Single Delete Modal */}
      {confirmDelete && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true">
          <div className="admin-modal" style={{ maxWidth: '400px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Konfirmasi Hapus</h3>
            </div>
            <div className="admin-modal-body">
              <p style={{ color: 'var(--admin-text-b)', lineHeight: 1.6, fontSize: '0.875rem' }}>
                Apakah Anda yakin ingin menghapus <strong>{confirmDelete.name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={() => setConfirmDelete(null)}>Batal</button>
              <button className="admin-btn admin-btn-danger" onClick={confirmDeleteAction} disabled={isPending}>
                {isPending ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal */}
      {confirmBulkDelete && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true">
          <div className="admin-modal" style={{ maxWidth: '400px' }}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--admin-danger)' }}>
                <AlertTriangle size={20} />
                <h3 className="admin-modal-title">Hapus Masal</h3>
              </div>
            </div>
            <div className="admin-modal-body">
              <p style={{ color: 'var(--admin-text-b)', lineHeight: 1.6, fontSize: '0.875rem' }}>
                Apakah Anda yakin ingin menghapus <strong>{selectedIds.length}</strong> dokter yang terpilih? 
                Semua jadwal terkait juga akan dihapus secara otomatis.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={() => setConfirmBulkDelete(false)}>Batal</button>
              <button className="admin-btn admin-btn-danger" onClick={confirmBulkDeleteAction} disabled={isPending}>
                {isPending ? 'Menghapus...' : `Ya, Hapus ${selectedIds.length} Dokter`}
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
