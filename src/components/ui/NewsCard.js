import Link from 'next/link';
import { formatDateId } from '@/lib/data/news';
import { getImageUrl } from '@/lib/utils';

/**
 * NewsCard — Reusable news card component
 */
export default function NewsCard({ article, featured = false }) {
  const {
    slug,
    title,
    excerpt,
    category,
    categoryColor,
    categoryBg,
    author,
    date,
    read_time,
    coverBg,
    image,
  } = article;

  return (
    <Link
      href={`/news/${slug}`}
      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
      className="news-card-link"
    >
      <article
        style={{
          background: 'var(--color-surface, #fff)',
          border: '1px solid var(--color-neutral-200)',
          borderRadius: '12px',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'border-color 150ms ease-out, box-shadow 200ms ease-out, transform 150ms ease-out',
        }}
        className="news-card"
      >
        {/* Cover image placeholder */}
        <div
          style={{
            background: image ? `url(${getImageUrl(image)}) center/cover no-repeat` : coverBg,
            height: featured ? '200px' : '160px',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '0.875rem',
          }}
          aria-hidden="true"
        >
          {/* Subtle overlay pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />
          {/* RS logo watermark */}
          {!image && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                opacity: 0.12,
              }}
            >
              <svg width="56" height="56" viewBox="0 0 24 24" fill="white">
                <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 3a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2H9a1 1 0 1 1 0-2h2V7a1 1 0 0 1 1-1z"/>
              </svg>
            </div>
          )}
          {/* Category badge on image */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.2rem 0.625rem',
              borderRadius: '999px',
              fontSize: '0.6875rem',
              fontWeight: 600,
              background: categoryBg,
              color: categoryColor,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {category}
          </span>
        </div>

        {/* Content */}
        <div
          style={{
            padding: '1rem 1.125rem',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <h3
            style={{
              fontSize: featured ? '1rem' : '0.9375rem',
              fontWeight: 600,
              color: 'var(--color-neutral-900)',
              lineHeight: 1.4,
              fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </h3>

          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-neutral-600)',
              lineHeight: 1.55,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: 1,
            }}
          >
            {excerpt}
          </p>

          {/* Meta */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.5rem',
              borderTop: '0.5px solid var(--color-neutral-200)',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                color: 'var(--color-neutral-600)',
              }}
            >
              {date ? formatDateId(new Date(date).toISOString()) : ''}
            </span>
            <span
              style={{
                fontSize: '0.6875rem',
                color: 'var(--color-neutral-600)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {read_time}
            </span>
          </div>
        </div>
      </article>

      <style>{`
        .news-card:hover {
          border-color: var(--color-primary-400);
          box-shadow: 0 4px 24px rgba(55, 138, 221, 0.12);
          transform: translateY(-2px);
        }
        .news-card-link:focus-visible .news-card {
          outline: 2.5px solid var(--color-primary-400);
          outline-offset: 2px;
        }
      `}</style>
    </Link>
  );
}
