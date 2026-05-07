import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getNews, getNewsBySlug, formatDateId } from '@/lib/data/news';
import { getImageUrl, getOgImageUrl } from '@/lib/utils';
import JsonLd from '@/components/JsonLd';
import DOMPurify from 'isomorphic-dompurify';

export async function generateStaticParams() {
  const allNews = await getNews();
  return allNews.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return {};
  
  const ogImageUrl = article.image  ? getOgImageUrl(article.image) : 'https://rsbhayangkaranganjuk.com/og-news.jpg';
  
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
  };
}

export default async function NewsDetailPage({ params }) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();

  const allNews = await getNews();
  
  // Set UI fallbacks for the single fetched article (like we do in getNews)
  article.categoryBg = article.category === 'Pengumuman' ? 'var(--color-warning-100)' : 'var(--color-primary-100)';
  article.categoryColor = article.category === 'Pengumuman' ? 'var(--color-warning-800)' : 'var(--color-primary-800)';
  article.coverBg = article.category === 'Pengumuman' ? 'var(--color-warning-200)' : 'var(--color-primary-200)';

  // Related articles (exclude current)
  const related = allNews.filter((a) => a.slug !== slug).slice(0, 2);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.image ? [getImageUrl(article.image)] : [],
    datePublished: article.date,
    author: [{
      '@type': 'Person',
      name: article.author || 'Tim RS Bhayangkara'
    }],
    publisher: {
      '@type': 'Hospital',
      name: 'RS Bhayangkara Nganjuk',
      logo: {
        '@type': 'ImageObject',
        url: 'https://rsbhayangkaranganjuk.com/logo.png'
      }
    }
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      {/* Header */}
      <section style={{ background: 'var(--color-primary-800)', paddingBlock: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container-site">
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1.25rem' }}>
            <ol style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', listStyle: 'none', fontSize: '0.75rem', color: 'var(--color-primary-200)', flexWrap: 'wrap' }}>
              <li><Link href="/" style={{ color: 'var(--color-primary-200)', textDecoration: 'none' }}>Beranda</Link></li>
              <li aria-hidden="true"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></li>
              <li><Link href="/news" style={{ color: 'var(--color-primary-200)', textDecoration: 'none' }}>Berita</Link></li>
              <li aria-hidden="true"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></li>
              <li aria-current="page" style={{ color: 'var(--color-primary-50)' }}>{article.category}</li>
            </ol>
          </nav>

          {/* Category */}
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.6875rem', fontWeight: 600, background: article.categoryBg, color: article.categoryColor, marginBottom: '0.875rem' }}>
            {article.category}
          </span>

          {/* Title */}
          <h1 style={{ fontSize: 'clamp(1.375rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--color-primary-50)', fontFamily: 'var(--font-figtree, Figtree, sans-serif)', lineHeight: 1.3, marginBottom: '1rem', maxWidth: '760px' }}>
            {article.title}
          </h1>

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--color-primary-200)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {article.author}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--color-primary-200)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {article.date ? formatDateId(new Date(article.date).toISOString()) : ''}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--color-primary-200)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {article.read_time}
            </span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <div className="container-site" style={{ paddingBlock: '2.5rem', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: '2.5rem', alignItems: 'start' }} id="news-detail-grid">
        {/* Main article */}
        <article>
          {/* Cover image */}
          <div
            style={{ 
              background: article.image ? `url(${getImageUrl(article.image)}) center/cover no-repeat` : article.coverBg, 
              height: 'auto', 
              minHeight: '260px',
              aspectRatio: '16/9',
              borderRadius: '12px', 
              marginBottom: '2rem', 
              position: 'relative', 
              overflow: 'hidden', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: article.image ? '1px solid var(--color-neutral-200)' : 'none'
            }}
            aria-hidden="true"
          >
            {!article.image && (
              <>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)' }} />
                <svg width="56" height="56" viewBox="0 0 24 24" fill="white" style={{ opacity: 0.15 }}>
                  <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 3a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2H9a1 1 0 1 1 0-2h2V7a1 1 0 0 1 1-1z"/>
                </svg>
              </>
            )}
          </div>

          {/* HTML Body */}
          <div 
            className="article-content" 
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} 
          />

          {/* Tags / bottom meta */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-neutral-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-600)' }}>Ditulis oleh:</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-neutral-900)' }}>{article.author}</span>
            </div>
            <Link href="/news" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--color-primary-600)', textDecoration: 'none' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
              Semua Artikel
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside aria-label="Artikel terkait dan CTA">
          {/* CTA card */}
          <div style={{ background: 'var(--color-primary-50)', border: '1px solid var(--color-primary-100)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-900)', marginBottom: '0.625rem' }}>
              Konsultasikan dengan Dokter Kami
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-600)', lineHeight: 1.55, marginBottom: '1rem' }}>
              Buatlah janji temu dengan dokter spesialis kami untuk penanganan yang tepat.
            </p>
            <Link href="/register" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', padding: '0.625rem 1rem', borderRadius: '8px', background: 'var(--color-primary-400)', color: '#fff', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none', transition: 'background 150ms' }} className="news-cta-btn">
              Daftar Online
            </Link>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid var(--color-neutral-200)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--color-neutral-200)', background: 'var(--color-neutral-50)' }}>
                <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-900)', fontFamily: 'var(--font-figtree, Figtree, sans-serif)' }}>
                  Artikel Terkait
                </h2>
              </div>
              <div>
                {related.map((rel, idx) => (
                  <Link
                    key={rel.id}
                    href={`/news/${rel.slug}`}
                    style={{
                      display: 'flex', gap: '0.75rem', padding: '0.875rem 1.25rem',
                      borderBottom: idx < related.length - 1 ? '0.5px solid var(--color-neutral-200)' : 'none',
                      textDecoration: 'none', transition: 'background 150ms',
                    }}
                    className="related-link"
                  >
                    <div style={{ 
                      width: '44px', height: '44px', borderRadius: '6px', flexShrink: 0,
                      background: rel.image ? `url(${getImageUrl(rel.image)}) center/cover no-repeat` : rel.coverBg
                    }} aria-hidden="true" />
                    <div>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-neutral-900)', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '0.25rem' }}>
                        {rel.title}
                      </p>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--color-neutral-600)' }}>{rel.date ? formatDateId(new Date(rel.date).toISOString()) : ''}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <style>{`
        .news-cta-btn:hover { background: var(--color-primary-600) !important; }
        .related-link:hover { background: var(--color-neutral-50) !important; }

        /* Article HTML Content Styling */
        .article-content {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          color: var(--color-neutral-900);
          font-size: 1rem;
          line-height: 1.75;
        }
        .article-content p {
          margin: 0;
        }
        .article-content h1,
        .article-content h2,
        .article-content h3 {
          color: var(--color-primary-900);
          font-weight: 700;
          line-height: 1.3;
          margin-top: 1rem;
          margin-bottom: 0.25rem;
        }
        .article-content h1 { font-size: 1.75rem; }
        .article-content h2 { font-size: 1.5rem; }
        .article-content h3 { font-size: 1.25rem; }
        .article-content ul,
        .article-content ol {
          padding-left: 1.5rem;
          margin: 0;
        }
        .article-content li {
          margin-bottom: 0.5rem;
        }
        .article-content blockquote {
          border-left: 4px solid var(--color-primary-400);
          background: var(--color-neutral-50);
          padding: 1rem 1.25rem;
          margin: 0.5rem 0;
          font-style: italic;
          border-radius: 0 8px 8px 0;
          color: var(--color-neutral-700);
        }
        .article-content strong {
          font-weight: 700;
          color: var(--color-neutral-900);
        }
        .article-content a {
          color: var(--color-primary-600);
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          #news-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
