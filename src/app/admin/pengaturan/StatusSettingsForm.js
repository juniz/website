'use client';

import { useState } from 'react';
import { updateSiteSettings } from '@/app/actions/admin/settings';
import { Save, Loader2, Power, AlertTriangle, CheckCircle2, AlertCircle, Info } from 'lucide-react';

/**
 * StatusSettingsForm — Mengelola status aktif/nonaktif website (Maintenance Mode).
 */
export default function StatusSettingsForm({ initialData }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [data, setData] = useState({
    isMaintenance: initialData?.isMaintenance ?? false,
    message: initialData?.message || 'Mohon maaf, saat ini website kami sedang dalam pemeliharaan rutin untuk meningkatkan layanan bagi Anda. Silakan hubungi kami melalui telepon atau datang langsung untuk kebutuhan darurat.',
    estimatedFinish: initialData?.estimatedFinish || '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    
    const res = await updateSiteSettings('maintenance', data);
    setLoading(false);

    if (res.success) {
      setStatus('success');
      setTimeout(() => setStatus(null), 4000);
    } else {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="status-form">
      {/* Section: Status Website */}
      <fieldset className="settings-fieldset">
        <legend className="settings-fieldset-legend">
          <span className="settings-fieldset-icon">
            <Power size={14} />
          </span>
          Kontrol Akses Website
        </legend>
        <p className="settings-fieldset-hint">
          Gunakan fitur ini jika Anda ingin melakukan pemeliharaan sistem atau menonaktifkan sementara akses publik ke website.
        </p>

        <div className="status-toggle-card">
          <div className={`status-badge ${data.isMaintenance ? 'status-badge-offline' : 'status-badge-online'}`}>
            <span className="status-dot"></span>
            {data.isMaintenance ? 'Website Offline (Mode Pemeliharaan)' : 'Website Online (Aktif)'}
          </div>
          
          <label className="status-switch-label">
            <div className="status-switch-info">
              <span className="status-switch-title">Aktifkan Mode Pemeliharaan</span>
              <span className="status-switch-desc">Jika diaktifkan, pengunjung akan dialihkan ke halaman pemeliharaan.</span>
            </div>
            <div className="status-switch-wrap">
              <input
                type="checkbox"
                name="isMaintenance"
                checked={data.isMaintenance}
                onChange={handleChange}
                className="status-switch-input"
              />
              <span className="status-switch-slider"></span>
            </div>
          </label>
        </div>
      </fieldset>

      {/* Section: Pesan Pemeliharaan */}
      <fieldset className="settings-fieldset" disabled={!data.isMaintenance} style={{ opacity: data.isMaintenance ? 1 : 0.6 }}>
        <legend className="settings-fieldset-legend">
          <span className="settings-fieldset-icon">
            <AlertTriangle size={14} />
          </span>
          Pesan Halaman Pemeliharaan
        </legend>
        <p className="settings-fieldset-hint">Pesan yang akan ditampilkan kepada pengunjung saat mode pemeliharaan aktif.</p>

        <div className="settings-form-group">
          <label className="settings-label" htmlFor="message">
            Pesan Pemberitahuan
          </label>
          <textarea
            id="message"
            name="message"
            className="settings-textarea"
            value={data.message}
            onChange={handleChange}
            placeholder="Tuliskan alasan pemeliharaan..."
            rows={4}
          />
        </div>

        <div className="settings-form-group">
          <label className="settings-label" htmlFor="estimatedFinish">
            Estimasi Selesai (Opsional)
          </label>
          <div className="settings-input-wrap">
            <span className="settings-input-icon"><Info size={15} /></span>
            <input
              id="estimatedFinish"
              className="settings-input"
              type="text"
              name="estimatedFinish"
              value={data.estimatedFinish}
              onChange={handleChange}
              placeholder="Contoh: Senin, 10 Mei pukul 12:00 WIB"
            />
          </div>
        </div>
      </fieldset>

      {/* Form Action */}
      <div className="settings-form-actions">
        {status === 'success' && (
          <div className="settings-save-success" role="alert">
            <CheckCircle2 size={16} />
            Berhasil disimpan! Perubahan akan segera diterapkan.
          </div>
        )}
        {status === 'error' && (
          <div className="settings-save-error" role="alert">
            <AlertCircle size={16} />
            Gagal menyimpan. Coba lagi.
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="settings-btn-save"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? 'Menyimpan…' : 'Simpan Perubahan'}
        </button>
      </div>

      <style>{`
        .status-toggle-card {
          padding: 16px;
          border-radius: var(--admin-radius-md);
          background: var(--admin-surface-2);
          border: 1px solid var(--admin-border-soft);
          margin-top: 10px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          margin-bottom: 16px;
        }

        .status-badge-online {
          background: #e6f7ed;
          color: #107c41;
          border: 1px solid #c9e6d5;
        }

        .status-badge-offline {
          background: #fff0f0;
          color: #d94040;
          border: 1px solid #f9d8d8;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 0 2px rgba(255,255,255,0.5);
        }

        .status-badge-online .status-dot {
          animation: statusPulse 2s infinite;
        }

        @keyframes statusPulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .status-switch-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          cursor: pointer;
        }

        .status-switch-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .status-switch-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--admin-text-b);
        }

        .status-switch-desc {
          font-size: 0.75rem;
          color: var(--admin-text-s);
        }

        .status-switch-wrap {
          position: relative;
          width: 44px;
          height: 24px;
          flex-shrink: 0;
        }

        .status-switch-input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .status-switch-slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background-color: var(--admin-border);
          transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 24px;
        }

        .status-switch-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .status-switch-input:checked + .status-switch-slider {
          background-color: #d94040;
        }

        .status-switch-input:checked + .status-switch-slider:before {
          transform: translateX(20px);
        }

        .status-switch-input:focus + .status-switch-slider {
          box-shadow: 0 0 0 3px rgba(217, 64, 64, 0.15);
        }
      `}</style>
    </form>
  );
}
