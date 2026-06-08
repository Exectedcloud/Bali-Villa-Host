'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { api, ApiError } from '@/lib/api-client';

const COUNTRY_CODES = [
  { code: '+62', country: 'ID', flag: '🇮🇩' },
  { code: '+1',  country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'GB', flag: '🇬🇧' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
  { code: '+60', country: 'MY', flag: '🇲🇾' },
];

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+62');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!termsAccepted) errs.terms = 'You must accept the terms to continue';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await api.post('/host/signup/', {
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone ? `${countryCode}${form.phone}` : '',
      });
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        // Email is already a host account — send them to log in
        setErrors({ email: 'This email is already registered as a host. Please log in instead.' });
      } else if (err instanceof ApiError && err.status === 400) {
        const data = err.data || {};
        const mapped = {};
        if (data.email) mapped.email = Array.isArray(data.email) ? data.email[0] : data.email;
        if (data.phone) mapped.phone = Array.isArray(data.phone) ? data.phone[0] : data.phone;
        if (data.password) mapped.password = Array.isArray(data.password) ? data.password[0] : data.password;
        if (Object.keys(mapped).length) { setErrors(mapped); } else { toast.error('Sign up failed. Please check your details.'); }
      } else {
        toast.error('Sign up failed. Please try again.');
      }
      setLoading(false);
    }
  }

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  if (submitted) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="flex items-center gap-2.5 mb-8">
          <Image src="/BaliVillalogo.png" alt="BaliVilla" width={160} height={40} className="h-10 w-auto" priority />
          <span className="text-sm font-medium text-ink-mute">for Hosts</span>
        </Link>
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-5">📬</div>
          <h1 className="font-display text-2xl font-medium text-ink mb-2">Check your email</h1>
          <p className="text-sm text-ink-mute mb-6">Verify your address to activate your host account</p>
          <div className="bg-surface rounded-2xl border border-rule shadow-md p-6 text-left space-y-3 mb-6">
            <p className="text-sm text-ink-soft leading-relaxed">
              We sent a verification link to{' '}
              <span className="font-semibold text-ink">{form.email}</span>.
            </p>
            <p className="text-xs text-ink-mute leading-relaxed">
              Click the link in that email to verify your account, then come back here to log in as a host.
            </p>
          </div>
          <Link
            href="/login"
            className="text-jade text-sm font-medium hover:text-jade-deep underline underline-offset-2 transition-colors"
          >
            Back to log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <Image src="/BaliVillalogo.png" alt="BaliVilla" width={160} height={40} className="h-10 w-auto" priority />
        <span className="text-sm font-medium text-ink-mute">for Hosts</span>
      </Link>

      <div className="w-full max-w-sm bg-surface rounded-2xl border border-rule shadow-md p-8">
        <h1 className="font-display text-2xl font-medium text-ink mb-1">Become a host</h1>
        <p className="text-sm text-ink-mute mb-7">Create your free host account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-ink-soft" htmlFor="firstName">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                required
                autoComplete="given-name"
                placeholder="Made"
                {...field('firstName')}
                className="h-11 px-3.5 rounded-lg border border-rule bg-paper text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-jade/40 focus:border-jade transition-colors"
              />
              {errors.firstName && <p className="text-xs text-danger">{errors.firstName}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-ink-soft" htmlFor="lastName">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                required
                autoComplete="family-name"
                placeholder="Wijaya"
                {...field('lastName')}
                className="h-11 px-3.5 rounded-lg border border-rule bg-paper text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-jade/40 focus:border-jade transition-colors"
              />
              {errors.lastName && <p className="text-xs text-danger">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-soft" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              {...field('email')}
              className="h-11 px-3.5 rounded-lg border border-rule bg-paper text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-jade/40 focus:border-jade transition-colors"
            />
            {errors.email && <p className="text-xs text-danger">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-soft" htmlFor="phone">
              Phone number <span className="text-ink-mute font-normal">(optional)</span>
            </label>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="h-11 pl-3 pr-7 rounded-lg border border-rule bg-paper text-sm text-ink appearance-none focus:outline-none focus:ring-2 focus:ring-jade/40 focus:border-jade transition-colors cursor-pointer"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-ink-mute pointer-events-none" />
              </div>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="812 3456 7890"
                {...field('phone')}
                className="flex-1 h-11 px-3.5 rounded-lg border border-rule bg-paper text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-jade/40 focus:border-jade transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-soft" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                {...field('password')}
                className="h-11 w-full px-3.5 pr-11 rounded-lg border border-rule bg-paper text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-jade/40 focus:border-jade transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-mute hover:text-ink transition-colors"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-danger">{errors.password}</p>}
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-soft" htmlFor="confirmPassword">
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="Repeat password"
                {...field('confirmPassword')}
                className="h-11 w-full px-3.5 pr-11 rounded-lg border border-rule bg-paper text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-jade/40 focus:border-jade transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-mute hover:text-ink transition-colors"
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-danger">{errors.confirmPassword}</p>}
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 size-4 rounded accent-jade"
            />
            <span className="text-xs text-ink-soft leading-relaxed">
              I agree to the{' '}
              <Link href="/terms" className="text-jade hover:text-jade-deep underline underline-offset-2">
                Host Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-jade hover:text-jade-deep underline underline-offset-2">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.terms && <p className="text-xs text-danger -mt-2">{errors.terms}</p>}

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={!loading ? { scale: 0.97 } : {}}
            transition={{ duration: 0.08, ease: 'linear' }}
            className="mt-1 h-11 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep disabled:opacity-60 transition-colors"
          >
            {loading ? 'Creating account…' : 'Become a host'}
          </motion.button>
        </form>

        <p className="text-center text-xs text-ink-mute mt-6">
          Already a host?{' '}
          <Link href="/login" className="text-jade hover:text-jade-deep font-medium transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
