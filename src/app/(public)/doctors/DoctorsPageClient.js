'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { specializationFilters } from '@/lib/data/shared';
import DoctorCard from '@/components/ui/DoctorCard';

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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
                {filtered.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>


    </>
  );
}
