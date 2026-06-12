'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { Search, Paperclip, Send, ThumbsUp, ThumbsDown, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import { useLocale } from '@/providers/LocaleProvider';

/* Auto-open a conversation from ?convId= URL param */
function AutoOpenConv({ onOpen }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const convId = searchParams.get('convId');

  useEffect(() => {
    if (convId) {
      onOpen(parseInt(convId, 10));
      router.replace('/dashboard/messages', { scroll: false });
    }
  }, [convId]);

  return null;
}

const QUICK_REPLY_BODIES = {
  en: {
    checkIn:    'Your check-in time is 2:00 PM. Key safe is beside the front gate — code 1234. Pool towels are in the cabinet by the outdoor shower. We look forward to welcoming you!',
    directions: 'From Ngurah Rai Airport, take the toll road towards Denpasar (about 45 min). Our driver can meet you at arrivals — let me know your flight number and I will arrange it.',
    wifi:       'Wifi network: BaliVilla_Guest · Password: Welcome2026. For best signal, the router is in the living room cabinet.',
    houseRules: 'A gentle reminder of our house rules: quiet hours after 10 PM, no smoking indoors, please close the pool gate when not in use, and no outside guests without prior notice. Thank you!',
  },
  id: {
    checkIn:    'Waktu check-in Anda adalah pukul 14.00. Brankas kunci ada di samping gerbang depan — kode 1234. Handuk kolam renang ada di lemari dekat pancuran luar. Kami menantikan kedatangan Anda!',
    directions: 'Dari Bandara Ngurah Rai, ambil jalan tol menuju Denpasar (sekitar 45 menit). Pengemudi kami bisa menjemput Anda di kedatangan — beri tahu nomor penerbangan Anda dan kami akan mengaturnya.',
    wifi:       'Jaringan Wifi: BaliVilla_Guest · Kata sandi: Welcome2026. Untuk sinyal terbaik, router ada di lemari ruang tamu.',
    houseRules: 'Pengingat lembut aturan rumah kami: jam tenang setelah pukul 22.00, dilarang merokok di dalam ruangan, harap tutup pintu gerbang kolam renang saat tidak digunakan, dan tidak ada tamu luar tanpa pemberitahuan sebelumnya. Terima kasih!',
  },
};

function useTimeAgo() {
  const t = useTranslations('messages');
  return function timeAgo(isoStr) {
    if (!isoStr) return '';
    const diff  = Date.now() - new Date(isoStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins < 1)   return t('justNow');
    if (mins < 60)  return t('minutesAgo', { count: mins });
    if (hours < 24) return t('hoursAgo', { count: hours });
    return t('daysAgo', { count: days });
  };
}

/* ── Message bubble ─────────────────────────────────────────────────────── */

