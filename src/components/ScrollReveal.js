'use client';

import { useEffect, useRef } from 'react';

/**
 * ScrollReveal — triggers .sr-visible on the wrapper when it enters
 * the viewport. All animation logic lives in globals.css keyframes.
 *
 * Props:
 *  variant  : 'fade-up' | 'fade-left' | 'fade-right' | 'zoom' | 'fade' (default: 'fade-up')
 *  delay    : CSS delay string, e.g. '100ms' (default: '0ms')
 *  threshold: IntersectionObserver threshold 0-1 (default: 0.12)
 *  once     : if true (default), stop observing after first reveal
 *  className: extra classes on the wrapper
 *  as       : HTML tag to render as (default: 'div')
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
}) {
  const ref = useRef(null);

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
        if (entry.isIntersecting) {
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
