'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Paperclip, Send, ThumbsUp, ThumbsDown, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

const QUICK_REPLIES = [
  { label: 'Check-in instructions', body: 'Your check-in time is 2:00 PM. Key safe is beside the front gate — code 1234. Pool towels are in the cabinet by the outdoor shower. We look forward to welcoming you!' },
  { label: 'Directions from airport', body: 'From Ngurah Rai Airport, take the toll road towards Denpasar (about 45 min). Our driver can meet you at arrivals — let me know your flight number and I will arrange it.' },
  { label: 'Wifi password', body: 'Wifi network: BaliVilla_Guest · Password: Welcome2026. For best signal, the router is in the living room cabinet.' },
  { label: 'House rules reminder', body: 'A gentle reminder of our house rules: quiet hours after 10 PM, no smoking indoors, please close the pool gate when not in use, and no outside guests without prior notice. Thank you!' },
];

function relativeTime(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function Thread({ conv }) {
  const qc = useQueryClient();
  const [msgInput, setMsgInput] = useState('');
  const [showQR, setShowQR] = useState(false);
  const endRef = useRef(null);

  const { data } = useQuery({
    queryKey: ['host-messages', conv.id],
    queryFn: () => api.get(`/host/conversations/${conv.id}/messages/`),
    refetchInterval: 5000,
  });
  const messages = data?.messages ?? [];

  const sendMutation = useMutation({
    mutationFn: (text) => api.post(`/host/conversations/${conv.id}/messages/`, { text, lang: 'en' }),
    onSuccess: () => {
      setMsgInput('');
      setShowQR(false);
      qc.invalidateQueries({ queryKey: ['host-messages', conv.id] });
      qc.invalidateQueries({ queryKey: ['host-conversations'] });
    },
    onError: () => toast.error('Failed to send message.'),
  });

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length, conv.id]);

  function sendMessage() {
    const text = msgInput.trim();
    if (!text) return;
    sendMutation.mutate(text);
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Guest info bar */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-rule shrink-0 bg-surface">
        <img src={conv.guestAvatar || ''} alt={conv.guestName} className="size-9 rounded-full object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink">{conv.guestName}</p>
          <p className="text-xs text-ink-mute mt-0.5 truncate">{conv.villaTitle}</p>
        </div>
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        {messages.map((msg) => {
          const isHost = msg.sender === 'host';
          const primary = isHost ? (msg.textEn || msg.textZh) : (msg.textEn || msg.textZh);
          const footnote = !isHost && msg.textZh && msg.textEn ? msg.textZh : null;
          return (
            <div key={msg.id} className={`flex gap-2.5 ${isHost ? 'flex-row-reverse' : 'flex-row'} group`}>
              {!isHost && (
                <img src={conv.guestAvatar || ''} alt="" className="size-7 rounded-full object-cover shrink-0 mt-1" />
              )}
              <div className={`flex flex-col gap-1 max-w-[68%] ${isHost ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${isHost ? 'bg-jade text-white rounded-tr-sm' : 'bg-surface-alt text-ink rounded-tl-sm border border-rule'}`}>
                  {primary}
                </div>
                {footnote && (
                  <div className="flex items-start gap-1.5 pl-1">
                    <p className="text-[11px] text-mist italic leading-snug">Original: {footnote}</p>
                    {msg.translated && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button type="button" onClick={() => toast.success('Thanks for your feedback!')} className="size-5 flex items-center justify-center rounded text-ink-mute hover:text-success transition-colors"><ThumbsUp className="size-3" /></button>
                        <button type="button" onClick={() => toast.info("Flagged for review — we'll improve this translation")} className="size-5 flex items-center justify-center rounded text-ink-mute hover:text-danger transition-colors"><ThumbsDown className="size-3" /></button>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-[10px] text-ink-mute opacity-0 group-hover:opacity-100 transition-opacity px-1">
                  {new Date(msg.sentAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  {' · '}{new Date(msg.sentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-rule shrink-0 bg-surface">
        <div className="px-4 pt-3 pb-0">
          <div className="relative inline-block">
            <button type="button" onClick={() => setShowQR((v) => !v)} className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-mute hover:text-jade transition-colors">
              Quick replies
              <ChevronDown className={`size-3 transition-transform ${showQR ? 'rotate-180' : ''}`} />
            </button>
            {showQR && (
              <div className="absolute bottom-full left-0 mb-2 w-72 bg-surface rounded-xl border border-rule shadow-lg overflow-hidden z-10">
                {QUICK_REPLIES.map((qr) => (
                  <button key={qr.label} type="button" onClick={() => { setMsgInput(qr.body); setShowQR(false); }} className="w-full text-left px-3.5 py-2.5 hover:bg-jade-soft transition-colors border-b border-rule last:border-0">
                    <p className="text-xs font-semibold text-ink">{qr.label}</p>
                    <p className="text-[11px] text-ink-mute mt-0.5 truncate">{qr.body.slice(0, 60)}…</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-end gap-2 px-4 pt-2 pb-4">
          <button type="button" onClick={() => toast.info('File attachment coming soon')} className="size-9 flex items-center justify-center rounded-lg border border-rule text-ink-mute hover:bg-jade-soft hover:border-jade/30 hover:text-jade transition-colors shrink-0">
            <Paperclip className="size-4" />
          </button>
          <textarea
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
            rows={2}
            className="flex-1 resize-none text-sm border border-rule rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-jade bg-surface placeholder:text-ink-mute/60 leading-relaxed"
          />
          <button type="button" onClick={sendMessage} disabled={!msgInput.trim() || sendMutation.isPending} className="size-9 flex items-center justify-center rounded-lg bg-jade text-white hover:bg-jade-deep disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0">
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState(null);

  const { data, isPending } = useQuery({
    queryKey: ['host-conversations'],
    queryFn: () => api.get('/host/conversations/'),
  });
  const conversations = data?.conversations ?? [];

  const filtered = conversations.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (c.guestName ?? '').toLowerCase().includes(q) || (c.villaTitle ?? '').toLowerCase().includes(q);
  });

  const activeConv = conversations.find((c) => c.id === activeId) ?? (activeId ? null : conversations[0] ?? null);
  const showThread = Boolean(activeId && activeConv);

  return (
    <div className="flex bg-surface rounded-xl border border-rule shadow-sm overflow-hidden -m-4 lg:-m-8" style={{ height: 'calc(100vh - 5.5rem)' }}>
      {/* Left: conversation list — full-screen on mobile when no thread open */}
      <div className={`border-r border-rule flex flex-col shrink-0 ${
        showThread ? 'hidden md:flex' : 'flex w-full md:w-[30%] md:min-w-[220px] md:max-w-xs'
      }`}>
        <div className="px-4 py-3.5 border-b border-rule shrink-0">
          <h2 className="text-sm font-semibold text-ink mb-2.5">Messages</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-ink-mute pointer-events-none" />
            <input type="text" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-8 pl-8 pr-3 text-xs border border-rule rounded-lg bg-surface-alt focus:outline-none focus:ring-1 focus:ring-jade placeholder:text-ink-mute/60" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isPending && (
            <div className="p-3 space-y-2">
              {[1,2,3].map((i) => <div key={i} className="h-16 rounded-lg skeleton-shimmer" />)}
            </div>
          )}
          {!isPending && filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="p-4 text-xs text-ink-mute text-center"
            >
              No conversations found.
            </motion.p>
          )}
          {filtered.map((c) => (
            <button key={c.id} type="button" onClick={() => setActiveId(c.id)} className={`w-full text-left px-4 py-3.5 border-b border-rule last:border-0 transition-colors ${c.id === (activeConv?.id) ? 'bg-jade-soft border-l-4 border-l-jade' : 'hover:bg-surface-alt/60 border-l-4 border-l-transparent'}`}>
              <div className="flex items-start gap-2.5">
                <div className="relative shrink-0">
                  <img src={c.guestAvatar || ''} alt={c.guestName} className="size-9 rounded-full object-cover" />
                  {c.unreadHost > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 size-4 bg-jade text-white text-[9px] font-bold rounded-full flex items-center justify-center">{c.unreadHost}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-xs leading-tight truncate ${c.unreadHost > 0 ? 'font-semibold text-ink' : 'font-medium text-ink-soft'}`}>{c.guestName}</p>
                    <span className="text-[10px] text-ink-mute shrink-0">{relativeTime(c.lastMessageAt)}</span>
                  </div>
                  <p className="text-[11px] text-jade/80 mt-0.5 truncate">{c.villaTitle}</p>
                  <p className="text-[11px] text-ink-mute mt-0.5 truncate">{c.lastMessagePreview?.slice(0, 55) ?? ''}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: active conversation — full-screen on mobile when thread open */}
      <div className={`flex-1 flex flex-col min-w-0 ${showThread ? 'flex' : 'hidden md:flex'}`}>
        {showThread && (
          /* Mobile back button shown inside Thread header */
          <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b border-rule shrink-0 bg-surface">
            <button type="button" onClick={() => setActiveId(null)} className="size-9 flex items-center justify-center rounded-lg text-ink-mute hover:bg-surface-alt transition-colors">
              ←
            </button>
            <p className="text-sm font-semibold text-ink">{activeConv?.guestName}</p>
          </div>
        )}
        {activeConv ? (
          <Thread conv={activeConv} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex items-center justify-center text-ink-mute"
          >
            <p className="text-sm">Select a conversation</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
