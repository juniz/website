import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPublicPejabat, getPublicPejabatBySlug } from '@/app/actions/public';
import { getImageUrl } from '@/lib/utils';
import JsonLd from '@/components/JsonLd';
import DOMPurify from 'isomorphic-dompurify';
import { Briefcase, Calendar, ChevronLeft, ArrowRight, User } from 'lucide-react';
import { Metadata } from 'next';

interface PejabatDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const allPejabat = await getPublicPejabat();
  return allPejabat.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PejabatDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pejabat = await getPublicPejabatBySlug(slug);
  if (!pejabat) return {};

  const title = `${pejabat.name} — Profil Pejabat RS Bhayangkara Nganjuk`;
  const description = `${pejabat.name} selaku ${pejabat.jabatan} RS Bhayangkara Nganjuk. Kenali riwayat karir dan dedikasi beliau dalam pelayanan kesehatan.`;
  const ogImageUrl = pejabat.photo ? getImageUrl(pejabat.photo) : 'https://rsbhayangkaranganjuk.com/og-pejabat.jpg';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: [{ url: ogImageUrl || '', width: 1200, height: 630 }],
    },
  };
}

export default async function PejabatDetailPage({ params }: PejabatDetailPageProps) {
  const { slug } = await params;
  const pejabat = await getPublicPejabatBySlug(slug);
  if (!pejabat) notFound();

  // Fetch all active officers for "Jajaran Pejabat Lainnya" (exclude current)
  const allPejabat = await getPublicPejabat();
  const otherPejabat = allPejabat.filter((p) => p.slug !== slug).slice(0, 3);

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: pejabat.name,
    jobTitle: pejabat.jabatan,
    affiliation: {
      '@type': 'Hospital',
      name: 'RS Bhayangkara Nganjuk',
      logo: 'https://rsbhayangkaranganjuk.com/logo.png',
    },
    image: pejabat.photo ? getImageUrl(pejabat.photo) : null,
  };

  const hasTimeline = pejabat.timeline && pejabat.timeline.length > 0;

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-neutral-50)', paddingBottom: '6rem' }}>
      <JsonLd data={personSchema} />

      {/* Hero Header bar */}
      <section
        style={{
          background: 'linear-gradient(165deg, var(--color-primary-900) 0%, var(--color-primary-800) 100%)',
          paddingBlock: '3rem 4rem',
          color: '#fff',
          borderBottom: '4px solid var(--color-primary-600)',
          position: 'relative',
        }}
      >
        <div className="container-site">
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1.25rem' }}>
            <ol
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                listStyle: 'none',
                fontSize: '0.8125rem',
                color: 'rgba(255,255,255,0.6)',
                padding: 0,
                margin: 0,
              }}
            >
              <li>
                <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Beranda
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/pejabat" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Pejabat
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" style={{ color: 'var(--color-primary-100)', fontWeight: 500 }}>
                {pejabat.name}
              </li>
            </ol>
          </nav>

          <Link
            href="/pejabat"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-primary-200)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              transition: 'color 0.2s',
            }}
            className="back-link"
          >
            <ChevronLeft size={16} />
            Kembali ke Daftar Pejabat
          </Link>
        </div>
      </section>

      {/* Main Grid Content */}
      <section style={{ marginTop: '-2.5rem', position: 'relative', zIndex: 10 }}>
        <div className="container-site">
          <div className="pejabat-detail-grid" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2.5rem', alignItems: 'start' }}>
            
            {/* ── Column Left: Sticky Profile Card ── */}
            <aside style={{ position: 'sticky', top: '100px' }} className="pejabat-sticky-sidebar">
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  boxShadow: '0 20px 40px rgba(4, 44, 83, 0.08)',
                  border: '1px solid var(--color-neutral-200)',
                  overflow: 'hidden',
                }}
              >
                {/* Photo container */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '3/4',
                    background: 'var(--color-primary-50)',
                    borderBottom: '1px solid var(--color-neutral-100)',
                  }}
                >
                  {pejabat.photo ? (
                    <Image
                      src={getImageUrl(pejabat.photo) || ''}
                      alt={pejabat.name}
                      fill
                      priority
                      sizes="320px"
                      style={{ objectFit: 'cover', objectPosition: 'top' }}
                    />
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: 'var(--color-primary-200)',
                      }}
                    >
                      <User size={96} strokeWidth={1} />
                    </div>
                  )}
                </div>

                {/* Meta details card body */}
                <div style={{ padding: '2rem 1.75rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--color-primary-600)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      display: 'block',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {pejabat.jabatan}
                  </span>
                  <h1
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: 'var(--color-foreground)',
                      fontFamily: 'var(--font-figtree)',
                      lineHeight: 1.25,
                      letterSpacing: '-0.02em',
                      margin: '0 0 1rem',
                    }}
                  >
                    {pejabat.name}
                  </h1>

                  {pejabat.pangkat && (
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        background: 'var(--color-primary-50)',
                        border: '1px solid var(--color-primary-100)',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.625rem',
                          color: 'var(--color-primary-600)',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Pangkat / Golongan
                      </span>
                      <span
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--color-primary-900)',
                          fontWeight: 700,
                        }}
                      >
                        {pejabat.pangkat}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* ── Column Right: Profile Bio & Timeline ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {/* Biography Section */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  padding: '2.5rem',
                  boxShadow: '0 10px 30px rgba(4, 44, 83, 0.04)',
                  border: '1px solid var(--color-neutral-200)',
                }}
              >
                <h2
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--color-primary-900)',
                    fontFamily: 'var(--font-figtree)',
                    letterSpacing: '-0.02em',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  Profil &amp; Biografi
                </h2>
                {pejabat.bio ? (
                  <div
                    className="pejabat-bio-content"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pejabat.bio) }}
                  />
                ) : (
                  <p style={{ color: 'var(--color-neutral-500)', fontStyle: 'italic', margin: 0 }}>
                    Biografi belum ditambahkan oleh administrator.
                  </p>
                )}
              </div>

              {/* Work Experience Timeline Section */}
              {hasTimeline && (
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '24px',
                    padding: '2.5rem',
                    boxShadow: '0 10px 30px rgba(4, 44, 83, 0.04)',
                    border: '1px solid var(--color-neutral-200)',
                  }}
                >
                  <h2
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: 'var(--color-primary-900)',
                      fontFamily: 'var(--font-figtree)',
                      letterSpacing: '-0.02em',
                      marginBottom: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Briefcase size={20} style={{ color: 'var(--color-primary-600)' }} />
                    Riwayat Pengalaman Kerja
                  </h2>

                  {/* Vertical Timeline component */}
                  <div
                    style={{
                      position: 'relative',
                      paddingLeft: '1.5rem',
                      borderLeft: '3px solid var(--color-primary-100)',
                      marginLeft: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2rem',
                    }}
                  >
                    {pejabat.timeline.map((item: any, index: number) => (
                      <div key={item.id || index} style={{ position: 'relative' }} className="timeline-item">
                        {/* Connecting Line Node Circle */}
                        <div
                          style={{
                            position: 'absolute',
                            left: '-2.125rem',
                            top: '4px',
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: '#ffffff',
                            border: '3px solid var(--color-primary-600)',
                            boxShadow: '0 0 0 5px var(--color-primary-50)',
                            transition: 'all 0.3s ease',
                          }}
                          className="timeline-node"
                        />

                        {/* Content Container */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span
                            style={{
                              alignSelf: 'flex-start',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '0.375rem 0.75rem',
                              background: 'var(--color-primary-50)',
                              border: '1px solid var(--color-primary-100)',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: 'var(--color-primary-700)',
                              fontFamily: 'var(--font-figtree)',
                            }}
                          >
                            <Calendar size={12} />
                            {item.year}
                          </span>

                          <h3
                            style={{
                              fontSize: '1.125rem',
                              fontWeight: 700,
                              color: 'var(--color-neutral-900)',
                              margin: '4px 0 2px',
                              lineHeight: 1.3,
                            }}
                          >
                            {item.position}
                          </h3>

                          <p
                            style={{
                              fontSize: '0.875rem',
                              color: 'var(--color-neutral-500)',
                              margin: 0,
                              fontWeight: 500,
                            }}
                          >
                            {item.institution}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom Section: Jajaran Pejabat Lainnya ── */}
      {otherPejabat.length > 0 && (
        <section style={{ marginTop: '5rem' }}>
          <div className="container-site">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                borderBottom: '2px solid var(--color-neutral-200)',
                paddingBottom: '1rem',
                marginBottom: '2rem',
              }}
            >
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    background: 'var(--color-primary-50)',
                    color: 'var(--color-primary-600)',
                    border: '1px solid var(--color-primary-100)',
                    borderRadius: '999px',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    fontFamily: 'var(--font-figtree)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Struktur Organisasi
                </span>
                <h2
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'var(--color-primary-900)',
                    fontFamily: 'var(--font-figtree)',
                    letterSpacing: '-0.02em',
                    margin: 0,
                  }}
                >
                  Jajaran Pejabat Lainnya
                </h2>
              </div>
              <Link
                href="/pejabat"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--color-primary-600)',
                  textDecoration: 'none',
                  transition: 'gap 0.2s',
                }}
                className="explore-all"
              >
                Semua Pejabat
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Other Officers Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem',
              }}
            >
              {otherPejabat.map((pj) => (
                <Link
                  key={pj.id}
                  href={`/pejabat/${pj.slug}`}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--color-neutral-200)',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  className="related-pejabat-card"
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      background: 'var(--color-primary-50)',
                      position: 'relative',
                      flexShrink: 0,
                    }}
                  >
                    {pj.photo ? (
                      <Image
                        src={getImageUrl(pj.photo) || ''}
                        alt={pj.name}
                        fill
                        sizes="64px"
                        style={{ objectFit: 'cover', objectPosition: 'top' }}
                      />
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          color: 'var(--color-primary-200)',
                        }}
                      >
                        <User size={24} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        color: 'var(--color-neutral-900)',
                        margin: '0 0 2px',
                        lineHeight: 1.3,
                      }}
                    >
                      {pj.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-primary-600)',
                        fontWeight: 600,
                        margin: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {pj.jabatan}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Global & Nested Class Custom Styling */}
      <style>{`
        .back-link:hover {
          color: #ffffff !important;
        }
        .explore-all:hover {
          gap: 10px !important;
          color: var(--color-primary-800) !important;
        }
        .related-pejabat-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-primary-300);
          box-shadow: 0 10px 25px rgba(24, 95, 165, 0.08);
        }

        /* Biography rich HTML contents */
        .pejabat-bio-content {
          color: var(--color-foreground);
          font-size: 0.9375rem;
          line-height: 1.8;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .pejabat-bio-content p {
          margin: 0;
        }
        .pejabat-bio-content ul, .pejabat-bio-content ol {
          margin: 0;
          padding-left: 1.5rem;
        }
        .pejabat-bio-content li {
          margin-bottom: 0.25rem;
        }
        .pejabat-bio-content strong {
          font-weight: 700;
          color: var(--color-primary-900);
        }
        
        /* Timeline item zoom effect on hover */
        .timeline-item:hover .timeline-node {
          transform: scale(1.2);
          background: var(--color-primary-600) !important;
          box-shadow: 0 0 0 8px var(--color-primary-50) !important;
        }

        @media (max-width: 900px) {
          .pejabat-detail-grid {
            grid-template-columns: 1fr !important;
          }
          .pejabat-sticky-sidebar {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>
    </main>
  );
}
