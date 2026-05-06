import { api } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HeaderSettingsForm from './HeaderSettingsForm';
import HeroSettingsForm from './HeroSettingsForm';
import SEOSettingsForm from './SEOSettingsForm';
import StatusSettingsForm from './StatusSettingsForm';
import { Layout, ImagePlay, SearchCode, Power } from 'lucide-react';

export const metadata = {
  title: 'Pengaturan Situs — Admin RS Bhayangkara',
};

async function getSettingsData() {
  const [settingsRes, seoRes] = await Promise.all([
    api.get('/settings'),
    api.get('/seo')
  ]);

  const settings = settingsRes.success ? (settingsRes.data.data || settingsRes.data || []) : [];
  const seoRaw = seoRes.success ? (seoRes.data.data || seoRes.data || []) : [];
  
  const seo = seoRaw.map(s => ({
    id: s.route, // Use route as ID
    route: s.route,
    meta_title: s.title,
    meta_description: s.description,
    meta_keywords: s.keywords ? s.keywords.split(',').map(k => k.trim()).filter(k => k !== '') : [],
    is_active: s.isActive ?? true
  }));

  const header = settings.find(s => s.key === 'header')?.value || {};
  const hero = settings.find(s => s.key === 'hero')?.value || {};
  const maintenance = settings.find(s => s.key === 'maintenance')?.value || {};

  return {
    header,
    hero,
    seo,
    maintenance
  };
}

const TABS = [
  {
    value: 'header',
    label: 'Header & Footer',
    icon: Layout,
    desc: 'Logo, kontak, jam operasional',
  },
  {
    value: 'hero',
    label: 'Hero Section',
    icon: ImagePlay,
    desc: 'Banner utama, statistik, CTA',
  },
  {
    value: 'seo',
    label: 'SEO',
    icon: SearchCode,
    desc: 'Meta title, description, keywords',
  },
  {
    value: 'status',
    label: 'Status Situs',
    icon: Power,
    desc: 'Mode pemeliharaan website',
  },
];

