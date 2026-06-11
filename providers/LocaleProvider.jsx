'use client';

import { createContext, useContext } from 'react';
import { useLocale as useNextIntlLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

const COOKIE_NAME = 'bv-host-locale';
const SUPPORTED = ['en', 'id'];

const SetLocaleContext = createContext(() => {});

export function LocaleProvider({ children }) {
  const router = useRouter();

  function setLocale(newLocale) {
    if (!SUPPORTED.includes(newLocale)) return;
    document.cookie = `${COOKIE_NAME}=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    router.refresh();
  }

  return (
    <SetLocaleContext.Provider value={setLocale}>
      {children}
    </SetLocaleContext.Provider>
  );
}

export function useLocale() {
  const locale = useNextIntlLocale();
  const setLocale = useContext(SetLocaleContext);
  return { locale, setLocale };
}
