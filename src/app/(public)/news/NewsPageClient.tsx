'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatDateId } from '@/lib/data/shared';
import { getImageUrl } from '@/lib/utils';
import PageHero from '@/components/PageHero';
import { NewsArticle } from '@/types/api';

const categories = [
  { code: 'all',         label: 'Semua' },
  { code: 'Kesehatan',   label: 'Kesehatan' },
  { code: 'Pengumuman',  label: 'Pengumuman' },
  { code: 'Program',     label: 'Program' },
];

interface NewsPageClientProps {
  initialNews?: NewsArticle[];
}

export default function NewsPageClient({ initialNews = [] }: NewsPageClientProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return initialNews.filter((article) => {
      const matchCat = activeCategory === 'all' || article.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || article.title.toLowerCase().includes(q) || article.excerpt?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery, initialNews]);

  return (
    <>
      {/* Page Header */}
      <PageHero
        breadcrumb="Berita &amp; Informasi"
        title="Berita &amp; Informasi Kesehatan"
        subtitle="Artikel terbaru dari tim medis dan redaksi RS Bhayangkara Nganjuk"
      />

      {/* Filter + Search */}
      <section style={{ backgroundColor: '#fff', borderBottom: '1px solid var(--color-neutral-200)', position: 'sticky', top: '64px', zIndex: 20 }}>
        <div className="container-site" style={{ paddingBlock: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ position: 'relative', maxWidth: '420px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-600)" strokeWidth="2" strokeLinecap="round"
              style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari artikel…" aria-label="Cari artikel berita"
              style={{ width: '100%', paddingLeft: '2.25rem', paddingRight: '1rem', paddingBlock: '0.5625rem', borderRadius: '8px', border: '1.5px solid var(--color-neutral-200)', fontSize: '0.875rem', color: 'var(--color-neutral-900)', background: 'var(--color-neutral-50)', outline: 'none', fontFamily: 'inherit' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary-400)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-neutral-200)')}
            />
          </div>
          <div role="group" aria-label="Filter kategori" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => {
              const isActive = activeCategory === cat.code;
              return (
                <button key={cat.code} type="button" onClick={() => setActiveCategory(cat.code)} aria-pressed={isActive}
                  style={{ padding: '0.3125rem 0.875rem', borderRadius: '999px', border: isActive ? '1.5px solid var(--color-primary-400)' : '1.5px solid var(--color-neutral-200)', background: isActive ? 'var(--color-primary-50)' : '#fff', color: isActive ? 'var(--color-primary-800)' : 'var(--color-neutral-600)', fontSize: '0.8125rem', fontWeight: isActive ? 600 : 400, cursor: 'pointer', minHeight: '32px', whiteSpace: 'nowrap', transition: 'all 150ms', fontFamily: 'inherit' }}>
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="section-py" style={{ background: 'var(--color-neutral-50)' }}>
        <div className="container-site">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', paddingBlock: '4rem', color: 'var(--color-neutral-600)' }}>
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>Artikel tidak ditemukan</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.375rem' }}>Coba kata kunci atau kategori lain</p>
            </div>
          ) : (
            <>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-600)', marginBottom: '1.25rem' }}>
                {filtered.length} artikel ditemukan
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {filtered.map((article) => (
                  <Link key={article.id} href={`/news/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }} className="news-card-link">
                    <article style={{ background: '#fff', border: '1px solid var(--color-neutral-200)', borderRadius: '12px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', transition: 'border-color 150ms, box-shadow 200ms, transform 150ms' }} className="news-card">
                      <div style={{ 
                        background: article.image ? `url(${getImageUrl(article.image)}) center/cover no-repeat` : article.coverBg, 
                        height: '160px', 
                        display: 'flex', 
                        alignItems: 'flex-end', 
                        padding: '0.875rem' 
                      }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.2rem 0.625rem', borderRadius: '999px', fontSize: '0.6875rem', fontWeight: 600, background: article.categoryBg, color: article.categoryColor }}>
                          {article.category}
                        </span>
                      </div>
                      <div style={{ padding: '1rem 1.125rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-neutral-900)', lineHeight: 1.4, fontFamily: 'var(--font-figtree, Figtree, sans-serif)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {article.title}
                        </h2>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-600)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                          {article.excerpt}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '0.5px solid var(--color-neutral-200)', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.6875rem', color: 'var(--color-neutral-600)' }}>{article.date ? formatDateId(new Date(article.date).toISOString()) : ''}</span>
                          <span style={{ fontSize: '0.6875rem', color: 'var(--color-neutral-600)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            {article.read_time}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <style>{`
        .news-card:hover { border-color: var(--color-primary-400) !important; box-shadow: 0 4px 24px rgba(55,138,221,0.12); transform: translateY(-2px); }
        .news-card-link:focus-visible .news-card { outline: 2.5px solid var(--color-primary-400); outline-offset: 2px; }
      `}</style>
    </>
  );
}
