'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import {
  Camera, Video, X, ChevronDown, ChevronUp, Sparkles,
  Wifi, Tv, UtensilsCrossed, Wind, Car, Thermometer, Laptop, Waves,
  Droplets, Sun, Flame, Music, Dumbbell, Bell, HeartPulse,
  AlertTriangle, AlertCircle, Accessibility, DoorOpen,
} from 'lucide-react';

const HIGHLIGHTS = ['Peaceful', 'Unique', 'Family-friendly', 'Stylish', 'Central', 'Spacious'];

const AMENITY_GROUPS = [
  {
    id: 'popular',
    label: 'Popular',
    items: [
      { id: 'wifi',      label: 'Wifi',             icon: Wifi },
      { id: 'tv',        label: 'TV',               icon: Tv },
      { id: 'kitchen',   label: 'Kitchen',          icon: UtensilsCrossed },
      { id: 'washer',    label: 'Washing machine',  icon: Wind },
      { id: 'parking',   label: 'Free parking',     icon: Car },
      { id: 'ac',        label: 'Air conditioning', icon: Thermometer },
      { id: 'workspace', label: 'Workspace',        icon: Laptop },
      { id: 'pool',      label: 'Pool',             icon: Waves },
    ],
  },
  {
    id: 'standout',
    label: 'Standout',
    items: [
      { id: 'hot_tub',        label: 'Hot tub',          icon: Droplets },
      { id: 'patio',          label: 'Patio',            icon: Sun },
      { id: 'bbq',            label: 'BBQ grill',        icon: Flame },
      { id: 'outdoor_dining', label: 'Outdoor dining',   icon: UtensilsCrossed },
      { id: 'firepit',        label: 'Fire pit',         icon: Flame },
      { id: 'pool_table',     label: 'Pool table',       icon: Dumbbell },
      { id: 'fireplace',      label: 'Indoor fireplace', icon: Flame },
      { id: 'piano',          label: 'Piano',            icon: Music },
      { id: 'gym',            label: 'Gym',              icon: Dumbbell },
      { id: 'beach_access',   label: 'Beach access',     icon: Waves },
    ],
  },
  {
    id: 'safety',
    label: 'Safety',
    items: [
      { id: 'smoke_alarm',       label: 'Smoke alarm',       icon: Bell },
      { id: 'first_aid',         label: 'First aid kit',     icon: HeartPulse },
      { id: 'fire_extinguisher', label: 'Fire extinguisher', icon: AlertTriangle },
      { id: 'co_alarm',          label: 'CO alarm',          icon: AlertCircle },
    ],
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    items: [
      { id: 'step_free',    label: 'Step-free access', icon: Accessibility },
      { id: 'wide_doors',   label: 'Wide doorways',    icon: DoorOpen },
      { id: 'grab_bars',    label: 'Grab bars',        icon: Accessibility },
      { id: 'roll_shower',  label: 'Roll-in shower',   icon: Droplets },
    ],
  },
];

