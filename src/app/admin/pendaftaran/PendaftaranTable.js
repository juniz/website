'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Eye, Trash2, ClipboardList } from 'lucide-react';
import { updateStatusPendaftaran, deletePendaftaran } from '@/app/actions/admin/pendaftaran';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Done', 'Cancelled'];

const STATUS_CFG = {
  Pending:   { cls: 'warning', label: 'Menunggu' },
  Confirmed: { cls: 'info',    label: 'Dikonfirmasi' },
  Done:      { cls: 'success', label: 'Selesai' },
  Cancelled: { cls: 'danger',  label: 'Dibatalkan' },
};

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function PendaftaranTable({ registrations }) {
  const router = useRouter();
  const [search, setSearch]       = useState('');
  const [filterStatus, setFilter] = useState('all');
  const [detailReg, setDetailReg] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast]         = useState(null);

  const filtered = registrations.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      r.patient_name?.toLowerCase().includes(q) ||
      r.phone?.includes(q) ||
      r.schedules?.doctors?.name?.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleStatusChange(reg, newStatus) {
    startTransition(async () => {
      const result = await updateStatusPendaftaran(reg.id, newStatus);
      if (result?.error) {
        showToast('Gagal mengubah status.', 'danger');
      } else {
        showToast('Status berhasil diperbarui.', 'success');
        router.refresh();
      }
    });
  }

  function confirmDelete() {
    if (!confirmDel) return;
    startTransition(async () => {
      const result = await deletePendaftaran(confirmDel.id);
      setConfirmDel(null);
      if (result?.error) {
        showToast('Gagal menghapus pendaftaran.', 'danger');
      } else {
        showToast('Pendaftaran berhasil dihapus.', 'success');
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
              placeholder="Cari nama pasien atau dokter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Cari pendaftaran"
            />
          </div>
          <select
            className="admin-select"
            value={filterStatus}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter status"
            style={{ width: 'auto', minWidth: 140 }}
          >
            <option value="all">Semua Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{STATUS_CFG[s]?.label || s}</option>
            ))}
          </select>
        </div>
        <span style={{ fontSize: '0.8125rem', color: 'var(--admin-text-m)' }}>
          {filtered.length} pendaftaran
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">
            <ClipboardList size={24} aria-hidden="true" />
          </div>
          <p className="admin-empty-title">Tidak ada pendaftaran ditemukan</p>
          <p className="admin-empty-desc">Coba ubah filter atau kata kunci pencarian.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table" aria-label="Daftar Pendaftaran Pasien">
            <thead>
              <tr>
                <th scope="col">Pasien</th>
                <th scope="col">Dokter / Jadwal</th>
                <th scope="col">Asuransi</th>
                <th scope="col">Tanggal Daftar</th>
                <th scope="col">Status</th>
                <th scope="col" style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const cfg = STATUS_CFG[r.status] || { cls: 'neutral', label: r.status };
                return (
                  <tr key={r.id}>
                    <td>
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--admin-text-h)', fontSize: '0.8125rem' }}>
                          {r.patient_name}
                        </p>
                        <p style={{ fontSize: '0.6875rem', color: 'var(--admin-text-s)', marginTop: 2 }}>
                          {r.phone}
                        </p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-b)', fontWeight: 500 }}>
                          {r.schedules?.doctors?.name || '—'}
                        </p>
                        <p style={{ fontSize: '0.6875rem', color: 'var(--admin-text-s)', marginTop: 2 }}>
                          {r.schedules?.date ? formatDate(r.schedules.date) : ''} {r.schedules?.time || ''}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className="admin-badge neutral">{r.insurance}</span>
                      {r.bpjs_number && (
                        <p style={{ fontSize: '0.6875rem', color: 'var(--admin-text-s)', marginTop: 2 }}>
                          {r.bpjs_number}
                        </p>
                      )}
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--admin-text-m)' }}>
                      {formatDate(r.created_at)}
                    </td>
                    <td>
                      <select
                        className="admin-select"
                        value={r.status}
                        onChange={(e) => handleStatusChange(r, e.target.value)}
                        aria-label={`Status pendaftaran ${r.patient_name}`}
                        style={{ width: 'auto', minWidth: 120, fontSize: '0.8125rem', padding: '5px 8px', height: 'auto', minHeight: 'unset' }}
                        disabled={isPending}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{STATUS_CFG[s]?.label || s}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-icon"
                          onClick={() => setDetailReg(r)}
                          aria-label={`Detail pendaftaran ${r.patient_name}`}
                          title="Lihat detail"
                        >
                          <Eye size={14} aria-hidden="true" />
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-icon"
                          onClick={() => setConfirmDel(r)}
                          aria-label={`Hapus pendaftaran ${r.patient_name}`}
                          title="Hapus"
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

      {/* Detail Modal */}
      {detailReg && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="detail-modal-title">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3 className="admin-modal-title" id="detail-modal-title">
                Detail Pendaftaran
              </h3>
              <button
                className="admin-btn admin-btn-ghost admin-btn-icon"
                onClick={() => setDetailReg(null)}
                aria-label="Tutup detail"
              >
                ✕
              </button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  ['Nama Pasien', detailReg.patient_name],
                  ['Tanggal Lahir', formatDate(detailReg.dob)],
                  ['No. Telepon', detailReg.phone],
                  ['Asuransi', detailReg.insurance],
                  ['No. BPJS', detailReg.bpjs_number || '—'],
                  ['Dokter', detailReg.schedules?.doctors?.name || '—'],
                  ['Jadwal', `${formatDate(detailReg.schedules?.date)} ${detailReg.schedules?.time || ''}`],
                  ['Status', STATUS_CFG[detailReg.status]?.label || detailReg.status],
                  ['Keluhan', detailReg.complaint || '—'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-text-s)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {label}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--admin-text-b)' }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-primary" onClick={() => setDetailReg(null)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDel && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="del-reg-title">
          <div className="admin-modal" style={{ maxWidth: '400px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title" id="del-reg-title">Hapus Pendaftaran</h3>
            </div>
            <div className="admin-modal-body">
              <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-b)', lineHeight: 1.6 }}>
                Hapus pendaftaran <strong>{confirmDel.patient_name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={() => setConfirmDel(null)} autoFocus>Batal</button>
              <button
                className="admin-btn"
                style={{ background: 'var(--admin-danger)', color: '#fff' }}
                onClick={confirmDelete}
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
