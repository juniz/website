import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import AboutEditor from './AboutEditor';
import {
  getAboutProfile,
  getAboutStats,
  getAboutVisiMisi,
  getAboutValues,
  getAboutMilestones,
  getAboutContact,
} from '@/app/actions/admin/about';

export const metadata = {
  title: 'Halaman Tentang Kami — Admin RS Bhayangkara',
};

export default async function AdminTentangPage() {
  const [profile, stats, visiMisi, values, milestones, contact] = await Promise.all([
    getAboutProfile(),
    getAboutStats(),
    getAboutVisiMisi(),
    getAboutValues(),
    getAboutMilestones(),
    getAboutContact(),
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── Header ─────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
        background: 'var(--admin-surface)', border: '1px solid var(--admin-border)',
        borderRadius: 'var(--admin-radius-lg)', padding: '18px 24px',
        boxShadow: 'var(--admin-shadow-xs)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 'var(--admin-radius-md)',
            background: 'var(--admin-primary-l)', color: 'var(--admin-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookOpen size={20} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.125rem', fontWeight: 700, color: 'var(--admin-text-h)',
              fontFamily: 'var(--font-figtree)', marginBottom: 2,
            }}>
              Konten Halaman Tentang Kami
            </h1>
            <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-s)' }}>
              Kelola profil rumah sakit, statistik, visi-misi, timeline, dan kontak.
            </p>
          </div>
        </div>
        <Link
          href="/about"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', border: '1px solid var(--admin-border)',
            borderRadius: 'var(--admin-radius-sm)', fontSize: '0.8125rem',
            fontWeight: 600, color: 'var(--admin-text-m)', textDecoration: 'none',
            transition: '150ms',
          }}
        >
          Lihat Halaman Publik ↗
        </Link>
      </div>

      {/* ── Editor ─────────────────────────────────────── */}
      <AboutEditor
        profile={profile}
        stats={stats}
        visiMisi={visiMisi}
        values={values}
        milestones={milestones}
        contact={contact}
      />
    </div>
  );
}
