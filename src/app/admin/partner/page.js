import { api } from '@/lib/api';
import { Handshake, Plus, Edit2, ExternalLink, CheckCircle, XCircle, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';

export const metadata = {
  title: 'Manajemen Partner — Admin RS Bhayangkara',
};

async function getPartners() {
  const res = await api.get('/partners');
  
  if (!res.success) {
    console.error('Error fetching partners:', res.error);
    return [];
  }

  const items = res.data.data || res.data || [];
  
  // Map camelCase backend ke snake_case yang diharapkan UI
  return items.map(p => ({
    ...p,
    logo_url: p.logoUrl,
    sort_order: p.sortOrder,
    is_active: p.isActive
  }));
}

export default async function PartnerAdminPage() {
  const partners = await getPartners();

  const activeCount   = partners.filter((p) => p.is_active).length;
  const inactiveCount = partners.length - activeCount;

  return (
    <div className="pt-page">

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="pt-page-header">
        <div className="pt-header-left">
          <div className="pt-page-icon">
            <Handshake size={20} />
          </div>
          <div>
            <h1 className="pt-page-title">Manajemen Partner</h1>
            <p className="pt-page-desc">Kelola logo dan link mitra kerjasama, asuransi, dan instansi terkait.</p>
          </div>
        </div>
        <Link href="/admin/partner/tambah" className="pt-add-btn">
          <Plus size={16} />
          Tambah Partner
        </Link>
      </div>

      {/* ── Stats Bar ───────────────────────────────────── */}
      {partners.length > 0 && (
        <div className="pt-stats-bar">
          <div className="pt-stat-item">
            <span className="pt-stat-icon pt-stat-blue">
              <Handshake size={14} />
            </span>
            <span className="pt-stat-value">{partners.length}</span>
            <span className="pt-stat-label">Total Partner</span>
          </div>
          <div className="pt-stat-divider" />
          <div className="pt-stat-item">
            <span className="pt-stat-icon pt-stat-green">
              <CheckCircle size={14} />
            </span>
            <span className="pt-stat-value">{activeCount}</span>
            <span className="pt-stat-label">Aktif</span>
          </div>
          <div className="pt-stat-divider" />
          <div className="pt-stat-item">
            <span className="pt-stat-icon pt-stat-muted">
              <XCircle size={14} />
            </span>
            <span className="pt-stat-value">{inactiveCount}</span>
            <span className="pt-stat-label">Nonaktif</span>
          </div>
        </div>
      )}

      {/* ── Content ─────────────────────────────────────── */}
      {partners.length === 0 ? (
        /* Empty State */
        <div className="pt-empty">
          <div className="pt-empty-icon">
            <Handshake size={36} strokeWidth={1.2} />
          </div>
          <div>
            <h3 className="pt-empty-title">Belum Ada Partner</h3>
            <p className="pt-empty-desc">Tambahkan mitra asuransi atau instansi yang bekerjasama dengan RS Bhayangkara.</p>
          </div>
          <Link href="/admin/partner/tambah" className="pt-add-btn">
            <Plus size={15} />
            Tambah Partner Pertama
          </Link>
        </div>
      ) : (
        /* Table Card */
        <div className="pt-table-card">
          <div className="pt-table-wrap">
            <table className="pt-table">
              <thead>
                <tr>
                  <th className="pt-th pt-th-no">#</th>
                  <th className="pt-th">Partner & Logo</th>
                  <th className="pt-th">Link / Website</th>
                  <th className="pt-th pt-th-center">Status</th>
                  <th className="pt-th pt-th-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((pt, index) => (
                  <tr key={pt.id} className="pt-tr">

                    {/* No urut */}
                    <td className="pt-td pt-td-no">
                      <span className="pt-row-index">{index + 1}</span>
                    </td>

                    {/* Partner */}
                    <td className="pt-td" style={{ minWidth: '240px' }}>
                      <div className="pt-item-cell">
                        <div className="pt-img-wrap">
                          {pt.logo_url ? (
                            <img src={getImageUrl(pt.logo_url)} alt={pt.name} className="pt-img" />
                          ) : (
                            <ImageIcon size={18} className="pt-img-placeholder" />
                          )}
                        </div>
                        <div className="pt-info">
                          <span className="pt-title">{pt.name}</span>
                          <span className="pt-order">Urutan: {pt.sort_order}</span>
                        </div>
                      </div>
                    </td>

                    {/* Link */}
                    <td className="pt-td">
                      {pt.link ? (
                        <a 
                          href={pt.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="pt-link-text"
                        >
                          <ExternalLink size={12} />
                          {pt.link.replace(/^https?:\/\//, '').split('/')[0]}
                        </a>
                      ) : (
                        <span className="pt-no-link">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="pt-td pt-td-center">
                      <span className={`pt-status-badge ${pt.is_active ? 'pt-status-active' : 'pt-status-inactive'}`}>
                        <span className="pt-status-dot" />
                        {pt.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="pt-td pt-td-right">
                      <Link
                        href={`/admin/partner/edit/${pt.id}`}
                        className="pt-edit-btn"
                        aria-label={`Edit ${pt.name}`}
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
          <div className="pt-table-footer">
            Menampilkan <strong>{partners.length}</strong> partner kerjasama
          </div>
        </div>
      )}

      <style>{`
        /* ── Page Layout ─────────────────────────────────── */
        .pt-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ── Header ──────────────────────────────────────── */
        .pt-page-header {
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

        .pt-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .pt-page-icon {
          width: 44px; height: 44px;
          border-radius: var(--admin-radius-md);
          background: var(--admin-primary-l);
          color: var(--admin-primary);
          display: flex; align-items: center; justify-content: center;
        }

        .pt-page-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--admin-text-h);
          font-family: var(--font-figtree, 'Figtree', sans-serif);
          margin-bottom: 2px;
        }

        .pt-page-desc {
          font-size: 0.8125rem;
          color: var(--admin-text-s);
        }

        /* ── Add Button ─────────────────────────────────── */
        .pt-add-btn {
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

        .pt-add-btn:hover {
          background: var(--admin-primary-h);
          box-shadow: 0 4px 12px rgba(24, 95, 165, 0.25);
        }

        /* ── Stats ────────────────────────────────────────── */
        .pt-stats-bar {
          display: flex;
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-lg);
          box-shadow: var(--admin-shadow-xs);
        }

        .pt-stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          flex: 1;
        }

        .pt-stat-divider { width: 1px; height: 32px; background: var(--admin-border-soft); margin: auto 0; }
        
        .pt-stat-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .pt-stat-blue  { background: var(--admin-primary-l); color: var(--admin-primary); }
        .pt-stat-green { background: var(--admin-success-l); color: var(--admin-success); }
        .pt-stat-muted { background: #F1F5F9; color: var(--admin-text-m); }

        .pt-stat-value { font-size: 1.25rem; font-weight: 800; color: var(--admin-text-h); line-height: 1; }
        .pt-stat-label { font-size: 0.75rem; color: var(--admin-text-s); }

        /* ── Table ────────────────────────────────────────── */
        .pt-table-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-lg);
          overflow: hidden;
          box-shadow: var(--admin-shadow-xs);
        }

        .pt-table-wrap { overflow-x: auto; }
        .pt-table { width: 100%; border-collapse: collapse; text-align: left; }

        .pt-th {
          padding: 12px 16px;
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--admin-text-s);
          text-transform: uppercase;
          background: var(--admin-surface-2);
          border-bottom: 1px solid var(--admin-border-soft);
        }
        .pt-th-no { width: 48px; text-align: center; }
        .pt-th-center { text-align: center; }
        .pt-th-right { text-align: right; }

        .pt-tr { border-bottom: 1px solid var(--admin-border-soft); transition: background 120ms; }
        .pt-tr:hover { background: var(--admin-surface-2); }
        .pt-td { padding: 12px 16px; font-size: 0.875rem; color: var(--admin-text-b); vertical-align: middle; }
        .pt-td-no { text-align: center; }
        .pt-td-center { text-align: center; }
        .pt-td-right { text-align: right; }

        .pt-row-index {
          display: inline-flex; align-items: center; justify-content: center;
          width: 24px; height: 24px; border-radius: 6px;
          background: var(--admin-border-soft); color: var(--admin-text-s);
          font-size: 0.6875rem; font-weight: 700;
        }

        /* ── Item Cell ────────────────────────────────────── */
        .pt-item-cell { display: flex; align-items: center; gap: 12px; }
        .pt-img-wrap {
          width: 48px; height: 48px; border-radius: 10px;
          background: var(--admin-surface-2); overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid var(--admin-border-soft); flex-shrink: 0;
        }
        .pt-img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
        .pt-img-placeholder { color: var(--admin-text-s); opacity: 0.5; }

        .pt-info { display: flex; flex-direction: column; gap: 2px; }
        .pt-title { font-weight: 700; color: var(--admin-text-h); }
        .pt-order { font-size: 0.75rem; color: var(--admin-text-s); }

        .pt-link-text {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 0.8125rem; color: var(--admin-primary);
          text-decoration: none; font-weight: 500;
        }
        .pt-link-text:hover { text-decoration: underline; }
        .pt-no-link { color: var(--admin-text-s); opacity: 0.5; font-size: 0.75rem; }

        /* ── Badges ───────────────────────────────────────── */
        .pt-status-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 0.75rem; font-weight: 600; padding: 4px 10px; border-radius: 999px;
        }
        .pt-status-dot { width: 6px; height: 6px; border-radius: 50%; }
        .pt-status-active { background: var(--admin-success-l); color: #116045; }
        .pt-status-active .pt-status-dot { background: var(--admin-success); }
        .pt-status-inactive { background: #F1F5F9; color: var(--admin-text-m); }
        .pt-status-inactive .pt-status-dot { background: var(--admin-border); }

        /* ── Buttons ──────────────────────────────────────── */
        .pt-edit-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 14px; border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-sm); font-size: 0.75rem;
          font-weight: 600; color: var(--admin-text-m); text-decoration: none;
          transition: all 150ms;
        }
        .pt-edit-btn:hover {
          background: var(--admin-primary-l); border-color: var(--admin-primary); color: var(--admin-primary);
        }

        .pt-table-footer {
          padding: 12px 16px; font-size: 0.75rem; color: var(--admin-text-s);
          background: var(--admin-surface-2); border-top: 1px solid var(--admin-border-soft);
        }

        /* ── Empty ────────────────────────────────────────── */
        .pt-empty {
          display: flex; flex-direction: column; align-items: center;
          padding: 60px 24px; text-align: center; gap: 16px;
          background: var(--admin-surface); border: 2px dashed var(--admin-border-soft);
          border-radius: var(--admin-radius-lg);
        }
        .pt-empty-icon {
          width: 64px; height: 64px; border-radius: 20px;
          background: var(--admin-surface-2); color: var(--admin-text-s);
          display: flex; align-items: center; justify-content: center;
        }
        .pt-empty-title { font-weight: 700; color: var(--admin-text-h); font-family: var(--font-figtree); }
        .pt-empty-desc { font-size: 0.875rem; color: var(--admin-text-s); max-width: 320px; line-height: 1.5; }
      `}</style>
    </div>
  );
}
