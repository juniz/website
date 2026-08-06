import { Quote, Star } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import { Testimonial } from '@/types/api';

interface TestimonialSectionProps {
  data?: Testimonial[];
}

export default function TestimonialSection({ data = [] }: TestimonialSectionProps) {
  if (data.length === 0) return null;

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="section-py"
      style={{ background: 'var(--color-primary-900)', color: 'var(--color-neutral-50)' }}
    >
      <div className="container-site">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          {/* Section badge */}
          <span className="section-badge-white">Testimoni Pasien</span>
          
          <div style={{ maxWidth: '600px', marginInline: 'auto', marginTop: '0.5rem' }}>
            <h2 className="section-title" id="testimonials-heading" style={{ color: 'var(--color-neutral-50)' }}>
              Apa Kata Pasien Kami?
            </h2>
            <p className="section-subtitle" style={{ color: 'var(--color-primary-200)' }}>
              Pengalaman nyata dari mereka yang telah mempercayakan kesehatannya kepada RS Bhayangkara Nganjuk.
            </p>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {data.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '1.75rem',
                borderRadius: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                position: 'relative',
                transition: 'border-color 250ms ease-out, background-color 250ms ease-out, transform 250ms ease-out, box-shadow 250ms ease-out',
              }}
              className="testimonial-card"
            >
              <div style={{ position: 'absolute', top: '1.75rem', right: '1.75rem', opacity: 0.12, color: 'var(--color-primary-400)' }}>
                <Quote size={44} fill="currentColor" stroke="none" />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-cta)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < item.rating ? "currentColor" : "none"} 
                    stroke={i < item.rating ? "none" : "currentColor"} 
                  />
                ))}
              </div>

              <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)', fontStyle: 'italic', lineHeight: 1.8, position: 'relative', zIndex: 10 }}>
                &ldquo;{item.content}&rdquo;
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto' }}>
                <div style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '50%', 
                  border: '2px solid var(--color-primary-600)',
                  background: 'rgba(255, 255, 255, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 'bold', 
                  color: 'var(--color-neutral-50)',
                  fontSize: '0.875rem', 
                  overflow: 'hidden', 
                  position: 'relative' 
                }}>
                  {item.avatar_url && getImageUrl(item.avatar_url) ? (
                    <Image 
                      src={getImageUrl(item.avatar_url)!} 
                      alt={item.patient_name} 
                      fill 
                      style={{ objectFit: 'cover' }} 
                      sizes="44px"
                    />
                  ) : item.patient_name?.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-neutral-50)' }}>{item.patient_name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-primary-200)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.patient_role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .testimonial-card:hover {
          border-color: rgba(255, 255, 255, 0.25) !important;
          background: rgba(255, 255, 255, 0.08) !important;
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </section>
  );
}
