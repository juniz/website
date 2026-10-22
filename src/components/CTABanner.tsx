import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

/**
 * CTABanner — Final CTA section before footer (Element 10).
 * Features high-contrast amber background, responsive design, and smooth hover micro-animations.
 */
export default function CTABanner() {
  return (
    <section 
      className="cta-banner-section"
      aria-labelledby="cta-banner-heading"
    >
      <div className="container-site">
        <div className="cta-banner-card">
          {/* Decorative Background Elements */}
          <div className="cta-banner-decor-1" aria-hidden="true" />
          <div className="cta-banner-decor-2" aria-hidden="true" />
          
          <div className="cta-banner-content">
            <h2 id="cta-banner-heading" className="cta-banner-title">
              Siap Melakukan Pendaftaran?<br />
              <span>Mulai Online Hari Ini.</span>
            </h2>
            <p className="cta-banner-subtitle">
              Hindari antrean panjang. Lakukan pre-registrasi pasien secara cepat, aman, dan mudah dari perangkat Anda.
            </p>
            
            <div className="cta-banner-actions">
              <Link 
                href="/pendaftaran" 
                className="cta-banner-btn-primary"
              >
                <span>Daftar Online Sekarang</span>
                <ArrowRight size={18} />
              </Link>
              
              <Link 
                href="/schedule" 
                className="cta-banner-btn-secondary"
              >
                <Calendar size={18} />
                <span>Lihat Jadwal Dokter</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cta-banner-section {
          padding-block: 4rem;
          background: #ffffff;
          position: relative;
        }
        
        .cta-banner-card {
          position: relative;
          background: linear-gradient(135deg, var(--color-primary-900) 0%, #032b40 100%);
          border: 1px solid var(--color-primary-800);
          border-radius: 16px;
          padding: 3.5rem 2rem;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(2, 48, 71, 0.25);
          text-align: center;
        }
        
        /* Decorative vector shapes */
        .cta-banner-decor-1 {
          position: absolute;
          top: -20%;
          left: -10%;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(142, 202, 230, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        
        .cta-banner-decor-2 {
          position: absolute;
          bottom: -30%;
          right: -5%;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(33, 158, 188, 0.12) 0%, transparent 60%);
          pointer-events: none;
        }
        
        .cta-banner-content {
          position: relative;
          zIndex: 5;
          max-width: 720px;
          margin-inline: auto;
        }
        
        .cta-banner-title {
          font-family: var(--font-figtree, 'Figtree', sans-serif);
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 800;
          color: var(--color-neutral-50);
          line-height: 1.25;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
        }
        
        .cta-banner-title span {
          color: var(--color-primary-400);
        }
        
        .cta-banner-subtitle {
          font-size: 0.875rem;
          color: var(--color-primary-100);
          line-height: 1.65;
          margin-bottom: 2.25rem;
          max-width: 600px;
          margin-inline: auto;
          font-weight: 400;
        }
        
        .cta-banner-actions {
          display: flex;
          justify-content: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }
        
        .cta-banner-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.625rem;
          background: var(--color-cta);
          color: var(--color-cta-text);
          font-weight: 700;
          font-size: 0.875rem;
          padding: 0.875rem 2rem;
          border-radius: 12px;
          text-decoration: none;
          min-height: 48px;
          transition: background-color 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 200ms ease, box-shadow 200ms ease;
          box-shadow: 0 4px 14px rgba(255, 183, 3, 0.3);
        }
        
        .cta-banner-btn-primary:hover {
          background: var(--color-cta-dark);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(208, 149, 0, 0.45);
        }
        
        .cta-banner-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.625rem;
          background: rgba(255, 255, 255, 0.1);
          color: var(--color-neutral-50);
          border: 1.5px solid rgba(255, 255, 255, 0.25);
          font-weight: 700;
          font-size: 0.875rem;
          padding: 0.875rem 2rem;
          border-radius: 12px;
          text-decoration: none;
          min-height: 48px;
          transition: background-color 200ms ease, border-color 200ms ease, transform 200ms ease;
        }
        
        .cta-banner-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .cta-banner-card {
            padding: 2.5rem 1.5rem;
          }
          .cta-banner-actions {
            flex-direction: column;
            gap: 0.875rem;
          }
          .cta-banner-btn-primary,
          .cta-banner-btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
