'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, CheckCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { api, ApiError } from '@/lib/api-client';

function ResetPasswordContent() {
  const t = useTranslations('auth.resetPassword');
  const tNav = useTranslations('nav');
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid') || '';
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError(t('error.mismatch'));
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/password/reset/', { uid, token, new_password: password });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('error.failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <Image src="/BaliVillalogo.png" alt="BaliVilla" width={160} height={40} className="h-10 w-auto" priority />
        <span className="text-sm font-medium text-ink-mute">{tNav('forHosts')}</span>
      </Link>

      {!uid || !token ? (
        <div className="w-full max-w-sm bg-surface rounded-2xl border border-rule shadow-md p-8 text-center">
          <p className="text-sm text-danger mb-4">{t('invalidLink')}</p>
          <Link href="/forgot-password" className="text-sm text-jade hover:text-jade-deep font-medium transition-colors">
            {t('requestNew')}
          </Link>
        </div>

      ) : done ? (
        <div className="w-full max-w-sm bg-surface rounded-2xl border border-rule shadow-md p-8">
          <div className="flex flex-col items-center text-center gap-4 py-2">
            <div className="size-12 rounded-full bg-jade-soft flex items-center justify-center">
              <CheckCircle className="size-6 text-jade" />
            </div>
            <div>
              <h1 className="font-display text-xl font-medium text-ink mb-1">{t('success.title')}</h1>
              <p className="text-sm text-ink-mute leading-relaxed">{t('success.desc')}</p>
            </div>
            <Link
              href="/login"
              className="w-full py-3.5 rounded-xl bg-jade hover:bg-jade-deep text-white font-semibold text-sm text-center transition-colors"
            >
              {t('success.login')}
            </Link>
          </div>
        </div>

      ) : (
        <div className="w-full max-w-sm bg-surface rounded-2xl border border-rule shadow-md p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="size-11 rounded-full bg-jade-soft flex items-center justify-center mb-4">
              <KeyRound className="size-5 text-jade" />
            </div>
            <h1 className="font-display text-2xl font-medium text-ink mb-1">{t('title')}</h1>
            <p className="text-sm text-ink-mute">{t('subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <p className="text-xs text-danger font-medium bg-danger/5 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-ink-soft" htmlFor="password">
                {t('newPassword')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-ink-soft" htmlFor="confirm">
                {t('confirmPassword')}
              </label>
              <input
                id="confirm"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="h-11 w-full px-3.5 rounded-lg border border-rule bg-paper text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-jade/40 focus:border-jade transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !password || !confirm}
              className="mt-1 h-11 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep disabled:opacity-60 transition-colors"
            >
              {loading ? t('submitting') : t('submit')}
            </button>
          </form>

          <div className="mt-6 flex justify-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-ink-mute hover:text-ink transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              {t('backToLogin')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="size-12 rounded-full border-4 border-jade border-t-transparent animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
