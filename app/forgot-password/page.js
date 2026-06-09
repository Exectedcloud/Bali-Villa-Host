'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth.forgotPassword');
  const tNav = useTranslations('nav');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/password/forgot/', { email });
    } catch {
      // always show success — don't reveal whether email is registered
    } finally {
      setLoading(false);
      setSent(true);
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
        {sent ? (
          <div className="flex flex-col items-center text-center gap-4 py-2">
            <div className="size-12 rounded-full bg-jade-soft flex items-center justify-center">
              <CheckCircle className="size-6 text-jade" />
            </div>
            <div>
              <h1 className="font-display text-xl font-medium text-ink mb-1">Check your email</h1>
              <p className="text-sm text-ink-mute leading-relaxed">
                {t('success.sent', { email })}. It expires in 30 minutes.
              </p>
            </div>
            <p className="text-xs text-ink-mute">
              Didn&apos;t get it?{' '}
              <button
                type="button"
                onClick={() => setSent(false)}
                className="text-jade hover:text-jade-deep font-medium transition-colors"
              >
                {t('success.tryAgain')}
              </button>
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-display text-2xl font-medium text-ink mb-1">{t('title')}</h1>
            <p className="text-sm text-ink-mute mb-7">{t('subtitle')}</p>

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  className="h-11 px-3.5 rounded-lg border border-rule bg-paper text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-jade/40 focus:border-jade transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-11 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep disabled:opacity-60 transition-colors"
              >
                {loading ? t('submitting') : t('submit')}
              </button>
            </form>
          </>
        )}

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
    </div>
  );
}
