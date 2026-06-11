import { Fraunces, Inter, Noto_Sans_SC, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Providers } from '@/components/Providers';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-noto',
  display: 'swap',
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata = {
  title: 'BaliVilla for Hosts',
  description: 'Manage your Bali villa rentals',
  icons: { icon: '/BaliVillalogo.png' },
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${inter.variable} ${notoSansSC.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            {children}
            <Toaster position="bottom-right" richColors />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
