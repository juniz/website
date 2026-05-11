'use client';
// Schedule listing client component — exported as SchedulePageClient

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getScheduleStatus, scheduleFilters } from '@/lib/data/shared';
import Badge from '@/components/ui/Badge';

/* Days for the date strip (today + 6 days) */
function buildDateStrip() {
  const days = [];
  const dayNamesShort = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const dayNamesFull = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      key: i,
      label: dayNamesShort[d.getDay()],
      labelFull: dayNamesFull[d.getDay()],
      date: d.getDate(),
      month: monthNames[d.getMonth()],
      isToday: i === 0,
      dateObj: d,
    });
  }
  return days;
}

export default function SchedulePageClient({ initialSchedules = [] }) {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('doctorId');
  
  const [selectedDay, setSelectedDay] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const days = useMemo(() => buildDateStrip(), []);

  const visibleSchedule = useMemo(() => {
    // Filter by the selected day string (Senin, Selasa, etc.)
    let filtered = initialSchedules.filter((s) => {
      if (!s.date) return false;
      
      const targetDay = days[selectedDay]?.labelFull?.toUpperCase();
      const scheduleDate = s.date.trim().toUpperCase();
      
      // Exact match (e.g., "SENIN" === "SENIN")
      if (scheduleDate === targetDay) return true;
      
      // Handle variations
      if (targetDay === 'MINGGU' && scheduleDate === 'AKHAD') return true;
      if (targetDay === 'JUMAT' && scheduleDate === "JUM'AT") return true;
      
      // If s.date is a full date string (e.g., "2024-05-11"), compare day name
      try {
        const d = new Date(s.date);
        if (!isNaN(d.getTime())) {
          const dayNamesFull = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
          return dayNamesFull[d.getDay()] === targetDay;
        }
      } catch (e) {}
      
      return false;
    });
    
    // Filter by specialization
    if (activeFilter !== 'all') {
      filtered = filtered.filter((s) => s.specializationCode === activeFilter);
    }
    
    // Filter by doctorId if present in URL
    if (doctorId) {
      filtered = filtered.filter((s) => String(s.doctorId) === String(doctorId));
    }
    
    return filtered;
  }, [selectedDay, activeFilter, initialSchedules, days, doctorId]);

  const todayFull = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <>
      {/* Page Header */}
      <section
        style={{
          background: 'var(--color-primary-800)',
          paddingBlock: '2.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="container-site">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1rem' }}>
            <ol style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', listStyle: 'none', fontSize: '0.75rem', color: 'var(--color-primary-200)' }}>
              <li><Link href="/" style={{ color: 'var(--color-primary-200)', textDecoration: 'none' }}>Beranda</Link></li>
              <li aria-hidden="true"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></li>
              <li aria-current="page" style={{ color: 'var(--color-primary-50)' }}>Jadwal Dokter</li>
            </ol>
          </nav>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--color-primary-50)', fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)', marginBottom: '0.375rem' }}>
            Jadwal Dokter
          </h1>
          <p style={{ color: 'var(--color-primary-200)', fontSize: '0.9375rem' }}>
            Cek ketersediaan dan daftar langsung
          </p>
        </div>
      </section>

      {/* Date strip + Filter */}
      <section
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--color-neutral-200)',
          position: 'sticky',
          top: '64px',
          zIndex: 20,
        }}
      >
        <div className="container-site" style={{ paddingBlock: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Date strip */}
          <div role="group" aria-label="Pilih tanggal" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '2px' }}>
            {days.map((day) => {
              const isSelected = selectedDay === day.key;
              return (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => setSelectedDay(day.key)}
                  aria-pressed={isSelected}
                  aria-label={`${day.labelFull} ${day.date} ${day.month}${day.isToday ? ' (hari ini)' : ''}`}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    padding: '0.625rem 1rem', borderRadius: '10px', minWidth: '80px',
                    border: isSelected ? '2px solid var(--color-primary-400)' : '1px solid var(--color-neutral-200)',
                    background: isSelected ? 'var(--color-primary-50)' : '#fff',
                    color: isSelected ? 'var(--color-primary-800)' : 'var(--color-neutral-600)',
                    cursor: 'pointer', transition: 'all 150ms ease-out', gap: '0.125rem',
                  }}
                >
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', color: isSelected ? 'var(--color-primary-700)' : 'var(--color-neutral-800)' }}>
                    {day.labelFull}
                  </span>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 500, opacity: 0.8 }}>
                    {day.date} {day.month}
                  </span>
                  {day.isToday && (
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--color-primary-400)', marginTop: '2px' }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Poli filter chips */}
          <div role="group" aria-label="Filter poli" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {scheduleFilters.map((f) => {
              const isActive = activeFilter === f.code;
              return (
                <button
                  key={f.code}
                  type="button"
                  onClick={() => setActiveFilter(f.code)}
                  aria-pressed={isActive}
                  style={{
                    padding: '0.3125rem 0.875rem', borderRadius: '999px',
                    border: isActive ? '1.5px solid var(--color-primary-400)' : '1.5px solid var(--color-neutral-200)',
                    background: isActive ? 'var(--color-primary-50)' : '#fff',
                    color: isActive ? 'var(--color-primary-800)' : 'var(--color-neutral-600)',
                    fontSize: '0.8125rem', fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer', transition: 'all 150ms ease-out',
                    minHeight: '32px', whiteSpace: 'nowrap',
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Schedule table */}
      <section className="section-py" style={{ background: 'var(--color-neutral-50)' }}>
        <div className="container-site">
          {/* Date label */}
          <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-neutral-900)', fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)' }}>
              Jadwal Hari {days[selectedDay]?.labelFull}
              <span style={{ color: 'var(--color-neutral-500)', fontWeight: 400, marginLeft: '0.5rem', fontSize: '0.875rem' }}>
                ({days[selectedDay]?.date} {days[selectedDay]?.month})
              </span>
            </h2>
            <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--color-primary-400)', color: '#fff', fontSize: '0.8125rem', fontWeight: 500, textDecoration: 'none', transition: 'background 150ms' }} className="sch-register-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Daftar Online
            </Link>
          </div>

          {visibleSchedule.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid var(--color-neutral-200)', borderRadius: '12px', padding: '3rem', textAlign: 'center', color: 'var(--color-neutral-600)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.4, marginBottom: '0.75rem' }} aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <p style={{ fontWeight: 500 }}>Jadwal belum tersedia untuk tanggal ini</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Silakan pilih tanggal lain atau hubungi kami langsung</p>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid var(--color-neutral-200)', borderRadius: '12px', overflow: 'hidden' }}>
              {/* Table head */}
              <div
                style={{ display: 'grid', gridTemplateColumns: 'minmax(180px,1fr) minmax(130px,auto) auto minmax(160px,auto)', padding: '0.75rem 1.25rem', background: 'var(--color-primary-50)', borderBottom: '1px solid var(--color-neutral-200)' }}
                aria-hidden="true"
                className="sch-table-head"
              >
                {['Dokter', 'Poli', 'Jam Praktik', 'Kuota & Tindakan'].map((col) => (
                  <span key={col} style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-primary-800)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{col}</span>
                ))}
              </div>

              {/* Rows */}
              <div role="table" aria-label="Jadwal dokter">
                <div role="rowgroup">
                  {visibleSchedule.map((row, idx) => {
                    const status = getScheduleStatus(row.filledQuota, row.totalQuota);
                    const isFull = row.filledQuota >= row.totalQuota;
                    return (
                      <div
                        key={row.id}
                        role="row"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(180px,1fr) minmax(130px,auto) auto minmax(160px,auto)',
                          alignItems: 'center',
                          padding: '1rem 1.25rem',
                          gap: '0.75rem',
                          borderBottom: idx < visibleSchedule.length - 1 ? '0.5px solid var(--color-neutral-200)' : 'none',
                          transition: 'background 150ms',
                        }}
                        className="sch-row"
                      >
                        {/* Doctor */}
                        <div role="cell">
                          <Link href={`/doctors/${row.doctorId}`} style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-primary-600)', textDecoration: 'none' }} className="sch-doc-link">
                            {row.doctorName}
                          </Link>
                        </div>
                        {/* Poli */}
                        <div role="cell">
                          <span style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-600)' }}>{row.specialization}</span>
                        </div>
                        {/* Time */}
                        <div role="cell">
                          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-neutral-900)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-600)" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            {row.time}
                          </span>
                        </div>
                        {/* Status + CTA */}
                        <div role="cell" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                            <Badge variant={status.variant} dot>{status.label}</Badge>
                            <span style={{ fontSize: '0.625rem', color: 'var(--color-neutral-600)', fontVariantNumeric: 'tabular-nums' }}>
                              {row.filledQuota}/{row.totalQuota} terisi
                            </span>
                          </div>
                          {isFull ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.375rem 0.875rem', borderRadius: '6px', background: 'var(--color-neutral-200)', color: 'var(--color-neutral-600)', fontSize: '0.75rem', fontWeight: 500, opacity: 0.6, cursor: 'not-allowed', minHeight: '34px' }}>
                              Penuh
                            </span>
                          ) : (
                            <Link
                              href={`/register?scheduleId=${row.id}&doctorId=${row.doctorId}`}
                              style={{ display: 'inline-flex', alignItems: 'center', padding: '0.375rem 0.875rem', borderRadius: '6px', background: 'var(--color-primary-400)', color: '#fff', fontSize: '0.75rem', fontWeight: 500, textDecoration: 'none', minHeight: '34px', transition: 'background 150ms' }}
                              className="sch-daftar-btn"
                              aria-label={`Daftar ke ${row.doctorName}`}
                            >
                              Daftar
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Info box */}
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem 1.25rem',
              background: 'var(--color-primary-50)',
              border: '1px solid var(--color-primary-100)',
              borderRadius: '10px',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-600)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '1px' }} aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-primary-800)', lineHeight: 1.6 }}>
              Jadwal dapat berubah sewaktu-waktu. Konfirmasi akan dikirim via WhatsApp. Hadir 15 menit sebelum waktu praktik dan bawa identitas diri.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .sch-register-btn:hover { background: var(--color-primary-600) !important; }
        .sch-row:hover { background: var(--color-neutral-50) !important; }
        .sch-daftar-btn:hover { background: var(--color-primary-600) !important; }
        .sch-doc-link:hover { color: var(--color-primary-400) !important; }
        @media (max-width: 640px) {
          .sch-table-head { display: none !important; }
          .sch-row { grid-template-columns: 1fr !important; gap: 0.5rem !important; }
        }
      `}</style>
    </>
  );
}
