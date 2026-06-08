'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api-client';

/**
 * Fetches the current authenticated host from /host/me/.
 * Redirects to /login on 401, /signup on 403.
 * @returns {{ user: object|null, host: object|null, isPending: boolean }}
 */
export function useHost() {
  const router = useRouter();
  const { data, isPending, error } = useQuery({
    queryKey: ['host-me'],
    queryFn: () => api.get('/host/me/'),
    retry: false,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (isPending || !error) return;
    if (error instanceof ApiError) {
      if (error.status === 401) router.replace('/login');
      else if (error.status === 403) router.replace('/signup');
    }
  }, [isPending, error, router]);

  return {
    user: data?.user ?? null,
    host: data?.host ?? null,
    isPending,
  };
}
