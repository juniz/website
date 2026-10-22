import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import { Service } from '@/types/api';

interface ServiceGridProps {
  data?: Service[];
}

type ServiceClassification = {
  isUrgentOrFacility: boolean;
  isEmergency: boolean;
  href: string;
  actionLabel: string;
  badgeLabel: string;
};

const FACILITY_KEYWORDS = [
  'igd',
  'ugd',
  'gawat',
  'darurat',
  'emergency',
  'icu',
  'iccu',
  'nicu',
  'picu',
  'hcu',
  'rawat-inap',
  'rawat inap',
  'kamar-operasi',
  'operasi',
  'bedah-sentral',
  'laboratorium',
  'lab',
  'radiologi',
  'rontgen',
  'ct-scan',
  'farmasi',
  'apotek',
  'ambulans',
  'ambulance',
  'hemodialisa',
  'mcu',
  'medical-check',
  'fisioterapi',
  'rehabilitasi',
];

const EMERGENCY_KEYWORDS = ['igd', 'ugd', 'gawat', 'darurat', 'emergency', 'ambulans', 'ambulance', 'icu', 'iccu', 'nicu', 'picu'];

function classifyService(service: Service): ServiceClassification {
  const haystack = `${service.slug || ''} ${service.name || ''} ${service.countInfo || service.count_info || ''}`.toLowerCase();
  const has24h = haystack.includes('24 jam') || haystack.includes('24jam') || haystack.includes('siaga');
  const isEmergency = EMERGENCY_KEYWORDS.some((kw) => haystack.includes(kw));
  const isUrgentOrFacility =
    isEmergency || has24h || FACILITY_KEYWORDS.some((kw) => haystack.includes(kw));

  if (isUrgentOrFacility) {
    return {
      isUrgentOrFacility: true,
      isEmergency,
      href: '/facilities',
      actionLabel: 'Lihat Fasilitas',
      badgeLabel: isEmergency || has24h ? 'Siaga 24 Jam' : 'Unit Penunjang',
    };
  }

  return {
    isUrgentOrFacility: false,
    isEmergency: false,
    href: `/doctors?specialization=${encodeURIComponent(service.slug)}`,
    actionLabel: 'Lihat Dokter',
    badgeLabel: 'Poliklinik Spesialis',
  };
}

