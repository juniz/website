'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { specializationFilters, getInitials } from '@/lib/data/shared';
import Badge from '@/components/ui/Badge';

export default function DoctorsPageClient({ initialDoctors = [] }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return initialDoctors.filter((doc) => {
      const matchSpec =
        activeFilter === 'all' || doc.specializationCode === activeFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        doc.name.toLowerCase().includes(q) ||
        doc.specialization.toLowerCase().includes(q);
      return matchSpec && matchSearch;
    });
  }, [activeFilter, searchQuery, initialDoctors]);

  const availabilityConfig = {
    today:       { variant: 'success', label: 'Tersedia hari ini' },
    tomorrow:    { variant: 'warning', label: 'Besok tersedia' },
    unavailable: { variant: 'danger',  label: 'Tidak tersedia' },
  };

  return (
    <>
      {/* Page Header */}
      <section
        style={{
          backgroundColor: 'var(--color-primary-800)',
          paddingBlock: '2.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="container-site">
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1rem' }}>
            <ol style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', listStyle: 'none', fontSize: '0.75rem', color: 'var(--color-primary-200)' }}>
              <li><Link href="/" style={{ color: 'var(--color-primary-200)', textDecoration: 'none' }}>Beranda</Link></li>
              <li aria-hidden="true"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></li>
              <li aria-current="page" style={{ color: 'var(--color-primary-50)' }}>Dokter Spesialis</li>
            </ol>
          </nav>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              color: 'var(--color-primary-50)',
              fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)',
              marginBottom: '0.375rem',
            }}
          >
            Dokter Spesialis
          </h1>
          <p style={{ color: 'var(--color-primary-200)', fontSize: '0.9375rem' }}>
            {initialDoctors.length} dokter spesialis siap melayani Anda
          </p>
        </div>
      </section>

      {/* Filter + Search Bar */}
      <section
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--color-neutral-200)',
          position: 'sticky',
          top: '64px',
          zIndex: 20,
        }}
      >
        <div
          className="container-site"
          style={{ paddingBlock: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          <div style={{ position: 'relative', maxWidth: '420px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-600)" strokeWidth="2" strokeLinecap="round"
              style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="search" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama dokter atau spesialisasi…"
              aria-label="Cari dokter"
              style={{ width: '100%', paddingLeft: '2.25rem', paddingRight: '1rem', paddingBlock: '0.5625rem', borderRadius: '8px', border: '1.5px solid var(--color-neutral-200)', fontSize: '0.875rem', color: 'var(--color-neutral-900)', background: 'var(--color-neutral-50)', outline: 'none', transition: 'border-color 150ms', fontFamily: 'inherit' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary-400)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-neutral-200)')}
            />
          </div>

          <div role="group" aria-label="Filter spesialisasi" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {specializationFilters.map((f) => {
              const isActive = activeFilter === f.code;
              return (
                <button key={f.code} type="button" onClick={() => setActiveFilter(f.code)} aria-pressed={isActive}
                  style={{ padding: '0.3125rem 0.875rem', borderRadius: '999px', border: isActive ? '1.5px solid var(--color-primary-400)' : '1.5px solid var(--color-neutral-200)', background: isActive ? 'var(--color-primary-50)' : '#fff', color: isActive ? 'var(--color-primary-800)' : 'var(--color-neutral-600)', fontSize: '0.8125rem', fontWeight: isActive ? 600 : 400, cursor: 'pointer', transition: 'all 150ms', minHeight: '32px', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Doctor Cards Grid */}
      <section className="section-py" style={{ background: 'var(--color-neutral-50)' }}>
        <div className="container-site">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', paddingBlock: '4rem', color: 'var(--color-neutral-600)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.4, marginBottom: '1rem' }} aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>Dokter tidak ditemukan</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.375rem' }}>Coba kata kunci atau filter yang berbeda</p>
            </div>
          ) : (
            <>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-600)', marginBottom: '1.25rem' }}>
                Menampilkan {filtered.length} dokter
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {filtered.map((doctor) => {
                  const avail = availabilityConfig[doctor.availability] ?? availabilityConfig.unavailable;
                  const initials = getInitials(doctor.name);
                  return (
                    <article key={doctor.id}
                      style={{ background: '#fff', border: '1px solid var(--color-neutral-200)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 150ms, box-shadow 200ms' }}
                      className="doctor-card-full">
                      <div style={{ padding: '1.25rem 1.25rem 1rem', display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                        <div aria-hidden="true" style={{ width: '52px', height: '52px', borderRadius: '50%', background: doctor.avatarBg, color: doctor.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)', fontSize: '1.0625rem', fontWeight: 600, flexShrink: 0, border: `1.5px solid ${doctor.avatarColor}22` }}>
                          {initials}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-neutral-900)', fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)', lineHeight: 1.3, marginBottom: '0.2rem' }}>{doctor.name}</h2>
                          <p style={{ fontSize: '0.75rem', color: 'var(--color-neutral-600)', lineHeight: 1.4 }}>{doctor.specialization}</p>
                          <p style={{ fontSize: '0.6875rem', color: 'var(--color-neutral-600)', marginTop: '0.125rem' }}>{doctor.experience} · {doctor.education}</p>
                        </div>
                      </div>

                      <div style={{ paddingInline: '1.25rem', paddingBottom: '0.75rem' }}>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-600)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {doctor.bio}
                        </p>
                      </div>

                      <div style={{ paddingInline: '1.25rem', paddingBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Badge variant={avail.variant} dot>{avail.label}</Badge>
                        {doctor.todaySchedule && (
                          <p style={{ fontSize: '0.75rem', color: 'var(--color-neutral-600)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            {doctor.todaySchedule}
                          </p>
                        )}
                      </div>

                      <div style={{ display: 'flex', borderTop: '0.5px solid var(--color-neutral-200)', marginTop: 'auto' }}>
                        <Link href={`/doctors/${doctor.id}`}
                          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-neutral-600)', textDecoration: 'none', borderRight: '0.5px solid var(--color-neutral-200)', transition: 'background 150ms, color 150ms' }}
                          className="doc-link-profile" aria-label={`Profil ${doctor.name}`}>
                          Profil
                        </Link>
                        <Link href={`/schedule?doctorId=${doctor.id}`}
                          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-primary-600)', textDecoration: 'none', background: 'var(--color-primary-50)', transition: 'background 150ms, color 150ms' }}
                          className="doc-link-schedule" aria-label={`Jadwal ${doctor.name}`}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginRight: '0.3rem' }} aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          Jadwal
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <style>{`
        .doctor-card-full:hover { border-color: var(--color-primary-400); box-shadow: 0 4px 20px rgba(55,138,221,0.12); }
        .doc-link-profile:hover { background: var(--color-neutral-50) !important; color: var(--color-neutral-900) !important; }
        .doc-link-schedule:hover { background: var(--color-primary-100) !important; color: var(--color-primary-900) !important; }
      `}</style>
    </>
  );
}
