import Link from 'next/link';
import NewsCard from '@/components/ui/NewsCard';
import { getNews } from '@/lib/data/news';

export default async function NewsPreview() {
  const allNews = await getNews();
  const latestNews = allNews.slice(0, 3); // Just take top 3

  return (
    <section
      aria-labelledby="news-heading"
      className="section-py"
      style={{ background: '#ffffff' }}
    >
      <div className="container-site">
        {/* Section header */}
        <div className="section-header">
          <div>
            <h2 className="section-title" id="news-heading">
              Berita & Informasi Kesehatan
            </h2>
            <p className="section-subtitle">
              Artikel terbaru dari tim medis dan redaksi kami
            </p>
          </div>
          <Link
            href="/news"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-primary-600)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontWeight: 500,
              flexShrink: 0,
            }}
            className="see-all-link"
          >
            Semua berita
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        </div>

        {/* News cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {latestNews.map((article, index) => (
            <NewsCard
              key={article.id}
              article={article}
              featured={index === 0}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link
            href="/news"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.5rem',
              borderRadius: '8px',
              border: '1.5px solid var(--color-primary-200)',
              color: 'var(--color-primary-600)',
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'border-color 150ms ease-out, background 150ms ease-out',
            }}
            className="news-see-all-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/>
              <polyline points="14 2 14 8 20 8"/>
              <path d="M2 15h10M9 18l3-3 -3-3"/>
            </svg>
            Lihat Semua Artikel
          </Link>
        </div>
      </div>

      <style>{`
        .see-all-link:hover {
          color: var(--color-primary-400) !important;
        }
        .news-see-all-btn:hover {
          border-color: var(--color-primary-400) !important;
          background: var(--color-primary-50) !important;
        }
      `}</style>
    </section>
  );
}
