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
          background: linear-gradient(135deg, var(--color-cta) 0%, var(--color-cta-dark) 100%);
          border-radius: 24px;
          padding: 3rem 2rem;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(208, 149, 0, 0.25);
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
          background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        
        .cta-banner-decor-2 {
          position: absolute;
          bottom: -30%;
          right: -5%;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(2, 48, 71, 0.08) 0%, transparent 60%);
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
          font-size: clamp(1.75rem, 4vw, 2.75rem);
          font-weight: 800;
          color: var(--color-primary-900);
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
        }
        
        .cta-banner-title span {
          color: rgba(2, 48, 71, 0.85);
        }
        
        .cta-banner-subtitle {
          font-size: clamp(0.9375rem, 2vw, 1.125rem);
          color: rgba(2, 48, 71, 0.85);
          line-height: 1.6;
          margin-bottom: 2.5rem;
          max-width: 600px;
          margin-inline: auto;
          font-weight: 500;
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
          background: var(--color-primary-900);
          color: #ffffff;
          font-weight: 700;
          font-size: 0.9375rem;
          padding: 1rem 2rem;
          border-radius: 14px;
          text-decoration: none;
          min-height: 52px;
          transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 4px 14px rgba(2, 48, 71, 0.25);
        }
        
        .cta-banner-btn-primary:hover {
          background: var(--color-primary-800);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(2, 48, 71, 0.35);
        }
        
        .cta-banner-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.625rem;
          background: transparent;
          color: var(--color-primary-900);
          border: 2px solid var(--color-primary-900);
          font-weight: 700;
          font-size: 0.9375rem;
          padding: 1rem 2rem;
          border-radius: 14px;
          text-decoration: none;
          min-height: 52px;
          transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .cta-banner-btn-secondary:hover {
          background: rgba(2, 48, 71, 0.08);
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
