'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export function HostFaqAccordion() {
  const [open, setOpen] = useState(null);
  const t = useTranslations('home');

  const FAQS = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') },
    { q: t('faq5Q'), a: t('faq5A') },
    { q: t('faq6Q'), a: t('faq6A') },
  ];

  return (
    <div className="divide-y divide-rule">
      {FAQS.map((faq, i) => (
        <div key={i}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-5 text-left gap-4"
          >
            <span className="text-base font-medium text-ink">{faq.q}</span>
            <ChevronDown
              className={cn(
                'size-5 text-ink-mute shrink-0 transition-transform duration-200',
                open === i && 'rotate-180'
              )}
            />
          </button>
          {open === i && (
            <p className="pb-5 text-sm text-ink-soft leading-relaxed max-w-prose">
              {faq.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
