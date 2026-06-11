import Link from 'next/link';
import {
  House, Languages, CalendarCheck, Banknote,
  ArrowRight, TrendingUp, Globe, Percent,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { HostTopNav } from '@/components/layout/HostTopNav';
import { HostFooter } from '@/components/layout/HostFooter';
import { HostFaqAccordion } from '@/components/home/HostFaqAccordion';
import { HeroSection } from '@/components/home/HeroSection';
import { ScrollReveal } from '@/components/ScrollReveal';

export const metadata = {
  title: 'BaliVilla for Hosts — Earn from your Bali villa',
  description: 'List your Bali villa and reach thousands of Chinese tourists. Automatic translation, WeChat Pay, Alipay — we handle the hard parts.',
};

export default async function LandingPage() {
  const t = await getTranslations('home');

  const HOW_IT_WORKS = [
    { icon: House,         step: '01', title: t('step01Title'), desc: t('step01Desc') },
    { icon: Languages,     step: '02', title: t('step02Title'), desc: t('step02Desc') },
    { icon: CalendarCheck, step: '03', title: t('step03Title'), desc: t('step03Desc') },
    { icon: Banknote,      step: '04', title: t('step04Title'), desc: t('step04Desc') },
  ];

  const TRUST_ITEMS = [
    { icon: TrendingUp, title: t('trust1Title'), stat: t('trust1Stat'), body: t('trust1Desc') },
    { icon: Globe,      title: t('trust2Title'), stat: t('trust2Stat'), body: t('trust2Desc') },
    { icon: Languages,  title: t('trust3Title'), stat: t('trust3Stat'), body: t('trust3Desc') },
    { icon: Percent,    title: t('trust4Title'), stat: t('trust4Stat'), body: t('trust4Desc') },
  ];

  return (
    <div className="min-h-screen bg-paper">
      <HostTopNav />

      {/* Hero */}
      <section className="pt-14 sm:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-0">
          <HeroSection />
        </div>
      </section>

      {/* How it works */}
      <ScrollReveal>
        <section id="how-it-works" className="py-12 md:py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-ink mb-3">
                {t('howItWorksTitle')}
              </h2>
              <p className="text-ink-mute max-w-md mx-auto">
                {t('howItWorksDesc')}
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
        <section id="commission" className="py-12 md:py-20 lg:py-28 border-t border-rule">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-display text-3xl sm:text-5xl font-medium text-jade leading-tight mb-6">
              {t('commissionTitle')}
            </h2>
            <p className="text-lg text-ink leading-relaxed mb-2">
              {t('commissionDesc1')}
            </p>
            <p className="text-lg text-ink-soft leading-relaxed mb-10">
              {t('commissionDesc2')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-surface rounded-xl px-8 py-4 shadow-sm">
                <p className="text-xs text-ink-mute mb-0.5">{t('youSet')}</p>
                <p className="font-mono text-2xl font-semibold text-ink">Rp 4,500,000<span className="text-sm font-sans font-normal text-ink-mute"> {t('perNight')}</span></p>
              </div>
              <div className="flex items-center justify-center text-ink-mute font-medium">→</div>
              <div className="bg-jade rounded-xl px-8 py-4 shadow-sm">
                <p className="text-xs text-white/70 mb-0.5">{t('youKeep')}</p>
                <p className="font-mono text-2xl font-semibold text-white">Rp 3,960,000<span className="text-sm font-sans font-normal text-white/70"> {t('perNight')}</span></p>
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
                {t('whyTitle')}
              </h2>
              <p className="text-ink-mute max-w-md mx-auto">
                {t('whyDesc')}
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
        <section id="faq" className="py-12 md:py-20 border-t border-rule">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-ink mb-12 text-center">
              {t('faqTitle')}
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
              {t('readyTitle')}
            </h2>
            <p className="text-base text-ink-soft leading-relaxed mb-8">
              {t('readyDesc')}
            </p>
            <Link
              href="/signup"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-jade text-white font-semibold text-sm hover:bg-jade-deep transition-colors"
            >
              {t('getStarted')}
              <ArrowRight className="size-4" />
            </Link>
            <p className="mt-4">
              <Link href="/login" className="text-sm text-ink-mute hover:text-jade transition-colors underline underline-offset-4">
                {t('alreadyHost')}
              </Link>
            </p>
          </div>
        </section>
      </ScrollReveal>

      <HostFooter />
    </div>
  );
}
