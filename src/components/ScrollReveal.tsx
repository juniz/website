'use client';

import { useEffect, useRef, ReactNode, ElementType, CSSProperties } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  variant?: 'fade-up' | 'fade-left' | 'fade-right' | 'zoom' | 'fade';
  delay?: string;
  threshold?: number;
  once?: boolean;
  className?: string;
  as?: ElementType;
  style?: CSSProperties;
}

/**
 * ScrollReveal — triggers .sr-visible on the wrapper when it enters
 * the viewport. All animation logic lives in globals.css keyframes.
 */
export default function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = '0ms',
  threshold = 0.12,
  once = true,
  className = '',
  as: Tag = 'div',
  style = {},
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion — skip animation entirely
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.classList.add('sr-visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add('sr-visible');
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.classList.remove('sr-visible');
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <Tag
      ref={ref}
      className={`sr-base sr-${variant} ${className}`}
      style={{ animationDelay: delay, ...style }}
    >
      {children}
    </Tag>
  );
}
