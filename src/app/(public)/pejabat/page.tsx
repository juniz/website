import { getPublicPejabat, getPageSEO } from '@/app/actions/public';
import { getImageUrl } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import PejabatCard from '@/components/PejabatCard';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
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
      images: [{ url: ogImageUrl || '', width: 1200, height: 630 }],
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
        background: 'linear-gradient(165deg, var(--color-primary-900) 0%, var(--color-primary-800) 100%)', 
        paddingBlock: '5rem 6rem', 
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '4px solid var(--color-primary-600)'
      }}>
        {/* Decorative Elements */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none' }}>
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <pattern id="grid-pejabat-v2" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pejabat-v2)" />
          </svg>
        </div>
        
        {/* Abstract medical glow */}
        <div style={{ 
          position: 'absolute', 
          top: '-10%', 
          right: '-5%', 
          width: '40%', 
          height: '60%', 
          background: 'radial-gradient(circle, rgba(55, 138, 221, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 0
        }} />

        <div className="container-site" style={{ position: 'relative', zIndex: 1 }}>
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
            <ol style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', listStyle: 'none', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', paddingLeft: 0 }}>
              <li><Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Beranda</Link></li>
              <li aria-hidden="true" style={{ opacity: 0.5 }}>/</li>
              <li aria-current="page" style={{ color: 'var(--color-primary-100)', fontWeight: 500 }}>Pejabat</li>
            </ol>
          </nav>
          
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', 
            fontWeight: 800, 
            fontFamily: 'var(--font-figtree)', 
            marginBottom: '1.25rem',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: '#FFFFFF'
          }}>
            Pejabat <span style={{ color: 'var(--color-primary-400)' }}>Struktural</span>
          </h1>
          <p style={{ 
            fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)', 
            color: 'rgba(255,255,255,0.8)', 
            maxWidth: '650px',
            lineHeight: 1.6,
            fontWeight: 400
          }}>
            Dedikasi pimpinan RS Bhayangkara Nganjuk dalam mewujudkan pelayanan kesehatan yang profesional, modern, dan terpercaya bagi seluruh lapisan masyarakat.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section style={{ marginTop: '-4rem', paddingBottom: '6rem', position: 'relative', zIndex: 10 }}>
        <div className="container-site">
          {pejabat.length === 0 ? (
            <div style={{ 
              background: '#fff', 
              borderRadius: '24px', 
              padding: '6rem 2rem', 
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
              border: '1px solid var(--color-neutral-200)'
            }}>
              <p style={{ color: 'var(--color-neutral-500)', fontSize: '1.125rem' }}>Data pejabat belum tersedia.</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '2.5rem' 
            }}>
              {pejabat.map((pj) => (
                <PejabatCard key={pj.id} pejabat={pj} />
              ))}
            </div>
          )}

        </div>
      </section>

      <style>{`
        .pejabat-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 25px 60px rgba(4, 44, 83, 0.12);
          border-color: var(--color-primary-400);
        }
        .pejabat-card:hover .pejabat-photo {
          transform: scale(1.04);
        }
        .pejabat-photo {
          transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .photo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 60%, rgba(4, 44, 83, 0.1));
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .pejabat-card:hover .photo-overlay {
          opacity: 1;
        }
        .pejabat-bio-rich p { margin: 0; }
        .pejabat-bio-rich ul, .pejabat-bio-rich ol { margin: 0; padding-left: 1.25rem; }
      `}</style>
    </main>
  );
}
