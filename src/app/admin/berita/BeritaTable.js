'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Pencil, Trash2, Search, Newspaper, ExternalLink } from 'lucide-react';
import { deleteBerita } from '@/app/actions/admin/berita';
import { getImageUrl } from '@/lib/utils';

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BeritaTable({ articles }) {
  const router = useRouter();
  const [search, setSearch]       = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [confirmDel, setConfirmDel] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast]         = useState(null);

  const categories = ['all', ...new Set(articles.map((a) => a.category).filter(Boolean))];

  const filtered = articles.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = a.title?.toLowerCase().includes(q) || a.author?.toLowerCase().includes(q);
    const matchCat = filterCat === 'all' || a.category === filterCat;
    return matchSearch && matchCat;
  });

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function confirmDeleteAction() {
    if (!confirmDel) return;
    startTransition(async () => {
      const result = await deleteBerita(confirmDel.id);
      setConfirmDel(null);
      if (result?.error) {
        showToast('Gagal menghapus artikel.', 'danger');
      } else {
        showToast('Artikel berhasil dihapus.', 'success');
        router.refresh();
      }
    });
  }

  return (
    <>
      <div className="admin-toolbar" style={{ padding: '14px 16px 0' }}>
        <div className="admin-toolbar-left">
          <div className="admin-search-wrap">
            <Search size={14} className="admin-search-icon" aria-hidden="true" />
            <input
              type="search"
              className="admin-input"
              placeholder="Cari judul atau penulis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Cari berita"
            />
          </div>
          <select
            className="admin-select"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            aria-label="Filter kategori"
            style={{ width: 'auto', minWidth: 140 }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'all' ? 'Semua Kategori' : c}</option>
            ))}
          </select>
        </div>
        <span style={{ fontSize: '0.8125rem', color: 'var(--admin-text-m)' }}>
          {filtered.length} artikel
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">
            <Newspaper size={24} aria-hidden="true" />
          </div>
          <p className="admin-empty-title">Tidak ada artikel ditemukan</p>
          <p className="admin-empty-desc">
            {search || filterCat !== 'all' ? 'Coba ubah filter.' : 'Mulai tulis artikel berita pertama Anda.'}
          </p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table" aria-label="Daftar Berita">
            <thead>
              <tr>
                <th scope="col">Artikel</th>
                <th scope="col">Kategori</th>
                <th scope="col">Penulis</th>
                <th scope="col">Tanggal</th>
                <th scope="col">Baca</th>
                <th scope="col" style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {a.image && (
                        <div style={{
                          width: 40, height: 40, borderRadius: 'var(--admin-radius-sm)',
                          overflow: 'hidden', flexShrink: 0,
                          background: 'var(--admin-primary-l)',
                          position: 'relative',
                        }}>
                          <Image
                            src={getImageUrl(a.image)}
                            alt=""
                            fill
                            style={{ objectFit: 'cover' }}
                            unoptimized
                          />
                        </div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        <p style={{
                          fontWeight: 600, color: 'var(--admin-text-h)',
                          fontSize: '0.8125rem',
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          {a.title}
                        </p>
                        <p style={{ fontSize: '0.6875rem', color: 'var(--admin-text-s)', marginTop: 2 }}>
                          /{a.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="admin-badge info">{a.category}</span>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--admin-text-m)' }}>{a.author}</td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--admin-text-m)' }}>{formatDate(a.date)}</td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--admin-text-s)' }}>{a.read_time}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                      <a
                        href={`/news/${a.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn admin-btn-ghost admin-btn-icon"
                        aria-label="Lihat di halaman publik"
                        title="Lihat publik"
                      >
                        <ExternalLink size={14} aria-hidden="true" />
                      </a>
                      <Link
                        href={`/admin/berita/${a.id}/edit`}
                        className="admin-btn admin-btn-ghost admin-btn-icon"
                        aria-label={`Edit ${a.title}`}
                        title="Edit"
                      >
                        <Pencil size={14} aria-hidden="true" />
                      </Link>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-icon"
                        onClick={() => setConfirmDel(a)}
                        aria-label={`Hapus ${a.title}`}
                        title="Hapus"
                      >
                        <Trash2 size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmDel && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="del-news-title">
          <div className="admin-modal" style={{ maxWidth: '400px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title" id="del-news-title">Hapus Artikel</h3>
            </div>
            <div className="admin-modal-body">
              <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-b)', lineHeight: 1.6 }}>
                Hapus artikel &quot;<strong>{confirmDel.title}</strong>&quot;? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={() => setConfirmDel(null)} autoFocus>Batal</button>
              <button
                className="admin-btn"
                style={{ background: 'var(--admin-danger)', color: '#fff' }}
                onClick={confirmDeleteAction}
                disabled={isPending}
              >
                {isPending ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="admin-toast-container" role="status" aria-live="polite">
          <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>
        </div>
      )}
    </>
  );
}
