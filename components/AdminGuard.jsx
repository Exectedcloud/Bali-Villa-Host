'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, ApiError } from '@/lib/api-client';

/**
 * Wraps protected admin routes. Calls /host/me/ to confirm the user is
 * authenticated and has the admin role. Redirects to / if they are not an admin.
 * @param {{ children: React.ReactNode }} props
 */
export function AdminGuard({ children }) {
  const router = useRouter();
  const { data, error, isLoading } = useQuery({
    queryKey: ['host-me'],
    queryFn: () => api.get('/host/me/'),
    retry: false,
    staleTime: 60_000,
  });

  const user = data?.user;
  const isAdmin = user?.roles?.includes('admin');

  useEffect(() => {
    if (isLoading) return;

    if (error) {
      router.replace('/login');
      return;
    }

    if (!isAdmin) {
      toast.error('Access denied. Administrator privileges required.');
      router.replace('/');
    }
  }, [isLoading, error, isAdmin, router]);

  if (isLoading || error || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-ink-mute">Loading Admin Panel...</p>
      </div>
    );
  }

  return children;
}
