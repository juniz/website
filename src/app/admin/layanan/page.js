import { Activity, Plus, Edit2, Heart, CheckCircle, XCircle, Layers } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

export const metadata = {
  title: 'Manajemen Layanan — Admin RS Bhayangkara',
};

async function getServices() {
  const res = await api.get('/services');
  
  if (!res.success) {
    console.error('Error fetching services:', res.error);
    return [];
  }

  // Karena backend ada TransformInterceptor, data asli ada di dalam property 'data'
  const items = res.data.data || res.data || [];
  
  // Map camelCase backend ke snake_case yang diharapkan UI lama (atau sebaliknya)
  // Di sini saya memetakan ke properti yang dibutuhkan oleh komponen ini
  return items.map(s => ({
    ...s,
    icon_name: s.iconName,
    color_code: s.colorCode,
    bg_color_code: s.bgColorCode,
    count_info: s.countInfo,
    is_active: s.isActive,
    sort_order: s.sortOrder
  }));
}

/* Helper untuk render icon dinamis */
function ServiceIcon({ name, color, size = 16 }) {
  const icons = {
    heart: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    users: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    activity: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    monitor: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    zap: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    shield: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    eye: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    ear: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 0 1-7 0"/><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 0 0 4 0"/>
      </svg>
    ),
    bone: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 5 0c0-.81-.7-1.8 0-2.5l7-7z"/>
      </svg>
    ),
    ambulance: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
        <path d="M8 11V7m-2 2h4" strokeWidth="1.75"/>
      </svg>
    ),
  };
  return icons[name] ?? icons.heart;
}

