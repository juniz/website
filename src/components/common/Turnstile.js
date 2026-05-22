'use client';

import { useEffect, useRef, useCallback } from 'react';
import Script from 'next/script';

export default function Turnstile({ onVerify, siteKey }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const onVerifyRef = useRef(onVerify);

  const isDev = process.env.NODE_ENV === 'development';

  // Keep onVerify ref up to date
  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  // Auto-verify in development
  useEffect(() => {
    if (isDev && onVerifyRef.current) {
      onVerifyRef.current('dummy-dev-token');
    }
  }, [isDev]);

  const renderWidget = useCallback(() => {
    if (isDev) return;
    if (!containerRef.current || !window.turnstile || widgetIdRef.current) return;

    try {
      const activeSiteKey = siteKey || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: activeSiteKey,
        callback: (token) => {
          if (onVerifyRef.current) onVerifyRef.current(token);
        },
        'error-callback': () => {
          if (onVerifyRef.current) onVerifyRef.current(null);
        },
        'expired-callback': () => {
          if (onVerifyRef.current) onVerifyRef.current(null);
        },
        theme: 'light',
      });
    } catch (err) {
      console.error('Turnstile render error:', err);
    }
  }, [isDev, siteKey]);

  useEffect(() => {
    if (isDev) return;

    // If turnstile is already loaded, render immediately
    if (window.turnstile) {
      renderWidget();
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, [isDev, renderWidget]); // Run only once on mount or when isDev/renderWidget changes

  if (isDev) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onLoad={renderWidget}
      />
      <div
        ref={containerRef}
        className="turnstile-container"
        style={{
          minHeight: '65px',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          margin: '0.5rem 0'
        }}
      />
    </>
  );
}
