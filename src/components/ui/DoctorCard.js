import Link from 'next/link';
import Badge from './Badge';
import { getInitials } from '@/lib/data/doctors';

/**
 * DoctorCard — Reusable doctor card with avatar, availability, and CTA
 */
export default function DoctorCard({ doctor }) {
  const {
    id,
    name,
    specialization,
    experience,
    availability,
    todaySchedule,
    avatarColor,
    avatarBg,
  } = doctor;

  const initials = getInitials(name);

  const availabilityConfig = {
    today: { variant: 'success', label: 'Tersedia hari ini', dot: true },
    tomorrow: { variant: 'warning', label: 'Besok tersedia', dot: true },
    unavailable: { variant: 'danger', label: 'Tidak tersedia', dot: true },
  };

  const avail = availabilityConfig[availability] ?? availabilityConfig.unavailable;

  return (
    <div
      style={{
        background: 'var(--color-surface, #fff)',
        border: '1px solid var(--color-neutral-200)',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 150ms ease-out, box-shadow 200ms ease-out',
        cursor: 'default',
      }}
      className="doctor-card"
    >
      {/* Card header */}
      <div
        style={{
          padding: '1.25rem 1.25rem 1rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.875rem',
        }}
      >
        {/* Avatar */}
        <div
          aria-hidden="true"
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: avatarBg,
            color: avatarColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.0625rem',
            fontWeight: 600,
            fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)',
            flexShrink: 0,
            border: `1.5px solid ${avatarColor}22`,
          }}
        >
          {initials}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: 'var(--color-neutral-900)',
              lineHeight: 1.3,
              marginBottom: '0.2rem',
              fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)',
            }}
          >
            {name}
          </h3>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-neutral-600)',
              lineHeight: 1.4,
            }}
          >
            {specialization}
          </p>
          <p
            style={{
              fontSize: '0.6875rem',
              color: 'var(--color-neutral-600)',
              marginTop: '0.125rem',
            }}
          >
            {experience}
          </p>
        </div>
      </div>

      {/* Schedule info */}
      <div
        style={{
          paddingInline: '1.25rem',
          paddingBottom: '0.875rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem',
        }}
      >
        <Badge variant={avail.variant} dot={avail.dot}>
          {avail.label}
        </Badge>

        {todaySchedule && (
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-neutral-600)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {todaySchedule}
          </p>
        )}
      </div>

      {/* CTA button */}
      <Link
        href={`/schedule?doctorId=${id}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.375rem',
          padding: '0.75rem 1rem',
          borderTop: '0.5px solid var(--color-neutral-200)',
          background: 'var(--color-primary-50)',
          color: 'var(--color-primary-800)',
          fontSize: '0.8125rem',
          fontWeight: 500,
          textDecoration: 'none',
          transition: 'background 150ms ease-out, color 150ms ease-out',
          marginTop: 'auto',
        }}
        className="doctor-card-cta"
        aria-label={`Lihat jadwal ${name}`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        Lihat Jadwal
      </Link>

      <style>{`
        .doctor-card:hover {
          border-color: var(--color-primary-400);
          box-shadow: 0 4px 20px rgba(55, 138, 221, 0.12);
        }
        .doctor-card-cta:hover {
          background: var(--color-primary-100) !important;
          color: var(--color-primary-900) !important;
        }
      `}</style>
    </div>
  );
}
