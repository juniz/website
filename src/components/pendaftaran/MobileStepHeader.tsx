'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface MobileStepHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  onBack?: () => void;
  showBack?: boolean;
}

export default function MobileStepHeader({
  currentStep,
  totalSteps,
  stepTitle,
  onBack,
  showBack = true,
}: MobileStepHeaderProps) {
  const progressPercent = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  const handleBack = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // ignore
      }
    }
    if (onBack) onBack();
  };

  return (
    <div className="mobile-step-header-container">
      {/* ── Top Bar ── */}
      <div className="msh-top-bar">
        {showBack && onBack ? (
          <button
            type="button"
            onClick={handleBack}
            className="msh-back-btn"
            aria-label="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
        ) : (
          <div style={{ width: 36 }} />
        )}

        <div className="msh-title-group">
          <span className="msh-step-badge">
            Langkah {currentStep} dari {totalSteps}
          </span>
          <h2 className="msh-step-title">{stepTitle}</h2>
        </div>

        <div style={{ width: 36 }} />
      </div>

      {/* ── Progress Bar ── */}
      <div className="msh-progress-track">
        <div
          className="msh-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <style jsx>{`
        .mobile-step-header-container {
          display: block;
          position: sticky;
          top: 0;
          z-index: 40;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--color-neutral-200);
          margin-left: -1rem;
          margin-right: -1rem;
          margin-top: -1rem;
          margin-bottom: 1.25rem;
          padding: 0.75rem 1rem 0;
        }

        @media (min-width: 640px) {
          .mobile-step-header-container {
            display: none;
          }
        }

        .msh-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.625rem;
        }

        .msh-back-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid var(--color-neutral-200);
          background: #fff;
          color: var(--color-primary-900);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 150ms ease, background 150ms ease;
        }

        .msh-back-btn:active {
          transform: scale(0.94);
          background: var(--color-primary-50);
        }

        .msh-title-group {
          text-align: center;
        }

        .msh-step-badge {
          display: inline-block;
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-primary-600);
          font-family: var(--font-figtree);
        }

        .msh-step-title {
          font-size: 0.9375rem;
          font-weight: 800;
          color: var(--color-primary-900);
          font-family: var(--font-figtree);
          margin: 0;
          line-height: 1.2;
        }

        .msh-progress-track {
          width: 100%;
          height: 4px;
          background: var(--color-primary-100);
          overflow: hidden;
        }

        .msh-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-primary-600), var(--color-primary-400));
          transition: width 350ms cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 0 2px 2px 0;
        }
      `}</style>
    </div>
  );
}
