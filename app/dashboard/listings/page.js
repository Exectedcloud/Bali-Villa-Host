'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Pencil, PauseCircle, PlayCircle, Eye, Copy, Trash2,
  Plus, Star, BookOpen, BarChart3, Home, ArrowRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { api } from '@/lib/api-client';
import { normalizeVillaPhotos } from '@/lib/mock-data';

const BADGE_CLS = {
  published:      'bg-success/10 text-success',
  pending_review: 'bg-jade-soft text-jade',
  paused:         'bg-mist/20 text-mist-deep',
  draft:          'bg-warn/10 text-warn',
};

export default function ListingsPage() {
  const t = useTranslations('listings');
  const [filter, setFilter] = useState('all');
  const [paused, setPaused] = useState(new Set());

  const { data, isPending } = useQuery({
    queryKey: ['host-villas'],
    queryFn: () => api.get('/host/villas/'),
  });
  const villas = data?.villas ?? [];

  const FILTERS = [
    { key: 'all',            label: t('filters.all') },
    { key: 'published',      label: t('filters.published') },
    { key: 'pending_review', label: t('filters.pendingReview') },
    { key: 'paused',         label: t('filters.paused') },
    { key: 'draft',          label: t('filters.draft') },
  ];

  function statusOf(v) {
    if (paused.has(v.id)) return 'paused';
    return v.status || 'published';
  }

  const enriched = villas.map((v, i) => ({ ...normalizeVillaPhotos(v, i), effectiveStatus: statusOf(v) }));
  const shown = filter === 'all'
    ? enriched
    : enriched.filter((v) => v.effectiveStatus === filter);

  function togglePause(id) {
    setPaused((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink">{t('title')}</h1>
          <p className="text-sm text-ink-mute mt-1">{t('subtitle', { count: villas.length })}</p>
        </div>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep transition-colors shrink-0"
        >
          <Plus className="size-4" />
          {t('addListing')}
        </Link>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(({ key, label }) => {
          const count = key === 'all'
            ? enriched.length
            : enriched.filter((v) => v.effectiveStatus === key).length;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                filter === key
                  ? 'bg-jade text-white border-jade'
                  : 'bg-surface text-ink-soft border-rule hover:border-jade/50 hover:text-ink'
              }`}
            >
              {label}
              <span className={`ml-1.5 text-xs ${filter === key ? 'text-white/70' : 'text-ink-mute'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Loading skeleton */}
      {isPending && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => <div key={i} className="h-72 rounded-2xl skeleton-shimmer" />)}
        </div>
      )}

      {/* Zero villas at all — onboarding CTA */}
      {!isPending && villas.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="py-24 text-center"
        >
          <div className="size-16 rounded-2xl bg-jade-soft flex items-center justify-center mx-auto mb-5">
            <Home className="size-8 text-jade" />
          </div>
          <h2 className="font-display text-2xl font-medium text-ink mb-2">{t('empty.title')}</h2>
          <p className="text-sm text-ink-mute mb-8 max-w-sm mx-auto">{t('empty.desc')}</p>
          <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.08, ease: 'linear' }} className="inline-block">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-jade hover:bg-jade-deep text-white text-sm font-semibold transition-colors"
            >
              {t('empty.cta')}
              <ArrowRight className="size-4" />
            </Link>
          </motion.div>
        </motion.div>
      )}

      {/* Filter yields nothing (but villas exist) */}
      {!isPending && villas.length > 0 && shown.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="py-20 text-center"
        >
          <p className="text-base font-medium text-ink mb-1">{t('noResults.title', { filter })}</p>
          <p className="text-sm text-ink-mute">{t('noResults.desc')}</p>
        </motion.div>
      )}

      {/* Grid */}
      {!isPending && villas.length > 0 && shown.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {shown.map((villa) => (
            <ListingCard key={villa.id} villa={villa} onTogglePause={togglePause} />
          ))}
        </div>
      )}
    </div>
  );
}

function ListingCard({ villa, onTogglePause }) {
  const t = useTranslations('listings');
  const { effectiveStatus: status } = villa;
  const isPaused = status === 'paused';
  const bookings = Math.round((villa.reviewCount ?? 0) * 0.62);
  const occupancy = status === 'published'
    ? Math.min(98, Math.round(55 + (villa.rating ?? 0) * 3.8))
    : 0;

  return (
    <motion.div
      className="bg-surface rounded-2xl border border-rule shadow-sm overflow-hidden flex flex-col group"
      whileHover={{ y: -2, boxShadow: 'var(--shadow-md)' }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      {/* Photo */}
      <div className="relative aspect-video overflow-hidden bg-surface-alt">
        <img
          src={villa.photos?.[0] ?? ''}
          alt={villa.titleEn}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03] ${
            isPaused || status === 'draft' ? 'opacity-50 grayscale' : ''
          }`}
        />
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-surface/90 ${BADGE_CLS[status] ?? ''}`}>
          {t(`filters.${status === 'pending_review' ? 'pendingReview' : status === 'published' ? 'published' : status === 'paused' ? 'paused' : 'draft'}`)}
        </span>
        {villa.instantBook && status === 'published' && (
          <span className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full bg-jade text-white">
            Instant
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h2 className="font-display text-lg font-medium text-ink leading-snug line-clamp-1">
            {villa.titleEn}
          </h2>
          {villa.titleZh && (
            <p className="text-xs text-ink-mute mt-0.5 truncate">{villa.titleZh}</p>
          )}
          <p className="text-xs text-mist mt-0.5 truncate">{villa.location}</p>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-4 text-xs text-ink-mute">
          <span className="flex items-center gap-1">
            <BookOpen className="size-3.5 shrink-0" />
            {t('card.bookings', { count: bookings })}
          </span>
          <span className="flex items-center gap-1">
            <Star className="size-3 fill-gold text-gold shrink-0" />
            {villa.rating ?? '—'}
          </span>
          <span className="flex items-center gap-1">
            <BarChart3 className="size-3.5 shrink-0" />
            {t('card.occupancy', { pct: occupancy })}
          </span>
        </div>

        <div className="border-t border-rule" />

        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            <Link
              href={`/dashboard/listings/${villa.id}`}
              title={t('card.settings')}
              className="size-8 rounded-lg flex items-center justify-center text-ink-mute hover:bg-jade-soft hover:text-jade transition-colors"
            >
              <Pencil className="size-4" />
            </Link>
            <button
              type="button"
              title={isPaused ? t('card.unpause') : t('card.pause')}
              onClick={() => onTogglePause(villa.id)}
              className="size-8 rounded-lg flex items-center justify-center text-ink-mute hover:bg-jade-soft hover:text-jade transition-colors"
            >
              {isPaused ? <PlayCircle className="size-4" /> : <PauseCircle className="size-4" />}
            </button>
            <a
              href={`${process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3000'}/villa/${villa.slug}`}
              target="_blank"
              rel="noreferrer"
              title={t('card.previewAsGuest')}
              className="size-8 rounded-lg flex items-center justify-center text-ink-mute hover:bg-jade-soft hover:text-jade transition-colors"
            >
              <Eye className="size-4" />
            </a>
            <button
              type="button"
              title={t('card.duplicate')}
              className="size-8 rounded-lg flex items-center justify-center text-ink-mute hover:bg-jade-soft hover:text-jade transition-colors"
            >
              <Copy className="size-4" />
            </button>
          </div>
          <button
            type="button"
            title={t('card.deleteListing')}
            className="size-8 rounded-lg flex items-center justify-center text-ink-mute hover:bg-danger/10 hover:text-danger transition-colors"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
