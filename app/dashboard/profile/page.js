'use client';

import { useState, useRef } from 'react';
import { Camera, X, Check, Shield, Smartphone, Globe, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { api } from '@/lib/api-client';

const TAB_KEYS = ['personalInfo', 'hostingPrefs', 'notifications', 'security'];

const ALL_LANGUAGES = ['English', 'Indonesian', 'Mandarin Chinese', 'Japanese', 'Korean', 'French', 'German', 'Spanish', 'Russian', 'Arabic'];

const NOTIF_EVENT_KEYS = [
  'new_booking', 'booking_request', 'new_message',
  'review_received', 'payout_sent', 'price_suggestion', 'security_alert',
];

const SESSIONS = [
  { id: 1, device: 'Chrome on macOS',   location: 'Jakarta, Indonesia', lastActive: '2 minutes ago', current: true  },
  { id: 2, device: 'Safari on iPhone',  location: 'Ubud, Bali',         lastActive: '3 hours ago',   current: false },
  { id: 3, device: 'Chrome on Windows', location: 'Denpasar, Bali',     lastActive: '2 days ago',    current: false },
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
  const t = useTranslations('common');
  return (
    <div className="flex justify-end pt-2">
      <button type="button" onClick={onSave} className="px-5 py-2 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep transition-colors">
        {t('save')}
      </button>
    </div>
  );
}

function PersonalInfoTab({ meData }) {
  const t = useTranslations('profile');
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
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-mute block mb-2">{t('personal.profilePhoto')}</label>
        <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        <div className="flex items-center gap-4">
          <div className="relative group">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name || 'Profile'} className="size-20 rounded-full object-cover" />
            ) : (
              <div className="size-20 rounded-full bg-jade-soft flex items-center justify-center text-jade text-2xl font-semibold">
                {(name || '?')[0].toUpperCase()}
              </div>
            )}
            <button type="button" onClick={() => avatarInputRef.current?.click()} className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="size-5 text-white" />
            </button>
          </div>
          <div className="text-xs text-ink-mute leading-relaxed">
            <p className="font-medium text-ink mb-0.5">{t('personal.uploadPhoto')}</p>
            <p>{t('personal.photoHint')}</p>
            <button type="button" onClick={() => avatarInputRef.current?.click()} className="text-jade font-medium mt-1 hover:text-jade-deep transition-colors">
              {t('personal.chooseFile')}
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-mute block mb-1.5">
          {t('personal.displayName')} <span className="text-ink-mute/60 font-normal normal-case">{t('personal.visibleToGuests')}</span>
        </label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 px-3 text-sm border border-rule rounded-xl bg-surface focus:outline-none focus:ring-1 focus:ring-jade" />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-mute block mb-1.5">{t('personal.bio')}</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full px-3 py-2.5 text-sm border border-rule rounded-xl bg-surface focus:outline-none focus:ring-1 focus:ring-jade resize-none leading-relaxed" />
        <p className="text-[11px] text-ink-mute mt-1">{t('personal.charCount', { count: bio.length })}</p>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-mute block mb-2">{t('personal.languagesSpoken')}</label>
        <div className="flex flex-wrap gap-2">
          {ALL_LANGUAGES.map((lang) => {
            const selected = langs.includes(lang);
            return (
              <button key={lang} type="button" onClick={() => toggleLang(lang)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selected ? 'bg-jade text-white border-jade' : 'bg-surface text-ink-soft border-rule hover:border-jade/40 hover:text-ink'}`}>
                {selected && <Check className="size-3" />}
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-mute block mb-1.5">
            {t('personal.email')} <span className="text-ink-mute/60 font-normal normal-case">{t('personal.readOnly')}</span>
          </label>
          <input type="email" value={email} readOnly className="w-full h-10 px-3 text-sm border border-rule rounded-xl bg-surface-alt text-ink-mute cursor-default" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-mute block mb-1.5">{t('personal.phone')}</label>
          <div className="flex gap-2">
            <select className="h-10 px-2 text-sm border border-rule rounded-xl bg-surface focus:outline-none focus:ring-1 focus:ring-jade w-20 shrink-0">
              <option>+62</option><option>+1</option><option>+44</option><option>+86</option>
            </select>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1 h-10 px-3 text-sm border border-rule rounded-xl bg-surface focus:outline-none focus:ring-1 focus:ring-jade" />
          </div>
        </div>
      </div>

      <SaveBar onSave={() => toast.success(t('personal.savedToast'))} />
    </div>
  );
}

function HostingPrefsTab() {
  const t = useTranslations('profile');
  const [autoReply, setAutoReply] = useState(true);
  const [replyMsg,  setReplyMsg]  = useState('Thank you for your enquiry! I will get back to you within a few hours with full details about availability and pricing.');
  const [respGoal,  setRespGoal]  = useState('12h');
  const [available, setAvailable] = useState(true);

  const RESPONSE_OPTIONS = [
    { key: '1h',  label: t('prefs.options.1h') },
    { key: '12h', label: t('prefs.options.12h') },
    { key: '24h', label: t('prefs.options.24h') },
    { key: '48h', label: t('prefs.options.48h') },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface-alt/60 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-ink">{t('prefs.autoReply')}</p>
            <p className="text-xs text-ink-mute mt-0.5">{t('prefs.autoReplyDesc')}</p>
          </div>
          <Toggle checked={autoReply} onChange={setAutoReply} />
        </div>
        {autoReply && (
          <textarea value={replyMsg} onChange={(e) => setReplyMsg(e.target.value)} rows={3} className="w-full px-3 py-2.5 text-sm border border-rule rounded-xl bg-surface focus:outline-none focus:ring-1 focus:ring-jade resize-none leading-relaxed" />
        )}
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-mute block mb-1.5">{t('prefs.responseTimeGoal')}</label>
        <select value={respGoal} onChange={(e) => setRespGoal(e.target.value)} className="h-10 px-3 text-sm border border-rule rounded-xl bg-surface focus:outline-none focus:ring-1 focus:ring-jade w-full sm:w-64 appearance-none">
          {RESPONSE_OPTIONS.map(({ key, label }) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <p className="text-xs text-ink-mute mt-1.5">{t('prefs.responseTimeHint')}</p>
      </div>

      <div className="flex items-start justify-between gap-4 p-4 bg-surface-alt/60 rounded-xl">
        <div>
          <p className="text-sm font-semibold text-ink">{t('prefs.available')}</p>
          <p className="text-xs text-ink-mute mt-0.5">
            {available ? t('prefs.acceptingDesc') : t('prefs.fullyBookedDesc')}
          </p>
        </div>
        <Toggle checked={available} onChange={setAvailable} />
      </div>

      <SaveBar onSave={() => toast.success(t('prefs.savedToast'))} />
    </div>
  );
}

function NotificationsTab() {
  const t = useTranslations('profile');
  const [settings, setSettings] = useState(
    Object.fromEntries(
      NOTIF_EVENT_KEYS.map((key) => [
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
      <p className="text-sm text-ink-mute">{t('notif.header')}</p>
      <div className="bg-surface rounded-xl border border-rule overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule bg-surface-alt/50">
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-mute">Event</th>
              {['email', 'sms', 'inapp'].map((ch) => (
                <th key={ch} className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-mute w-20">
                  {t(`notif.${ch}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NOTIF_EVENT_KEYS.map((key) => (
              <tr key={key} className="border-b border-rule last:border-0 hover:bg-surface-alt/40 transition-colors">
                <td className="px-5 py-3 text-sm font-medium text-ink">{t(`notif.events.${key}`)}</td>
                {(['email', 'sms', 'inapp']).map((ch) => (
                  <td key={ch} className="px-4 py-3 text-center">
                    <input type="checkbox" checked={settings[key][ch]} onChange={() => toggle(key, ch)} className="size-4 rounded border-rule accent-jade cursor-pointer" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SaveBar onSave={() => toast.success(t('notif.savedToast'))} />
    </div>
  );
}

function SecurityTab() {
  const t = useTranslations('profile');
  const [twoFA,      setTwoFA]      = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConf, setDeleteConf] = useState('');
  const [sessions,   setSessions]   = useState(SESSIONS);

  function signOutSession(id) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    toast.success(t('security.sessionSignedOutToast'));
  }

  function handleDelete() {
    if (deleteConf !== 'DELETE') { toast.error(t('security.modal.typeError')); return; }
    toast.error(t('security.modal.submittedToast'));
    setShowDelete(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface-alt/60 rounded-xl p-5 flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-ink">{t('security.changePassword')}</h3>
        {[
          { key: 'currentPassword', id: 'curr' },
          { key: 'newPassword',     id: 'new'  },
          { key: 'confirmNew',      id: 'conf' },
        ].map(({ key, id }) => (
          <div key={id}>
            <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-ink-mute block mb-1.5">{t(`security.${key}`)}</label>
            <input id={id} type="password" className="w-full h-10 px-3 text-sm border border-rule rounded-xl bg-surface focus:outline-none focus:ring-1 focus:ring-jade" />
          </div>
        ))}
        <button type="button" onClick={() => toast.success(t('security.passwordUpdatedToast'))} className="self-start px-5 py-2 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep transition-colors">
          {t('security.updatePassword')}
        </button>
      </div>

      <div className="flex items-start justify-between gap-4 p-5 bg-surface-alt/60 rounded-xl">
        <div className="flex gap-3">
          <Shield className={`size-5 mt-0.5 shrink-0 ${twoFA ? 'text-jade' : 'text-ink-mute'}`} />
          <div>
            <p className="text-sm font-semibold text-ink">{t('security.twoFA')}</p>
            <p className="text-xs text-ink-mute mt-0.5">
              {twoFA ? t('security.twoFAEnabled') : t('security.twoFADisabled')}
            </p>
          </div>
        </div>
        <Toggle checked={twoFA} onChange={(v) => { setTwoFA(v); toast.success(v ? t('security.twoFAEnabledToast') : t('security.twoFADisabledToast')); }} />
      </div>

      <div className="bg-surface rounded-xl border border-rule overflow-hidden">
        <div className="px-5 py-4 border-b border-rule flex items-center gap-2">
          <Smartphone className="size-4 text-ink-mute" />
          <h3 className="text-sm font-semibold text-ink">{t('security.activeSessions')}</h3>
        </div>
        <div className="divide-y divide-rule">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-5 py-3.5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-ink">{s.device}</p>
                  {s.current && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-jade-soft text-jade">{t('security.current')}</span>
                  )}
                </div>
                <p className="text-xs text-ink-mute mt-0.5">{s.location} · {s.lastActive}</p>
              </div>
              {!s.current && (
                <button type="button" onClick={() => signOutSession(s.id)} className="text-xs font-semibold text-ink-mute hover:text-danger transition-colors shrink-0">
                  {t('security.signOut')}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border border-danger/30 rounded-xl p-5 bg-danger/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="size-5 text-danger shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-danger">{t('security.dangerZone')}</h3>
            <p className="text-xs text-ink-mute mt-1 mb-3">{t('security.dangerZoneDesc')}</p>
            <button type="button" onClick={() => setShowDelete(true)} className="px-4 py-2 rounded-xl border border-danger text-danger text-sm font-semibold hover:bg-danger hover:text-white transition-colors">
              {t('security.deleteAccount')}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
      {showDelete && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setShowDelete(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <motion.div
            className="relative bg-surface rounded-2xl border border-rule shadow-xl w-full max-w-md p-6"
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-danger">{t('security.modal.title')}</h3>
              <button type="button" onClick={() => setShowDelete(false)} className="size-7 flex items-center justify-center rounded-lg text-ink-mute hover:bg-surface-alt">
                <X className="size-4" />
              </button>
            </div>
            <p className="text-sm text-ink-mute mb-4">
              {t('security.modal.desc')}
            </p>
            <input
              type="text"
              placeholder={t('security.modal.placeholder')}
              value={deleteConf}
              onChange={(e) => setDeleteConf(e.target.value)}
              className="w-full h-10 px-3 text-sm border border-rule rounded-xl bg-surface focus:outline-none focus:ring-1 focus:ring-danger mb-4"
            />
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowDelete(false)} className="flex-1 h-10 rounded-xl border border-rule text-sm font-semibold text-ink-soft hover:bg-surface-alt transition-colors">
                {t('security.modal.cancel')}
              </button>
              <button type="button" onClick={handleDelete} disabled={deleteConf !== 'DELETE'} className="flex-1 h-10 rounded-xl bg-danger text-white text-sm font-semibold hover:bg-danger/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                {t('security.modal.deletePermanently')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

export default function ProfilePage() {
  const t = useTranslations('profile');
  const [activeTab, setActiveTab] = useState('personalInfo');

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
          <h1 className="font-display text-3xl font-medium text-ink">{displayName || t('yourProfile')}</h1>
          {meData?.host && (
            <p className="text-sm text-ink-mute mt-0.5">
              {t('hostingSince', { year: meData.host.hostingSince, rate: meData.host.responseRate })}
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-rule overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {TAB_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap min-h-[44px] ${
              activeTab === key
                ? 'border-jade text-jade'
                : 'border-transparent text-ink-mute hover:text-ink'
            }`}
          >
            {t(`tabs.${key}`)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'personalInfo'  && <PersonalInfoTab key={meData?.user?.id} meData={meData} />}
        {activeTab === 'hostingPrefs'  && <HostingPrefsTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'security'      && <SecurityTab />}
      </div>
    </div>
  );
}
