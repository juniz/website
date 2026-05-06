import { api } from '@/lib/api';
import { Building2, Plus, Edit2, CheckCircle, XCircle, Building, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';

export const metadata = {
  title: 'Manajemen Fasilitas — Admin RS Bhayangkara',
};

async function getFacilities() {
  const res = await api.get('/facilities');
  
  if (!res.success) {
    console.error('Error fetching facilities:', res.error);
    return [];
  }

  const items = res.data.data || res.data || [];
  
  // Map camelCase backend ke snake_case yang diharapkan UI
  return items.map(f => ({
    ...f,
    image_url: f.imageUrl,
    is_active: f.isActive,
    sort_order: f.sortOrder
  }));
}

export default async function FacilitiesAdminPage() {
  const facilities = await getFacilities();

  const activeCount   = facilities.filter((f) => f.is_active).length;
  const inactiveCount = facilities.length - activeCount;

  return (
    <div className="fac-page">

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="fac-page-header">
        <div className="fac-header-left">
          <div className="fac-page-icon">
            <Building2 size={20} />
          </div>
          <div>
            <h1 className="fac-page-title">Manajemen Fasilitas</h1>
            <p className="fac-page-desc">Kelola informasi gedung, ruangan, dan peralatan medis rumah sakit.</p>
          </div>
        </div>
        <Link href="/admin/fasilitas/tambah" className="fac-add-btn">
          <Plus size={16} />
          Tambah Fasilitas
        </Link>
      </div>

      {/* ── Stats Bar ───────────────────────────────────── */}
      {facilities.length > 0 && (
        <div className="fac-stats-bar">
          <div className="fac-stat-item">
            <span className="fac-stat-icon fac-stat-blue">
              <Building size={14} />
            </span>
            <span className="fac-stat-value">{facilities.length}</span>
            <span className="fac-stat-label">Total Fasilitas</span>
          </div>
          <div className="fac-stat-divider" />
          <div className="fac-stat-item">
            <span className="fac-stat-icon fac-stat-green">
              <CheckCircle size={14} />
            </span>
            <span className="fac-stat-value">{activeCount}</span>
            <span className="fac-stat-label">Aktif</span>
          </div>
          <div className="fac-stat-divider" />
          <div className="fac-stat-item">
            <span className="fac-stat-icon fac-stat-muted">
              <XCircle size={14} />
            </span>
            <span className="fac-stat-value">{inactiveCount}</span>
            <span className="fac-stat-label">Nonaktif</span>
          </div>
        </div>
      )}

      {/* ── Content ─────────────────────────────────────── */}
      {facilities.length === 0 ? (
        /* Empty State */
        <div className="fac-empty">
          <div className="fac-empty-icon">
            <Building2 size={36} strokeWidth={1.2} />
          </div>
          <div>
            <h3 className="fac-empty-title">Belum Ada Fasilitas</h3>
            <p className="fac-empty-desc">Tambahkan fasilitas unggulan atau sarana penunjang medis rumah sakit.</p>
          </div>
          <Link href="/admin/fasilitas/tambah" className="fac-add-btn">
            <Plus size={15} />
            Tambah Fasilitas Pertama
          </Link>
        </div>
      ) : (
        /* Table Card */
        <div className="fac-table-card">
          <div className="fac-table-wrap">
            <table className="fac-table">
              <thead>
                <tr>
                  <th className="fac-th fac-th-no">#</th>
                  <th className="fac-th">Fasilitas & Gambar</th>
                  <th className="fac-th">Kategori</th>
                  <th className="fac-th fac-th-center">Status</th>
                  <th className="fac-th fac-th-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map((fac, index) => (
                  <tr key={fac.id} className="fac-tr">

                    {/* No urut */}
                    <td className="fac-td fac-td-no">
                      <span className="fac-row-index">{index + 1}</span>
                    </td>

                    {/* Fasilitas */}
                    <td className="fac-td" style={{ minWidth: '240px' }}>
                      <div className="fac-item-cell">
                        <div className="fac-img-wrap">
                          {fac.image_url ? (
                            <img src={getImageUrl(fac.image_url)} alt={fac.title} className="fac-img" />
                          ) : (
                            <ImageIcon size={18} className="fac-img-placeholder" />
                          )}
                        </div>
                        <div className="fac-info">
                          <span className="fac-title">{fac.title}</span>
                          <span className="fac-desc line-clamp-1">{fac.description || 'Tidak ada deskripsi'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Kategori */}
                    <td className="fac-td">
                      <span className="fac-category-tag">
                        {fac.category || 'Umum'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="fac-td fac-td-center">
                      <span className={`fac-status-badge ${fac.is_active ? 'fac-status-active' : 'fac-status-inactive'}`}>
                        <span className="fac-status-dot" />
                        {fac.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="fac-td fac-td-right">
                      <Link
                        href={`/admin/fasilitas/edit/${fac.id}`}
                        className="fac-edit-btn"
                        aria-label={`Edit ${fac.title}`}
                      >
                        <Edit2 size={13} />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="fac-table-footer">
            Menampilkan <strong>{facilities.length}</strong> fasilitas
          </div>
        </div>
      )}

      <style>{`
        /* ── Page Layout ─────────────────────────────────── */
        .fac-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ── Header ──────────────────────────────────────── */
        .fac-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-lg);
          padding: 20px 24px;
          box-shadow: var(--admin-shadow-xs);
          flex-wrap: wrap;
        }

        .fac-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .fac-page-icon {
          width: 44px; height: 44px;
          border-radius: var(--admin-radius-md);
          background: var(--admin-primary-l);
          color: var(--admin-primary);
          display: flex; align-items: center; justify-content: center;
        }

        .fac-page-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--admin-text-h);
          font-family: var(--font-figtree, 'Figtree', sans-serif);
          margin-bottom: 2px;
        }

        .fac-page-desc {
          font-size: 0.8125rem;
          color: var(--admin-text-s);
        }

        /* ── Add Button ─────────────────────────────────── */
        .fac-add-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          background: var(--admin-primary);
          color: #fff;
          border-radius: var(--admin-radius-sm);
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 150ms;
        }

        .fac-add-btn:hover {
          background: var(--admin-primary-h);
          box-shadow: 0 4px 12px rgba(24, 95, 165, 0.25);
        }

        /* ── Stats ────────────────────────────────────────── */
        .fac-stats-bar {
          display: flex;
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-lg);
          box-shadow: var(--admin-shadow-xs);
        }

        .fac-stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          flex: 1;
        }

        .fac-stat-divider { width: 1px; height: 32px; background: var(--admin-border-soft); margin: auto 0; }
        
        .fac-stat-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .fac-stat-blue  { background: var(--admin-primary-l); color: var(--admin-primary); }
        .fac-stat-green { background: var(--admin-success-l); color: var(--admin-success); }
        .fac-stat-muted { background: #F1F5F9; color: var(--admin-text-m); }

        .fac-stat-value { font-size: 1.25rem; font-weight: 800; color: var(--admin-text-h); line-height: 1; }
        .fac-stat-label { font-size: 0.75rem; color: var(--admin-text-s); }

        /* ── Table ────────────────────────────────────────── */
        .fac-table-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-lg);
          overflow: hidden;
          box-shadow: var(--admin-shadow-xs);
        }

        .fac-table-wrap { overflow-x: auto; }
        .fac-table { width: 100%; border-collapse: collapse; text-align: left; }

        .fac-th {
          padding: 12px 16px;
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--admin-text-s);
          text-transform: uppercase;
          background: var(--admin-surface-2);
          border-bottom: 1px solid var(--admin-border-soft);
        }
        .fac-th-no { width: 48px; text-align: center; }
        .fac-th-center { text-align: center; }
        .fac-th-right { text-align: right; }

        .fac-tr { border-bottom: 1px solid var(--admin-border-soft); transition: background 120ms; }
        .fac-tr:hover { background: var(--admin-surface-2); }
        .fac-td { padding: 12px 16px; font-size: 0.875rem; color: var(--admin-text-b); vertical-align: middle; }
        .fac-td-no { text-align: center; }
        .fac-td-center { text-align: center; }
        .fac-td-right { text-align: right; }

        .fac-row-index {
          display: inline-flex; align-items: center; justify-content: center;
          width: 24px; height: 24px; border-radius: 6px;
          background: var(--admin-border-soft); color: var(--admin-text-s);
          font-size: 0.6875rem; font-weight: 700;
        }

        /* ── Item Cell ────────────────────────────────────── */
        .fac-item-cell { display: flex; align-items: center; gap: 12px; }
        .fac-img-wrap {
          width: 48px; height: 48px; border-radius: 10px;
          background: var(--admin-surface-2); overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid var(--admin-border-soft); flex-shrink: 0;
        }
        .fac-img { width: 100%; height: 100%; object-fit: cover; }
        .fac-img-placeholder { color: var(--admin-text-s); opacity: 0.5; }

        .fac-info { display: flex; flex-direction: column; gap: 2px; }
        .fac-title { font-weight: 700; color: var(--admin-text-h); }
        .fac-desc { font-size: 0.75rem; color: var(--admin-text-s); }

        .fac-category-tag {
          font-size: 0.75rem; font-weight: 600; padding: 4px 10px;
          background: var(--admin-surface-2); color: var(--admin-text-m);
          border-radius: 6px; border: 1px solid var(--admin-border-soft);
        }

        /* ── Badges ───────────────────────────────────────── */
        .fac-status-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 0.75rem; font-weight: 600; padding: 4px 10px; border-radius: 999px;
        }
        .fac-status-dot { width: 6px; height: 6px; border-radius: 50%; }
        .fac-status-active { background: var(--admin-success-l); color: #116045; }
        .fac-status-active .fac-status-dot { background: var(--admin-success); }
        .fac-status-inactive { background: #F1F5F9; color: var(--admin-text-m); }
        .fac-status-inactive .fac-status-dot { background: var(--admin-border); }

        /* ── Buttons ──────────────────────────────────────── */
        .fac-edit-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 14px; border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-sm); font-size: 0.75rem;
          font-weight: 600; color: var(--admin-text-m); text-decoration: none;
          transition: all 150ms;
        }
        .fac-edit-btn:hover {
          background: var(--admin-primary-l); border-color: var(--admin-primary); color: var(--admin-primary);
        }

        .fac-table-footer {
          padding: 12px 16px; font-size: 0.75rem; color: var(--admin-text-s);
          background: var(--admin-surface-2); border-top: 1px solid var(--admin-border-soft);
        }

        /* ── Empty ────────────────────────────────────────── */
        .fac-empty {
          display: flex; flex-direction: column; align-items: center;
          padding: 60px 24px; text-align: center; gap: 16px;
          background: var(--admin-surface); border: 2px dashed var(--admin-border-soft);
          border-radius: var(--admin-radius-lg);
        }
        .fac-empty-icon {
          width: 64px; height: 64px; border-radius: 20px;
          background: var(--admin-surface-2); color: var(--admin-text-s);
          display: flex; align-items: center; justify-content: center;
        }
        .fac-empty-title { font-weight: 700; color: var(--admin-text-h); font-family: var(--font-figtree); }
        .fac-empty-desc { font-size: 0.875rem; color: var(--admin-text-s); max-width: 320px; line-height: 1.5; }
      `}</style>
    </div>
  );
}