export function Step2Form({ data, patch, showErrors }) {
  const [openGroups, setOpenGroups] = useState({ popular: true, standout: false, safety: false, accessibility: false });
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  function toggleGroup(id) {
    setOpenGroups((g) => ({ ...g, [id]: !g[id] }));
  }

  function toggleHighlight(h) {
    const has = data.highlights.includes(h);
    if (has) {
      patch({ highlights: data.highlights.filter((x) => x !== h) });
    } else if (data.highlights.length < 2) {
      patch({ highlights: [...data.highlights, h] });
    }
  }

  function toggleAmenity(id) {
    const has = data.amenities.includes(id);
    patch({ amenities: has ? data.amenities.filter((x) => x !== id) : [...data.amenities, id] });
  }

  function handleVideoSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    patch({ videoFile: file, videoUrl: URL.createObjectURL(file) });
  }

  function removeVideo() {
    if (data.videoUrl) URL.revokeObjectURL(data.videoUrl);
    patch({ videoFile: null, videoUrl: '' });
    if (videoInputRef.current) videoInputRef.current.value = '';
  }

  function handlePhotoFiles(files) {
    if (!files?.length) return;
    const newFiles = Array.from(files).map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
    patch({ photos: [...(data.photos ?? []), ...newFiles] });
    if (photoInputRef.current) photoInputRef.current.value = '';
  }

  function removePhoto(idx) {
    const updated = [...(data.photos ?? [])];
    URL.revokeObjectURL(updated[idx].preview);
    updated.splice(idx, 1);
    patch({ photos: updated });
  }

  function handleAiGenerate() {
    toast.info('AI assistance coming soon');
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Photos */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">Photos</h2>
            <p className="text-xs text-ink-mute mt-0.5">At least 1 photo required · JPG or PNG · Max 10 MB each</p>
          </div>
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rule text-sm font-medium text-ink-soft hover:bg-surface-alt hover:text-ink transition-colors"
          >
            <Camera className="size-4" />
            Add photos
          </button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png"
            multiple
            className="hidden"
            onChange={(e) => handlePhotoFiles(e.target.files)}
          />
        </div>

        {!data.photos?.length ? (
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center gap-3 hover:border-jade/50 hover:bg-jade-soft/30 transition-colors w-full ${showErrors ? 'border-danger' : 'border-rule'}`}
          >
            <div className="size-12 rounded-full bg-jade-soft flex items-center justify-center">
              <Camera className="size-6 text-jade" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-ink">Upload villa photos</p>
              <p className="text-xs text-ink-mute mt-1">JPG or PNG · Max 10 MB per photo</p>
            </div>
          </button>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {data.photos.map((p, idx) => (
              <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-rule group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.preview} alt="" className="w-full h-full object-cover" />
                {idx === 0 && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-jade text-white text-[10px] font-semibold uppercase tracking-wide">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute top-2 right-2 size-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        {showErrors && !data.photos?.length && (
          <p className="text-xs text-danger">At least 1 photo is required</p>
        )}
      </section>

      {/* Video upload */}
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-ink">Video tour</h2>

        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/quicktime"
          className="hidden"
          onChange={handleVideoSelect}
        />

        {!data.videoUrl ? (
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="border-2 border-dashed border-rule rounded-2xl p-12 flex flex-col items-center gap-3 hover:border-jade/50 hover:bg-jade-soft/30 transition-colors w-full"
          >
            <div className="size-12 rounded-full bg-jade-soft flex items-center justify-center">
              <Video className="size-6 text-jade" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-ink">Upload a video tour of your villa</p>
              <p className="text-xs text-ink-mute mt-1">MP4 or MOV · Up to 500 MB</p>
            </div>
          </button>
        ) : (
          <div className="relative rounded-2xl overflow-hidden border border-rule bg-surface-alt">
            <video
              src={data.videoUrl}
              controls
              className="w-full max-h-72 object-contain bg-black"
            />
            <button
              type="button"
              onClick={removeVideo}
              className="absolute top-3 right-3 size-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="size-4 text-white" />
            </button>
          </div>
        )}
      </section>

      {/* Title */}
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-ink">Listing title</h2>
        <div className="relative">
          <input
            type="text"
            maxLength={50}
            value={data.title}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="e.g. Peaceful jungle villa with private pool"
            className={`h-11 w-full px-3.5 pr-14 rounded-lg border bg-paper text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 transition-colors ${showErrors && !data.title.trim() ? 'border-danger focus:ring-danger/40 focus:border-danger' : 'border-rule focus:ring-jade/40 focus:border-jade'}`}
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-ink-mute tabular-nums">
            {data.title.length}/50
          </span>
        </div>
        {showErrors && !data.title.trim() && (
          <p className="text-xs text-danger">Listing title is required</p>
        )}
      </section>

      {/* Highlights */}
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink">Highlights</h2>
          <p className="text-xs text-ink-mute mt-0.5">Pick up to 2 that best describe your property</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {HIGHLIGHTS.map((h) => {
            const selected = data.highlights.includes(h);
            const maxed = !selected && data.highlights.length >= 2;
            return (
              <button
                key={h}
                type="button"
                onClick={() => toggleHighlight(h)}
                disabled={maxed}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors disabled:opacity-40 disabled:pointer-events-none ${
                  selected
                    ? 'bg-jade border-jade text-white'
                    : 'bg-surface border-rule text-ink hover:border-jade/60'
                }`}
              >
                {h}
              </button>
            );
          })}
        </div>
      </section>

      {/* Description */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink">Description</h2>
          <button
            type="button"
            onClick={handleAiGenerate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-jade-soft text-jade text-xs font-medium hover:bg-jade hover:text-white transition-colors"
          >
            <Sparkles className="size-3.5" />
            Generate from photos
          </button>
        </div>
        <textarea
          value={data.description}
          onChange={(e) => patch({ description: e.target.value })}
          rows={6}
          placeholder="Describe your villa — what makes it special, the surroundings, nearby attractions…"
          className={`px-3.5 py-3 rounded-lg border bg-paper text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 transition-colors resize-none leading-relaxed ${showErrors && !data.description.trim() ? 'border-danger focus:ring-danger/40 focus:border-danger' : 'border-rule focus:ring-jade/40 focus:border-jade'}`}
        />
        {showErrors && !data.description.trim() && (
          <p className="text-xs text-danger">Description is required</p>
        )}
      </section>

      {/* Amenities */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold text-ink">Amenities</h2>
          {showErrors && data.amenities.length < 3 && (
            <p className="text-xs text-danger mt-0.5">Select at least 3 amenities — {data.amenities.length} selected</p>
          )}
        </div>
        <div className="flex flex-col divide-y divide-rule border border-rule rounded-xl overflow-hidden">
          {AMENITY_GROUPS.map((group) => (
            <div key={group.id}>
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between px-5 py-4 bg-surface hover:bg-surface-alt transition-colors"
              >
                <span className="text-sm font-semibold text-ink">{group.label}</span>
                {openGroups[group.id]
                  ? <ChevronUp className="size-4 text-ink-mute" />
                  : <ChevronDown className="size-4 text-ink-mute" />
                }
              </button>
              {openGroups[group.id] && (
                <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-paper">
                  {group.items.map(({ id, label, icon: Icon }) => (
                    <label key={id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={data.amenities.includes(id)}
                        onChange={() => toggleAmenity(id)}
                        className="size-4 rounded accent-jade shrink-0"
                      />
                      <Icon className="size-4 text-ink-mute group-hover:text-ink shrink-0 transition-colors" />
                      <span className="text-sm text-ink-soft group-hover:text-ink transition-colors">{label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
