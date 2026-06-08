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
    <motion.div className="max-w-2xl" variants={container} initial="hidden" animate="show">
      <motion.h1
        variants={child}
        className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-ink leading-[1.05] mb-4 sm:mb-6"
      >
        List your Bali villa.{' '}
        <span className="text-jade">Reach Chinese guests.</span>
      </motion.h1>

      <motion.p variants={child} className="text-lg text-ink-soft leading-relaxed mb-8 max-w-lg">
        Automatic translation. WeChat Pay &amp; Alipay. No language barrier. Keep 88% of every
        booking — just 12% commission.
      </motion.p>

      <motion.div variants={child} className="flex flex-col sm:flex-row gap-3 mb-12">
        <MotionLink
          href="/signup"
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.08, ease: 'linear' }}
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-jade text-white font-semibold text-sm hover:bg-jade-deep transition-colors"
        >
          List your villa
          <ArrowRight className="size-4" />
        </MotionLink>
      </motion.div>

      <motion.div variants={child} className="flex flex-wrap gap-5">
        {CHECKS.map((text) => (
          <span key={text} className="flex items-center gap-1.5 text-sm text-ink-mute">
            <CheckCircle className="size-4 text-jade shrink-0" />
            {text}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
