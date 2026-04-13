'use client';

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';

const BREADCRUMBS = {
  '/admin': [{ label: 'Dashboard' }],
  '/admin/dokter': [{ label: 'Kelola Konten' }, { label: 'Dokter' }],
  '/admin/dokter/tambah': [{ label: 'Dokter', href: '/admin/dokter' }, { label: 'Tambah Dokter' }],
  '/admin/jadwal': [{ label: 'Kelola Konten' }, { label: 'Jadwal Praktek' }],
  '/admin/jadwal/tambah': [{ label: 'Jadwal', href: '/admin/jadwal' }, { label: 'Tambah Jadwal' }],
  '/admin/pendaftaran': [{ label: 'Kelola Konten' }, { label: 'Pendaftaran Pasien' }],
  '/admin/berita': [{ label: 'Kelola Konten' }, { label: 'Berita & Artikel' }],
  '/admin/berita/tambah': [{ label: 'Berita', href: '/admin/berita' }, { label: 'Tulis Artikel' }],
};

function getBreadcrumbs(pathname) {
  if (BREADCRUMBS[pathname]) return BREADCRUMBS[pathname];
  // Dynamic routes like /admin/dokter/[id]/edit
  for (const key of Object.keys(BREADCRUMBS)) {
    if (pathname.startsWith(key + '/')) {
      const last = BREADCRUMBS[key];
      return [...last.slice(0, -1), { label: last[last.length - 1].label, href: key }, { label: 'Edit' }];
    }
  }
  return [{ label: 'Admin' }];
}

export default function AdminTopbar({ user }) {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname);
  const pageTitle = crumbs[crumbs.length - 1].label;

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        {/* Mobile menu toggle is rendered by sidebar, but we need a slot here */}
        <div className="admin-topbar-breadcrumb" aria-label="Breadcrumb navigasi">
          <ol className="admin-breadcrumb-list" role="list">
            {crumbs.map((crumb, i) => (
              <li key={i} className="admin-breadcrumb-item">
                {i < crumbs.length - 1 ? (
                  <>
                    {crumb.href ? (
                      <a href={crumb.href} className="admin-breadcrumb-link">
                        {crumb.label}
                      </a>
                    ) : (
                      <span className="admin-breadcrumb-sep">{crumb.label}</span>
                    )}
                    <span className="admin-breadcrumb-divider" aria-hidden="true">/</span>
                  </>
                ) : (
                  <span className="admin-breadcrumb-current" aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
          <h1 className="admin-page-title">{pageTitle}</h1>
        </div>
      </div>

      <div className="admin-topbar-right">
        <button
          className="admin-topbar-btn"
          aria-label="Notifikasi"
          title="Notifikasi"
        >
          <Bell size={18} strokeWidth={1.75} aria-hidden="true" />
        </button>

        <div className="admin-topbar-user" aria-label="Pengguna saat ini">
          <div className="admin-topbar-avatar" aria-hidden="true">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <span className="admin-topbar-name">{user?.name || 'Admin'}</span>
        </div>
      </div>
    </header>
  );
}
