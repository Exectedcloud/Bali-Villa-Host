'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import en from '../messages/en.json';
import zh from '../messages/zh.json';
import id from '../messages/id.json';

const MESSAGES = { en, zh, id };
const COOKIE_NAME = 'bv-host-locale';
const SUPPORTED = ['en', 'zh', 'id'];
const DEFAULT_LOCALE = 'id';

/** @typedef {{ locale: string, setLocale: (l: string) => void }} LocaleCtx */
/** @type {import('react').Context<LocaleCtx>} */
const LocaleContext = createContext({ locale: DEFAULT_LOCALE, setLocale: () => {} });

function readCookieLocale() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split(';').find((c) => c.trim().startsWith(`${COOKIE_NAME}=`));
  const val = match?.split('=')[1]?.trim();
  return SUPPORTED.includes(val) ? val : null;
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = readCookieLocale();
    if (stored) setLocaleState(stored);
  }, []);

  function setLocale(newLocale) {
    if (!SUPPORTED.includes(newLocale)) return;
    setLocaleState(newLocale);
    document.cookie = `${COOKIE_NAME}=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
