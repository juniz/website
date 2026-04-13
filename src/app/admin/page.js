import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import {
  Stethoscope,
  CalendarDays,
  ClipboardList,
  Newspaper,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const metadata = { title: 'Dashboard' };

async function getDashboardStats() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [
    { count: totalDoctors },
    { count: availableDoctors },
    { count: totalSchedules },
    { count: totalRegistrations },
    { count: pendingRegistrations },
    { count: totalNews },
  ] = await Promise.all([
    supabase.from('doctors').select('*', { count: 'exact', head: true }),
    supabase.from('doctors').select('*', { count: 'exact', head: true }).eq('is_available', true),
    supabase.from('schedules').select('*', { count: 'exact', head: true }),
    supabase.from('registrations').select('*', { count: 'exact', head: true }),
    supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
    supabase.from('news').select('*', { count: 'exact', head: true }),
  ]);

  return {
    totalDoctors: totalDoctors || 0,
    availableDoctors: availableDoctors || 0,
    totalSchedules: totalSchedules || 0,
    totalRegistrations: totalRegistrations || 0,
    pendingRegistrations: pendingRegistrations || 0,
    totalNews: totalNews || 0,
  };
}

async function getRecentActivity() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: recentRegs } = await supabase
    .from('registrations')
    .select(`
      id, patient_name, status, created_at,
      schedules ( time, date, doctors ( name, specialization ) )
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  return recentRegs || [];
}

const STATUS_CFG = {
  Pending:  { color: 'warning', label: 'Menunggu' },
  Confirmed:{ color: 'info',    label: 'Dikonfirmasi' },
  Done:     { color: 'success', label: 'Selesai' },
  Cancelled:{ color: 'danger',  label: 'Dibatalkan' },
};

export default async function AdminDashboardPage() {
  const [stats, recentActivity] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
  ]);

  const STAT_CARDS = [
    {
      label: 'Total Dokter',
      value: stats.totalDoctors,
      sub: `${stats.availableDoctors} dokter aktif`,
      icon: Stethoscope,
      color: 'var(--admin-primary)',
      colorL: 'var(--admin-primary-l)',
      href: '/admin/dokter',
    },
    {
      label: 'Jadwal Tersedia',
      value: stats.totalSchedules,
      sub: 'Semua jadwal terdaftar',
      icon: CalendarDays,
      color: '#7C3AED',
      colorL: '#F3F0FF',
      href: '/admin/jadwal',
    },
    {
      label: 'Pendaftaran',
      value: stats.totalRegistrations,
      sub: `${stats.pendingRegistrations} perlu konfirmasi`,
      icon: ClipboardList,
      color: 'var(--admin-success)',
      colorL: 'var(--admin-success-l)',
      href: '/admin/pendaftaran',
    },
    {
      label: 'Artikel Berita',
      value: stats.totalNews,
      sub: 'Total konten berita',
      icon: Newspaper,
      color: 'var(--admin-warning)',
      colorL: 'var(--admin-warning-l)',
      href: '/admin/berita',
    },
  ];

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Selamat Pagi' : now.getHours() < 17 ? 'Selamat Siang' : 'Selamat Malam';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(120deg, #0D3563 0%, #185FA5 60%, #378ADD 100%)',
          borderRadius: 'var(--admin-radius-xl)',
          padding: '24px 28px',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '0.8125rem', opacity: 0.7, marginBottom: '4px', fontWeight: 500 }}>
            {greeting}, Administrator
          </p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-figtree, Figtree, sans-serif)', marginBottom: '6px', color: '#fff' }}>
            Panel Manajemen Konten
          </h2>
          <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>
            RS Bhayangkara Nganjuk — Kelola dokter, jadwal, pendaftaran & berita
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="admin-stat-grid">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="admin-stat-card"
              style={{ '--stat-color': card.color, '--stat-color-l': card.colorL, textDecoration: 'none' }}
              aria-label={`${card.label}: ${card.value}`}
            >
              <div className="admin-stat-icon">
                <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
              </div>
              <div className="admin-stat-meta">
                <span className="admin-stat-label">{card.label}</span>
                <span className="admin-stat-value">{card.value}</span>
                <span className="admin-stat-sub">{card.sub}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions + Recent Activity */}
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {/* Quick Actions */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Aksi Cepat</span>
          </div>
          <div className="admin-quick-action-list">
            {[
              { href: '/admin/dokter/tambah', label: 'Tambah Dokter Baru' },
              { href: '/admin/jadwal/tambah', label: 'Buat Jadwal Praktek' },
              { href: '/admin/pendaftaran', label: 'Kelola Pendaftaran' },
              { href: '/admin/berita/tambah', label: 'Tulis Artikel Berita' },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="admin-quick-action-item"
              >
                {action.label}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="admin-card" style={{ flex: 1 }}>
          <div className="admin-card-header">
            <span className="admin-card-title">Pendaftaran Terbaru</span>
            <Link href="/admin/pendaftaran" className="admin-btn admin-btn-ghost admin-btn-sm" style={{ textDecoration: 'none' }}>
              Lihat Semua
            </Link>
          </div>
          {recentActivity.length === 0 ? (
            <div className="admin-empty" style={{ padding: '32px' }}>
              <Clock size={28} className="admin-empty-icon" aria-hidden="true" />
              <p className="admin-empty-desc">Belum ada pendaftaran</p>
            </div>
          ) : (
            <div style={{ padding: '8px 0' }}>
              {recentActivity.map((reg) => {
                const cfg = STATUS_CFG[reg.status] || { color: 'neutral', label: reg.status };
                const dateStr = reg.created_at
                  ? new Date(reg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                  : '';
                return (
                  <div
                    key={reg.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 16px',
                      borderBottom: '1px solid var(--admin-border-soft)',
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'var(--admin-primary-l)', color: 'var(--admin-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                    }}>
                      {reg.patient_name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--admin-text-h)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {reg.patient_name}
                      </p>
                      <p style={{ fontSize: '0.6875rem', color: 'var(--admin-text-s)' }}>
                        {reg.schedules?.doctors?.name} · {dateStr}
                      </p>
                    </div>
                    <span className={`admin-badge ${cfg.color}`}>{cfg.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
