'use client';

import { useState, useMemo } from 'react';
import { specializationFilters } from '@/lib/data/shared';
import DoctorCard from '@/components/ui/DoctorCard';
import PageHero from '@/components/PageHero';
import { Doctor } from '@/types/api';

interface DoctorsPageClientProps {
  initialDoctors?: Doctor[];
}

export default function DoctorsPageClient({ initialDoctors = [] }: DoctorsPageClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
      <PageHero
        breadcrumb="Dokter Spesialis"
        title="Dokter Spesialis"
        subtitle={`${initialDoctors.length} dokter spesialis siap melayani Anda`}
      />

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
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary-400)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-neutral-200)')}
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
