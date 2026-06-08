'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    q: 'How much does it cost to list on BaliVilla?',
    a: 'Listing is completely free. There are no setup fees, no monthly subscription, and no hidden charges. We take a 12% commission only when a booking is confirmed and paid. If there\'s no booking, you pay nothing.',
  },
  {
    q: 'How do I get paid?',
    a: 'You receive payouts in IDR directly to your Indonesian bank account (BCA, Mandiri, BNI, BRI, and others are all supported). Payouts are released within 24 hours of your guest\'s check-in and typically arrive within 1–2 business days.',
  },
  {
    q: 'What if there\'s a problem with a guest?',
    a: 'Our host support team is available 7 days a week. For disputes, we have a formal resolution process with dedicated case managers who speak both English and Bahasa Indonesia. We also hold a security deposit on your behalf for every booking.',
  },
  {
    q: 'Do I need to speak Chinese to use BaliVilla?',
    a: 'Not at all. That\'s the whole point of the platform. Every guest message is automatically translated to English for you, and your replies are translated to Chinese before the guest sees them. You can host Chinese guests fluently without speaking a word of Mandarin.',
  },
  {
    q: 'How does the automatic translation work?',
    a: 'We use DeepL, the highest-accuracy translation engine available. Every message is translated in under 2 seconds. You\'ll see the original message and the English translation side by side. Guests see the same in reverse. You can also flag any translation that doesn\'t look right, and we\'ll correct it.',
  },
  {
    q: 'What if I want to leave the platform?',
    a: 'You can pause or remove your listing at any time from your dashboard — no notice period required. Any confirmed bookings already in your calendar will remain in effect (cancelling those would be subject to our standard cancellation policy), but you\'re free to stop accepting new bookings immediately.',
  },
];

export function HostFaqAccordion() {
  const [open, setOpen] = useState(null);

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