function ServiceFallbackIcon({ isEmergency }: { isEmergency: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={isEmergency ? '#342500' : '#04699b'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" />
    </svg>
  );
}

export default function ServiceGrid({ data = [] }: ServiceGridProps) {
  const displayServices = data.filter((s) => s.isActive !== false && s.is_active !== false);

  if (displayServices.length === 0) {
    return (
      <section
        aria-labelledby="services-heading"
        className="section-py"
        style={{ background: '#ffffff' }}
      >
        <div className="container-site">
          <span className="section-badge">Layanan Kami</span>
          <div className="section-header" style={{ marginTop: '0.375rem' }}>
            <div>
              <h2 className="section-title" id="services-heading">
                Layanan Unggulan
              </h2>
              <p className="section-subtitle">
                Instalasi gawat darurat 24 jam, unit penunjang medis, dan poliklinik spesialis
              </p>
            </div>
          </div>

          <div
            style={{
              background: '#f0f9fe',
              border: '1px solid #d2eaf5',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div>
              <h3
                style={{
                  fontFamily: 'Figtree, system-ui, sans-serif',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  lineHeight: 1.3,
                  color: '#023047',
                }}
              >
                Daftar layanan sedang diperbarui
              </h3>
              <p
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: '#5f5e5a',
                  marginTop: '0.375rem',
                }}
              >
                Anda tetap dapat melihat jadwal praktik dokter spesialis atau fasilitas rumah sakit secara langsung.
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <Link
                href="/schedule"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '48px',
                  padding: '0.5rem 1.5rem',
                  background: '#219ebc',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontFamily: 'Figtree, system-ui, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Cek Jadwal Dokter
              </Link>
              <Link
                href="/facilities"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '48px',
                  padding: '0.5rem 1.5rem',
                  background: 'transparent',
                  color: '#04699b',
                  border: '1.5px solid #219ebc',
                  borderRadius: '8px',
                  fontFamily: 'Figtree, system-ui, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Lihat Fasilitas
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const classified = displayServices.map((service) => ({
    service,
    meta: classifyService(service),
  }));

  const urgentServices = classified.filter((item) => item.meta.isUrgentOrFacility);
  const clinicServices = classified.filter((item) => !item.meta.isUrgentOrFacility);
  const hasBothTiers = urgentServices.length > 0 && clinicServices.length > 0;

  const renderCard = ({ service, meta }: { service: Service; meta: ServiceClassification }, featured = false) => {
    const iconUrl = getImageUrl(service.iconName || service.icon_name);
    const countText = service.countInfo || service.count_info || (meta.isUrgentOrFacility ? 'Layanan Medis Terpadu' : 'Tersedia Praktik Spesialis');

    return (
      <Link
        key={service.slug || service.id}
        href={meta.href}
        style={{ textDecoration: 'none', display: 'block', height: '100%' }}
        className="service-card-link"
      >
        <article
          style={{
            background: featured ? '#f0f9fe' : '#ffffff',
            border: featured ? '1px solid #8ecae6' : '1px solid #d3d1c7',
            borderLeft: meta.isEmergency
              ? '4px solid #ffb703'
              : featured
              ? '4px solid #219ebc'
              : '1px solid #d3d1c7',
            borderRadius: '16px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1rem',
            height: '100%',
            transition: 'border-color 200ms ease-out, box-shadow 200ms ease-out, transform 200ms ease-out',
          }}
          className={featured ? 'service-card service-card-featured' : 'service-card'}
        >
          {/* Top row: Icon + Category Badge */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '0.5rem',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  background: meta.isEmergency
                    ? '#fff1cd'
                    : service.bgColorCode || service.bg_color_code || '#e8f4fa',
                  border: meta.isEmergency ? '1px solid #ffb703' : '1px solid #d2eaf5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  overflow: 'hidden',
                  padding: '0.5rem',
                  transition: 'transform 200ms ease-out',
                }}
                className="service-icon-container"
              >
                {iconUrl ? (
                  <Image
                    src={iconUrl}
                    alt=""
                    width={32}
                    height={32}
                    style={{ objectFit: 'contain' }}
                    sizes="32px"
                  />
                ) : (
                  <ServiceFallbackIcon isEmergency={meta.isEmergency} />
                )}
              </div>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '999px',
                  background: meta.isEmergency ? '#fff1cd' : '#e8f4fa',
                  border: meta.isEmergency ? '1px solid #ffb703' : '1px solid #d2eaf5',
                  color: meta.isEmergency ? '#342500' : '#04699b',
                  fontFamily: 'Figtree, system-ui, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                {meta.isEmergency && (
                  <span
                    aria-hidden="true"
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '999px',
                      background: '#d09500',
                      display: 'inline-block',
                    }}
                  />
                )}
                {meta.badgeLabel}
              </span>
            </div>

            {/* Service Name + Count/Availability Info */}
            <div>
              <h3
                style={{
                  fontFamily: 'Figtree, system-ui, sans-serif',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#023047',
                  lineHeight: 1.3,
                  margin: 0,
                }}
              >
                {service.name}
              </h3>
              <p
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: '#5f5e5a',
                  marginTop: '0.375rem',
                  marginBottom: 0,
                }}
              >
                {countText}
              </p>
            </div>
          </div>

          {/* Bottom Action Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              borderTop: '1px solid #d2eaf5',
              color: '#04699b',
              fontFamily: 'Figtree, system-ui, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
            className="service-card-action"
          >
            <span>{meta.actionLabel}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="service-card-arrow"
              style={{ transition: 'transform 200ms ease-out' }}
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </article>
      </Link>
    );
  };

  return (
    <section
      aria-labelledby="services-heading"
      className="section-py"
      style={{ background: '#ffffff' }}
    >
      <div className="container-site">
        {/* Section badge */}
        <span className="section-badge">Layanan Kami</span>

        {/* Section header */}
        <div className="section-header" style={{ marginTop: '0.375rem' }}>
          <div>
            <h2 className="section-title" id="services-heading">
              Layanan Unggulan
            </h2>
            <p className="section-subtitle">
              Pilih unit layanan darurat 24 jam, fasilitas medis, atau poliklinik dokter spesialis sesuai kebutuhan Anda
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              href="/doctors"
              style={{
                fontFamily: 'Figtree, system-ui, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#04699b',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                flexShrink: 0,
                minHeight: '44px',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #d2eaf5',
                background: '#f0f9fe',
              }}
              className="see-all-link"
            >
              Cari Dokter
            </Link>
            <Link
              href="/facilities"
              style={{
                fontFamily: 'Figtree, system-ui, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#04699b',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                flexShrink: 0,
                minHeight: '44px',
                padding: '0.5rem 0.75rem',
              }}
              className="see-all-link"
            >
              Lihat Fasilitas &amp; Layanan
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Orientation Banner: 24-Hour Emergency & Direct Registration Callout */}
        {/* <div
          style={{
            background: '#023047',
            borderRadius: '16px',
            padding: '1rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            border: '1px solid #04699b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.375rem 0.75rem',
                borderRadius: '999px',
                background: '#ffb703',
                color: '#342500',
                fontFamily: 'Figtree, system-ui, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              IGD &amp; Ambulans 24 Jam
            </span>
            <p
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 400,
                lineHeight: 1.6,
                color: '#ffffff',
                margin: 0,
              }}
            >
              Penanganan medis darurat siap setiap saat. Untuk kunjungan poliklinik terencana, pilih spesialis di bawah atau daftar online.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href="tel:+6281216831605"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                minHeight: '44px',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                background: 'rgba(142, 202, 230, 0.14)',
                border: '1px solid rgba(142, 202, 230, 0.35)',
                color: '#ffffff',
                fontFamily: 'Figtree, system-ui, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
              className="urgent-call-link"
            >
              Hubungi IGD
            </a>
            <Link
              href="/pendaftaran"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '44px',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                background: '#ffb703',
                color: '#342500',
                fontFamily: 'Figtree, system-ui, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
              className="urgent-cta-link"
            >
              Daftar Poliklinik
            </Link>
          </div>
        </div> */}

        {/* Two-Tier Hierarchy when both Urgent/Facility & Specialist Clinics exist */}
        {hasBothTiers ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                  gap: '0.5rem',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'Figtree, system-ui, sans-serif',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: '#023047',
                    margin: 0,
                  }}
                >
                  Unit Siaga 24 Jam &amp; Penunjang Medis
                </h3>
                <span
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    color: '#5f5e5a',
                  }}
                >
                  {urgentServices.length} layanan
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
                  gap: '1rem',
                }}
              >
                {urgentServices.map((item) => renderCard(item, true))}
              </div>
            </div>

            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                  gap: '0.5rem',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'Figtree, system-ui, sans-serif',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: '#023047',
                    margin: 0,
                  }}
                >
                  Poliklinik Spesialis Rawat Jalan
                </h3>
                <span
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    color: '#5f5e5a',
                  }}
                >
                  {clinicServices.length} poliklinik
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
                  gap: '1rem',
                }}
              >
                {clinicServices.map((item) => renderCard(item, false))}
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
              gap: '1rem',
            }}
          >
            {classified.map((item) => renderCard(item, item.meta.isUrgentOrFacility))}
          </div>
        )}
      </div>

      <style>{`
        .service-card:hover {
          border-color: #219ebc !important;
          box-shadow: 0 4px 16px rgba(33, 158, 188, 0.18);
          transform: translateY(-2px);
        }
        .service-card:hover .service-icon-container {
          transform: scale(1.06);
        }
        .service-card:hover .service-card-arrow {
          transform: translateX(4px);
        }
        .service-card-link:focus-visible,
        .see-all-link:focus-visible,
        .urgent-call-link:focus-visible,
        .urgent-cta-link:focus-visible {
          outline: 2.5px solid #8ecae6;
          outline-offset: 2px;
          border-radius: 12px;
        }
        .see-all-link:hover {
          color: #219ebc !important;
        }
        .urgent-call-link:hover {
          background: rgba(142, 202, 230, 0.24) !important;
        }
        .urgent-cta-link:hover {
          background: #d09500 !important;
          color: #ffffff !important;
        }
      `}</style>
    </section>
  );
}
