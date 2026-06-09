'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { api, ApiError } from '@/lib/api-client';

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations('auth.login');
  const tNav = useTranslations('nav');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [unverified, setUnverified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/host/login/', { email: form.email, password: form.password });
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          toast.error(t('error.invalidCredentials'));
          setUnverified(false);
        } else if (err.status === 403 && err.message.toLowerCase().includes('verify')) {
          setUnverified(true);
        } else if (err.status === 403) {
          toast.error(t('error.notAHost'));
          setUnverified(false);
        } else {
          toast.error(t('error.failed'));
          setUnverified(false);
        }
      } else {
        toast.error(t('error.failed'));
        setUnverified(false);
      }
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!form.email) { toast.error('Enter your email address first'); return; }
    setResendLoading(true);
    try {
      await api.post('/auth/resend-verification/', { email: form.email });
    } catch {
      // always show success
    } finally {
      setResendLoading(false);
      setResendSent(true);
    }
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <Image src="/BaliVillalogo.png" alt="BaliVilla" width={160} height={40} className="h-10 w-auto" priority />
        <span className="text-sm font-medium text-ink-mute">{tNav('forHosts')}</span>
      </Link>

      <div className="w-full max-w-sm bg-surface rounded-2xl border border-rule shadow-md p-8">
        <h1 className="font-display text-2xl font-medium text-ink mb-1">{t('title')}</h1>
        <p className="text-sm text-ink-mute mb-7">{t('subtitle')}</p>

        {unverified && (
          <div className="mb-5 rounded-xl bg-warn/10 border border-warn/20 px-4 py-3 flex flex-col gap-2">
            <p className="text-sm text-warn font-medium">{t('error.emailNotVerified')}</p>
            {resendSent ? (
              <p className="text-xs text-jade font-medium">{t('resendSent')}</p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="text-xs text-jade hover:text-jade-deep font-semibold transition-colors text-left disabled:opacity-50"
              >
                {resendLoading ? 'Sending…' : t('resendVerification')}
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-soft" htmlFor="email">
              {t('email')}
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              className="h-11 px-3.5 rounded-lg border border-rule bg-paper text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-jade/40 focus:border-jade transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-ink-soft" htmlFor="password">
                {t('password')}
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-jade hover:text-jade-deep transition-colors"
              >
                {t('forgotPassword')}
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="h-11 w-full px-3.5 pr-11 rounded-lg border border-rule bg-paper text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-jade/40 focus:border-jade transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-mute hover:text-ink transition-colors"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={!loading ? { scale: 0.97 } : {}}
            transition={{ duration: 0.08, ease: 'linear' }}
            className="mt-1 h-11 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep disabled:opacity-60 transition-colors"
          >
            {loading ? t('submitting') : t('submit')}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-rule" />
          <span className="text-xs text-ink-mute">or</span>
          <div className="flex-1 h-px bg-rule" />
        </div>

        {/* WeChat */}
        <button
          type="button"
          className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl border border-rule bg-surface text-sm font-medium text-ink hover:bg-surface-alt transition-colors"
        >
          <MessageCircle className="size-4 text-[#07C160]" />
          {t('wechat')}
        </button>

        {/* Footer links */}
        <p className="text-center text-xs text-ink-mute mt-7">
          {t('noAccount')}{' '}
          <Link href="/signup" className="text-jade hover:text-jade-deep font-medium transition-colors">
            {t('signUp')}
          </Link>
        </p>
        <p className="text-center text-xs text-ink-mute mt-2">
          {t('guestLink')}{' '}
          <a
            href="http://localhost:3000"
            className="text-jade hover:text-jade-deep font-medium transition-colors"
          >
            {t('visitBaliVilla')}
          </a>
        </p>
      </div>
    </div>
  );
}
