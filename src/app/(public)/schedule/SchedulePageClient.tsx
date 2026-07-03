'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { getScheduleStatus, scheduleFilters, getInitials } from '@/lib/data/shared';
import { getImageUrl } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import PageHero from '@/components/PageHero';
import { DoctorSchedule } from '@/types/api';

interface DateStripOption {
  key: number;
  label: string;
  labelFull: string;
  date: number;
  month: string;
  isToday: boolean;
  dateObj: Date;
}

/* Days for the date strip (today + 6 days) */
function buildDateStrip(): DateStripOption[] {
  const days: DateStripOption[] = [];
  const dayNamesShort = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const dayNamesFull = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      key: i,
      label: dayNamesShort[d.getDay()]!,
      labelFull: dayNamesFull[d.getDay()]!,
      date: d.getDate(),
      month: monthNames[d.getMonth()]!,
      isToday: i === 0,
      dateObj: d,
    });
  }
  return days;
}

interface SchedulePageClientProps {
  initialSchedules?: DoctorSchedule[];
}

export default function SchedulePageClient({ initialSchedules = [] }: SchedulePageClientProps) {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('doctorId');
  
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
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

    // Filter by search query (doctorName or specialization)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((s) => 
        (s.doctorName && s.doctorName.toLowerCase().includes(q)) || 
        (s.specialization && s.specialization.toLowerCase().includes(q))
      );
    }
    
    return filtered;
  }, [selectedDay, activeFilter, initialSchedules, days, doctorId, searchQuery]);

  return (
    <>
      {/* Page Header */}
      <PageHero
        breadcrumb="Jadwal Dokter"
        title="Jadwal Dokter"
        subtitle="Cek ketersediaan dan daftar langsung"
      />

      {/* Date strip + Filter */}
      <section
        style={{
          backgroundColor: 'var(--color-primary-900)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'sticky',
          top: '64px',
          zIndex: 20,
        }}
      >
        <div className="container-site" style={{ paddingBlock: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Date strip */}
          <div role="group" aria-label="Pilih tanggal" style={{ display: 'flex', gap: '0.625rem', overflowX: 'auto', paddingBottom: '4px' }} className="date-strip-scroll">
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
                    padding: '0.625rem 1.125rem', borderRadius: '12px', minWidth: '82px',
                    border: isSelected ? '2px solid var(--color-cta)' : '1px solid rgba(255, 255, 255, 0.15)',
                    background: isSelected ? 'var(--color-cta)' : 'rgba(255, 255, 255, 0.08)',
                    color: isSelected ? 'var(--color-cta-text)' : 'rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer', transition: 'all 200ms ease-out', gap: '0.125rem',
                  }}
                  className="sch-date-pill"
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: isSelected ? 'var(--color-cta-text)' : '#ffffff' }}>
                    {day.label}
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: isSelected ? 'var(--color-cta-text)' : 'rgba(255,255,255,0.9)' }}>
                    {day.date}
                  </span>
                  <span style={{ fontSize: '0.625rem', fontWeight: 500, opacity: 0.7 }}>
                    {day.month}
                  </span>
                  {day.isToday && (
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: isSelected ? 'var(--color-cta-text)' : 'var(--color-cta)', marginTop: '2px' }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
            <div style={{ position: 'absolute', top: '50%', left: '0.875rem', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none', color: 'rgba(255, 255, 255, 0.4)' }}>
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Cari nama dokter atau poliklinik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem 2.5rem 0.625rem 2.25rem',
                borderRadius: '10px',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 200ms ease-out',
              }}
              className="sch-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '0.75rem',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={14} />
              </button>
            )}
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
                    padding: '0.4rem 1.125rem', borderRadius: '999px',
                    border: isActive ? '1.5px solid var(--color-cta)' : '1.5px solid rgba(255, 255, 255, 0.15)',
                    background: isActive ? 'var(--color-cta)' : 'rgba(255, 255, 255, 0.08)',
                    color: isActive ? 'var(--color-cta-text)' : 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.8125rem', fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer', transition: 'all 200ms ease-out',
                    minHeight: '34px', whiteSpace: 'nowrap',
                  }}
                  className="sch-filter-chip"
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Schedule list */}
      <section className="section-py" style={{ background: 'var(--color-neutral-50)' }}>
        <div className="container-site">
          {/* Date label */}
          <div style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-neutral-900)', fontFamily: 'var(--font-figtree, Figtree, system-ui, sans-serif)', letterSpacing: '-0.01em' }}>
                Jadwal Hari {days[selectedDay]?.labelFull}
                <span style={{ color: 'var(--color-neutral-600)', fontWeight: 500, marginLeft: '0.5rem', fontSize: '0.875rem' }}>
                  ({days[selectedDay]?.date} {days[selectedDay]?.month} {days[selectedDay]?.dateObj.getFullYear()})
                </span>
              </h2>
            </div>
            <Link 
              href="/pendaftaran" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.625rem 1.25rem', 
                borderRadius: '10px', 
                background: 'var(--color-cta)', 
                color: 'var(--color-cta-text)', 
                fontSize: '0.875rem', 
                fontWeight: 700, 
                textDecoration: 'none', 
                transition: 'all 150ms ease-out',
                boxShadow: '0 2px 8px rgba(255, 183, 3, 0.25)' 
              }} 
              className="sch-register-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Daftar Online
            </Link>
          </div>

          {visibleSchedule.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid var(--color-neutral-200)', borderRadius: '16px', padding: '4rem 2rem', textAlign: 'center', color: 'var(--color-neutral-600)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.35, marginBottom: '1rem' }} aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-neutral-900)' }}>Jadwal belum tersedia untuk tanggal ini</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Silakan pilih tanggal lain atau hubungi kami langsung</p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {visibleSchedule.map((row) => {
                const status = getScheduleStatus(row.filledQuota, row.totalQuota);
                const isFull = row.filledQuota >= row.totalQuota;
                const initials = getInitials(row.doctorName);
                const percent = Math.min(100, Math.round((row.filledQuota / row.totalQuota) * 100));

                const avatarBg = 'var(--color-primary-50)';
                const avatarColor = 'var(--color-primary-600)';

                return (
                  <div
                    key={row.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--color-neutral-200)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 200ms ease-out',
                    }}
                    className="sch-doctor-card"
                  >
                    {/* Doctor photo/avatar area */}
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '3/4',
                        background: 'var(--color-primary-50)',
                        overflow: 'hidden',
                      }}
                    >
                      {row.doctor?.image && getImageUrl(row.doctor.image) ? (
                        <Image
                          src={getImageUrl(row.doctor.image)!}
                          alt={`Foto dr. ${row.doctorName}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 280px"
                          style={{ objectFit: 'cover', objectPosition: 'top center' }}
                          unoptimized
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            background: avatarBg,
                            color: avatarColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-figtree, Figtree, sans-serif)',
                          }}
                        >
                          {initials}
                        </div>
                      )}

                      {/* Specialization overlay tag */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '0.75rem',
                          left: '0.75rem',
                          background: 'rgba(2, 48, 71, 0.85)',
                          backdropFilter: 'blur(4px)',
                          color: '#ffffff',
                          padding: '0.25rem 0.625rem',
                          borderRadius: '999px',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          letterSpacing: '0.02em',
                        }}
                      >
                        {row.specialization}
                      </div>
                    </div>

                    {/* Card Content info */}
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                      <div>
                        <Link 
                          href={`/doctors/${row.doctorId}`} 
                          style={{ 
                            fontSize: '1rem', 
                            fontWeight: 700, 
                            color: 'var(--color-primary-900)', 
                            textDecoration: 'none',
                            fontFamily: 'var(--font-figtree, Figtree, sans-serif)',
                            lineHeight: 1.35,
                          }} 
                          className="sch-doc-card-link"
                        >
                          {row.doctorName}
                        </Link>
                      </div>

                      {/* Time and Status */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--color-primary-50)', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--color-neutral-600)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                              <circle cx="12" cy="12" r="10"/>
                              <polyline points="12 6 12 12 16 14"/>
                            </svg>
                            {row.time}
                          </span>
                          <Badge 
                            variant={
                              status.label === 'Tersedia' ? 'success' :
                              status.label === 'Sisa Sedikit' ? 'warning' : 'danger'
                            } 
                            dot
                          >
                            {status.label}
                          </Badge>
                        </div>
                      </div>

                      {/* Quota Progress */}
                      <div style={{ marginTop: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', fontSize: '0.75rem', color: 'var(--color-neutral-600)' }}>
                          <span>Kuota Terisi</span>
                          <span style={{ fontWeight: 600, color: 'var(--color-primary-900)' }}>
                            {row.filledQuota} / {row.totalQuota}
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '5px', background: 'var(--color-primary-50)', borderRadius: '2.5px', overflow: 'hidden' }}>
                          <div style={{ width: `${percent}%`, height: '100%', background: isFull ? 'var(--color-danger)' : 'var(--color-primary-600)', borderRadius: '2.5px' }} />
                        </div>
                      </div>
                    </div>

                    {/* Bottom action button */}
                    <div style={{ padding: '0 1.25rem 1.25rem' }}>
                      {isFull ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.625rem 1rem', borderRadius: '10px', background: 'var(--color-neutral-200)', color: 'var(--color-neutral-600)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'not-allowed', width: '100%', textAlign: 'center', minHeight: '38px', opacity: 0.7 }}>
                          Penuh
                        </span>
                      ) : (
                        <Link
                          href="/pendaftaran"
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            padding: '0.625rem 1rem', 
                            borderRadius: '10px', 
                            background: 'var(--color-primary-600)', 
                            color: '#ffffff', 
                            fontSize: '0.8125rem', 
                            fontWeight: 700, 
                            textDecoration: 'none', 
                            width: '100%', 
                            textAlign: 'center', 
                            minHeight: '38px', 
                            transition: 'all 150ms ease-out',
                            boxShadow: '0 2px 6px rgba(4, 105, 155, 0.15)'
                          }}
                          className="sch-card-daftar-btn"
                          aria-label={`Daftar ke ${row.doctorName}`}
                        >
                          Daftar Online
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Info box */}
          <div
            style={{
              marginTop: '2rem',
              padding: '1rem 1.25rem',
              background: 'var(--color-primary-50)',
              border: '1px solid var(--color-primary-100)',
              borderRadius: '10px',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-600)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '1px' }} aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-primary-800)', lineHeight: 1.6, fontWeight: 500 }}>
              Jadwal dapat berubah sewaktu-waktu. Konfirmasi akan dikirim via WhatsApp. Hadir 15 menit sebelum waktu praktik dan bawa identitas diri.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .sch-register-btn:hover {
          background: var(--color-cta-dark) !important;
          color: var(--color-cta-text) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(208, 149, 0, 0.35);
        }
        .sch-search-input:focus {
          border-color: var(--color-cta) !important;
          background: rgba(255, 255, 255, 0.12) !important;
          box-shadow: 0 0 0 3px rgba(255, 183, 3, 0.2);
        }
        .sch-search-input::placeholder {
          color: rgba(255, 255, 255, 0.45);
        }
        .sch-date-pill:hover {
          background: rgba(255, 255, 255, 0.15) !important;
        }
        .sch-filter-chip:hover {
          background: rgba(255, 255, 255, 0.15) !important;
        }
        .sch-doctor-card:hover {
          border-color: var(--color-primary-300) !important;
          box-shadow: 0 8px 24px rgba(24, 95, 165, 0.1);
          transform: translateY(-3px);
        }
        .sch-doc-card-link:hover {
          color: var(--color-primary-600) !important;
        }
        .sch-card-daftar-btn:hover {
          background: var(--color-primary-800) !important;
          transform: translateY(-1.5px);
          box-shadow: 0 4px 12px rgba(4, 105, 155, 0.25);
        }
        /* Custom date strip scroll */
        .date-strip-scroll::-webkit-scrollbar {
          height: 4px;
        }
        .date-strip-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .date-strip-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 2px;
        }
      `}</style>
    </>
  );
}
