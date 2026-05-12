'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Pencil, Trash2, Search, AlertTriangle, Users } from 'lucide-react';
import { deletePejabat, bulkDeletePejabat } from '@/app/actions/admin/pejabat';
import { getImageUrl } from '@/lib/utils';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.replace(/[Dd]r\.?\s|[Ss].\w+\.,?\s*/g, '').trim().split(' ');
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '').toUpperCase();
}

export default function PejabatTable({ items }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    if (search === currentQ) return;
    const params = new URLSearchParams(searchParams);
    if (search) params.set('q', search); else params.delete('q');
    params.set('page', '1');
    const id = setTimeout(() => router.push(`${pathname}?${params.toString()}`), 450);
    return () => clearTimeout(id);
  }, [search, router, pathname, searchParams]);

  const allSelected = items.length > 0 && selectedIds.length === items.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < items.length;

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleDelete() {
    if (!confirmDelete) return;
    startTransition(async () => {
      const result = await deletePejabat(confirmDelete.id);
      setConfirmDelete(null);
      if (result?.error) showToast('Gagal menghapus pejabat.', 'danger');
      else { showToast('Pejabat berhasil dihapus.'); router.refresh(); }
    });
  }

  function handleBulkDelete() {
    startTransition(async () => {
      const result = await bulkDeletePejabat(selectedIds);
      setConfirmBulk(false);
      if (result?.error) showToast('Gagal menghapus.', 'danger');
      else { showToast(`${selectedIds.length} pejabat dihapus.`); setSelectedIds([]); router.refresh(); }
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
              placeholder="Cari nama atau jabatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Cari pejabat"
            />
          </div>
          {selectedIds.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px', borderLeft: '1px solid var(--admin-border)', paddingLeft: '12px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--admin-primary)' }}>
                {selectedIds.length} terpilih
              </span>
              <button className="admin-btn admin-btn-danger" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => setConfirmBulk(true)}>
                <Trash2 size={12} /> Hapus
              </button>
            </div>
          )}
        </div>
        <span style={{ fontSize: '0.8125rem', color: 'var(--admin-text-m)' }}>{items.length} pejabat</span>
      </div>

      {/* Table */}
      {items.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon"><Users size={24} /></div>
          <p className="admin-empty-title">Tidak ada pejabat ditemukan</p>
          <p className="admin-empty-desc">{search ? 'Coba ubah kata kunci.' : 'Mulai dengan menambahkan pejabat baru.'}</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table" aria-label="Daftar Pejabat">
            <thead>
              <tr>
                <th scope="col" style={{ width: 40 }}>
                  <input type="checkbox" className="admin-checkbox" checked={allSelected} ref={(el) => el && (el.indeterminate = someSelected)} onChange={() => setSelectedIds(allSelected ? [] : items.map(i => i.id))} />
                </th>
                <th scope="col">Pejabat</th>
                <th scope="col">Jabatan</th>
                <th scope="col">Pangkat</th>
                <th scope="col">NRP</th>
                <th scope="col">Status</th>
                <th scope="col" style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((pj) => (
                <tr key={pj.id} className={selectedIds.includes(pj.id) ? 'selected' : ''}>
                  <td>
                    <input type="checkbox" className="admin-checkbox" checked={selectedIds.includes(pj.id)} onChange={() => setSelectedIds(prev => prev.includes(pj.id) ? prev.filter(i => i !== pj.id) : [...prev, pj.id])} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--admin-primary-l)', color: 'var(--admin-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem', fontWeight: 700, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                        {pj.photo ? (
                          <Image src={getImageUrl(pj.photo)} alt={pj.name} fill sizes="38px" style={{ objectFit: 'cover', objectPosition: 'top' }} />
                        ) : (
                          getInitials(pj.name)
                        )}
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--admin-text-h)' }}>{pj.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--admin-text-m)' }}>{pj.jabatan}</td>
                  <td style={{ color: 'var(--admin-text-m)', fontSize: '0.8125rem' }}>{pj.pangkat || '—'}</td>
                  <td style={{ color: 'var(--admin-text-s)', fontSize: '0.8125rem', fontFamily: 'monospace' }}>{pj.nrp || '—'}</td>
                  <td>
                    <span className={`admin-badge ${pj.isActive ? 'success' : 'neutral'}`}>
                      {pj.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                      <a href={`/admin/pejabat/${pj.id}/edit`} className="admin-btn admin-btn-ghost admin-btn-icon" title={`Edit ${pj.name}`} aria-label={`Edit ${pj.name}`}>
                        <Pencil size={14} />
                      </a>
                      <button className="admin-btn admin-btn-danger admin-btn-icon" onClick={() => setConfirmDelete(pj)} title={`Hapus ${pj.name}`} aria-label={`Hapus ${pj.name}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal */}
      {confirmDelete && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true">
          <div className="admin-modal" style={{ maxWidth: 400 }}>
            <div className="admin-modal-header"><h3 className="admin-modal-title">Konfirmasi Hapus</h3></div>
            <div className="admin-modal-body">
              <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-b)', lineHeight: 1.6 }}>
                Hapus <strong>{confirmDelete.name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={() => setConfirmDelete(null)}>Batal</button>
              <button className="admin-btn admin-btn-danger" onClick={handleDelete} disabled={isPending}>
                {isPending ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal */}
      {confirmBulk && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true">
          <div className="admin-modal" style={{ maxWidth: 400 }}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--admin-danger)' }}>
                <AlertTriangle size={20} />
                <h3 className="admin-modal-title">Hapus Masal</h3>
              </div>
            </div>
            <div className="admin-modal-body">
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                Hapus <strong>{selectedIds.length}</strong> pejabat yang dipilih?
              </p>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={() => setConfirmBulk(false)}>Batal</button>
              <button className="admin-btn admin-btn-danger" onClick={handleBulkDelete} disabled={isPending}>
                {isPending ? 'Menghapus...' : `Hapus ${selectedIds.length}`}
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