export default async function ServicesAdminPage() {
  const services = await getServices();

  const activeCount   = services.filter((s) => s.is_active).length;
  const inactiveCount = services.length - activeCount;

  return (
    <div className="svc-page">

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="svc-page-header">
        <div className="svc-header-left">
          <div className="svc-page-icon">
            <Activity size={20} />
          </div>
          <div>
            <h1 className="svc-page-title">Manajemen Layanan</h1>
            <p className="svc-page-desc">Kelola poli klinik dan layanan medis unggulan rumah sakit.</p>
          </div>
        </div>
        <Link href="/admin/layanan/tambah" className="svc-add-btn">
          <Plus size={16} />
          Tambah Layanan
        </Link>
      </div>

      {/* ── Stats Bar ───────────────────────────────────── */}
      {services.length > 0 && (
        <div className="svc-stats-bar">
          <div className="svc-stat-item">
            <span className="svc-stat-icon svc-stat-blue">
              <Layers size={14} />
            </span>
            <span className="svc-stat-value">{services.length}</span>
            <span className="svc-stat-label">Total Layanan</span>
          </div>
          <div className="svc-stat-divider" />
          <div className="svc-stat-item">
            <span className="svc-stat-icon svc-stat-green">
              <CheckCircle size={14} />
            </span>
            <span className="svc-stat-value">{activeCount}</span>
            <span className="svc-stat-label">Aktif</span>
          </div>
          <div className="svc-stat-divider" />
          <div className="svc-stat-item">
            <span className="svc-stat-icon svc-stat-muted">
              <XCircle size={14} />
            </span>
            <span className="svc-stat-value">{inactiveCount}</span>
            <span className="svc-stat-label">Nonaktif</span>
          </div>
        </div>
      )}

      {/* ── Content ─────────────────────────────────────── */}
      {services.length === 0 ? (
        /* Empty State */
        <div className="svc-empty">
          <div className="svc-empty-icon">
            <Activity size={36} strokeWidth={1.2} />
          </div>
          <div>
            <h3 className="svc-empty-title">Belum Ada Layanan</h3>
            <p className="svc-empty-desc">Tambahkan layanan medis atau poli klinik untuk ditampilkan di website.</p>
          </div>
          <Link href="/admin/layanan/tambah" className="svc-add-btn">
            <Plus size={15} />
            Tambah Layanan Pertama
          </Link>
        </div>
      ) : (
        /* Table */
        <div className="svc-table-card">
          <div className="svc-table-wrap">
            <table className="svc-table">
              <thead>
                <tr>
                  <th className="svc-th svc-th-no">#</th>
                  <th className="svc-th">Layanan</th>
                  <th className="svc-th">Info Tambahan</th>
                  <th className="svc-th svc-th-center">Status</th>
                  <th className="svc-th svc-th-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={service.id} className="svc-tr">

                    {/* No urut */}
                    <td className="svc-td svc-td-no">
                      <span className="svc-row-index">{index + 1}</span>
                    </td>

                    {/* Layanan */}
                    <td className="svc-td">
                      <div className="svc-service-cell">
                        <div
                          className="svc-color-icon"
                          style={{
                            background: service.bg_color_code || 'var(--admin-primary-l)',
                          }}
                          aria-hidden="true"
                        >
                          <ServiceIcon 
                            name={service.icon_name} 
                            color={service.color_code || 'var(--admin-primary)'} 
                          />
                        </div>
                        <div className="svc-service-info">
                          <span className="svc-service-name">{service.name}</span>
                          <span className="svc-service-slug">/{service.slug}</span>
                        </div>
                      </div>
                    </td>

                    {/* Info Tambahan */}
                    <td className="svc-td">
                      <span className="svc-count-info">
                        {service.count_info || <span style={{ color: 'var(--admin-text-s)', fontStyle: 'italic' }}>—</span>}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="svc-td svc-td-center">
                      <span className={`svc-status-badge ${service.is_active ? 'svc-status-active' : 'svc-status-inactive'}`}>
                        <span className="svc-status-dot" />
                        {service.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="svc-td svc-td-right">
                      <Link
                        href={`/admin/layanan/edit/${service.id}`}
                        className="svc-edit-btn"
                        aria-label={`Edit layanan ${service.name}`}
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
          <div className="svc-table-footer">
            Menampilkan <strong>{services.length}</strong> layanan
          </div>
        </div>
      )}

      <style>{`
        /* ── Page ───────────────────────────────────────── */
        .svc-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ── Page Header ────────────────────────────────── */
        .svc-page-header {
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

        .svc-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 0;
        }

        .svc-page-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--admin-radius-md);
          background: var(--admin-primary-l);
          color: var(--admin-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .svc-page-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--admin-text-h);
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          margin-bottom: 2px;
        }

        .svc-page-desc {
          font-size: 0.8125rem;
          color: var(--admin-text-s);
          line-height: 1.5;
        }

        /* ── Add Button ─────────────────────────────────── */
        .svc-add-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          background: var(--admin-primary);
          color: #fff;
          border: none;
          border-radius: var(--admin-radius-sm);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          transition: background 150ms, box-shadow 150ms, transform 100ms;
          min-height: 40px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .svc-add-btn:hover {
          background: var(--admin-primary-h);
          box-shadow: 0 3px 10px rgba(24, 95, 165, 0.28);
        }

        .svc-add-btn:active { transform: scale(0.98); }

        /* ── Stats Bar ──────────────────────────────────── */
        .svc-stats-bar {
          display: flex;
          align-items: center;
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-lg);
          box-shadow: var(--admin-shadow-xs);
          overflow: hidden;
        }

        .svc-stat-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          flex: 1;
        }

        .svc-stat-divider {
          width: 1px;
          height: 32px;
          background: var(--admin-border-soft);
          flex-shrink: 0;
        }

        .svc-stat-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .svc-stat-blue  { background: var(--admin-primary-l); color: var(--admin-primary); }
        .svc-stat-green { background: var(--admin-success-l); color: var(--admin-success); }
        .svc-stat-muted { background: #F1F5F9; color: var(--admin-text-m); }

        .svc-stat-value {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--admin-text-h);
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }

        .svc-stat-label {
          font-size: 0.75rem;
          color: var(--admin-text-s);
          line-height: 1.4;
        }

        /* ── Table Card ─────────────────────────────────── */
        .svc-table-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-lg);
          box-shadow: var(--admin-shadow-xs);
          overflow: hidden;
        }

        .svc-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .svc-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          min-width: 580px;
        }

        /* ── Table Head ─────────────────────────────────── */
        .svc-th {
          padding: 12px 16px;
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--admin-text-s);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          background: var(--admin-surface-2);
          border-bottom: 1px solid var(--admin-border-soft);
          white-space: nowrap;
        }

        .svc-th-no     { width: 48px; text-align: center; }
        .svc-th-center { text-align: center; }
        .svc-th-right  { text-align: right; }

        /* ── Table Rows ─────────────────────────────────── */
        .svc-tr {
          border-bottom: 1px solid var(--admin-border-soft);
          transition: background 120ms;
        }

        .svc-tr:last-child { border-bottom: none; }

        .svc-tr:hover { background: var(--admin-surface-2); }

        .svc-td {
          padding: 14px 16px;
          font-size: 0.875rem;
          color: var(--admin-text-b);
          vertical-align: middle;
        }

        .svc-td-no     { text-align: center; width: 48px; }
        .svc-td-center { text-align: center; }
        .svc-td-right  { text-align: right; }

        /* Row index */
        .svc-row-index {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: var(--admin-border-soft);
          color: var(--admin-text-s);
          font-size: 0.6875rem;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }

        /* ── Service Cell ───────────────────────────────── */
        .svc-service-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .svc-color-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--admin-radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .svc-service-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .svc-service-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--admin-text-h);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .svc-service-slug {
          font-size: 0.75rem;
          color: var(--admin-text-s);
          font-family: 'Courier New', monospace;
        }

        /* ── Count Info ─────────────────────────────────── */
        .svc-count-info {
          font-size: 0.8125rem;
          color: var(--admin-text-m);
        }

        /* ── Status Badge ───────────────────────────────── */
        .svc-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
          white-space: nowrap;
        }

        .svc-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .svc-status-active {
          background: var(--admin-success-l);
          color: #116045;
        }

        .svc-status-active .svc-status-dot {
          background: var(--admin-success);
        }

        .svc-status-inactive {
          background: #F1F5F9;
          color: var(--admin-text-m);
        }

        .svc-status-inactive .svc-status-dot {
          background: var(--admin-border);
        }

        /* ── Edit Button ────────────────────────────────── */
        .svc-edit-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-sm);
          background: transparent;
          color: var(--admin-text-m);
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          font-family: inherit;
          transition: all 150ms;
          white-space: nowrap;
          min-height: 32px;
        }

        .svc-edit-btn:hover {
          background: var(--admin-primary-l);
          border-color: var(--admin-primary);
          color: var(--admin-primary);
        }

        /* ── Table Footer ───────────────────────────────── */
        .svc-table-footer {
          padding: 12px 16px;
          font-size: 0.75rem;
          color: var(--admin-text-s);
          background: var(--admin-surface-2);
          border-top: 1px solid var(--admin-border-soft);
        }

        /* ── Empty State ────────────────────────────────── */
        .svc-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          text-align: center;
          padding: 56px 24px;
          background: var(--admin-surface);
          border: 1px dashed var(--admin-border);
          border-radius: var(--admin-radius-lg);
        }

        .svc-empty-icon {
          width: 72px;
          height: 72px;
          border-radius: var(--admin-radius-xl);
          background: var(--admin-surface-2);
          color: var(--admin-text-s);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .svc-empty-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--admin-text-h);
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          margin-bottom: 4px;
        }

        .svc-empty-desc {
          font-size: 0.875rem;
          color: var(--admin-text-s);
          line-height: 1.5;
        }

        /* ── Mobile ─────────────────────────────────────── */
        @media (max-width: 640px) {
          .svc-page-header { padding: 16px; }
          .svc-stat-label  { display: none; }
          .svc-stat-item   { padding: 12px 14px; }
          .svc-th, .svc-td { padding: 12px; }
        }
      `}</style>
    </div>
  );
}
