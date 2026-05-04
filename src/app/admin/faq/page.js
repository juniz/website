import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { HelpCircle, Plus, Edit2, MessageCircleQuestion, Layers, ListOrdered } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Manajemen FAQ — Admin RS Bhayangkara',
};

async function getFAQs() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }

  return data;
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
            <p className="faq-empty-desc">Mulai tambahkan pertanyaan umum untuk membantu pasien.</p>
          </div>
          <Link href="/admin/faq/tambah" className="faq-add-btn">
            <Plus size={15} />
            Tambah FAQ Pertama
          </Link>
        </div>
      ) : (
        /* Category Groups */
        <div className="faq-categories">
          {categoryList.map(([cat, items]) => (
            <div key={cat} className="faq-category-group">
              {/* Category Header */}
              <div className="faq-category-header">
                <div className="faq-category-header-left">
                  <div className="faq-category-dot" />
                  <h2 className="faq-category-title">{cat}</h2>
                  <span className="faq-category-count">{items.length}</span>
                </div>
                <Link
                  href={`/admin/faq/tambah?category=${encodeURIComponent(cat)}`}
                  className="faq-category-add-btn"
                  title={`Tambah FAQ ke kategori ${cat}`}
                >
                  <Plus size={13} />
                  Tambah
                </Link>
              </div>

              {/* FAQ Items */}
              <div className="faq-items-list">
                {items.map((faq, index) => (
                  <div key={faq.id} className="faq-item">
                    <div className="faq-item-index">{index + 1}</div>
                    <div className="faq-item-content">
                      <h3 className="faq-item-question">{faq.question}</h3>
                      <p className="faq-item-answer">{faq.answer}</p>
                    </div>
                    <div className="faq-item-actions">
                      <Link
                        href={`/admin/faq/edit/${faq.id}`}
                        className="faq-item-edit-btn"
                        aria-label={`Edit FAQ: ${faq.question}`}
                      >
                        <Edit2 size={14} />
                        <span>Edit</span>
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
        /* ── Page Layout ────────────────────────────────── */
        .faq-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ── Page Header ────────────────────────────────── */
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
          min-width: 0;
        }

        .faq-page-icon {
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

        .faq-page-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--admin-text-h);
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          margin-bottom: 2px;
        }

        .faq-page-desc {
          font-size: 0.8125rem;
          color: var(--admin-text-s);
          line-height: 1.5;
        }

        /* ── Add Button ─────────────────────────────────── */
        .faq-add-btn {
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

        .faq-add-btn:hover {
          background: var(--admin-primary-h);
          box-shadow: 0 3px 10px rgba(24, 95, 165, 0.28);
        }

        .faq-add-btn:active {
          transform: scale(0.98);
        }

        /* ── Stats Bar ──────────────────────────────────── */
        .faq-stats-bar {
          display: flex;
          align-items: center;
          gap: 0;
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-lg);
          box-shadow: var(--admin-shadow-xs);
          overflow: hidden;
        }

        .faq-stat-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          flex: 1;
        }

        .faq-stat-divider {
          width: 1px;
          height: 32px;
          background: var(--admin-border-soft);
          flex-shrink: 0;
        }

        .faq-stat-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .faq-stat-icon-blue {
          background: var(--admin-primary-l);
          color: var(--admin-primary);
        }

        .faq-stat-icon-purple {
          background: #EDE9FE;
          color: #7C3AED;
        }

        .faq-stat-icon-green {
          background: var(--admin-success-l);
          color: var(--admin-success);
        }

        .faq-stat-value {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--admin-text-h);
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }

        .faq-stat-label {
          font-size: 0.75rem;
          color: var(--admin-text-s);
          line-height: 1.4;
        }

        /* ── Categories Container ───────────────────────── */
        .faq-categories {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Category Group ─────────────────────────────── */
        .faq-category-group {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-lg);
          box-shadow: var(--admin-shadow-xs);
          overflow: hidden;
        }

        /* ── Category Header ────────────────────────────── */
        .faq-category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 20px;
          background: var(--admin-surface-2);
          border-bottom: 1px solid var(--admin-border-soft);
        }

        .faq-category-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .faq-category-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--admin-primary);
          flex-shrink: 0;
        }

        .faq-category-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--admin-text-h);
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          letter-spacing: -0.01em;
        }

        .faq-category-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 22px;
          height: 22px;
          padding: 0 6px;
          background: var(--admin-primary-l);
          color: var(--admin-primary);
          border-radius: 999px;
          font-size: 0.6875rem;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }

        .faq-category-add-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 11px;
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-sm);
          background: var(--admin-surface);
          color: var(--admin-text-m);
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          font-family: inherit;
          transition: all 150ms;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .faq-category-add-btn:hover {
          background: var(--admin-primary-l);
          border-color: var(--admin-primary);
          color: var(--admin-primary);
        }

        /* ── FAQ Items List ─────────────────────────────── */
        .faq-items-list {
          display: flex;
          flex-direction: column;
        }

        /* ── FAQ Item ───────────────────────────────────── */
        .faq-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 14px 20px;
          border-bottom: 1px solid var(--admin-border-soft);
          transition: background 150ms;
          position: relative;
        }

        .faq-item:last-child {
          border-bottom: none;
        }

        .faq-item:hover {
          background: var(--admin-surface-2);
        }

        .faq-item:hover .faq-item-actions {
          opacity: 1;
        }

        .faq-item-index {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: var(--admin-border-soft);
          color: var(--admin-text-s);
          font-size: 0.6875rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
          font-variant-numeric: tabular-nums;
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
        }

        .faq-item-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .faq-item-question {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--admin-text-h);
          line-height: 1.5;
        }

        .faq-item-answer {
          font-size: 0.8125rem;
          color: var(--admin-text-m);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ── Item Actions ───────────────────────────────── */
        .faq-item-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          opacity: 0;
          transition: opacity 150ms;
          flex-shrink: 0;
        }

        .faq-item-edit-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-sm);
          background: var(--admin-surface);
          color: var(--admin-text-m);
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          font-family: inherit;
          cursor: pointer;
          transition: all 150ms;
          white-space: nowrap;
          min-height: 32px;
        }

        .faq-item-edit-btn:hover {
          background: var(--admin-primary-l);
          border-color: var(--admin-primary);
          color: var(--admin-primary);
        }

        /* ── Mobile: always show actions ─────────────────── */
        @media (max-width: 640px) {
          .faq-item-actions {
            opacity: 1;
          }

          .faq-item-edit-btn span {
            display: none;
          }

          .faq-item-edit-btn {
            padding: 6px;
            min-width: 32px;
            justify-content: center;
          }

          .faq-stat-label {
            display: none;
          }

          .faq-stat-item {
            padding: 12px 14px;
          }

          .faq-page-header {
            padding: 16px;
          }
        }

        /* ── Empty State ────────────────────────────────── */
        .faq-empty-state {
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

        .faq-empty-icon {
          width: 72px;
          height: 72px;
          border-radius: var(--admin-radius-xl);
          background: var(--admin-surface-2);
          color: var(--admin-text-s);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .faq-empty-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--admin-text-h);
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          margin-bottom: 4px;
        }

        .faq-empty-desc {
          font-size: 0.875rem;
          color: var(--admin-text-s);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
