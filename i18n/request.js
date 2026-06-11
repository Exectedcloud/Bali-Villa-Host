import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get('bv-host-locale')?.value ?? 'id';
  const locale = ['en', 'id'].includes(raw) ? raw : 'id';
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
