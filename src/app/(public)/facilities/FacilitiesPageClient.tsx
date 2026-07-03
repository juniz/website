'use client';

import { useState, useEffect } from 'react';
import { Search, Globe, X } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';
import PageHero from '@/components/PageHero';
import { Facility } from '@/types/api';

interface FacilitiesPageClientProps {
  facilities?: Facility[];
}

export default function FacilitiesPageClient({ facilities = [] }: FacilitiesPageClientProps) {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  // Extract all categories dynamically
  const categories = ['Semua', ...new Set(facilities.map(f => f.category).filter((c): c is string => !!c))];

  // Filter facilities based on search & category
  const filteredFacilities = facilities.filter(fac => {
    const matchesCategory = activeCategory === 'Semua' || fac.category === activeCategory;
    const matchesSearch = fac.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fac.description && fac.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Close modal on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedFacility(null);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // Lock scroll when modal is active
  useEffect(() => {
    document.body.style.overflow = selectedFacility ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedFacility]);

  return (
    <>
      {/* Page Header */}
      <PageHero
        breadcrumb="Fasilitas & Layanan"
        title="Fasilitas & Layanan"
        subtitle="Fasilitas medis modern dan layanan kesehatan berkualitas tinggi untuk kenyamanan dan pemulihan pasien."
      />

      {/* Facilities Catalog */}
      <section style={{ backgroundColor: 'var(--color-neutral-50)', padding: '3rem 0', minHeight: '60vh' }}>
        <div className="container-site">
          {/* Filters Bar */}
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            marginBottom: '2.5rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
          }} className="filters-bar-wrapper">

            {/* Category tabs */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {categories.map(cat => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: '0.625rem 1.25rem',
                      borderRadius: '999px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: isActive ? 'var(--color-primary-600)' : 'var(--color-neutral-200)',
                      backgroundColor: isActive ? 'var(--color-primary-600)' : '#ffffff',
                      color: isActive ? '#ffffff' : 'var(--color-neutral-900)',
                      transition: 'all 180ms ease-out',
                      minHeight: '40px',
                      minWidth: '70px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    className="category-pill-btn"
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
              <span style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-neutral-600)',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none'
              }}>
                <Search size={18} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari fasilitas..."
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 16px 0 42px',
                  borderRadius: '999px',
                  border: '1px solid var(--color-neutral-200)',
                  backgroundColor: '#ffffff',
                  fontSize: '0.875rem',
                  color: 'var(--color-neutral-900)',
                  transition: 'border-color 150ms ease-out, box-shadow 150ms ease-out',
                  outline: 'none'
                }}
                className="search-input-field"
              />
            </div>
          </div>

          {/* Facility Cards Grid */}
          {filteredFacilities.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid var(--color-neutral-200)',
              maxWidth: '500px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Globe size={48} strokeWidth={1.5} style={{ color: 'var(--color-neutral-600)' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-neutral-900)', margin: 0 }}>
                Fasilitas Tidak Ditemukan
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)', margin: 0, lineHeight: 1.5 }}>
                Kami tidak menemukan fasilitas yang cocok dengan pencarian atau kategori Anda saat ini.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '24px'
            }}>
              {filteredFacilities.map(fac => {
                const img = fac.image_url ? getImageUrl(fac.image_url) : null;
                return (
                  <button
                    key={fac.id}
                    onClick={() => setSelectedFacility(fac)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      textAlign: 'left',
                      background: '#ffffff',
                      border: '1px solid var(--color-neutral-200)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 200ms ease-out',
                      padding: 0,
                      width: '100%',
                    }}
                    className="facility-card"
                  >
                    {/* Card Image */}
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: '180px',
                      backgroundColor: 'var(--color-primary-50)',
                      overflow: 'hidden'
                    }}>
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={img}
                          alt={fac.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 300ms ease-out'
                          }}
                          className="facility-card-img"
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-primary-600)'
                        }}>
                          <Globe size={40} strokeWidth={1.5} />
                        </div>
                      )}

                      {/* Category Badge */}
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'var(--color-primary-50)',
                        color: 'var(--color-primary-600)',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        letterSpacing: '0.04em',
                        border: '1px solid var(--color-primary-100)'
                      }}>
                        {fac.category}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, width: '100%' }}>
                      <h3 style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'var(--color-neutral-900)',
                        marginBottom: '8px',
                        fontFamily: 'var(--font-figtree)',
                        lineHeight: 1.4
                      }}>
                        {fac.title}
                      </h3>
                      <p style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-neutral-600)',
                        lineHeight: 1.6,
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        flex: 1
                      }}>
                        {fac.description || 'Tidak ada deskripsi tersedia.'}
                      </p>

                      <div style={{
                        marginTop: '16px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: 'var(--color-primary-600)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        Lihat Detail Selengkapnya &rarr;
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Modal Detail Popup */}
      {selectedFacility && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            backgroundColor: 'rgba(4, 44, 83, 0.6)',
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 200ms ease-out both'
          }}
          onClick={() => setSelectedFacility(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid var(--color-neutral-200)',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              animation: 'slideUp 250ms cubic-bezier(0.16, 1, 0.3, 1) both'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              aria-label="Tutup detail"
              onClick={() => setSelectedFacility(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid var(--color-neutral-200)',
                color: 'var(--color-neutral-900)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'background 150ms'
              }}
              className="close-modal-btn"
            >
              <X size={18} />
            </button>

            {/* Modal Image */}
            <div style={{
              width: '100%',
              height: '300px',
              position: 'relative',
              backgroundColor: 'var(--color-primary-50)'
            }}>
              {selectedFacility.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getImageUrl(selectedFacility.image_url) || ''}
                  alt={selectedFacility.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary-600)'
                }}>
                  <Globe size={64} strokeWidth={1.5} />
                </div>
              )}
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              {/* Category */}
              <span style={{
                backgroundColor: 'var(--color-primary-50)',
                color: 'var(--color-primary-600)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '4px 12px',
                borderRadius: '999px',
                letterSpacing: '0.04em',
                border: '1px solid var(--color-primary-100)',
                display: 'inline-block',
                marginBottom: '12px'
              }}>
                {selectedFacility.category}
              </span>

              {/* Title */}
              <h2 id="modal-title" style={{
                fontFamily: 'var(--font-figtree)',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--color-neutral-900)',
                margin: '0 0 16px 0',
                lineHeight: 1.3
              }}>
                {selectedFacility.title}
              </h2>

              {/* Description */}
              <div style={{
                fontSize: '0.9375rem',
                color: 'var(--color-neutral-900)',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                fontFamily: 'var(--font-inter)'
              }}>
                {selectedFacility.description || 'Tidak ada deskripsi tambahan.'}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .facility-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -5px rgba(4, 44, 83, 0.1), 0 4px 6px -2px rgba(4, 44, 83, 0.05);
          border-color: var(--color-primary-200);
        }
        .facility-card:hover .facility-card-img {
          transform: scale(1.03);
        }
        .close-modal-btn:hover {
          background-color: #ffffff !important;
          color: var(--color-primary-600) !important;
        }
        
        /* Focus Standard */
        .search-input-field:focus {
          border-color: var(--color-primary-400) !important;
          box-shadow: 0 0 0 3px rgba(55, 138, 221, 0.15) !important;
        }
        .category-pill-btn:focus-visible, 
        .facility-card:focus-visible, 
        .close-modal-btn:focus-visible {
          outline: 2.5px solid var(--color-primary-400) !important;
          outline-offset: 2px !important;
          border-radius: 4px;
        }
        
        @media (max-width: 640px) {
          .filters-bar-wrapper {
            flex-direction: column !important;
            align-items: stretch !important;
          }
        }
      `}</style>
    </>
  );
}
