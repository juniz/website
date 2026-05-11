'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Pencil, Trash2, Search, CalendarDays, AlertTriangle } from 'lucide-react';
import { deleteJadwal, bulkDeleteJadwal } from '@/app/actions/admin/jadwal';
import Pagination from '@/components/admin/Pagination';

function formatDayOrDate(value) {
  if (!value) return '—';
  if (!isNaN(Date.parse(value)) && value.includes('-')) {
    return new Date(value).toLocaleDateString('id-ID', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });
  }
  return value;
}

function getQuotaStatus(filled, total) {
  if (filled >= total) return { label: 'Penuh', cls: 'danger' };
  if (total - filled <= 5) return { label: 'Hampir Penuh', cls: 'warning' };
  return { label: 'Tersedia', cls: 'success' };
}

export default function JadwalTable({ schedules, doctors, meta }) {
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

  const filtered = schedules;
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
      setSelectedIds(filtered.map((s) => s.id));
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
      const result = await deleteJadwal(confirmDelete.id);
      setConfirmDelete(null);
      if (result?.error) {
        showToast('Gagal menghapus jadwal.', 'danger');
      } else {
        showToast('Jadwal berhasil dihapus.', 'success');
        router.refresh();
      }
    });
  }

  function confirmBulkDeleteAction() {
    if (selectedIds.length === 0) return;
    startTransition(async () => {
      const result = await bulkDeleteJadwal(selectedIds);
      setConfirmBulkDelete(false);
      if (result?.error) {
        showToast('Gagal menghapus beberapa jadwal.', 'danger');
      } else {
        showToast(`${selectedIds.length} jadwal berhasil dihapus.`, 'success');
        setSelectedIds([]);
        router.refresh();
      }
    });
  }

  return (
    <>
      <div className="admin-toolbar" style={{ padding: '14px 16px 0' }}>
        <div className="admin-toolbar-left">
          <div className="admin-search-wrap">
            <Search size={14} className="admin-search-icon" aria-hidden="true" />
            <input
              type="search"
              className="admin-input"
              placeholder="Cari nama dokter atau tanggal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Cari jadwal"
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
          {filtered.length} jadwal
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">
            <CalendarDays size={24} aria-hidden="true" />
          </div>
          <p className="admin-empty-title">Tidak ada jadwal ditemukan</p>
          <p className="admin-empty-desc">
            {search ? 'Coba ubah kata kunci pencarian.' : 'Mulai dengan menambahkan jadwal praktek.'}
          </p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table" aria-label="Daftar Jadwal Praktek">
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
                <th scope="col">Tanggal</th>
                <th scope="col">Waktu</th>
                <th scope="col">Kuota</th>
                <th scope="col">Status</th>
                <th scope="col" style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const quota = getQuotaStatus(s.filledQuota, s.totalQuota);
                return (
                  <tr key={s.id} className={selectedIds.includes(s.id) ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        className="admin-checkbox"
                        checked={selectedIds.includes(s.id)}
                        onChange={() => handleSelectRow(s.id)}
                      />
                    </td>
                    <td>
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--admin-text-h)', fontSize: '0.8125rem' }}>
                          {s.doctor?.name || '—'}
                        </p>
                        <p style={{ fontSize: '0.6875rem', color: 'var(--admin-text-s)', marginTop: 2 }}>
                          {s.doctor?.specialization}
                        </p>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--admin-text-b)' }}>
                      {formatDayOrDate(s.date)}
                    </td>
                    <td>
                      <span className="admin-badge info">{s.time}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem', fontVariantNumeric: 'tabular-nums' }}>
                        {s.filledQuota}/{s.totalQuota}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${quota.cls}`}>{quota.label}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                        <Link
                          href={`/admin/jadwal/${s.id}/edit`}
                          className="admin-btn admin-btn-ghost admin-btn-icon"
                          aria-label="Edit jadwal"
                        >
                          <Pencil size={14} aria-hidden="true" />
                        </Link>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-icon"
                          onClick={() => setConfirmDelete(s)}
                          aria-label="Hapus jadwal"
                        >
                          <Trash2 size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
              <h3 className="admin-modal-title">Hapus Jadwal</h3>
            </div>
            <div className="admin-modal-body">
              <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-b)', lineHeight: 1.6 }}>
                Hapus jadwal <strong>{confirmDelete.doctor?.name}</strong> tanggal{' '}
                <strong>{formatDayOrDate(confirmDelete.date)}</strong>?
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
                Apakah Anda yakin ingin menghapus <strong>{selectedIds.length}</strong> jadwal yang terpilih? 
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={() => setConfirmBulkDelete(false)}>Batal</button>
              <button className="admin-btn admin-btn-danger" onClick={confirmBulkDeleteAction} disabled={isPending}>
                {isPending ? 'Menghapus...' : `Ya, Hapus ${selectedIds.length} Jadwal`}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="admin-toast-container" role="status" aria-live="polite">
          <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>
        </div>
      )}
    </>
  );
}
