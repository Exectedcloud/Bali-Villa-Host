'use client';

import { useState, useRef } from 'react';
import { Camera, X, Check, Shield, Smartphone, Globe, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

const TABS = ['Personal info', 'Hosting preferences', 'Notifications', 'Security'];

const ALL_LANGUAGES = ['English', 'Indonesian', 'Mandarin Chinese', 'Japanese', 'Korean', 'French', 'German', 'Spanish', 'Russian', 'Arabic'];

const NOTIF_EVENTS = [
  { key: 'new_booking',      label: 'New booking confirmed' },
  { key: 'booking_request',  label: 'Booking request received' },
  { key: 'new_message',      label: 'New guest message' },
  { key: 'review_received',  label: 'Guest review posted' },
  { key: 'payout_sent',      label: 'Payout initiated' },
  { key: 'price_suggestion', label: 'Smart pricing suggestion' },
  { key: 'security_alert',   label: 'Account security alert' },
];

const SESSIONS = [
  { id: 1, device: 'Chrome on macOS',  location: 'Jakarta, Indonesia',  lastActive: '2 minutes ago',  current: true  },
  { id: 2, device: 'Safari on iPhone', location: 'Ubud, Bali',          lastActive: '3 hours ago',    current: false },
  { id: 3, device: 'Chrome on Windows',location: 'Denpasar, Bali',      lastActive: '2 days ago',     current: false },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${checked ? 'bg-jade' : 'bg-rule'}`}
    >
      <span className={`inline-block size-3.5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-1'}`} />
    </button>
  );
}

function SaveBar({ onSave }) {
  return (
    <div className="flex justify-end pt-2">
      <button
        type="button"
        onClick={onSave}
        className="px-5 py-2 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep transition-colors"
      >
        Save changes
      </button>
    </div>
  );
}

// ── Tab: Personal info ────────────────────────────────────────────────────────