export default async function SettingsPage() {
  const { header, hero, seo, maintenance } = await getSettingsData();

  return (
    <div className="settings-page">
      {/* Page Header */}
      <div className="settings-page-header">
        <div className="settings-page-header-content">
          <div className="settings-page-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div>
            <h1 className="settings-page-title">Pengaturan Situs</h1>
            <p className="settings-page-desc">Kelola identitas, tampilan utama, dan optimasi mesin pencari website.</p>
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="settings-tabs-wrapper">
        <Tabs defaultValue="header" className="settings-tabs">
          {/* Tab Navigation */}
          <div className="settings-tabs-nav-wrap">
            <TabsList className="settings-tabs-list">
              {TABS.map(({ value, label, icon: Icon, desc }) => (
                <TabsTrigger key={value} value={value} className="settings-tab-trigger">
                  <span className="settings-tab-icon-wrap">
                    <Icon size={16} />
                  </span>
                  <span className="settings-tab-label-wrap">
                    <span className="settings-tab-label">{label}</span>
                    <span className="settings-tab-desc">{desc}</span>
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Content Panels */}
          <div className="settings-tabs-content">
            <TabsContent value="header" className="settings-tab-panel">
              <HeaderSettingsForm initialData={header} />
            </TabsContent>

            <TabsContent value="hero" className="settings-tab-panel">
              <HeroSettingsForm initialData={hero} />
            </TabsContent>

            <TabsContent value="seo" className="settings-tab-panel">
              <SEOSettingsForm initialData={seo} />
            </TabsContent>

            <TabsContent value="status" className="settings-tab-panel">
              <StatusSettingsForm initialData={maintenance} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <style>{`
        /* ── Settings Page Layout ─────────────────────────── */
        .settings-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ── Page Header ─────────────────────────────────── */
        .settings-page-header {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-lg);
          padding: 20px 24px;
          box-shadow: var(--admin-shadow-xs);
        }

        .settings-page-header-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .settings-page-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: var(--admin-radius-md);
          background: var(--admin-primary-l);
          color: var(--admin-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .settings-page-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--admin-text-h);
          font-family: var(--font-figtree, 'Figtree', system-ui, sans-serif);
          margin-bottom: 2px;
        }

        .settings-page-desc {
          font-size: 0.8125rem;
          color: var(--admin-text-s);
          line-height: 1.5;
        }

        /* ── Tabs Wrapper ─────────────────────────────────── */
        .settings-tabs-wrapper {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--admin-radius-lg);
          box-shadow: var(--admin-shadow-xs);
          overflow: hidden;
        }

        .settings-tabs {
          width: 100%;
        }

        /* ── Tab Navigation ───────────────────────────────── */
        .settings-tabs-nav-wrap {
          border-bottom: 1px solid var(--admin-border-soft);
          background: var(--admin-surface-2);
          padding: 0 8px;
        }

        .settings-tabs-list {
          display: flex;
          align-items: stretch;
          gap: 2px;
          background: transparent !important;
          padding: 8px 0 !important;
          height: auto !important;
          border-radius: 0 !important;
          width: 100%;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .settings-tabs-list::-webkit-scrollbar {
          display: none;
        }

        .settings-tab-trigger {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          padding: 10px 14px !important;
          border-radius: var(--admin-radius-md) !important;
          background: transparent !important;
          color: var(--admin-text-m) !important;
          border: 1px solid transparent !important;
          cursor: pointer !important;
          transition:
            background 180ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
            color 180ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
            border-color 180ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
            box-shadow 180ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
            transform 120ms ease !important;
          white-space: nowrap !important;
          min-height: 52px !important;
          box-shadow: none !important;
          flex-shrink: 0;
          text-align: left;
          position: relative;
        }

        /* Bottom indicator line */
        .settings-tab-trigger::after {
          content: '';
          position: absolute;
          bottom: -9px;  /* sits just on top of the nav-wrap border */
          left: 12px;
          right: 12px;
          height: 2px;
          border-radius: 2px 2px 0 0;
          background: var(--admin-primary);
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .settings-tab-trigger[data-state="active"]::after {
          transform: scaleX(1);
        }

        .settings-tab-trigger:hover {
          background: var(--admin-surface) !important;
          color: var(--admin-text-b) !important;
          border-color: var(--admin-border) !important;
          transform: translateY(-1px);
        }

        .settings-tab-trigger:active {
          transform: translateY(0) scale(0.98);
        }

        .settings-tab-trigger[data-state="active"] {
          background: var(--admin-surface) !important;
          color: var(--admin-primary) !important;
          border-color: var(--admin-border) !important;
          box-shadow: var(--admin-shadow-sm) !important;
        }

        .settings-tab-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--admin-primary-l);
          color: var(--admin-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition:
            background 180ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
            transform 180ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .settings-tab-trigger[data-state="active"] .settings-tab-icon-wrap {
          transform: scale(1.08);
        }

        .settings-tab-trigger:not([data-state="active"]) .settings-tab-icon-wrap {
          background: var(--admin-border-soft);
          color: var(--admin-text-m);
        }

        .settings-tab-label-wrap {
          display: flex;
          flex-direction: column;
          gap: 1px;
          text-align: left;
        }

        .settings-tab-label {
          font-size: 0.8125rem;
          font-weight: 600;
          line-height: 1.3;
        }

        .settings-tab-desc {
          font-size: 0.6875rem;
          color: var(--admin-text-s);
          font-weight: 400;
          line-height: 1.3;
        }

        .settings-tab-trigger[data-state="active"] .settings-tab-desc {
          color: rgba(24, 95, 165, 0.6);
        }

        /* ── Tab Content ──────────────────────────────────── */
        .settings-tabs-content {
          padding: 28px;
        }

        /* ── Tab panel entrance ──────────────────────────── */
        .settings-tab-panel {
          animation: tabPanelIn 280ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
          transform-origin: top center;
        }

        @keyframes tabPanelIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.99);
            filter: blur(1px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        /* Stagger fieldsets / direct children inside the panel */
        .settings-tab-panel > * {
          animation: tabChildIn 320ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }

        .settings-tab-panel > *:nth-child(1) { animation-delay: 30ms; }
        .settings-tab-panel > *:nth-child(2) { animation-delay: 70ms; }
        .settings-tab-panel > *:nth-child(3) { animation-delay: 110ms; }
        .settings-tab-panel > *:nth-child(4) { animation-delay: 150ms; }
        .settings-tab-panel > *:nth-child(5) { animation-delay: 190ms; }

        @keyframes tabChildIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Reduced motion ───────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .settings-tab-panel,
          .settings-tab-panel > * {
            animation: none !important;
          }
          .settings-tab-trigger,
          .settings-tab-trigger::after,
          .settings-tab-icon-wrap {
            transition: none !important;
          }
        }

        /* ── Mobile responsive ────────────────────────────── */
        @media (max-width: 640px) {
          .settings-page-header {
            padding: 16px;
          }
          .settings-tabs-content {
            padding: 16px;
          }
          .settings-tab-desc {
            display: none;
          }
          .settings-tab-trigger {
            padding: 8px 12px !important;
            min-height: 44px !important;
          }
        }
      `}</style>
    </div>
  );
}
