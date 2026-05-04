import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout, ImagePlay, SearchCode } from 'lucide-react';
import HeaderSettingsForm from './HeaderSettingsForm';
import HeroSettingsForm from './HeroSettingsForm';
import SEOSettingsForm from './SEOSettingsForm';

export const metadata = {
  title: 'Pengaturan Situs — Admin RS Bhayangkara',
};

async function getSettingsData() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [
    { data: header },
    { data: hero },
    { data: seo }
  ] = await Promise.all([
    supabase.from('site_settings').select('value').eq('key', 'header').single(),
    supabase.from('site_settings').select('value').eq('key', 'hero').single(),
    supabase.from('page_seo').select('*').order('route', { ascending: true })
  ]);

  return {
    header: header?.value || {},
    hero: hero?.value || {},
    seo: seo || []
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
];

export default async function SettingsPage() {
  const { header, hero, seo } = await getSettingsData();

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
          transition: all 150ms ease !important;
          white-space: nowrap !important;
          min-height: 52px !important;
          box-shadow: none !important;
          flex-shrink: 0;
          text-align: left;
        }

        .settings-tab-trigger:hover {
          background: var(--admin-surface) !important;
          color: var(--admin-text-b) !important;
          border-color: var(--admin-border) !important;
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
          transition: background 150ms;
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

        .settings-tab-panel {
          animation: fadeTabIn 200ms ease forwards;
        }

        @keyframes fadeTabIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
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
