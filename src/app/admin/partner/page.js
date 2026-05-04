import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { Handshake, Plus, Edit2, Globe, Image as ImageIcon, Building2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Manajemen Partner — Admin RS Bhayangkara',
};

async function getPartners() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching partners:', error);
    return [];
  }

  return data;
}

export default async function PartnersAdminPage() {
  const partners = await getPartners();

  const activeCount   = partners.filter((p) => p.is_active).length;
  const inactiveCount = partners.length - activeCount;

  return (
    <div className="partner-page">

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="partner-page-header">
        <div className="partner-header-left">
          <div className="partner-page-icon">
            <Handshake size={20} />
          </div>
          <div>
            <h1 className="partner-page-title">Manajemen Partner</h1>
            <p className="partner-page-desc">Kelola daftar asuransi dan mitra kerjasama rumah sakit.</p>
          </div>
        </div>
        <Link href="/admin/partner/tambah" className="partner-add-btn">
          <Plus size={16} />
          Tambah Partner
        </Link>
      </div>

      {/* ── Stats Bar ───────────────────────────────────── */}
      {partners.length > 0 && (
        <div className="partner-stats-bar">
          <div className="partner-stat-item">
            <span className="partner-stat-icon partner-stat-blue">
              <Building2 size={14} />
            </span>
            <span className="partner-stat-value">{partners.length}</span>
            <span className="partner-stat-label">Total Partner</span>
          </div>
          <div className="partner-stat-divider" />
          <div className="partner-stat-item">
            <span className="partner-stat-icon partner-stat-green">
              <CheckCircle size={14} />
            </span>
            <span className="partner-stat-value">{activeCount}</span>
            <span className="partner-stat-label">Aktif</span>
          </div>
          <div className="partner-stat-divider" />
          <div className="partner-stat-item">
            <span className="partner-stat-icon partner-stat-muted">
              <XCircle size={14} />
            </span>
            <span className="partner-stat-value">{inactiveCount}</span>
            <span className="partner-stat-label">Nonaktif</span>
          </div>
        </div>
      )}

      {/* ── Partner Grid ────────────────────────────────── */}
      {partners.length === 0 ? (
        /* Empty State */
        <div className="partner-empty-state">
          <div className="partner-empty-icon">
            <Handshake size={36} strokeWidth={1.2} />
          </div>
          <div>
            <h3 className="partner-empty-title">Belum Ada Partner</h3>
            <p className="partner-empty-desc">Tambahkan mitra asuransi atau kerjasama untuk ditampilkan di website.</p>
          </div>
          <Link href="/admin/partner/tambah" className="partner-add-btn">
            <Plus size={15} />
            Tambah Partner Pertama
          </Link>
        </div>
      ) : (
        <div className="partner-grid">
          {partners.map((partner) => (
            <div key={partner.id} className={`partner-card ${!partner.is_active ? 'partner-card-inactive' : ''}`}>

              {/* Logo Area */}
              <div className="partner-logo-wrap">
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={`Logo ${partner.name}`}
                    className="partner-logo-img"
                  />
                ) : (
                  <div className="partner-logo-placeholder">
                    <ImageIcon size={28} strokeWidth={1.2} />
                  </div>
                )}

                {/* Status badge */}
                <span className={`partner-status-badge ${partner.is_active ? 'partner-status-active' : 'partner-status-inactive'}`}>
                  {partner.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>

              {/* Info */}
              <div className="partner-info">
                <h3 className="partner-name" title={partner.name}>{partner.name}</h3>

                {partner.website_url ? (
                  <a
                    href={partner.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="partner-website-link"
                    aria-label={`Kunjungi website ${partner.name}`}
                  >
                    <Globe size={11} />
                    Kunjungi Website
                  </a>
                ) : (
                  <span className="partner-no-website">—</span>
                )}
              </div>

              {/* Actions */}
              <div className="partner-actions">
                <Link
                  href={`/admin/partner/edit/${partner.id}`}
                  className="partner-edit-btn"
                  aria-label={`Edit partner ${partner.name}`}
                >
                  <Edit2 size={13} />
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        /* ── Page ───────────────────────────────────────── */
        .partner-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ── Page Header ────────────────────────────────── */
        .partner-page-header {
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

        .partner-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 0;
        }

        .partner-page-icon {
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

        .partner-page-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--admin-text-h);
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          margin-bottom: 2px;
        }

        .partner-page-desc {
          font-size: 0.8125rem;
          color: var(--admin-text-s);
          line-height: 1.5;
        }

        /* ── Add Button ─────────────────────────────────── */
        .partner-add-btn {
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

        .partner-add-btn:hover {
          background: var(--admin-primary-h);
          box-shadow: 0 3px 10px rgba(24, 95, 165, 0.28);
        }

        .partner-add-btn:active {
          transform: scale(0.98);
        }

        /* ── Stats Bar ──────────────────────────────────── */
        .partner-stats-bar {
          display: flex;
          align-items: center;
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-lg);
          box-shadow: var(--admin-shadow-xs);
          overflow: hidden;
        }

        .partner-stat-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          flex: 1;
        }

        .partner-stat-divider {
          width: 1px;
          height: 32px;
          background: var(--admin-border-soft);
          flex-shrink: 0;
        }

        .partner-stat-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .partner-stat-blue  { background: var(--admin-primary-l); color: var(--admin-primary); }
        .partner-stat-green { background: var(--admin-success-l); color: var(--admin-success); }
        .partner-stat-muted { background: #F1F5F9; color: var(--admin-text-m); }

        .partner-stat-value {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--admin-text-h);
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }

        .partner-stat-label {
          font-size: 0.75rem;
          color: var(--admin-text-s);
          line-height: 1.4;
        }

        /* ── Partner Grid ───────────────────────────────── */
        .partner-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        @media (min-width: 640px) {
          .partner-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (min-width: 1024px) {
          .partner-grid { grid-template-columns: repeat(4, 1fr); }
        }

        @media (min-width: 1280px) {
          .partner-grid { grid-template-columns: repeat(5, 1fr); }
        }

        /* ── Partner Card ───────────────────────────────── */
        .partner-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-lg);
          box-shadow: var(--admin-shadow-xs);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: box-shadow 200ms, border-color 200ms, transform 200ms;
        }

        .partner-card:hover {
          box-shadow: var(--admin-shadow-md);
          border-color: var(--admin-primary-t);
          transform: translateY(-2px);
        }

        .partner-card-inactive {
          opacity: 0.6;
        }

        .partner-card-inactive:hover {
          opacity: 0.85;
        }

        /* ── Logo Area ──────────────────────────────────── */
        .partner-logo-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          background: var(--admin-surface-2);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          border-bottom: 1px solid var(--admin-border-soft);
          overflow: hidden;
        }

        .partner-logo-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          mix-blend-mode: multiply;
        }

        .partner-logo-placeholder {
          color: var(--admin-border);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Status Badge ───────────────────────────────── */
        .partner-status-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 0.625rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 999px;
          line-height: 1.6;
          letter-spacing: 0.04em;
        }

        .partner-status-active {
          background: var(--admin-success-l);
          color: #116045;
        }

        .partner-status-inactive {
          background: #F1F5F9;
          color: var(--admin-text-m);
        }

        /* ── Info ───────────────────────────────────────── */
        .partner-info {
          padding: 12px 14px 8px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .partner-name {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--admin-text-h);
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .partner-website-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.6875rem;
          color: var(--admin-primary);
          text-decoration: none;
          line-height: 1.4;
          transition: opacity 150ms;
        }

        .partner-website-link:hover {
          text-decoration: underline;
          opacity: 0.8;
        }

        .partner-no-website {
          font-size: 0.75rem;
          color: var(--admin-text-s);
        }

        /* ── Actions ────────────────────────────────────── */
        .partner-actions {
          padding: 8px 14px 12px;
          display: flex;
          gap: 6px;
          border-top: 1px solid var(--admin-border-soft);
        }

        .partner-edit-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          flex: 1;
          padding: 6px 10px;
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-sm);
          background: transparent;
          color: var(--admin-text-m);
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          font-family: inherit;
          transition: all 150ms;
          min-height: 30px;
        }

        .partner-edit-btn:hover {
          background: var(--admin-primary-l);
          border-color: var(--admin-primary);
          color: var(--admin-primary);
        }

        /* ── Empty State ────────────────────────────────── */
        .partner-empty-state {
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

        .partner-empty-icon {
          width: 72px;
          height: 72px;
          border-radius: var(--admin-radius-xl);
          background: var(--admin-surface-2);
          color: var(--admin-text-s);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .partner-empty-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--admin-text-h);
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          margin-bottom: 4px;
        }

        .partner-empty-desc {
          font-size: 0.875rem;
          color: var(--admin-text-s);
          line-height: 1.5;
        }

        /* ── Mobile ─────────────────────────────────────── */
        @media (max-width: 640px) {
          .partner-page-header { padding: 16px; }
          .partner-stat-label  { display: none; }
          .partner-stat-item   { padding: 12px 14px; }
        }
      `}</style>
    </div>
  );
}
