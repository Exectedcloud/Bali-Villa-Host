'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, ApiError } from '@/lib/api-client';

/**
 * Wraps protected dashboard routes. Calls /host/me/ to confirm the user is
 * authenticated and has the host role. Redirects to /login on any failure.
 * @param {{ children: React.ReactNode }} props
 */
export function AuthGuard({ children }) {
  const router = useRouter();
  const { data, error, isLoading } = useQuery({
    queryKey: ['host-me'],
    queryFn: () => api.get('/host/me/'),
    retry: false,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (isLoading || !error) return;
    if (error instanceof ApiError && error.status === 403) {
      toast.error('This account is not registered as a host. Sign up as a host first.');
    }
    router.replace('/login');
  }, [isLoading, error, router]);

  if (isLoading || error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-ink-mute">Loading…</p>
      </div>
    );
  }

  return children;
}