function PersonalInfoTab({ meData }) {
  const [name,  setName]  = useState(meData?.host?.displayName ?? '');
  const [bio,   setBio]   = useState(meData?.host?.bio ?? '');
  const [phone, setPhone] = useState(meData?.user?.phone ?? '');
  const [langs, setLangs] = useState(meData?.host?.languages?.length ? meData.host.languages : ['English']);
  const [localAvatarUrl, setLocalAvatarUrl] = useState('');
  const avatarInputRef = useRef(null);

  const avatarUrl = localAvatarUrl || meData?.user?.avatarUrl || '';
  const email     = meData?.user?.email ?? '';

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (localAvatarUrl) URL.revokeObjectURL(localAvatarUrl);
    setLocalAvatarUrl(URL.createObjectURL(file));
  }

  function toggleLang(lang) {
    setLangs((prev) => prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-mute block mb-2">Profile photo</label>
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
        <div className="flex items-center gap-4">
          <div className="relative group">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name || 'Profile'} className="size-20 rounded-full object-cover" />
            ) : (
              <div className="size-20 rounded-full bg-jade-soft flex items-center justify-center text-jade text-2xl font-semibold">
                {(name || '?')[0].toUpperCase()}
              </div>
            )}
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              <Camera className="size-5 text-white" />
            </button>
          </div>
          <div className="text-xs text-ink-mute leading-relaxed">
            <p className="font-medium text-ink mb-0.5">Upload a new photo</p>
            <p>JPG or PNG · Max 4 MB · Minimum 400×400 px</p>
            <button type="button" onClick={() => avatarInputRef.current?.click()} className="text-jade font-medium mt-1 hover:text-jade-deep transition-colors">
              Choose file
            </button>
          </div>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-mute block mb-1.5">
          Display name <span className="text-ink-mute/60 font-normal normal-case">(visible to guests)</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-10 px-3 text-sm border border-rule rounded-xl bg-surface focus:outline-none focus:ring-1 focus:ring-jade"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-mute block mb-1.5">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="w-full px-3 py-2.5 text-sm border border-rule rounded-xl bg-surface focus:outline-none focus:ring-1 focus:ring-jade resize-none leading-relaxed"
        />
        <p className="text-[11px] text-ink-mute mt-1">{bio.length} / 500 characters</p>
      </div>

      {/* Languages */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-mute block mb-2">Languages spoken</label>
        <div className="flex flex-wrap gap-2">
          {ALL_LANGUAGES.map((lang) => {
            const selected = langs.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLang(lang)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  selected
                    ? 'bg-jade text-white border-jade'
                    : 'bg-surface text-ink-soft border-rule hover:border-jade/40 hover:text-ink'
                }`}
              >
                {selected && <Check className="size-3" />}
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-mute block mb-1.5">
            Email <span className="text-ink-mute/60 font-normal normal-case">(read-only)</span>
          </label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full h-10 px-3 text-sm border border-rule rounded-xl bg-surface-alt text-ink-mute cursor-default"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-mute block mb-1.5">Phone number</label>
          <div className="flex gap-2">
            <select className="h-10 px-2 text-sm border border-rule rounded-xl bg-surface focus:outline-none focus:ring-1 focus:ring-jade w-20 shrink-0">
              <option>+62</option><option>+1</option><option>+44</option><option>+86</option>
            </select>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 h-10 px-3 text-sm border border-rule rounded-xl bg-surface focus:outline-none focus:ring-1 focus:ring-jade"
            />
          </div>
        </div>
      </div>

      <SaveBar onSave={() => toast.success('Profile updated')} />
    </div>
  );
}

// ── Tab: Hosting preferences ──────────────────────────────────────────────────

function HostingPrefsTab() {
  const [autoReply,  setAutoReply]  = useState(true);
  const [replyMsg,   setReplyMsg]   = useState('Thank you for your enquiry! I will get back to you within a few hours with full details about availability and pricing.');
  const [respGoal,   setRespGoal]   = useState('Within 12 hours');
  const [available,  setAvailable]  = useState(true);

  return (
    <div className="flex flex-col gap-6">
      {/* Auto-reply */}
      <div className="bg-surface-alt/60 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-ink">Auto-reply for new inquiries</p>
            <p className="text-xs text-ink-mute mt-0.5">Guests receive this message instantly when they make an enquiry</p>
          </div>
          <Toggle checked={autoReply} onChange={setAutoReply} />
        </div>
        {autoReply && (
          <textarea
            value={replyMsg}
            onChange={(e) => setReplyMsg(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 text-sm border border-rule rounded-xl bg-surface focus:outline-none focus:ring-1 focus:ring-jade resize-none leading-relaxed"
          />
        )}
      </div>

      {/* Response time */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-mute block mb-1.5">Response time goal</label>
        <select
          value={respGoal}
          onChange={(e) => setRespGoal(e.target.value)}
          className="h-10 px-3 text-sm border border-rule rounded-xl bg-surface focus:outline-none focus:ring-1 focus:ring-jade w-full sm:w-64 appearance-none"
        >
          {['Within 1 hour', 'Within 12 hours', 'Within 24 hours', 'Within 48 hours'].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <p className="text-xs text-ink-mute mt-1.5">Shown on your listings — faster response rates improve search ranking</p>
      </div>

      {/* Availability */}
      <div className="flex items-start justify-between gap-4 p-4 bg-surface-alt/60 rounded-xl">
        <div>
          <p className="text-sm font-semibold text-ink">Available for new bookings</p>
          <p className="text-xs text-ink-mute mt-0.5">
            {available
              ? 'Your listings are accepting new reservations'
              : 'All your listings appear fully booked to guests'}
          </p>
        </div>
        <Toggle checked={available} onChange={setAvailable} />
      </div>

      <SaveBar onSave={() => toast.success('Preferences saved')} />
    </div>
  );
}

// ── Tab: Notifications ────────────────────────────────────────────────────────

function NotificationsTab() {
  const [settings, setSettings] = useState(
    Object.fromEntries(
      NOTIF_EVENTS.map(({ key }) => [
        key,
        { email: true, sms: key !== 'price_suggestion', inapp: true },
      ])
    )
  );

  function toggle(event, channel) {
    setSettings((prev) => ({
      ...prev,
      [event]: { ...prev[event], [channel]: !prev[event][channel] },
    }));
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-mute">Choose how you want to be notified for each event type.</p>
      <div className="bg-surface rounded-xl border border-rule overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule bg-surface-alt/50">
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-mute">Event</th>
              {['Email', 'SMS', 'In-app'].map((ch) => (
                <th key={ch} className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-mute w-20">{ch}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NOTIF_EVENTS.map(({ key, label }) => (
              <tr key={key} className="border-b border-rule last:border-0 hover:bg-surface-alt/40 transition-colors">
                <td className="px-5 py-3 text-sm font-medium text-ink">{label}</td>
                {(['email', 'sms', 'inapp']).map((ch) => (
                  <td key={ch} className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={settings[key][ch]}
                      onChange={() => toggle(key, ch)}
                      className="size-4 rounded border-rule accent-jade cursor-pointer"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SaveBar onSave={() => toast.success('Notification preferences saved')} />
    </div>
  );
}

// ── Tab: Security ─────────────────────────────────────────────────────────────

function SecurityTab() {
  const [twoFA,      setTwoFA]      = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConf, setDeleteConf] = useState('');
  const [sessions,   setSessions]   = useState(SESSIONS);

  function signOutSession(id) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    toast.success('Session signed out');
  }

  function handleDelete() {
    if (deleteConf !== 'DELETE') { toast.error('Type DELETE to confirm'); return; }
    toast.error('Account deletion request submitted — you will receive a confirmation email');
    setShowDelete(false);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Change password */}
      <div className="bg-surface-alt/60 rounded-xl p-5 flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-ink">Change password</h3>
        {[
          { label: 'Current password', id: 'curr' },
          { label: 'New password',     id: 'new'  },
          { label: 'Confirm new',      id: 'conf' },
        ].map(({ label, id }) => (
          <div key={id}>
            <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-ink-mute block mb-1.5">{label}</label>
            <input id={id} type="password" className="w-full h-10 px-3 text-sm border border-rule rounded-xl bg-surface focus:outline-none focus:ring-1 focus:ring-jade" />
          </div>
        ))}
        <button type="button" onClick={() => toast.success('Password updated')} className="self-start px-5 py-2 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep transition-colors">
          Update password
        </button>
      </div>

      {/* 2FA */}
      <div className="flex items-start justify-between gap-4 p-5 bg-surface-alt/60 rounded-xl">
        <div className="flex gap-3">
          <Shield className={`size-5 mt-0.5 shrink-0 ${twoFA ? 'text-jade' : 'text-ink-mute'}`} />
          <div>
            <p className="text-sm font-semibold text-ink">Two-factor authentication</p>
            <p className="text-xs text-ink-mute mt-0.5">
              {twoFA ? 'Your account is protected with 2FA via authenticator app' : 'Add an extra layer of security to your account'}
            </p>
          </div>
        </div>
        <Toggle checked={twoFA} onChange={(v) => { setTwoFA(v); toast.success(v ? '2FA enabled' : '2FA disabled'); }} />
      </div>

      {/* Active sessions */}
      <div className="bg-surface rounded-xl border border-rule overflow-hidden">
        <div className="px-5 py-4 border-b border-rule flex items-center gap-2">
          <Smartphone className="size-4 text-ink-mute" />
          <h3 className="text-sm font-semibold text-ink">Active sessions</h3>
        </div>
        <div className="divide-y divide-rule">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-5 py-3.5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-ink">{s.device}</p>
                  {s.current && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-jade-soft text-jade">Current</span>
                  )}
                </div>
                <p className="text-xs text-ink-mute mt-0.5">{s.location} · {s.lastActive}</p>
              </div>
              {!s.current && (
                <button
                  type="button"
                  onClick={() => signOutSession(s.id)}
                  className="text-xs font-semibold text-ink-mute hover:text-danger transition-colors shrink-0"
                >
                  Sign out
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="border border-danger/30 rounded-xl p-5 bg-danger/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="size-5 text-danger shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-danger">Danger zone</h3>
            <p className="text-xs text-ink-mute mt-1 mb-3">
              Permanently delete your host account and all listings. This cannot be undone.
            </p>
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              className="px-4 py-2 rounded-xl border border-danger text-danger text-sm font-semibold hover:bg-danger hover:text-white transition-colors"
            >
              Delete account
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
      {showDelete && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setShowDelete(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <motion.div
            className="relative bg-surface rounded-2xl border border-rule shadow-xl w-full max-w-md p-6"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-danger">Delete account</h3>
              <button type="button" onClick={() => setShowDelete(false)} className="size-7 flex items-center justify-center rounded-lg text-ink-mute hover:bg-surface-alt">
                <X className="size-4" />
              </button>
            </div>
            <p className="text-sm text-ink-mute mb-4">
              This will permanently delete your account and all your listings. Type <strong className="text-ink">DELETE</strong> to confirm.
            </p>
            <input
              type="text"
              placeholder="Type DELETE"
              value={deleteConf}
              onChange={(e) => setDeleteConf(e.target.value)}
              className="w-full h-10 px-3 text-sm border border-rule rounded-xl bg-surface focus:outline-none focus:ring-1 focus:ring-danger mb-4"
            />
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowDelete(false)} className="flex-1 h-10 rounded-xl border border-rule text-sm font-semibold text-ink-soft hover:bg-surface-alt transition-colors">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteConf !== 'DELETE'}
                className="flex-1 h-10 rounded-xl bg-danger text-white text-sm font-semibold hover:bg-danger/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Delete permanently
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Personal info');

  const { data: meData } = useQuery({
    queryKey: ['host-me'],
    queryFn: () => api.get('/host/me/'),
  });

  const displayName = meData?.host?.displayName ?? '';
  const avatarUrl   = meData?.user?.avatarUrl ?? '';

  return (
    <div className="flex flex-col gap-6 max-w-3xl">

      {/* Header */}
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="size-14 rounded-full object-cover shrink-0" />
        ) : (
          <div className="size-14 rounded-full bg-jade-soft flex items-center justify-center text-jade text-xl font-semibold shrink-0">
            {(displayName || '?')[0].toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="font-display text-3xl font-medium text-ink">{displayName || 'Your profile'}</h1>
          {meData?.host && (
            <p className="text-sm text-ink-mute mt-0.5">
              Hosting since {meData.host.hostingSince} · {meData.host.responseRate}% response rate
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 border-b border-rule overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap min-h-[44px] ${
              activeTab === tab
                ? 'border-jade text-jade'
                : 'border-transparent text-ink-mute hover:text-ink'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'Personal info'       && <PersonalInfoTab key={meData?.user?.id} meData={meData} />}
        {activeTab === 'Hosting preferences' && <HostingPrefsTab />}
        {activeTab === 'Notifications'       && <NotificationsTab />}
        {activeTab === 'Security'            && <SecurityTab />}
      </div>
    </div>
  );
}