function MessageBubble({ msg, guestAvatar, locale }) {
  const t = useTranslations('messages');
  const isHost = msg.sender === 'host';
  const tr     = msg.translations || {};

  const primaryText = locale === 'id'
    ? (tr.id || tr.en || msg.textEn || msg.textZh || '')
    : (tr.en || msg.textEn || msg.textZh || '');

  const secondaryText = tr.zh || msg.textZh || null;

  const confidence    = msg.translationConfidence != null ? Number(msg.translationConfidence) : null;
  const lowConfidence = confidence !== null && confidence < 0.75;
  const showBadge     = msg.translated && Boolean(secondaryText) && secondaryText !== primaryText;

  return (
    <div className={`flex gap-3 mb-4 group ${isHost ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isHost && (
        <div className="self-end mb-6 shrink-0">
          <Avatar src={guestAvatar} name="" size={28} />
        </div>
      )}
      <div className={`flex flex-col gap-1 max-w-[72%] ${isHost ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 space-y-1.5 ${
          isHost
            ? 'bg-jade text-white rounded-tr-sm'
            : 'bg-surface border border-rule text-ink rounded-tl-sm'
        }`}>
          <p className="text-sm leading-relaxed">{primaryText}</p>

          {secondaryText && secondaryText !== primaryText && (
            <>
              <div className={`h-px ${isHost ? 'bg-white/20' : 'bg-rule'}`} />
              <p className={`text-xs leading-relaxed ${isHost ? 'text-white/60' : 'text-mist'}`}>
                {secondaryText}
              </p>
            </>
          )}

          <div className={`flex items-center gap-1.5 pt-0.5 ${isHost ? 'justify-end' : 'justify-start'}`}>
            <span className={`text-[10px] ${isHost ? 'text-white/50' : 'text-ink-mute'}`}>
              {new Date(msg.sentAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </span>
            {showBadge && (
              <span
                title={confidence != null
                  ? `DeepL · confidence ${Math.round(confidence * 100)}%`
                  : 'Translated by DeepL'}
                className={`inline-flex items-center text-[9px] font-semibold px-1.5 py-0.5 rounded-full select-none ${
                  lowConfidence
                    ? 'bg-warn/15 text-warn'
                    : isHost
                      ? 'bg-white/15 text-white/70'
                      : 'bg-mist/15 text-mist-deep'
                }`}
              >
                DeepL
              </span>
            )}
          </div>
        </div>

        {showBadge && !isHost && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pl-1">
            <button
              type="button"
              onClick={() => toast.success(t('feedbackGood'))}
              className="size-5 flex items-center justify-center rounded text-ink-mute hover:text-success transition-colors"
            >
              <ThumbsUp className="size-3" />
            </button>
            <button
              type="button"
              onClick={() => toast.info(t('feedbackBad'))}
              className="size-5 flex items-center justify-center rounded text-ink-mute hover:text-danger transition-colors"
            >
              <ThumbsDown className="size-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Conversation row ───────────────────────────────────────────────────── */

function ConvRow({ conv, active, onClick }) {
  const timeAgo = useTimeAgo();
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full text-left px-4 py-4 flex gap-3 transition-colors border-b border-rule last:border-0',
        active ? 'bg-jade-soft' : 'hover:bg-surface-alt',
      )}
    >
      <div className="relative shrink-0">
        <Avatar src={conv.guestAvatar} name={conv.guestName} size={40} />
        {conv.unreadHost > 0 && (
          <span className="absolute -top-0.5 -right-0.5 size-4 bg-jade text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {conv.unreadHost}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-0.5">
          <p className={cn('text-sm truncate', active || conv.unreadHost > 0 ? 'font-semibold text-ink' : 'font-medium text-ink-soft')}>
            {conv.guestName}
          </p>
          <span className="text-xs text-ink-mute shrink-0">{timeAgo(conv.lastMessageAt)}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          {conv.villaPhoto && (
            <img src={conv.villaPhoto} alt="" className="size-4 rounded object-cover shrink-0" />
          )}
          <p className="text-[11px] text-jade/80 font-medium truncate">{conv.villaTitle}</p>
        </div>
        {conv.lastMessagePreview && (
          <p className={`text-[11px] truncate mt-0.5 ${conv.unreadHost > 0 ? 'text-ink' : 'text-ink-mute'}`}>
            {conv.lastMessagePreview.slice(0, 55)}
          </p>
        )}
      </div>
    </button>
  );
}

/* ── Thread ─────────────────────────────────────────────────────────────── */

function Thread({ conv, locale }) {
  const t   = useTranslations('messages');
  const qc  = useQueryClient();
  const [msgInput, setMsgInput] = useState('');
  const [showQR, setShowQR]     = useState(false);
  const endRef = useRef(null);

  const bodies = QUICK_REPLY_BODIES[locale] ?? QUICK_REPLY_BODIES.en;
  const QUICK_REPLIES = [
    { key: 'checkIn',    body: bodies.checkIn },
    { key: 'directions', body: bodies.directions },
    { key: 'wifi',       body: bodies.wifi },
    { key: 'houseRules', body: bodies.houseRules },
  ];

  const { data, isPending } = useQuery({
    queryKey: ['host-messages', conv.id],
    queryFn: () => api.get(`/host/conversations/${conv.id}/messages/`),
    refetchInterval: 5000,
  });
  const messages = data?.messages ?? [];

  const sendMutation = useMutation({
    mutationFn: (text) => api.post(`/host/conversations/${conv.id}/messages/`, { text, lang: locale }),
    onSuccess: () => {
      setMsgInput('');
      setShowQR(false);
      qc.invalidateQueries({ queryKey: ['host-messages', conv.id] });
      qc.invalidateQueries({ queryKey: ['host-conversations'] });
    },
    onError: () => toast.error(t('failedToSend')),
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, conv.id]);

  function sendMessage() {
    const text = msgInput.trim();
    if (!text) return;
    sendMutation.mutate(text);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Thread header — matches guest side structure */}
      <div className="px-5 py-4 border-b border-rule shrink-0 flex items-center gap-3">
        <Avatar src={conv.guestAvatar} name={conv.guestName} size={36} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink truncate">{conv.guestName}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {conv.villaPhoto && (
              <img src={conv.villaPhoto} alt="" className="size-4 rounded object-cover shrink-0" />
            )}
            <p className="text-xs text-ink-mute truncate">{conv.villaTitle}</p>
          </div>
        </div>
      </div>

      {/* Messages scroll area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
        {isPending && (
          <div className="flex justify-center py-8">
            <span className="text-xs text-ink-mute">Loading…</span>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} guestAvatar={conv.guestAvatar} locale={locale} />
        ))}
        <div ref={endRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-rule shrink-0">
        {/* Quick replies toggle */}
        <div className="px-4 pt-3 pb-0">
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setShowQR((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-mute hover:text-jade transition-colors"
            >
              {t('quickReplies')}
              <ChevronDown className={`size-3 transition-transform ${showQR ? 'rotate-180' : ''}`} />
            </button>
            {showQR && (
              <div className="absolute bottom-full left-0 mb-2 w-72 bg-surface rounded-xl border border-rule shadow-lg overflow-hidden z-10">
                {QUICK_REPLIES.map((qr) => (
                  <button
                    key={qr.key}
                    type="button"
                    onClick={() => { setMsgInput(qr.body); setShowQR(false); }}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-jade-soft transition-colors border-b border-rule last:border-0"
                  >
                    <p className="text-xs font-semibold text-ink">{t(`quickReply.${qr.key}`)}</p>
                    <p className="text-[11px] text-ink-mute mt-0.5 truncate">{qr.body.slice(0, 60)}…</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Composer row */}
        <div className="flex items-end gap-2 px-4 pt-2 pb-4">
          <button
            type="button"
            onClick={() => toast.info(t('attachmentSoon'))}
            className="p-2.5 rounded-xl text-ink-mute hover:bg-surface-alt hover:text-ink transition-colors shrink-0"
          >
            <Paperclip className="size-4" />
          </button>
          <textarea
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
            }}
            placeholder={t('messagePlaceholder')}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-rule bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-mute outline-none focus:border-jade focus:ring-2 focus:ring-jade/20 transition-colors max-h-32"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={!msgInput.trim() || sendMutation.isPending}
            className="p-2.5 rounded-xl bg-jade hover:bg-jade-deep text-white transition-colors shrink-0 disabled:opacity-40"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function MessagesPage() {
  const t = useTranslations('messages');
  const { locale } = useLocale();
  const [search, setSearch]     = useState('');
  const [activeId, setActiveId] = useState(null);

  const { data, isPending } = useQuery({
    queryKey: ['host-conversations'],
    queryFn: () => api.get('/host/conversations/'),
    refetchInterval: 15000,
  });
  const conversations = data?.conversations ?? [];

  const filtered = conversations.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (c.guestName ?? '').toLowerCase().includes(q)
        || (c.villaTitle ?? '').toLowerCase().includes(q);
  });

  const activeConv = conversations.find((c) => c.id === activeId)
    ?? (activeId ? null : conversations[0] ?? null);
  const showThread = Boolean(activeConv);

  return (
    <div className="flex flex-col bg-surface rounded-xl border border-rule shadow-sm overflow-hidden mt-4 lg:mt-6 h-[calc(100vh-5.5rem)] lg:h-[calc(100vh-3.5rem)]">
      <Suspense fallback={null}>
        <AutoOpenConv onOpen={(id) => setActiveId(id)} />
      </Suspense>

      {/* Page header */}
      <div className={cn(
        'px-4 sm:px-6 py-4 sm:py-5 border-b border-rule shrink-0 flex items-center gap-3',
        showThread ? 'hidden md:flex' : '',
      )}>
        <h1 className="font-display text-xl font-medium text-ink flex-1">{t('title')}</h1>
      </div>

      {/* ── Panels ── */}
      <div className="flex flex-1 min-h-0">

      {/* ── Left: conversation list ── */}
      <div className={`border-r border-rule flex flex-col shrink-0 ${
        showThread
          ? 'hidden md:flex md:w-[30%] md:min-w-[220px] md:max-w-xs'
          : 'flex w-full md:w-[30%] md:min-w-[220px] md:max-w-xs'
      }`}>
        {/* List header */}
        <div className="px-4 py-3 border-b border-rule shrink-0 flex items-center gap-3">
          <p className="text-xs font-semibold text-ink shrink-0">{t('title')}</p>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-ink-mute pointer-events-none" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs border border-rule rounded-lg bg-surface-alt focus:outline-none focus:ring-1 focus:ring-jade placeholder:text-ink-mute/60"
            />
          </div>
        </div>

        {/* Conversation rows */}
        <div className="flex-1 overflow-y-auto">
          {isPending && (
            <div className="p-3 space-y-2">
              {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl skeleton-shimmer" />)}
            </div>
          )}
          {!isPending && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="p-6 text-center"
            >
              <p className="text-xs text-ink-mute mb-3">{t('noConversations')}</p>
              <a
                href="/dashboard/reservations"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-jade hover:text-jade-deep transition-colors"
              >
                <Send className="size-3.5" />
                Message a guest
              </a>
            </motion.div>
          )}
          {filtered.map((c) => (
            <ConvRow
              key={c.id}
              conv={c}
              active={c.id === activeConv?.id}
              onClick={() => setActiveId(c.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Right: thread or empty state ── */}
      <div className={`flex-1 min-w-0 flex flex-col ${!showThread && 'hidden md:flex'}`}>
        {showThread ? (
          <>
            {/* Mobile back button */}
            <div className="md:hidden px-4 py-3 border-b border-rule shrink-0 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="size-9 flex items-center justify-center rounded-lg text-ink-mute hover:bg-surface-alt transition-colors"
              >
                ←
              </button>
              <p className="text-sm font-semibold text-ink truncate">{activeConv?.guestName}</p>
            </div>
            <Thread conv={activeConv} locale={locale} />
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8"
          >
            <div className="size-14 rounded-full bg-jade-soft flex items-center justify-center">
              <Send className="size-6 text-jade" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink mb-1">{t('title')}</p>
              <p className="text-xs text-ink-mute max-w-xs">{t('selectConversation')}</p>
            </div>
            <a
              href="/dashboard/reservations"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep transition-colors"
            >
              <Send className="size-4" />
              Message a guest
            </a>
          </motion.div>
        )}
      </div>

      </div>
    </div>
  );
}
