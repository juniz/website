import Link from 'next/link';
import Image from 'next/image';
import { getInitials } from '@/lib/data/doctors';

/**
 * DoctorCard — Portrait-style card: large photo on top, info below.
 * Matches reference design with full-width photo area.
 */
export default function DoctorCard({ doctor }) {
  const {
    id,
    name,
    specialization,
    availability,
    todaySchedule,
    avatarColor,
    avatarBg,
    image,
  } = doctor;

  const initials = getInitials(name);

  const availabilityConfig = {
    today:       { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', label: 'Tersedia hari ini', dot: true },
    tomorrow:    { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'Besok tersedia',    dot: true },
    unavailable: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'Tidak tersedia',   dot: true },
  };

  const avail = availabilityConfig[availability] ?? availabilityConfig.unavailable;

  return (
    <div className="doctor-card">
      {/* ── Photo area ─────────────────────────────── */}
      <div className="doctor-card-photo-wrap">
        {image ? (
          <Image
            src={image}
            alt={`Foto dr. ${name}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
            style={{ objectFit: 'cover', objectPosition: 'top center' }}
          />
        ) : (
          /* Fallback: inisial nama */
          <div
            aria-hidden="true"
            style={{
              width: '100%', height: '100%',
              background: avatarBg,
              color: avatarColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 700,
              fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)',
            }}
          >
            {initials}
          </div>
        )}

        {/* Availability badge — overlay, pojok kiri bawah */}
        <div
          style={{
            position: 'absolute', bottom: '0.75rem', left: '0.75rem',
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '3px 10px',
            borderRadius: '999px',
            background: avail.bg,
            border: `1px solid ${avail.border}`,
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: avail.color,
            backdropFilter: 'blur(4px)',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: avail.color, display: 'inline-block' }} />
          {avail.label}
        </div>
      </div>

      {/* ── Info area ──────────────────────────────── */}
      <div style={{ padding: '1rem 1rem 0.5rem', textAlign: 'center', flex: 1 }}>
        <h3 className="doctor-card-name">{name}</h3>
        <p className="doctor-card-spec">{specialization}</p>

        {todaySchedule && (
          <p style={{
            fontSize: '0.75rem', color: 'var(--color-neutral-500)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
            marginTop: '0.25rem',
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {todaySchedule}
          </p>
        )}
      </div>

      {/* ── CTA button ─────────────────────────────── */}
      <div style={{ padding: '0.75rem 1rem 1rem' }}>
        <Link
          href={`/schedule?doctorId=${id}`}
          className="doctor-card-cta"
          aria-label={`Lihat jadwal ${name}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          LIHAT JADWAL
        </Link>
      </div>

      <style>{`
        .doctor-card {
          background: #fff;
          border: 1px solid var(--color-neutral-200);
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: border-color 180ms ease-out, box-shadow 220ms ease-out, transform 180ms ease-out;
        }
        .doctor-card:hover {
          border-color: var(--color-primary-300);
          box-shadow: 0 8px 32px rgba(24, 95, 165, 0.14);
          transform: translateY(-2px);
        }

        /* Photo wrapper */
        .doctor-card-photo-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;   /* portrait ratio — sama dengan referensi */
          background: var(--color-primary-50);
          overflow: hidden;
        }

        /* Name */
        .doctor-card-name {
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--color-primary-900);
          line-height: 1.35;
          margin-bottom: 0.25rem;
          font-family: var(--font-figtree, Figtree, system-ui, sans-serif);
        }

        /* Specialization */
        .doctor-card-spec {
          font-size: 0.8125rem;
          color: var(--color-primary-600);
          font-weight: 600;
          line-height: 1.4;
        }

        /* CTA */
        .doctor-card-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          width: 100%;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          border: 1.5px solid var(--color-primary-300);
          background: transparent;
          color: var(--color-primary-800);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-decoration: none;
          transition: background 150ms ease-out, color 150ms ease-out, border-color 150ms ease-out;
        }
        .doctor-card-cta:hover {
          background: var(--color-primary-600) !important;
          color: #fff !important;
          border-color: var(--color-primary-600) !important;
        }
      `}</style>
    </div>
  );
}
