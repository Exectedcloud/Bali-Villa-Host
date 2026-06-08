'use client';

import { Home, Building2, Tent, Hotel, MoreHorizontal, Plus, Minus, ChevronDown } from 'lucide-react';

const PROPERTY_TYPES = [
  { value: 'villa', label: 'Villa', icon: Home },
  { value: 'vacation_home', label: 'Vacation home', icon: Building2 },
  { value: 'guest_house', label: 'Guest house', icon: Tent },
  { value: 'hotel', label: 'Hotel', icon: Hotel },
  { value: 'other', label: 'Other', icon: MoreHorizontal },
];

const COUNTRY_CODES = [
  { code: '+62', flag: '🇮🇩' },
  { code: '+1',  flag: '🇺🇸' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+61', flag: '🇦🇺' },
  { code: '+65', flag: '🇸🇬' },
  { code: '+60', flag: '🇲🇾' },
];

const CAPACITY_FIELDS = [
  { key: 'guests',    label: 'Guests',    min: 1, max: 50 },
  { key: 'bedrooms',  label: 'Bedrooms',  min: 0, max: 30 },
  { key: 'beds',      label: 'Beds',      min: 1, max: 50 },
  { key: 'bathrooms', label: 'Bathrooms', min: 1, max: 20 },
];

const inputCls = 'h-11 px-3.5 rounded-lg border border-rule bg-paper text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-jade/40 focus:border-jade transition-colors w-full';

export function Step1Form({ data, patch, showErrors }) {
  function stepper(key, delta) {
    const field = CAPACITY_FIELDS.find((f) => f.key === key);
    patch({ [key]: Math.min(field.max, Math.max(field.min, data[key] + delta)) });
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Property type */}
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-ink">Property type</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {PROPERTY_TYPES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => patch({ propertyType: value })}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                data.propertyType === value
                  ? 'border-jade bg-jade-soft text-jade'
                  : 'border-rule bg-surface text-ink-mute hover:border-jade/40 hover:text-ink'
              }`}
            >
              <Icon className="size-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Property name */}
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-ink">Property name</h2>
        <div className="relative">
          <input
            type="text"
            maxLength={50}
            value={data.propertyName}
            onChange={(e) => patch({ propertyName: e.target.value })}
            placeholder="e.g. Villa Tirtha — Ubud Sunrise Retreat"
            className={`${inputCls} pr-14 ${showErrors && !data.propertyName.trim() ? 'border-danger focus:ring-danger/40 focus:border-danger' : ''}`}
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-ink-mute tabular-nums">
            {data.propertyName.length}/50
          </span>
        </div>
        {showErrors && !data.propertyName.trim() && (
          <p className="text-xs text-danger">Property name is required</p>
        )}
      </section>

      {/* Location */}
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-ink">Location</h2>
        <input
          type="text"
          value={data.address}
          onChange={(e) => patch({ address: e.target.value })}
          placeholder="Use Mapbox autocomplete — e.g. Jl. Raya Ubud No. 12"
          className={`${inputCls} ${showErrors && !data.address.trim() ? 'border-danger focus:ring-danger/40 focus:border-danger' : ''}`}
        />
        {showErrors && !data.address.trim() && (
          <p className="text-xs text-danger">Address is required</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={data.country}
            onChange={(e) => patch({ country: e.target.value })}
            placeholder="Country"
            className={inputCls}
          />
          <input
            type="text"
            value={data.region}
            onChange={(e) => patch({ region: e.target.value })}
            placeholder="Province / Region"
            className={inputCls}
          />
          <input
            type="text"
            value={data.city}
            onChange={(e) => patch({ city: e.target.value })}
            placeholder="City / District"
            className={inputCls}
          />
        </div>
      </section>

      {/* Contact */}
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-ink">Contact details</h2>
        <div className="flex gap-2">
          <div className="relative shrink-0">
            <select
              value={data.countryCode}
              onChange={(e) => patch({ countryCode: e.target.value })}
              className="h-11 pl-3 pr-8 rounded-lg border border-rule bg-paper text-sm text-ink appearance-none focus:outline-none focus:ring-2 focus:ring-jade/40 focus:border-jade transition-colors cursor-pointer"
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-ink-mute pointer-events-none" />
          </div>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => patch({ phone: e.target.value })}
            placeholder="812 3456 7890"
            className="flex-1 h-11 px-3.5 rounded-lg border border-rule bg-paper text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-jade/40 focus:border-jade transition-colors"
          />
        </div>
        <input
          type="email"
          value={data.email}
          onChange={(e) => patch({ email: e.target.value })}
          placeholder="villa@example.com"
          className={inputCls}
        />
      </section>

      {/* Capacity */}
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-ink">Capacity</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CAPACITY_FIELDS.map(({ key, label, min, max }) => (
            <div key={key} className="bg-surface rounded-xl border border-rule p-5 flex flex-col items-center gap-3">
              <span className="text-xs font-medium text-ink-mute">{label}</span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => stepper(key, -1)}
                  disabled={data[key] <= min}
                  className="size-8 rounded-full border border-rule flex items-center justify-center text-ink-mute hover:border-jade hover:text-jade disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="font-mono text-xl font-semibold text-ink w-6 text-center tabular-nums">
                  {data[key]}
                </span>
                <button
                  type="button"
                  onClick={() => stepper(key, 1)}
                  disabled={data[key] >= max}
                  className="size-8 rounded-full border border-rule flex items-center justify-center text-ink-mute hover:border-jade hover:text-jade disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
