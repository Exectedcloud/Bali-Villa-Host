'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Step1Form } from '@/components/onboarding/Step1Form';
import { Step2Form } from '@/components/onboarding/Step2Form';
import { Step3Form } from '@/components/onboarding/Step3Form';
import { Step4Form } from '@/components/onboarding/Step4Form';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { MapPin, Camera, Banknote, CheckCircle2 } from 'lucide-react';

const STEP_META = [
  {
    question: 'Where is your villa?',
    subtext: 'Just the basics — you can edit everything later.',
    icon: MapPin,
    panelTitle: 'Easy to get started',
    panelBody: 'Properties in Ubud, Canggu, and Uluwatu are most popular with Chinese guests. Your listing typically goes live within 48 hours of submission.',
    panelNote: 'Average setup time: under 30 minutes',
  },
  {
    question: 'What makes your villa special?',
    subtext: 'Show guests what they can expect — honest photos and a clear description build trust.',
    icon: Camera,
    panelTitle: 'Good photos earn more',
    panelBody: 'Listings with 8 or more high-quality photos receive 3× more booking inquiries. Show the pool, the view from the bedroom, and the outdoor living area.',
    panelNote: 'Tip: Natural light is better than flash',
  },
  {
    question: 'How much will you charge?',
    subtext: 'Set your nightly rate in IDR. You can adjust pricing from your dashboard at any time.',
    icon: Banknote,
    panelTitle: 'Transparent commission',
    showCalculator: true,
  },
  {
    question: 'Ready to publish?',
    subtext: 'Review your listing preview, add your payout details, then submit for BaliVilla review.',
    icon: CheckCircle2,
    panelTitle: 'What happens next',
    showTimeline: true,
  },
];

const DEFAULT_DATA = {
  propertyType: 'villa',
  propertyName: '',
  address: '',
  country: 'Indonesia',
  region: '',
  city: '',
  countryCode: '+62',
  phone: '',
  email: '',
  guests: 4,
  bedrooms: 2,
  beds: 2,
  bathrooms: 2,
  videoFile: null,
  videoUrl: '',
  title: '',
  highlights: [],
  description: '',
  amenities: [],
  basePriceIdr: '',
  weekendPremium: 10,
  cleaningFee: '',
  newListingDiscount: true,
  lastMinuteDiscount: false,
  weeklyDiscount: false,
  monthlyDiscount: false,
  newListingPct: 20,
  lastMinutePct: 10,
  weeklyPct: 10,
  monthlyPct: 20,
  cancellationPolicy: 'moderate',
  houseRules: ['no_smoking', 'quiet_hours'],
  checkInFrom: '14:00',
  checkInUntil: '22:00',
  checkOut: '11:00',
  minNights: 1,
  maxNights: 30,
  instantBook: false,
  bankHolder: '',
  bankName: '',
  bankAccount: '',
  swiftCode: '',
  payoutCurrency: 'IDR',
  npwp: '',
  npwpNA: false,
  hostTerms: false,
};

function isStepValid(step, data) {
  if (step === 1) return data.propertyName.trim().length > 0 && data.address.trim().length > 0;
  if (step === 2) return data.title.trim().length > 0 && data.description.trim().length > 0 && data.amenities.length >= 3;
  if (step === 3) return Number(data.basePriceIdr.toString().replace(/\D/g, '')) > 0;
  return true;
}

