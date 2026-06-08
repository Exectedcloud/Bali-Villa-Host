'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { api, ApiError } from '@/lib/api-client';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [state, setState] = useState('loading'); // 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const uid = searchParams.get('uid');
    const token = searchParams.get('token');

    if (!uid || !token) {
      setState('error');
      setErrorMsg('This verification link is invalid or incomplete.');
      return;
    }

    api.post('/auth/verify-email/', { uid: parseInt(uid, 10), token })
      .then(() => setState('success'))
      .catch((err) => {
        setState('error');
        setErrorMsg(
          err instanceof ApiError
            ? err.message
            : 'Verification failed. The link may have expired — request a new one from the login page.'
        );
      });
  }, []);

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <Image src="/BaliVillalogo.png" alt="BaliVilla" width={160} height={40} className="h-10 w-auto" priority />
        <span className="text-sm font-medium text-ink-mute">for Hosts</span>
      </Link>

      <div className="w-full max-w-sm text-center">
        {state === 'loading' && (
          <>
            <div className="size-12 rounded-full border-4 border-jade border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-ink-soft text-sm">Verifying your email…</p>
          </>
        )}

        {state === 'success' && (
          <>
            <div className="text-5xl mb-5">✅</div>
            <h1 className="font-display text-2xl font-medium text-ink mb-2">Email verified!</h1>
            <p className="text-sm text-ink-mute mb-6">Your host account is ready. Log in to get started.</p>
            <div className="bg-surface rounded-2xl border border-rule shadow-md p-6 mb-6">
              <p className="text-sm text-ink-soft leading-relaxed">
                Your email has been verified. You can now log in to your host account and complete your listing setup.
              </p>
            </div>
            <Link
              href="/login"
              className="block w-full py-3.5 rounded-xl bg-jade hover:bg-jade-deep text-white font-semibold text-sm text-center transition-colors"
            >
              Log in to host dashboard
            </Link>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="text-5xl mb-5">❌</div>
            <h1 className="font-display text-2xl font-medium text-ink mb-2">Verification failed</h1>
            <div className="bg-surface rounded-2xl border border-rule shadow-md p-6 mb-6">
              <p className="text-sm text-danger leading-relaxed">{errorMsg}</p>
            </div>
            <Link
              href="/login"
              className="text-jade text-sm font-medium hover:text-jade-deep underline underline-offset-2 transition-colors"
            >
              Back to log in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="size-12 rounded-full border-4 border-jade border-t-transparent animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
