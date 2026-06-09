'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

const MotionLink = motion(Link);

const CHECKS = [
  'Free to list, no commitment',
  'First booking in under 1 week',
  'WeChat Pay & Alipay built in',
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const child = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export function HeroSection() {
  return (
    <div className="relative min-h-[480px] sm:min-h-[580px] lg:min-h-[680px] rounded-2xl overflow-hidden flex items-end">
      {/* Ken-burns background */}
      <div className="absolute inset-0">
        <img
          src="/landing.jpg"
          alt=""
          aria-hidden="true"
          className="kenburns w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-ink/85 via-ink/40 to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-2xl px-6 pb-10 sm:px-10 sm:pb-14 lg:pb-18"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h1
          variants={child}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-[1.05] mb-4 sm:mb-6"
        >
          List your Bali villa.{' '}
          <span className="text-jade-soft">Reach Chinese guests.</span>
        </motion.h1>

        <motion.p variants={child} className="text-base sm:text-lg text-white/80 leading-relaxed mb-8 max-w-lg">
          Automatic translation. WeChat Pay &amp; Alipay. No language barrier. Keep 88% of every
          booking — just 12% commission.
        </motion.p>

        <motion.div variants={child} className="flex flex-col sm:flex-row gap-3 mb-10">
          <MotionLink
            href="/signup"
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.08, ease: 'linear' }}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-jade text-white font-semibold text-sm hover:bg-jade-deep transition-colors"
          >
            List your villa
            <ArrowRight className="size-4" />
          </MotionLink>
          <MotionLink
            href="/login"
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.08, ease: 'linear' }}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/30 text-white font-medium text-sm hover:bg-white/10 transition-colors"
          >
            Already a host? Log in
          </MotionLink>
        </motion.div>

        <motion.div variants={child} className="flex flex-wrap gap-5">
          {CHECKS.map((text) => (
            <span key={text} className="flex items-center gap-1.5 text-sm text-white/80">
              <CheckCircle className="size-4 text-jade-soft shrink-0" />
              {text}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
