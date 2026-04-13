'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pencil, Trash2, Search, CalendarDays } from 'lucide-react';
import { deleteJadwal } from '@/app/actions/admin/jadwal';

function formatDayOrDate(value) {
  if (!value) return '—';
  // Check if it looks like a valid date format (e.g. YYYY-MM-DD)
  if (!isNaN(Date.parse(value)) && value.includes('-')) {
    return new Date(value).toLocaleDateString('id-ID', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });
  }
  // Otherwise it's already a day string like "Senin"
  return value;
}

function getQuotaStatus(filled, total) {
  if (filled >= total) return { label: 'Penuh', cls: 'danger' };
  if (total - filled <= 5) return { label: 'Hampir Penuh', cls: 'warning' };
  return { label: 'Tersedia', cls: 'success' };
}

export default function JadwalTable({ schedules, doctors }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState(null);

  const filtered = schedules.filter((s) => {
    const docName = s.doctors?.name?.toLowerCase() || '';
    const docSpec = s.doctors?.specialization?.toLowerCase() || '';
    const q = search.toLowerCase();
    return docName.includes(q) || docSpec.includes(q) || s.date?.includes(q);
  });

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
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
                const quota = getQuotaStatus(s.filled_quota, s.total_quota);
                return (
                  <tr key={s.id}>
                    <td>
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--admin-text-h)', fontSize: '0.8125rem' }}>
                          {s.doctors?.name || '—'}
                        </p>
                        <p style={{ fontSize: '0.6875rem', color: 'var(--admin-text-s)', marginTop: 2 }}>
                          {s.doctors?.specialization}
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
                        {s.filled_quota}/{s.total_quota}
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

      {confirmDelete && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="del-jadwal-title">
          <div className="admin-modal" style={{ maxWidth: '400px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title" id="del-jadwal-title">Hapus Jadwal</h3>
            </div>
            <div className="admin-modal-body">
              <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-b)', lineHeight: 1.6 }}>
                Hapus jadwal <strong>{confirmDelete.doctors?.name}</strong> tanggal{' '}
                <strong>{formatDayOrDate(confirmDelete.date)}</strong>?
                Pendaftaran pasien yang sudah ada tidak dapat dihapus.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={() => setConfirmDelete(null)} autoFocus>
                Batal
              </button>
              <button
                className="admin-btn"
                style={{ background: 'var(--admin-danger)', color: '#fff' }}
                onClick={confirmDeleteAction}
                disabled={isPending}
              >
                {isPending ? 'Menghapus...' : 'Ya, Hapus'}
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
