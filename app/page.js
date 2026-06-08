import Link from 'next/link';
import {
  House, Languages, CalendarCheck, Banknote,
  ArrowRight, TrendingUp, Globe, Percent,
} from 'lucide-react';
import { HostTopNav } from '@/components/layout/HostTopNav';
import { HostFooter } from '@/components/layout/HostFooter';
import { HostFaqAccordion } from '@/components/home/HostFaqAccordion';
import { HeroSection } from '@/components/home/HeroSection';
import { ScrollReveal } from '@/components/ScrollReveal';

const HOW_IT_WORKS = [
  {
    icon: House,
    step: '01',
    title: 'List your villa',
    desc: 'Add photos, set your nightly rate in IDR, and describe your space in English. The whole process takes under 30 minutes.',
  },
  {
    icon: Languages,
    step: '02',
    title: 'We translate automatically',
    desc: 'Every listing, message, and review is instantly translated to Chinese. No Mandarin skills required — ever.',
  },
  {
    icon: CalendarCheck,
    step: '03',
    title: 'Chinese guests book',
    desc: 'Guests discover your villa on BaliVilla, pay securely in CNY via WeChat Pay or Alipay, and you get notified instantly.',
  },
  {
    icon: Banknote,
    step: '04',
    title: 'You earn',
    desc: 'Receive your payout in IDR directly to your bank account. 88% of every booking goes to you — always.',
  },
];

const TRUST_ITEMS = [
  {
    icon: TrendingUp,
    title: 'Earn from your villa',
    stat: 'Avg. Rp 38M / month',
    body: 'Top hosts on BaliVilla earn consistently from Chinese tourists who book longer stays and pay in full upfront.',
  },
  {
    icon: Globe,
    title: 'We bring Chinese guests',
    stat: '10,000+ active travelers',
    body: 'Our platform reaches travelers from mainland China, Hong Kong, and Singapore who are planning Bali holidays.',
  },
  {
    icon: Languages,
    title: 'We handle translation',
    stat: 'Real-time Chinese ↔ English',
    body: 'Every message between you and your guests is automatically translated. You write in English, they read in Chinese.',
  },
  {
    icon: Percent,
    title: 'Just 12% commission',
    stat: 'No setup fees, ever',
    body: 'You set your IDR price and keep 88% of every booking. We earn only when you earn.',
  },
];

export const metadata = {
  title: 'BaliVilla for Hosts — Earn from your Bali villa',
  description: 'List your Bali villa and reach thousands of Chinese tourists. Automatic translation, WeChat Pay, Alipay — we handle the hard parts.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper">
      <HostTopNav />

      {/* Hero — animated entrance handled by HeroSection */}
      <section className="pt-14 sm:pt-16 bg-gradient-to-br from-surface via-surface to-surface-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 lg:py-32">
          <HeroSection />
        </div>
      </section>

      {/* How it works */}
      <ScrollReveal>
        <section id="how-it-works" className="py-12 md:py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-ink mb-3">
                How it works
              </h2>
              <p className="text-ink-mute max-w-md mx-auto">
                From listing to your first payout in as little as a week.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {HOW_IT_WORKS.map(({ icon: Icon, step, title, desc }) => (
                <div
                  key={step}
                  className="bg-surface rounded-2xl border border-rule p-6 flex flex-col gap-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="size-11 rounded-xl bg-jade-soft flex items-center justify-center">
                      <Icon className="size-5 text-jade" />
                    </div>
                    <span className="text-xs font-mono text-ink-mute">{step}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-ink mb-1.5">{title}</h3>
                    <p className="text-sm text-ink-soft leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Commission */}
      <ScrollReveal>
        <section className="py-12 md:py-20 lg:py-28 border-t border-rule">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-display text-3xl sm:text-5xl font-medium text-jade leading-tight mb-6">
              Just 12% commission.
            </h2>
            <p className="text-lg text-ink leading-relaxed mb-2">
              No setup fees. No monthly fees. No hidden charges.
            </p>
            <p className="text-lg text-ink-soft leading-relaxed mb-10">
              You set the price in IDR. You keep 88%. We earn only when you earn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-surface rounded-xl px-8 py-4 shadow-sm">
                <p className="text-xs text-ink-mute mb-0.5">You set</p>
                <p className="font-mono text-2xl font-semibold text-ink">Rp 4,500,000<span className="text-sm font-sans font-normal text-ink-mute"> / night</span></p>
              </div>
              <div className="flex items-center justify-center text-ink-mute font-medium">→</div>
              <div className="bg-jade rounded-xl px-8 py-4 shadow-sm">
                <p className="text-xs text-white/70 mb-0.5">You keep (88%)</p>
                <p className="font-mono text-2xl font-semibold text-white">Rp 3,960,000<span className="text-sm font-sans font-normal text-white/70"> / night</span></p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Why hosts choose BaliVilla */}
      <ScrollReveal>
        <section className="py-12 md:py-20 lg:py-28 border-t border-rule">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-ink mb-3">
                Why hosts choose BaliVilla
              </h2>
              <p className="text-ink-mute max-w-md mx-auto">
                Built for Bali villa owners who want Chinese guests without the complexity.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {TRUST_ITEMS.map(({ icon: Icon, title, stat, body }) => (
                <div key={title} className="bg-surface rounded-2xl border border-rule p-8 flex flex-col gap-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
                  <div className="size-12 rounded-full bg-jade flex items-center justify-center">
                    <Icon className="size-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-medium text-ink mb-1">{title}</h3>
                    <p className="text-sm font-semibold text-jade mb-2">{stat}</p>
                    <p className="text-sm text-ink-soft leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* FAQ */}
      <ScrollReveal>
        <section className="py-12 md:py-20 border-t border-rule">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-ink mb-12 text-center">
              Frequently asked questions
            </h2>
            <HostFaqAccordion />
          </div>
        </section>
      </ScrollReveal>

      {/* Final CTA */}
      <ScrollReveal>
        <section className="py-12 md:py-16 lg:py-24 border-t border-rule">
          <div className="max-w-lg mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-ink leading-tight mb-4">
              Ready to host?
            </h2>
            <p className="text-base text-ink-soft leading-relaxed mb-8">
              Join hundreds of Bali villa owners welcoming Chinese guests. Free to list. No commitment.
            </p>
            <Link
              href="/signup"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-jade text-white font-semibold text-sm hover:bg-jade-deep transition-colors"
            >
              Get started — it&apos;s free
              <ArrowRight className="size-4" />
            </Link>
            <p className="mt-4">
              <Link href="/login" className="text-sm text-ink-mute hover:text-jade transition-colors underline underline-offset-4">
                Already a host? Log in
              </Link>
            </p>
          </div>
        </section>
      </ScrollReveal>

      <HostFooter />
    </div>
  );
}
