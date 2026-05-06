import { api } from '@/lib/api';
import { HelpCircle, Plus, Edit2, MessageCircleQuestion, Layers, ListOrdered } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Manajemen FAQ — Admin RS Bhayangkara',
};

async function getFAQs() {
  const res = await api.get('/faqs');
  
  if (!res.success) {
    console.error('Error fetching FAQs:', res.error);
    return [];
  }

  const items = res.data.data || res.data || [];
  
  // Map camelCase backend ke snake_case yang diharapkan UI
  return items.map(f => ({
    ...f,
    sort_order: f.sortOrder,
    is_active: f.isActive
  }));
}

export default async function FAQsAdminPage() {
  const faqs = await getFAQs();

  // Group by category
  const categories = faqs.reduce((acc, faq) => {
    const cat = faq.category || 'Umum';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {});

  const categoryList = Object.entries(categories);
  const totalCategories = categoryList.length;

  return (
    <div className="faq-page">

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="faq-page-header">
        <div className="faq-page-header-left">
          <div className="faq-page-icon">
            <MessageCircleQuestion size={20} />
          </div>
          <div>
            <h1 className="faq-page-title">Manajemen FAQ</h1>
            <p className="faq-page-desc">Kelola pertanyaan umum dan jawaban untuk pasien.</p>
          </div>
        </div>
        <Link href="/admin/faq/tambah" className="faq-add-btn">
          <Plus size={16} />
          Tambah FAQ
        </Link>
      </div>

      {/* ── Stats Bar ───────────────────────────────────── */}
      {faqs.length > 0 && (
        <div className="faq-stats-bar">
          <div className="faq-stat-item">
            <span className="faq-stat-icon faq-stat-icon-blue">
              <HelpCircle size={14} />
            </span>
            <span className="faq-stat-value">{faqs.length}</span>
            <span className="faq-stat-label">Total Pertanyaan</span>
          </div>
          <div className="faq-stat-divider" />
          <div className="faq-stat-item">
            <span className="faq-stat-icon faq-stat-icon-purple">
              <Layers size={14} />
            </span>
            <span className="faq-stat-value">{totalCategories}</span>
            <span className="faq-stat-label">Kategori</span>
          </div>
          <div className="faq-stat-divider" />
          <div className="faq-stat-item">
            <span className="faq-stat-icon faq-stat-icon-green">
              <ListOrdered size={14} />
            </span>
            <span className="faq-stat-value">
              {totalCategories > 0 ? Math.round(faqs.length / totalCategories) : 0}
            </span>
            <span className="faq-stat-label">Rata-rata / Kategori</span>
          </div>
        </div>
      )}

      {/* ── FAQ Content ─────────────────────────────────── */}
      {faqs.length === 0 ? (
        /* Empty State */
        <div className="faq-empty-state">
          <div className="faq-empty-icon">
            <HelpCircle size={36} strokeWidth={1.2} />
          </div>
          <div>
            <h3 className="faq-empty-title">Belum Ada FAQ</h3>
            <p className="faq-empty-desc">Tambahkan pertanyaan yang sering diajukan pasien untuk membantu mereka.</p>
          </div>
          <Link href="/admin/faq/tambah" className="faq-add-btn">
            <Plus size={15} />
            Tambah FAQ Pertama
          </Link>
        </div>
      ) : (
        /* FAQ Grid (Grouped by Category) */
        <div className="faq-categories-grid">
          {categoryList.map(([catName, items]) => (
            <div key={catName} className="faq-category-card">
              <div className="faq-category-header">
                <div className="faq-category-info">
                  <span className="faq-category-badge">{catName}</span>
                  <span className="faq-category-count">{items.length} Pertanyaan</span>
                </div>
              </div>

              <div className="faq-items-list">
                {items.map((faq) => (
                  <div key={faq.id} className={`faq-item ${!faq.is_active ? 'faq-item-inactive' : ''}`}>
                    <div className="faq-item-main">
                      <h4 className="faq-item-question">
                        {!faq.is_active && <span className="faq-item-hidden-label">Draft:</span>}
                        {faq.question}
                      </h4>
                      <p className="faq-item-answer">{faq.answer}</p>
                    </div>
                    
                    <div className="faq-item-actions">
                      <div className="faq-item-meta">
                        <span className="faq-item-order">#{faq.sort_order}</span>
                      </div>
                      <Link
                        href={`/admin/faq/edit/${faq.id}`}
                        className="faq-edit-btn"
                        aria-label="Edit FAQ"
                      >
                        <Edit2 size={13} />
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        /* ── Page Layout ─────────────────────────────────── */
        .faq-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ── Header ──────────────────────────────────────── */
        .faq-page-header {
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

        .faq-page-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .faq-page-icon {
          width: 44px; height: 44px;
          border-radius: var(--admin-radius-md);
          background: var(--admin-primary-l);
          color: var(--admin-primary);
          display: flex; align-items: center; justify-content: center;
        }

        .faq-page-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--admin-text-h);
          font-family: var(--font-figtree, 'Figtree', sans-serif);
          margin-bottom: 2px;
        }

        .faq-page-desc {
          font-size: 0.8125rem;
          color: var(--admin-text-s);
        }

        /* ── Add Button ─────────────────────────────────── */
        .faq-add-btn {
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

        .faq-add-btn:hover {
          background: var(--admin-primary-h);
          box-shadow: 0 4px 12px rgba(24, 95, 165, 0.25);
        }

        /* ── Stats Bar ───────────────────────────────────── */
        .faq-stats-bar {
          display: flex;
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-lg);
          box-shadow: var(--admin-shadow-xs);
          flex-wrap: wrap;
        }

        .faq-stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          flex: 1;
          min-width: 160px;
        }

        .faq-stat-divider { width: 1px; height: 32px; background: var(--admin-border-soft); margin: auto 0; }
        
        .faq-stat-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .faq-stat-icon-blue   { background: var(--admin-primary-l); color: var(--admin-primary); }
        .faq-stat-icon-purple { background: #F3E8FF; color: #7E22CE; }
        .faq-stat-icon-green  { background: var(--admin-success-l); color: var(--admin-success); }

        .faq-stat-value { font-size: 1.25rem; font-weight: 800; color: var(--admin-text-h); line-height: 1; }
        .faq-stat-label { font-size: 0.75rem; color: var(--admin-text-s); }

        /* ── Empty State ─────────────────────────────────── */
        .faq-empty-state {
          display: flex; flex-direction: column; align-items: center;
          padding: 60px 24px; text-align: center; gap: 16px;
          background: var(--admin-surface); border: 2px dashed var(--admin-border-soft);
          border-radius: var(--admin-radius-lg);
        }
        .faq-empty-icon {
          width: 64px; height: 64px; border-radius: 20px;
          background: var(--admin-surface-2); color: var(--admin-text-s);
          display: flex; align-items: center; justify-content: center;
        }
        .faq-empty-title { font-weight: 700; color: var(--admin-text-h); font-family: var(--font-figtree); }
        .faq-empty-desc { font-size: 0.875rem; color: var(--admin-text-s); max-width: 320px; line-height: 1.5; }

        /* ── FAQ Categories ──────────────────────────────── */
        .faq-categories-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 1024px) {
          .faq-categories-grid { grid-template-columns: 1fr; }
        }

        .faq-category-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-lg);
          overflow: hidden;
          box-shadow: var(--admin-shadow-xs);
        }

        .faq-category-header {
          padding: 12px 20px;
          background: var(--admin-surface-2);
          border-bottom: 1px solid var(--admin-border-soft);
          display: flex; align-items: center; justify-content: space-between;
        }

        .faq-category-info { display: flex; align-items: center; gap: 12px; }
        .faq-category-badge {
          padding: 4px 10px; border-radius: 6px;
          background: var(--admin-primary); color: #fff;
          font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em;
        }
        .faq-category-count { font-size: 0.75rem; color: var(--admin-text-s); font-weight: 500; }

        .faq-items-list { display: flex; flex-direction: column; }

        .faq-item {
          padding: 20px;
          display: flex; gap: 24px;
          border-bottom: 1px solid var(--admin-border-soft);
          transition: background 120ms;
        }
        .faq-item:last-child { border-bottom: none; }
        .faq-item:hover { background: var(--admin-surface-2); }

        .faq-item-inactive { opacity: 0.6; background: #fafafa; }
        .faq-item-hidden-label {
          font-size: 10px; background: #eee; color: #666;
          padding: 1px 4px; border-radius: 4px; margin-right: 6px;
          vertical-align: middle;
        }

        .faq-item-main { flex: 1; min-width: 0; }
        .faq-item-question { font-size: 0.9375rem; font-weight: 700; color: var(--admin-text-h); margin-bottom: 8px; }
        .faq-item-answer { font-size: 0.875rem; color: var(--admin-text-b); line-height: 1.6; }

        .faq-item-actions {
          display: flex; flex-direction: column; align-items: flex-end; gap: 12px;
          flex-shrink: 0;
        }

        .faq-item-order {
          font-size: 0.6875rem; font-weight: 700; color: var(--admin-text-s);
          background: var(--admin-border-soft); padding: 2px 6px; border-radius: 4px;
        }

        .faq-edit-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-sm); font-size: 0.75rem;
          font-weight: 600; color: var(--admin-text-m); text-decoration: none;
          transition: all 150ms;
          background: var(--admin-surface);
        }
        .faq-edit-btn:hover {
          background: var(--admin-primary-l); border-color: var(--admin-primary); color: var(--admin-primary);
        }
      `}</style>
    </div>
  );
}
