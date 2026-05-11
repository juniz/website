'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ meta }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!meta || meta.lastPage <= 1) return null;

  const { total, page, limit, lastPage } = meta;

  function createPageURL(pageNumber) {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  }

  function handlePageChange(pageNumber) {
    if (pageNumber < 1 || pageNumber > lastPage) return;
    router.push(createPageURL(pageNumber));
  }

  // Generate page numbers to show
  const getPages = () => {
    const pages = [];
    const showMax = 5;
    
    let start = Math.max(1, page - Math.floor(showMax / 2));
    let end = Math.min(lastPage, start + showMax - 1);
    
    if (end - start + 1 < showMax) {
      start = Math.max(1, end - showMax + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="admin-pagination">
      <div className="admin-pagination-info">
        Menampilkan <strong>{((page - 1) * limit) + 1}</strong> - <strong>{Math.min(page * limit, total)}</strong> dari <strong>{total}</strong> data
      </div>
      <div className="admin-pagination-btns">
        <button
          className="admin-page-btn"
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft size={16} />
        </button>
        
        {getPages()[0] > 1 && (
          <>
            <button className="admin-page-btn" onClick={() => handlePageChange(1)}>1</button>
            {getPages()[0] > 2 && <span style={{ padding: '0 4px', color: 'var(--admin-text-s)' }}>...</span>}
          </>
        )}

        {getPages().map((p) => (
          <button
            key={p}
            className={`admin-page-btn ${p === page ? 'active' : ''}`}
            onClick={() => handlePageChange(p)}
          >
            {p}
          </button>
        ))}

        {getPages()[getPages().length - 1] < lastPage && (
          <>
            {getPages()[getPages().length - 1] < lastPage - 1 && <span style={{ padding: '0 4px', color: 'var(--admin-text-s)' }}>...</span>}
            <button className="admin-page-btn" onClick={() => handlePageChange(lastPage)}>{lastPage}</button>
          </>
        )}

        <button
          className="admin-page-btn"
          disabled={page >= lastPage}
          onClick={() => handlePageChange(page + 1)}
          aria-label="Halaman berikutnya"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
