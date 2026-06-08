'use client';

import { useState } from 'react';
import { Dialog } from 'radix-ui';
import { CheckCircle, ChevronDown, ChevronUp, Star, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { api, ApiError } from '@/lib/api-client';

const BANK_OPTIONS = ['BCA', 'Mandiri', 'BNI', 'BRI', 'CIMB Niaga', 'Danamon', 'Other'];

const inputCls = 'h-11 px-3.5 rounded-lg border border-rule bg-paper text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-jade/40 focus:border-jade transition-colors w-full';

export function Step4Form({ data, patch, router }) {
  const [bankOpen, setBankOpen] = useState(true);
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);

  async function handlePublish() {
    setPublishing(true);
    try {
      await api.post('/host/villas/', data);
      setPublished(true);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to publish listing.');
      setPublishing(false);
    }
  }

  const previewPhoto = data.videoUrl ? null : 'https://images.unsplash.com/photo-1582610116397-edb318620f90?w=400&q=80';
  const previewTitle = data.title || 'Your villa name';
  const previewLocation = [data.city, data.region].filter(Boolean).join(', ') || 'Bali, Indonesia';
  const previewPrice = data.basePriceIdr
    ? `Rp ${data.basePriceIdr}`
    : 'Rp —';

  const canPublish = data.bankHolder && data.bankName && data.bankAccount && data.hostTerms;

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left — listing preview */}
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-semibold text-ink">Listing preview</h2>
          <div className="bg-surface rounded-2xl border border-rule overflow-hidden shadow-md">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={previewPhoto}
                alt="Villa preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-sm text-xs font-semibold text-ink shadow-sm">
                  Preview
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-base font-semibold text-ink leading-snug">{previewTitle}</h3>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="size-3.5 fill-gold text-gold" />
                  <span className="text-xs font-medium text-ink">New</span>
                </div>
              </div>
              <p className="text-xs text-ink-mute mb-3">{previewLocation}</p>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-base font-semibold text-ink">{previewPrice}</span>
                <span className="text-xs text-ink-mute">/ night</span>
              </div>
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs text-jade hover:text-jade-deep transition-colors font-medium"
              >
                Preview as guest
                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right — payout, tax, terms, publish */}
        <div className="flex flex-col gap-6">

          {/* Banking info */}
          <div className="flex flex-col border border-rule rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setBankOpen((v) => !v)}
              className="flex items-center justify-between px-5 py-4 bg-surface hover:bg-surface-alt transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-ink">Banking information</span>
                {!data.bankHolder && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-warn/15 text-warn font-medium">Required</span>
                )}
              </div>
              {bankOpen ? <ChevronUp className="size-4 text-ink-mute" /> : <ChevronDown className="size-4 text-ink-mute" />}
            </button>
            {bankOpen && (
              <div className="px-5 py-5 bg-paper flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-ink-soft">Account holder name</label>
                  <input
                    type="text"
                    value={data.bankHolder}
                    onChange={(e) => patch({ bankHolder: e.target.value })}
                    placeholder="Full name as on your bank account"
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-ink-soft">Bank</label>
                  <select
                    value={data.bankName}
                    onChange={(e) => patch({ bankName: e.target.value })}
                    className={`${inputCls} appearance-none cursor-pointer`}
                  >
                    <option value="">Select your bank</option>
                    {BANK_OPTIONS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-ink-soft">Account number</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={data.bankAccount}
                    onChange={(e) => patch({ bankAccount: e.target.value })}
                    placeholder="1234567890"
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-ink-soft">SWIFT / BIC code <span className="text-ink-mute font-normal">(optional)</span></label>
                  <input
                    type="text"
                    value={data.swiftCode}
                    onChange={(e) => patch({ swiftCode: e.target.value.toUpperCase() })}
                    placeholder="CENAIDJA"
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-ink-soft">Payout currency</label>
                  <select
                    value={data.payoutCurrency}
                    onChange={(e) => patch({ payoutCurrency: e.target.value })}
                    className={`${inputCls} appearance-none cursor-pointer`}
                  >
                    <option value="IDR">IDR — Indonesian Rupiah</option>
                    <option value="USD">USD — US Dollar</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Tax info */}
          <div className="flex flex-col gap-3 p-5 bg-surface rounded-xl border border-rule">
            <h3 className="text-sm font-semibold text-ink">Tax information</h3>
            {!data.npwpNA && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-ink-soft">NPWP number</label>
                <input
                  type="text"
                  value={data.npwp}
                  onChange={(e) => patch({ npwp: e.target.value })}
                  placeholder="00.000.000.0-000.000"
                  className={inputCls}
                />
              </div>
            )}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={data.npwpNA}
                onChange={(e) => patch({ npwpNA: e.target.checked })}
                className="size-4 rounded accent-jade"
              />
              <span className="text-xs text-ink-soft">Not applicable / I don&apos;t have an NPWP</span>
            </label>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.hostTerms}
              onChange={(e) => patch({ hostTerms: e.target.checked })}
              className="mt-0.5 size-4 rounded accent-jade shrink-0"
            />
            <span className="text-xs text-ink-soft leading-relaxed">
              I accept the{' '}
              <a href="/terms" className="text-jade hover:text-jade-deep underline underline-offset-2">
                BaliVilla Host Terms
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-jade hover:text-jade-deep underline underline-offset-2">
                Privacy Policy
              </a>
              , and confirm I have the right to list this property
            </span>
          </label>

          {/* Publish */}
          <button
            type="button"
            onClick={handlePublish}
            disabled={!canPublish || publishing}
            className="w-full h-12 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            {publishing ? 'Submitting…' : 'Submit for review'}
          </button>
          {!canPublish && (
            <p className="text-xs text-ink-mute text-center -mt-2">
              Complete banking info and accept terms to publish
            </p>
          )}
        </div>
      </div>

      {/* Success modal */}
      <Dialog.Root open={published}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-surface rounded-2xl p-8 shadow-xl w-full max-w-sm mx-4 flex flex-col items-center text-center gap-5">
            <div className="size-16 rounded-full bg-jade-soft flex items-center justify-center">
              <CheckCircle className="size-8 text-jade" />
            </div>
            <div>
              <Dialog.Title className="font-display text-2xl font-medium text-ink mb-2">
                Your listing is under review
              </Dialog.Title>
              <Dialog.Description className="text-sm text-ink-mute leading-relaxed">
                Thank you! Your listing has been submitted and is now being reviewed by the BaliVilla team. We&apos;ll notify you once it&apos;s approved and live.
              </Dialog.Description>
            </div>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="w-full h-11 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep transition-colors"
            >
              Go to dashboard
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
