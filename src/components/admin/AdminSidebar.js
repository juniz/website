'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Stethoscope,
  CalendarDays,
  ClipboardList,
  Newspaper,
  ChevronLeft,
  ShieldCheck,
  LogOut,
  X,
  Menu,
} from 'lucide-react';
import { doLogout } from '@/app/actions/auth';

const NAV_ITEMS = [
  {
    group: 'Utama',
    items: [
      {
        href: '/admin',
        label: 'Dashboard',
        icon: LayoutDashboard,
        exact: true,
        description: 'Ringkasan & statistik',
      },
    ],
  },
  {
    group: 'Kelola Konten',
    items: [
      {
        href: '/admin/dokter',
        label: 'Dokter',
        icon: Stethoscope,
        description: 'Data dokter & spesialisasi',
      },
      {
        href: '/admin/jadwal',
        label: 'Jadwal Praktek',
        icon: CalendarDays,
        description: 'Jadwal & kuota',
      },
      {
        href: '/admin/pendaftaran',
        label: 'Pendaftaran',
        icon: ClipboardList,
        description: 'Pasien & status',
      },
      {
        href: '/admin/berita',
        label: 'Berita & Artikel',
        icon: Newspaper,
        description: 'Kelola konten berita',
      },
    ],
  },
];

function NavItem({ item, collapsed }) {
  const pathname = usePathname();
  const isActive = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);

  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`admin-nav-item ${isActive ? 'active' : ''}`}
      title={collapsed ? item.label : undefined}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="admin-nav-icon">
        <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
      </span>
      {!collapsed && (
        <span className="admin-nav-label">
          <span className="admin-nav-text">{item.label}</span>
          <span className="admin-nav-desc">{item.description}</span>
        </span>
      )}
      {isActive && !collapsed && <span className="admin-nav-indicator" aria-hidden="true" />}
    </Link>
  );
}

export default function AdminSidebar({ user }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile toggle (rendered in topbar via portal-like approach) */}
      <button
        id="admin-sidebar-toggle"
        className="admin-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Buka menu navigasi"
        aria-expanded={mobileOpen}
      >
        <Menu size={20} />
      </button>

      <aside
        className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
        aria-label="Navigasi admin panel"
      >
        {/* Header */}
        <div className="admin-sidebar-header">
          {!collapsed && (
            <div className="admin-brand">
              <div className="admin-brand-icon" aria-hidden="true">
                <ShieldCheck size={20} strokeWidth={2} />
              </div>
              <div className="admin-brand-text">
                <span className="admin-brand-name">RS Bhayangkara</span>
                <span className="admin-brand-sub">Admin Panel</span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="admin-brand-icon-only" aria-hidden="true">
              <ShieldCheck size={20} strokeWidth={2} />
            </div>
          )}

          {/* Mobile close */}
          <button
            className="admin-sidebar-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>

          {/* Desktop collapse toggle */}
          <button
            className="admin-collapse-toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Perluas sidebar' : 'Perkecil sidebar'}
            aria-expanded={!collapsed}
          >
            <ChevronLeft
              size={16}
              style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 250ms' }}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar-nav" aria-label="Menu utama">
          {NAV_ITEMS.map((group) => (
            <div key={group.group} className="admin-nav-group">
              {!collapsed && (
                <p className="admin-nav-group-label" aria-hidden="true">
                  {group.group}
                </p>
              )}
              <ul role="list" className="admin-nav-list">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <NavItem item={item} collapsed={collapsed} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          {!collapsed && (
            <div className="admin-user-info">
              <div className="admin-user-avatar" aria-hidden="true">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="admin-user-details">
                <span className="admin-user-name">{user?.name || 'Administrator'}</span>
                <span className="admin-user-email">{user?.email || ''}</span>
              </div>
            </div>
          )}
          <button
            className={`admin-logout-btn ${collapsed ? 'icon-only' : ''}`}
            onClick={() => doLogout()}
            title="Keluar"
            aria-label="Keluar dari admin panel"
          >
            <LogOut size={16} strokeWidth={1.75} aria-hidden="true" />
            {!collapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
