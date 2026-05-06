import { Power, AlertTriangle, Phone, Mail } from 'lucide-react';

export default function MaintenancePage({ data }) {
  const { message, estimatedFinish } = data || {};
  
  return (
    <div className="mnt-container">
      <div className="mnt-card">
        <div className="mnt-icon-wrap">
          <Power size={32} className="mnt-icon" />
          <div className="mnt-pulse"></div>
        </div>

        <h1 className="mnt-title">Sedang Dalam Pemeliharaan</h1>
        
        <p className="mnt-message">
          {message || 'Mohon maaf, saat ini website kami sedang dalam pemeliharaan rutin untuk meningkatkan layanan bagi Anda.'}
        </p>

        {estimatedFinish && (
          <div className="mnt-estimate">
            <AlertTriangle size={16} />
            Estimasi selesai: <strong>{estimatedFinish}</strong>
          </div>
        )}

        <div className="mnt-footer">
          <p className="mnt-footer-text">Butuh bantuan segera? Hubungi kami melalui:</p>
          <div className="mnt-contact-grid">
            <div className="mnt-contact-item">
              <Phone size={14} />
              <span>IGD: (0358) 321111</span>
            </div>
            <div className="mnt-contact-item">
              <Mail size={14} />
              <span>info@rsbhayangkara-nganjuk.id</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .mnt-container {
          min-height: 100vh;
          width: 100%;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: var(--font-figtree, 'Figtree', sans-serif);
        }

        .mnt-card {
          max-width: 540px;
          width: 100%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 48px 40px;
          text-align: center;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
        }

        .mnt-icon-wrap {
          width: 80px;
          height: 80px;
          background: #fff0f0;
          color: #d94040;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          position: relative;
        }

        .mnt-icon {
          position: relative;
          z-index: 2;
        }

        .mnt-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: #d94040;
          opacity: 0.2;
          animation: mntPulse 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes mntPulse {
          75%, 100% { transform: scale(1.6); opacity: 0; }
        }

        .mnt-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 16px;
          letter-spacing: -0.01em;
        }

        .mnt-message {
          font-size: 0.9375rem;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .mnt-estimate {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #fff7ed;
          border: 1px solid #ffedd5;
          border-radius: 12px;
          color: #c2410c;
          font-size: 0.875rem;
          margin-bottom: 32px;
        }

        .mnt-footer {
          border-top: 1px solid #f1f5f9;
          padding-top: 24px;
        }

        .mnt-footer-text {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 12px;
        }

        .mnt-contact-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: center;
        }

        .mnt-contact-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8125rem;
          color: #475569;
        }

        @media (max-width: 480px) {
          .mnt-card { padding: 32px 20px; }
          .mnt-title { font-size: 1.25rem; }
        }
      `}</style>
    </div>
  );
}
