import Link from 'next/link';
import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
import { api } from '@/lib/api';

import { getPageSEO, getPublicAboutData } from '@/app/actions/public';
import { getImageUrl } from '@/lib/utils';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
  const seo = await getPageSEO('/about');
  const title = seo?.meta_title || 'Tentang RS Bhayangkara Nganjuk';
  const description = seo?.meta_description || 'RS Bhayangkara Nganjuk adalah rumah sakit terakreditasi Madya yang melayani masyarakat Nganjuk sejak 1985. Kenali profil, visi misi, dan tim dokter kami.';
  const ogImageUrl = seo?.og_image ? getImageUrl(seo.og_image) : 'https://rsbhayangkaranganjuk.com/og-about.jpg';

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

// ── Fallback data (used when DB is empty) ────────────────────
const FALLBACK_PROFILE = {
  header_title:        'Tentang Kami',
  header_subtitle:     'Melayani masyarakat Nganjuk dengan sepenuh hati sejak 1985',
  paragraph_1:         'RS Bhayangkara Nganjuk adalah rumah sakit umum di bawah naungan Kepolisian Negara Republik Indonesia yang telah melayani masyarakat Nganjuk dan sekitarnya sejak tahun 1985. Dengan status terakreditasi Madya dari KARS, kami berkomitmen memberikan layanan kesehatan berstandar tinggi untuk seluruh lapisan masyarakat.',
  paragraph_2:         'Didukung oleh lebih dari 32 dokter spesialis dan ratusan tenaga kesehatan profesional, RS Bhayangkara Nganjuk terus berinovasi untuk menghadirkan pengalaman layanan medis yang nyaman, cepat, dan terpercaya.',
  accreditation_title: 'TERAKREDITASI MADYA',
  accreditation_body:  'Komisi Akreditasi Rumah Sakit (KARS)',
  accreditation_valid: 'Berlaku s.d 2027',
};

const FALLBACK_STATS = [
  { id: '1', value: '40+', label: 'Tahun Melayani',   icon_name: 'award' },
  { id: '2', value: '120', label: 'Tempat Tidur',     icon_name: 'bed'   },
  { id: '3', value: '32+', label: 'Dokter Spesialis', icon_name: 'users' },
  { id: '4', value: '10',  label: 'Poli Klinik',      icon_name: 'grid'  },
];

const FALLBACK_VM = {
  visi: 'Menjadi rumah sakit terakreditasi paripurna yang unggul, profesional, dan terpercaya di Jawa Timur pada tahun 2030.',
  misi: [
    'Memberikan pelayanan medis bermutu tinggi',
    'Mengembangkan SDM yang profesional dan berkarakter',
    'Menerapkan sistem manajemen berbasis digital',
    'Menjadi mitra kesehatan masyarakat Nganjuk',
  ],
};

const FALLBACK_VALUES = [
  { id: '1', title: 'Profesional', description: 'Tenaga medis bersertifikat and terus mengikuti perkembangan ilmu kedokteran terkini.' },
  { id: '2', title: 'Terpercaya',  description: 'Diakreditasi KARS Madya; standar mutu and keselamatan pasien selalu diutamakan.' },
  { id: '3', title: 'Peduli',      description: 'Melayani seluruh lapisan masyarakat, termasuk pemegang BPJS Kesehatan.' },
  { id: '4', title: 'Inovatif',    description: 'Teknologi medis modern and sistem digital untuk kenyamanan pasien.' },
];

const FALLBACK_MILESTONES = [
  { id: '1', year: '1985', event: 'Rumah sakit didirikan sebagai fasilitas kesehatan kepolisian' },
  { id: '2', year: '1999', event: 'Dibuka untuk masyarakat umum — akreditasi pertama' },
  { id: '3', year: '2010', event: 'Ekspansi gedung rawat inap — kapasitas 120 tempat tidur' },
  { id: '4', year: '2018', event: 'Akreditasi KARS Madya — standar layanan meningkat signifikan' },
  { id: '5', year: '2023', event: 'Pembukaan unit Radiologi CT Scan & laboratorium modern' },
  { id: '6', year: '2025', event: 'Peluncuran sistem pendaftaran online & rekam medis digital' },
];

const FALLBACK_CONTACT = [
  { id: '1', icon: '📍', text: 'Nganjuk, Jawa Timur 64418' },
  { id: '2', icon: '📞', text: '(0358) XXXXXX' },
  { id: '3', icon: '🕐', text: 'IGD: 24 Jam · Poli: Sen–Jum 07.00–21.00' },
];

// ── Fetch all About data from NestJS API ───────────────────────
// getAboutData removed - moved to actions/public.js

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Tentang RS Bhayangkara Nganjuk',
  url: 'https://rsbhayangkaranganjuk.com/about',
  description: 'Profil RS Bhayangkara Nganjuk — rumah sakit terakreditasi Madya di Nganjuk, Jawa Timur.',
  mainEntity: {
    '@type': 'Hospital',
    name: 'RS Bhayangkara Nganjuk',
    foundingDate: '1985',
    numberOfBeds: 120,
  },
};

