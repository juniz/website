import { getPublicPejabat, getPageSEO } from '@/app/actions/public';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';

export async function generateMetadata() {
  const seo = await getPageSEO('/pejabat');
  const title = seo?.meta_title || 'Struktur Organisasi & Pejabat — RS Bhayangkara Nganjuk';
  const description = seo?.meta_description || 'Kenali jajaran pimpinan dan pejabat struktural RS Bhayangkara Nganjuk yang berkomitmen memberikan pelayanan kesehatan terbaik.';
  const ogImageUrl = seo?.og_image ? getImageUrl(seo.og_image) : 'https://rsbhayangkaranganjuk.com/og-pejabat.jpg';

  return {
    title: { absolute: title },
    description,
    keywords: seo?.meta_keywords || [],
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: 'website',
    },
  };
}

export default async function PejabatPublicPage() {
  const [pejabat, seo] = await Promise.all([
    getPublicPejabat(),
    getPageSEO('/pejabat')
  ]);

  if (seo && seo.is_active === false) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'name': 'Pejabat RS Bhayangkara Nganjuk',
    'description': 'Daftar pejabat struktural dan pimpinan RS Bhayangkara Nganjuk.',
    'publisher': {
      '@type': 'Hospital',
      'name': 'RS Bhayangkara Nganjuk'
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-neutral-50)' }}>
      <JsonLd data={jsonLd} />

      {/* Hero / Header Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-800) 100%)', 
        paddingBlock: '4rem 5rem', 
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Grid Overlay */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}>
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pejabat" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pejabat)" />
          </svg>
        </div>

        <div className="container-site" style={{ position: 'relative', zIndex: 1 }}>
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
            <ol style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', listStyle: 'none', fontSize: '0.8125rem', color: 'var(--color-primary-200)' }}>
              <li><Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Beranda</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" style={{ color: '#fff' }}>Pejabat</li>
            </ol>
          </nav>
          
          <h1 style={{ 
            fontSize: 'clamp(2rem, 5vw, 3rem)', 
            fontWeight: 800, 
            fontFamily: 'var(--font-figtree)', 
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            Pejabat Struktural
          </h1>
          <p style={{ 
            fontSize: 'clamp(1rem, 1.2vw, 1.125rem)', 
            color: 'var(--color-primary-100)', 
            maxWidth: '600px',
            lineHeight: 1.6
          }}>
            Jajaran pimpinan RS Bhayangkara Nganjuk yang berdedikasi dalam mengelola dan memberikan pelayanan kesehatan paripurna bagi masyarakat.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section style={{ marginTop: '-3rem', paddingBottom: '5rem' }}>
        <div className="container-site">
          {pejabat.length === 0 ? (
            <div style={{ 
              background: '#fff', 
              borderRadius: '24px', 
              padding: '5rem 2rem', 
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
              border: '1px solid var(--color-primary-100)'
            }}>
              <p style={{ color: 'var(--color-neutral-500)', fontSize: '1.125rem' }}>Data pejabat belum tersedia.</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '2rem' 
            }}>
              {pejabat.map((pj, idx) => (
                <article 
                  key={pj.id}
                  style={{ 
                    background: '#fff', 
                    borderRadius: '24px', 
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    border: '1px solid var(--color-neutral-200)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  className="pejabat-card"
                >
                  {/* Photo Container */}
                  <div style={{ 
                    position: 'relative', 
                    width: '100%', 
                    aspectRatio: '4/5', 
                    background: 'var(--color-primary-50)',
                    overflow: 'hidden'
                  }}>
                    {pj.photo ? (
                      <Image 
                        src={getImageUrl(pj.photo)} 
                        alt={pj.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 350px"
                        style={{ objectFit: 'cover', objectPosition: 'top' }}
                        className="pejabat-photo"
                      />
                    ) : (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        height: '100%',
                        color: 'var(--color-primary-200)'
                      }}>
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                    )}
                    
                    {/* Badge Overlay */}
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '1rem', 
                      left: '1rem', 
                      right: '1rem',
                      zIndex: 2
                    }}>
                      <div style={{ 
                        background: 'rgba(255, 255, 255, 0.9)', 
                        backdropFilter: 'blur(10px)',
                        padding: '1rem',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                      }}>
                        <h2 style={{ 
                          fontSize: '1.125rem', 
                          fontWeight: 700, 
                          color: 'var(--color-primary-900)',
                          fontFamily: 'var(--font-figtree)',
                          marginBottom: '0.25rem',
                          lineHeight: 1.2
                        }}>
                          {pj.name}
                        </h2>
                        <p style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: 600, 
                          color: 'var(--color-primary-600)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          {pj.jabatan}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {(pj.pangkat || pj.nrp) && (
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '0.75rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px dashed var(--color-neutral-200)'
                      }}>
                        {pj.pangkat && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-neutral-400)', fontWeight: 600 }}>PANGKAT:</span>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-700)', fontWeight: 700 }}>{pj.pangkat}</span>
                          </div>
                        )}
                        {pj.nrp && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-neutral-400)', fontWeight: 600 }}>NRP/NIP:</span>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-700)', fontWeight: 700 }}>{pj.nrp}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {pj.bio && (
                      <p style={{ 
                        fontSize: '0.9375rem', 
                        color: 'var(--color-neutral-600)', 
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {pj.bio}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .pejabat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(24, 95, 165, 0.12);
          border-color: var(--color-primary-200);
        }
        .pejabat-card:hover .pejabat-photo {
          transform: scale(1.05);
        }
        .pejabat-photo {
          transition: transform 0.5s ease;
        }
      `}</style>
    </main>
  );
}
