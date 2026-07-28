'use client';

import React, { useEffect, useRef } from 'react';
import { X, Search, Check, Stethoscope, Clock, User } from 'lucide-react';
import { Schedule } from '@/types/api';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  schedules: Schedule[];
  selectedSchedule: Schedule | null;
  onSelectSchedule: (schedule: Schedule) => void;
  isLoading?: boolean;
}

export default function MobileBottomSheet({
  isOpen,
  onClose,
  title,
  searchPlaceholder = 'Cari poli atau dokter...',
  searchQuery = '',
  onSearchChange,
  schedules,
  selectedSchedule,
  onSelectSchedule,
  isLoading = false,
}: MobileBottomSheetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (sched: Schedule) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch {
        // ignore
      }
    }
    onSelectSchedule(sched);
    onClose();
  };

  return (
    <div className="mbs-backdrop" onClick={onClose}>
      <div
        ref={containerRef}
        className="mbs-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Drag Handle ── */}
        <div className="mbs-handle-bar">
          <div className="mbs-handle" />
        </div>

        {/* ── Header ── */}
        <div className="mbs-header">
          <h3 className="mbs-title">{title}</h3>
          <button
            type="button"
            className="mbs-close-btn"
            onClick={onClose}
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Search Bar ── */}
        {onSearchChange && (
          <div className="mbs-search-wrapper">
            <Search size={16} className="mbs-search-icon" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="mbs-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="mbs-search-clear"
                onClick={() => onSearchChange('')}
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {/* ── List Content ── */}
        <div className="mbs-content">
          {isLoading ? (
            <div className="mbs-loading">
              <div className="mbs-spinner" />
              <p>Memuat jadwal dokter...</p>
            </div>
          ) : schedules.length > 0 ? (
            <div className="mbs-list">
              {schedules.map((sched, idx) => {
                const isSelected = selectedSchedule === sched || selectedSchedule?.kd_dokter === sched.kd_dokter && selectedSchedule?.kd_poli === sched.kd_poli;
                return (
                  <button
                    key={`${sched.kd_poli}-${sched.kd_dokter}-${idx}`}
                    type="button"
                    onClick={() => handleSelect(sched)}
                    className={`mbs-item ${isSelected ? 'mbs-item--selected' : ''}`}
                  >
                    <div className="mbs-item-avatar">
                      <Stethoscope size={20} />
                    </div>

                    <div className="mbs-item-info">
                      <p className="mbs-item-poli">{sched.nm_poli}</p>
                      <p className="mbs-item-dokter">{sched.nm_dokter}</p>
                      <div className="mbs-item-meta">
                        <span className="mbs-item-time">
                          <Clock size={11} />
                          {sched.jam_mulai?.substring(0, 5)} - {sched.jam_selesai?.substring(0, 5)}
                        </span>
                        {sched.kuota > 0 && (
                          <span className="mbs-item-kuota">{sched.kuota} slot tersedia</span>
                        )}
                      </div>
                    </div>

                    <div className={`mbs-check ${isSelected ? 'mbs-check--active' : ''}`}>
                      {isSelected && <Check size={14} color="#fff" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mbs-empty">
              <User size={32} style={{ color: 'var(--color-neutral-300)', marginBottom: 8 }} />
              <p style={{ fontWeight: 600, color: 'var(--color-neutral-700)', margin: 0 }}>
                Jadwal tidak ditemukan
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-500)', margin: '4px 0 0' }}>
                Coba ubah kata kunci pencarian atau tanggal periksa.
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .mbs-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(2, 48, 71, 0.55);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: mbsFadeIn 200ms ease-out forwards;
        }

        .mbs-sheet {
          width: 100%;
          max-width: 640px;
          max-height: 85vh;
          background: #ffffff;
          border-top-left-radius: 24px;
          border-top-right-radius: 24px;
          box-shadow: 0 -10px 40px rgba(2, 48, 71, 0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: mbsSlideUp 280ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          padding-bottom: max(1rem, env(safe-area-inset-bottom));
        }

        .mbs-handle-bar {
          display: flex;
          justify-content: center;
          padding-top: 10px;
          padding-bottom: 4px;
        }

        .mbs-handle {
          width: 40px;
          height: 4px;
          border-radius: 2px;
          background: var(--color-neutral-300);
        }

        .mbs-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          border-bottom: 1px solid var(--color-neutral-100);
        }

        .mbs-title {
          font-size: 1.0625rem;
          font-weight: 800;
          font-family: var(--font-figtree);
          color: var(--color-primary-900);
          margin: 0;
        }

        .mbs-close-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: var(--color-neutral-100);
          color: var(--color-neutral-700);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .mbs-search-wrapper {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          margin: 0.75rem 1.25rem 0.25rem;
          padding: 0 0.875rem;
          background: var(--color-neutral-50);
          border: 1.5px solid var(--color-neutral-200);
          border-radius: 12px;
          transition: border-color 150ms ease, background-color 150ms ease;
        }

        .mbs-search-wrapper:focus-within {
          border-color: var(--color-primary-600);
          background: #ffffff;
        }

        .mbs-search-icon {
          color: var(--color-neutral-400);
          flex-shrink: 0;
        }

        .mbs-search-input {
          flex: 1;
          min-width: 0;
          padding: 0.75rem 0;
          font-size: 0.9375rem;
          border: none;
          outline: none;
          background: transparent;
          color: var(--color-neutral-900);
          font-family: inherit;
        }

        .mbs-search-clear {
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          color: var(--color-neutral-400);
          cursor: pointer;
          padding: 4px;
          flex-shrink: 0;
        }

        .mbs-content {
          flex: 1;
          overflow-y: auto;
          padding: 0.75rem 1.25rem 1.5rem;
          -webkit-overflow-scrolling: touch;
        }

        .mbs-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          gap: 0.75rem;
          color: var(--color-neutral-500);
          font-size: 0.875rem;
        }

        .mbs-spinner {
          width: 28px;
          height: 28px;
          border: 3px solid var(--color-primary-100);
          border-top-color: var(--color-primary-600);
          border-radius: 50%;
          animation: mbsSpin 800ms linear infinite;
        }

        .mbs-list {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        .mbs-item {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.875rem 1rem;
          border-radius: 14px;
          border: 1.5px solid var(--color-neutral-200);
          background: #fff;
          text-align: left;
          width: 100%;
          cursor: pointer;
          box-sizing: border-box;
          transition: all 150ms ease;
        }

        .mbs-item:active {
          transform: scale(0.98);
          background: var(--color-primary-50);
        }

        .mbs-item--selected {
          border-color: var(--color-primary-600);
          background: var(--color-primary-50);
          box-shadow: 0 4px 14px rgba(24, 95, 165, 0.12);
        }

        .mbs-item-avatar {
          width: 42px;
          height: 42px;
          min-width: 42px;
          border-radius: 12px;
          background: var(--color-primary-100);
          color: var(--color-primary-600);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mbs-item--selected .mbs-item-avatar {
          background: var(--color-primary-600);
          color: #ffffff;
        }

        .mbs-item-info {
          flex: 1;
          min-width: 0;
        }

        .mbs-item-poli {
          font-size: 0.9375rem;
          font-weight: 800;
          font-family: var(--font-figtree);
          color: var(--color-primary-900);
          margin: 0;
        }

        .mbs-item-dokter {
          font-size: 0.8125rem;
          color: var(--color-neutral-600);
          margin: 2px 0 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mbs-item-meta {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          margin-top: 4px;
        }

        .mbs-item-time {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-primary-600);
        }

        .mbs-item-kuota {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #059669;
          background: #d1fae5;
          padding: 1px 6px;
          border-radius: 4px;
        }

        .mbs-check {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1.5px solid var(--color-neutral-300);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mbs-check--active {
          border-color: var(--color-primary-600);
          background: var(--color-primary-600);
        }

        .mbs-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1rem;
          text-align: center;
        }

        @keyframes mbsFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes mbsSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        @keyframes mbsSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