function ContextPanel({ meta, data }) {
  const Icon = meta.icon;

  if (meta.showCalculator) {
    const rawIdr = Number(String(data.basePriceIdr).replace(/\D/g, '')) || 3000000;
    const keepIdr = Math.round(rawIdr * 0.88);
    return (
      <div className="bg-jade-soft rounded-2xl p-6 flex flex-col gap-5">
        <div className="size-12 rounded-xl bg-jade flex items-center justify-center shrink-0">
          <Icon className="size-6 text-white" />
        </div>
        <div>
          <h3 className="font-display text-xl font-medium text-ink mb-1">{meta.panelTitle}</h3>
          <p className="text-xs text-ink-mute leading-relaxed">You set the rate in IDR. We only earn when you earn.</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-surface rounded-xl px-4 py-3">
            <p className="text-[10px] text-ink-mute font-semibold uppercase tracking-wide mb-0.5">You set</p>
            <p className="font-mono text-base font-semibold text-ink">
              Rp {rawIdr.toLocaleString('id-ID')}
              <span className="text-xs font-sans font-normal text-ink-mute"> /night</span>
            </p>
          </div>
          <p className="text-center text-xs text-ink-mute">→ 12% commission</p>
          <div className="bg-jade rounded-xl px-4 py-3">
            <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wide mb-0.5">You keep (88%)</p>
            <p className="font-mono text-base font-semibold text-white">
              Rp {keepIdr.toLocaleString('id-ID')}
              <span className="text-xs font-sans font-normal text-white/70"> /night</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (meta.showTimeline) {
    const timelineSteps = [
      { label: 'Submit your listing', active: true },
      { label: 'BaliVilla review (1–2 days)', active: false },
      { label: 'Go live to Chinese guests', active: false },
      { label: 'First booking arrives', active: false },
    ];
    return (
      <div className="bg-jade-soft rounded-2xl p-6 flex flex-col gap-5">
        <div className="size-12 rounded-xl bg-jade flex items-center justify-center shrink-0">
          <Icon className="size-6 text-white" />
        </div>
        <h3 className="font-display text-xl font-medium text-ink">{meta.panelTitle}</h3>
        <div className="flex flex-col gap-3">
          {timelineSteps.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`size-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white ${
                i === 0 ? 'bg-jade' : 'bg-rule'
              }`}>
                {i + 1}
              </div>
              <span className={`text-sm ${i === 0 ? 'font-semibold text-ink' : 'text-ink-mute'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-jade-soft rounded-2xl p-6 flex flex-col gap-5">
      <div className="size-12 rounded-xl bg-jade flex items-center justify-center shrink-0">
        <Icon className="size-6 text-white" />
      </div>
      <div>
        <h3 className="font-display text-xl font-medium text-ink mb-2">{meta.panelTitle}</h3>
        <p className="text-sm text-ink-soft leading-relaxed">{meta.panelBody}</p>
      </div>
      {meta.panelNote && (
        <p className="text-xs text-mist border-t border-jade/20 pt-3">{meta.panelNote}</p>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState(DEFAULT_DATA);
  const [dirty, setDirty] = useState(false);

  const { data: meData } = useQuery({ queryKey: ['host-me'], queryFn: () => api.get('/host/me/') });
  const hostAvatarUrl = meData?.user?.avatarUrl || '';

  function patch(updates) {
    setData((d) => ({ ...d, ...updates }));
    setDirty(true);
  }

  function goToStep(newStep) {
    setStep(newStep);
    setDirty(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const meta = STEP_META[step - 1];
  const stepProps = { data, patch, router, showErrors: dirty };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-rule">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/BaliVillalogo.png"
              alt="BaliVilla"
              width={160}
              height={40}
              className="h-10 w-auto"
              priority
            />
            <span className="text-sm font-medium text-mist hidden sm:inline">for Hosts</span>
          </Link>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-sm text-ink-mute hover:text-ink transition-colors"
            >
              Save and exit
            </button>
            {hostAvatarUrl && (
              <img src={hostAvatarUrl} alt="Your avatar" className="size-8 rounded-full object-cover border-2 border-rule" />
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 pt-24 pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-start">

            {/* Left — question + form */}
            <div className="flex-1 min-w-0">
              {/* Dot step indicator */}
              <div className="flex items-center gap-2 mb-8">
                {STEP_META.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-200 ${
                      i < step - 1
                        ? 'size-2 bg-jade'
                        : i === step - 1
                        ? 'w-6 h-2 bg-jade'
                        : 'size-2 bg-rule'
                    }`}
                  />
                ))}
                <span className="ml-1 text-xs text-ink-mute">Step {step} of {STEP_META.length}</span>
              </div>

              {/* Big question headline */}
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-ink leading-tight mb-3">
                {meta.question}
              </h1>
              <p className="text-sm sm:text-base text-ink-mute leading-relaxed mb-6 sm:mb-10">{meta.subtext}</p>

              {/* Step form */}
              {step === 1 && <Step1Form {...stepProps} />}
              {step === 2 && <Step2Form {...stepProps} />}
              {step === 3 && <Step3Form {...stepProps} />}
              {step === 4 && <Step4Form {...stepProps} />}
            </div>

            {/* Right — contextual panel (hidden on mobile to reduce scroll) */}
            <div className="hidden lg:block w-80 shrink-0 sticky top-24">
              <ContextPanel meta={meta} data={data} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-rule">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:justify-between">
          <button
            type="button"
            onClick={() => goToStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-rule text-sm font-medium text-ink-soft hover:border-jade hover:text-jade disabled:opacity-30 disabled:pointer-events-none transition-colors min-h-[44px]"
          >
            Back
          </button>
          {step < 4 && (
            <button
              type="button"
              onClick={() => isStepValid(step, data) && goToStep(step + 1)}
              disabled={!isStepValid(step, data)}
              className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep disabled:opacity-40 disabled:pointer-events-none transition-colors min-h-[44px]"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
