import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';

export default function PejabatCard({ pejabat }) {
  return (
    <Link
      href={`/pejabat/${pejabat.slug}`}
      style={{
        background: '#fff',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(4, 44, 83, 0.06)',
        border: '1px solid var(--color-neutral-200)',
        transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        textDecoration: 'none',
        height: '100%',
        cursor: 'pointer',
      }}
      className="pejabat-card"
    >
      {/* Photo Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3/4',
          background: 'var(--color-primary-50)',
          overflow: 'hidden',
          borderBottom: '1px solid var(--color-neutral-100)',
        }}
      >
        {pejabat.photo ? (
          <Image
            src={getImageUrl(pejabat.photo)}
            alt={pejabat.name}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            style={{ objectFit: 'cover', objectPosition: 'top' }}
            className="pejabat-photo"
          />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--color-primary-200)',
            }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        )}

        {/* Subtle Overlay on Hover */}
        <div className="photo-overlay" />
      </div>

      {/* Info Header (Below Photo) */}
      <div style={{ padding: '1.5rem 1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--color-primary-600)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {pejabat.jabatan}
        </span>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--color-neutral-900)',
            fontFamily: 'var(--font-figtree)',
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
            margin: 0,
          }}
        >
          {pejabat.name}
        </h2>
      </div>

      {/* Details & Bio */}
      <div style={{ padding: '0 1.5rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-between' }}>
        {/* Pangkat Badging */}
        {pejabat.pangkat ? (
          <div
            style={{
              display: 'inline-flex',
              alignSelf: 'flex-start',
              padding: '0.375rem 0.75rem',
              background: 'var(--color-primary-50)',
              borderRadius: '8px',
              border: '1px solid var(--color-primary-100)',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--color-primary-800)', fontWeight: 600 }}>
              Pangkat: {pejabat.pangkat}
            </span>
          </div>
        ) : (
          <div style={{ height: '24px' }} /> /* Spacer for alignment */
        )}

        {/* Biography Snippet */}
        {pejabat.bio ? (
          <div
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-neutral-500)',
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontStyle: 'italic',
              margin: 0,
            }}
            dangerouslySetInnerHTML={{ __html: pejabat.bio }}
            className="pejabat-bio-rich"
          />
        ) : (
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-400)', fontStyle: 'italic', margin: 0 }}>
            Belum ada informasi biografi.
          </p>
        )}
      </div>
    </Link>
  );
}