function StatIcon({ name }) {
  const icons = {
    award: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
    bed:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true"><path d="M2 9V4m0 5h20M2 9v11m20-11V4M2 20h20"/><rect x="5" y="12" width="5" height="4" rx="1"/><rect x="14" y="12" width="5" height="4" rx="1"/></svg>,
    users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    grid:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  };
  return icons[name] ?? null;
}

export default async function AboutPage() {
  const [apiData, seo] = await Promise.all([
    getPublicAboutData(),
    getPageSEO('/about')
  ]);

  if (seo && seo.isActive === false) {
    notFound();
  }

  // Merge backend data with fallback defaults
  const profile    = apiData.profile    || FALLBACK_PROFILE;
  const stats      = apiData.stats      || FALLBACK_STATS;
  const visiMisi   = apiData.visiMisi   || FALLBACK_VM;
  const values     = apiData.values     || FALLBACK_VALUES;
  const milestones = apiData.milestones || FALLBACK_MILESTONES;
  const contact    = apiData.contact    || FALLBACK_CONTACT;

  return (
    <>
      <JsonLd data={aboutSchema} />

      {/* Header */}
      <section style={{ background: 'var(--color-primary-800)', paddingBlock: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container-site">
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1rem' }}>
            <ol style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', listStyle: 'none', fontSize: '0.75rem', color: 'var(--color-primary-200)' }}>
              <li><Link href="/" style={{ color: 'var(--color-primary-200)', textDecoration: 'none' }}>Beranda</Link></li>
              <li aria-hidden="true"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></li>
              <li aria-current="page" style={{ color: 'var(--color-primary-50)' }}>Tentang Kami</li>
            </ol>
          </nav>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--color-primary-50)', fontFamily: 'var(--font-figtree, Figtree, sans-serif)', marginBottom: '0.375rem' }}>
            {profile.header_title}
          </h1>
          <p style={{ color: 'var(--color-primary-200)', fontSize: '0.9375rem' }}>
            {profile.header_subtitle}
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{ background: 'var(--color-primary-900)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container-site" style={{ paddingBlock: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
          {stats.map((s) => (
            <div key={s.id} style={{ textAlign: 'center', padding: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--color-primary-400)', marginBottom: '0.375rem' }}>
                <StatIcon name={s.icon_name} />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-50)', fontFamily: 'var(--font-figtree, Figtree, sans-serif)', lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-200)', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="container-site" style={{ paddingBlock: '3rem', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: '2.5rem', alignItems: 'start' }} id="about-grid">

        {/* Left: Profile, Visi-Misi, Values */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Profile */}
          <section aria-labelledby="profile-heading" style={{ background: '#fff', border: '1px solid var(--color-neutral-200)', borderRadius: '12px', padding: '1.75rem' }}>
            <h2 id="profile-heading" style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-neutral-900)', fontFamily: 'var(--font-figtree, Figtree, sans-serif)', marginBottom: '1rem' }}>
              Profil Rumah Sakit
            </h2>
            {profile.paragraph_1 && (
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-neutral-600)', lineHeight: 1.75, marginBottom: '1rem' }}>
                {profile.paragraph_1}
              </p>
            )}
            {profile.paragraph_2 && (
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-neutral-600)', lineHeight: 1.75 }}>
                {profile.paragraph_2}
              </p>
            )}
          </section>

          {/* Visi Misi */}
          <section aria-labelledby="visi-heading" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="visi-grid">
            <div style={{ background: 'var(--color-primary-50)', border: '1px solid var(--color-primary-100)', borderRadius: '12px', padding: '1.5rem' }}>
              <h2 id="visi-heading" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary-800)', fontFamily: 'var(--font-figtree, Figtree, sans-serif)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                Visi
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-primary-900)', lineHeight: 1.65 }}>
                {visiMisi.visi}
              </p>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--color-neutral-200)', borderRadius: '12px', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-neutral-900)', fontFamily: 'var(--font-figtree, Figtree, sans-serif)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-600)" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                Misi
              </h2>
              <ul style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)', lineHeight: 1.65, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(visiMisi.misi || []).map((m) => (
                  <li key={m} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-teal)" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: '3px' }} aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Values */}
          <section aria-labelledby="values-heading">
            <h2 id="values-heading" style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-neutral-900)', fontFamily: 'var(--font-figtree, Figtree, sans-serif)', marginBottom: '1rem' }}>
              Nilai-Nilai Kami
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {values.map((v) => (
                <div key={v.id} style={{ background: '#fff', border: '1px solid var(--color-neutral-200)', borderRadius: '10px', padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-primary-600)', fontFamily: 'var(--font-figtree, Figtree, sans-serif)', marginBottom: '0.5rem' }}>{v.title}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-600)', lineHeight: 1.6 }}>{v.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Accreditation + Timeline + Contact */}
        <aside>
          {/* Accreditation badge */}
          {profile.accreditation_certificate_url ? (
            /* ── Mode: tampilkan file sertifikat ── */
            <div style={{ marginBottom: '1.25rem', border: '1px solid var(--color-primary-100)', borderRadius: '12px', overflow: 'hidden' }}>

              {/* Preview area */}
              {(() => {
                const url = profile.accreditation_certificate_url;
                const isImg = url && ['.png', '.jpg', '.jpeg', '.webp', '.gif'].some(ext => url.toLowerCase().split('?')[0].endsWith(ext));
                
                if (isImg) {
                  return (
                    <a
                      href={getImageUrl(url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'block', lineHeight: 0 }}
                      title="Klik untuk membuka sertifikat"
                    >
                      <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                        <Image
                          src={getImageUrl(url)}
                          alt="Sertifikat Akreditasi RS Bhayangkara Nganjuk"
                          fill
                          sizes="(max-width: 768px) 100vw, 320px"
                          style={{ objectFit: 'cover', objectPosition: 'top center' }}
                          priority={false}
                        />
                      </div>
                    </a>
                  );
                }
                
                return (
                  <a
                    href={getImageUrl(url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', padding: '2rem 1rem', background: 'var(--color-primary-50)', textDecoration: 'none' }}
                    title="Klik untuk membuka sertifikat"
                  >
                    <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                      </svg>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-primary-800)', fontFamily: 'var(--font-figtree, Figtree, sans-serif)', marginBottom: '0.25rem' }}>
                        Sertifikat Akreditasi
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-primary-500)' }}>Klik untuk membuka dokumen PDF</p>
                    </div>
                  </a>
                );
              })()}

              {/* Info bar di bawah preview */}
              <div style={{ padding: '0.875rem 1rem', background: 'var(--color-primary-50)', borderTop: '1px solid var(--color-primary-100)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--color-primary-900)', fontFamily: 'var(--font-figtree, Figtree, sans-serif)', marginBottom: '0.125rem' }}>
                  {profile.accreditation_title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-600)' }}>{profile.accreditation_body}</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-neutral-600)', marginTop: '0.125rem' }}>{profile.accreditation_valid}</div>

                <a
                  href={getImageUrl(profile.accreditation_certificate_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                    marginTop: '0.625rem', padding: '0.375rem 0.75rem',
                    background: 'var(--color-primary-100)', border: '1px solid var(--color-primary-200)',
                    borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                    color: 'var(--color-primary-700)', textDecoration: 'none',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Unduh Sertifikat
                </a>
              </div>
            </div>
          ) : (
            <div style={{ background: 'var(--color-primary-50)', border: '1px solid var(--color-primary-100)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-primary-900)', fontFamily: 'var(--font-figtree, Figtree, sans-serif)' }}>{profile.accreditation_title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-600)' }}>{profile.accreditation_body}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-neutral-600)', marginTop: '0.125rem' }}>{profile.accreditation_valid}</div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div style={{ background: '#fff', border: '1px solid var(--color-neutral-200)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', background: 'var(--color-neutral-50)', borderBottom: '1px solid var(--color-neutral-200)' }}>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-900)', fontFamily: 'var(--font-figtree, Figtree, sans-serif)' }}>Perjalanan Kami</h2>
            </div>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0' }}>
              {milestones.map((m, idx) => (
                <div key={m.id} style={{ display: 'flex', gap: '0.75rem', paddingBottom: idx < milestones.length - 1 ? '1rem' : 0, position: 'relative' }}>
                  {idx < milestones.length - 1 && (
                    <div style={{ position: 'absolute', left: '16px', top: '28px', bottom: 0, width: '2px', background: 'var(--color-primary-50)' }} aria-hidden="true" />
                  )}
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary-50)', border: '2px solid var(--color-primary-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', zIndex: 1 }}>
                    <span style={{ fontSize: '0.5rem', fontWeight: 700, color: 'var(--color-primary-600)', fontVariantNumeric: 'tabular-nums' }}>{m.year.slice(2)}</span>
                  </div>
                  <div style={{ paddingTop: '0.3125rem' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-primary-600)', display: 'block', marginBottom: '0.125rem' }}>{m.year}</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-600)', lineHeight: 1.5 }}>{m.event}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact card */}
          <div style={{ background: '#fff', border: '1px solid var(--color-neutral-200)', borderRadius: '12px', padding: '1.25rem', marginTop: '1.25rem' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-900)', fontFamily: 'var(--font-figtree, Figtree, sans-serif)', marginBottom: '0.875rem' }}>Hubungi Kami</h2>
            {contact.map((item) => (
              <p key={item.id} style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-600)', display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                <span role="img" aria-hidden="true">{item.icon}</span>
                {item.text}
              </p>
            ))}
          </div>
        </aside>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #about-grid { grid-template-columns: 1fr !important; }
          .visi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
