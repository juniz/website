'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, MessageCircle, Phone, ArrowRight } from 'lucide-react';
import { FAQ } from '@/types/api';

interface FAQItemProps {
  item: FAQ;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

/* ─── Accordion Item ──────────────────────────────────────── */
function FAQItem({ item, index, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
      <button
        className="faq-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-body-${item.id}`}
        id={`faq-btn-${item.id}`}
      >
        <span className="faq-num">{String(index + 1).padStart(2, '0')}</span>
        <span className="faq-question">{item.question}</span>
        <span className="faq-chevron" aria-hidden="true">
          <ChevronDown size={18} />
        </span>
      </button>

      <div
        id={`faq-body-${item.id}`}
        role="region"
        aria-labelledby={`faq-btn-${item.id}`}
        className="faq-body"
        hidden={!isOpen}
      >
        <p className="faq-answer">{item.answer}</p>
      </div>
    </div>
  );
}

interface FAQSectionProps {
  data?: FAQ[];
  compact?: boolean;
}

/* ─── Main Section ────────────────────────────────────────── */
export default function FAQSection({ data = [], compact = false }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | number | null>(null);

  const toggle = (id: string | number) => setOpenId(prev => prev === id ? null : id);

  // Di home: tampilkan 5 item saja, di halaman FAQ: tampilkan semua
  const items = compact ? data.slice(0, 5) : data;

  if (data.length === 0) return null;

  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <style>{`
        .faq-section {
          padding: 5rem 0;
          background: linear-gradient(160deg, var(--color-primary-900) 0%, #032130 60%, #01141e 100%);
          position: relative;
          overflow: hidden;
        }
        .faq-section::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(33, 158, 188, 0.18) 0%, transparent 65%);
          pointer-events: none;
        }
        .faq-section::after {
          content: '';
          position: absolute;
          bottom: -60px; left: -60px;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(142, 202, 230, 0.12) 0%, transparent 65%);
          pointer-events: none;
        }

        /* Layout */
        .faq-inner {
          max-width: 1120px; margin: 0 auto; padding: 0 1.5rem;
          display: grid; grid-template-columns: 320px 1fr; gap: 3.5rem; align-items: start;
        }
        @media (max-width: 900px) { .faq-inner { grid-template-columns: 1fr; gap: 2rem; } }

        /* Left panel */
        .faq-sidebar { position: sticky; top: 96px; }
        @media (max-width: 900px) { .faq-sidebar { position: static; } }

        .faq-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 999px;
          background: rgba(255, 255, 255, 0.08); color: var(--color-primary-200);
          font-size: 0.6875rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
          margin-bottom: 1rem; border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .faq-heading {
          font-size: clamp(1.5rem, 2.5vw, 2rem); font-weight: 800;
          color: #fff; line-height: 1.25; margin-bottom: 0.875rem;
          font-family: var(--font-figtree, Figtree, sans-serif);
        }
        .faq-heading span { color: var(--color-primary-400); }
        .faq-sub {
          font-size: 0.9375rem; color: var(--color-primary-200); line-height: 1.7; margin-bottom: 1.75rem;
        }

        /* CTA Card */
        .faq-cta-card {
          border-radius: 16px; padding: 1.25rem;
          background: linear-gradient(135deg, var(--color-primary-800) 0%, var(--color-primary-600) 100%);
          color: #fff;
        }
        .faq-cta-card p { font-size: 0.875rem; opacity: 0.85; margin-bottom: 0.875rem; line-height: 1.6; }
        .faq-cta-btns { display: flex; flex-direction: column; gap: 8px; }
        .faq-cta-btn {
          display: flex; align-items: center; gap: 8px; padding: 9px 14px; border-radius: 10px;
          font-size: 0.8125rem; font-weight: 700; text-decoration: none;
          transition: background-color 150ms ease, color 150ms ease;
          cursor: pointer;
        }
        .faq-cta-btn-wa { background: #25D366; color: #fff; }
        .faq-cta-btn-wa:hover { background: #1ebe5d; }
        .faq-cta-btn-tel { background: rgba(255,255,255,0.18); color: #fff; border: 1px solid rgba(255,255,255,0.25); }
        .faq-cta-btn-tel:hover { background: rgba(255,255,255,0.28); }

        /* View all link */
        .faq-viewall {
          display: inline-flex; align-items: center; gap: 6px; margin-top: 1.25rem;
          font-size: 0.875rem; font-weight: 700; color: var(--color-primary-400); text-decoration: none;
          transition: gap 150ms ease, color 150ms ease;
          cursor: pointer;
        }
        .faq-viewall:hover { gap: 10px; color: var(--color-primary-200); }

        /* Accordion list */
        .faq-list { display: flex; flex-direction: column; gap: 10px; }

        /* Item */
        .faq-item {
          border-radius: 14px; border: 1.5px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.05); overflow: hidden; transition: border-color 200ms, box-shadow 200ms;
          backdrop-filter: blur(4px);
        }
        .faq-item--open {
          border-color: rgba(142, 202, 230, 0.45);
          box-shadow: 0 4px 24px rgba(0,0,0,0.25);
          background: rgba(255,255,255,0.08);
        }

        /* Trigger */
        .faq-trigger {
          width: 100%; display: flex; align-items: center; gap: 14px;
          padding: 1rem 1.25rem; text-align: left; background: none; border: none; cursor: pointer;
          transition: background 150ms;
        }
        .faq-trigger:hover { background: rgba(255,255,255,0.06); }
        .faq-item--open .faq-trigger { background: rgba(142, 202, 230, 0.08); }

        .faq-num {
          flex-shrink: 0; width: 28px; height: 28px; border-radius: 8px;
          background: rgba(255,255,255,0.1); color: var(--color-primary-200);
          font-size: 0.6875rem; font-weight: 800; display: flex; align-items: center; justify-content: center;
          font-variant-numeric: tabular-nums; transition: background 200ms, color 200ms;
        }
        .faq-item--open .faq-num { background: var(--color-primary-600); color: #fff; }

        .faq-question {
          flex: 1; font-size: 0.9375rem; font-weight: 700; color: var(--color-primary-50);
          transition: color 150ms; font-family: var(--font-figtree, Figtree, sans-serif);
        }
        .faq-item--open .faq-question { color: var(--color-primary-400); }

        .faq-chevron {
          flex-shrink: 0; color: rgba(255,255,255,0.3); transition: transform 250ms ease, color 150ms;
          display: flex;
        }
        .faq-item--open .faq-chevron { transform: rotate(180deg); color: var(--color-primary-400); }

        /* Body */
        .faq-body { animation: faqIn 200ms ease; }
        @keyframes faqIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .faq-body { animation: none !important; }
        }

        .faq-answer {
          padding: 0 1.25rem 1.25rem calc(1.25rem + 28px + 14px);
          font-size: 0.9rem; color: var(--color-primary-200); line-height: 1.8;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
      `}</style>

      <div className="faq-inner">

        {/* ── Sidebar ─────────────────────────── */}
        <aside className="faq-sidebar">
          <div className="faq-badge">
            <HelpCircle size={11} />
            Bantuan &amp; Informasi
          </div>

          <h2 className="faq-heading" id="faq-heading">
            Pertanyaan yang<br /><span>Sering Diajukan</span>
          </h2>

          <p className="faq-sub">
            Temukan jawaban cepat atas pertanyaan umum seputar layanan, pendaftaran, dan fasilitas RS Bhayangkara Nganjuk.
          </p>

          {/* CTA card */}
          <div className="faq-cta-card">
            <p>Tidak menemukan jawaban yang Anda cari? Tim kami siap membantu.</p>
            <div className="faq-cta-btns">
              <a href="https://wa.me/6281216831605" target="_blank" rel="noopener noreferrer" className="faq-cta-btn faq-cta-btn-wa">
                <MessageCircle size={15} />
                Chat via WhatsApp
              </a>
              <a href="tel:+6281216831605" className="faq-cta-btn faq-cta-btn-tel">
                <Phone size={15} />
                +62 812-1683-1605
              </a>
            </div>
          </div>

          {/* View all — hanya tampil di home (compact mode) */}
          {compact && data.length > 5 && (
            <Link href="/faq" className="faq-viewall">
              Lihat semua pertanyaan <ArrowRight size={15} />
            </Link>
          )}
        </aside>

        {/* ── Accordion List ───────────────────── */}
        <div className="faq-list" role="list">
          {items.map((item, idx) => (
            <div key={item.id} role="listitem">
              <FAQItem
                item={item}
                index={idx}
                isOpen={openId === item.id}
                onToggle={() => toggle(item.id)}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
