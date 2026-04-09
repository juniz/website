'use client';

import { useActionState, useState, useEffect } from 'react';
import { checkLogin } from '@/app/actions/auth';
import Button from '@/components/ui/Button';

/**
 * LoginPageClient - High Fidelity Admin Portal
 * Style: Healthcare Cinematic (Azure Blue)
 * Design Intelligence: UI/UX Pro Max
 * Features: Glassmorphism, Responsive Spatial Design, Adaptive Interactions
 */
export default function LoginPageClient() {
  const [errorMessage, formAction, isPending] = useActionState(checkLogin, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden bg-slate-950">
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{ 
            backgroundImage: "url('/images/login-bg.png')",
            filter: 'brightness(0.6) saturate(1.2)'
          }}
        />
        {/* Modern Gradient Overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-primary-950/40 via-transparent to-primary-950/80" />
        <div className="absolute inset-0 bg-radial-at-tr from-accent-teal-500/10 to-transparent" />
      </div>

      {/* Animated Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-accent-teal-500/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />

      {/* Main Container */}
      <main 
        className={`w-full max-w-[440px] relative z-10 transition-all duration-1000 ease-out 
          ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* Branding & Header */}
        <header className="flex flex-col items-center mb-10 text-center">
          <div className="relative mb-6 group">
            <div className="absolute -inset-4 bg-white/10 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-all duration-500" />
            <div className="w-20 h-20 rounded-4xl bg-linear-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
              {/* Inner glow effect */}
              <div className="absolute inset-0 bg-linear-to-tr from-primary-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 drop-shadow-lg">
                <path d="M12 2v20M2 12h20" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-white tracking-tighter mb-3 drop-shadow-sm">
            Admin Portal
          </h1>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-teal-400 animate-pulse" />
            <p className="text-white/80 text-[10px] font-bold tracking-[0.2em] uppercase">
              RS Bhayangkara Nganjuk
            </p>
          </div>
        </header>

        {/* Login Card - Compact & Airy */}
        <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.5)] border border-white/20 p-8! sm:p-10! relative overflow-hidden m-4">
          {/* Subtle light trace animation at the top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary-500 to-transparent opacity-50" />
          
          <form action={formAction} className="flex flex-col gap-10! pt-4!">
            {/* Email Input */}
            <div className="flex flex-col gap-7!">
              <label htmlFor="login-email" className="block text-[11px] font-black text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-[0.15em] opacity-80">
                Email Administrator
              </label>
              <div className="group relative">
                <div className="absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors duration-300">
                  {/* <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg> */}
                </div>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full h-15 pl-14 pr-6 bg-slate-100/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300"
                  placeholder="admin@rsbhayangkara.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-7!">
              <label htmlFor="login-password" className="block text-[11px] font-black text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-[0.15em] opacity-80">
                Kata Sandi
              </label>
              <div className="group relative">
                <div className="absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors duration-300">
                  {/* <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg> */}
                </div>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="block w-full h-15 pl-14 pr-16 bg-slate-100/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 px-3 flex items-center text-slate-400 hover:text-primary-600 focus:outline-none rounded-xl transition-all duration-300 active:scale-95"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Feedback */}
            {errorMessage && (
              <div role="alert" className="flex items-start gap-3 p-6! bg-red-50/80 dark:bg-red-950/30 border-2 border-red-100 dark:border-red-900/40 rounded-2xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="w-1 absolute inset-y-0 left-0 bg-red-500"></div>
                <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 mt-0.5 shadow-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-red-900 dark:text-red-200 uppercase tracking-wider mb-1!">Kesalahan</h4>
                  <p className="text-xs font-bold text-red-700 dark:text-red-300 leading-tight">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Interactive Submit Button */}
            <div className="pt-8!">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full h-14! flex items-center justify-center text-lg font-black! rounded-[1rem]! shadow-[0_20px_40px_-10px_rgba(0,147,221,0.4)]! hover:shadow-[0_25px_50px_-10px_rgba(0,147,221,0.5)]! active:scale-[0.97] transition-all duration-300 bg-linear-to-r from-primary-600 to-primary-500 border-none"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center gap-3 text-base">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memverifikasi...
                  </span>
                ) : (
                  'Masuk ke Sistem'
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Cinematic Footer */}
        <footer className="mt-16 text-center animate-in fade-in duration-1000 delay-700">
          <p className="text-white/40 text-[0.75rem] font-black uppercase tracking-[0.3em] drop-shadow-md">
            &copy; 2025 TI RS Bhayangkara Nganjuk • Secure Admin Portal v1.0
          </p>
        </footer>
      </main>
    </div>
  );
}
