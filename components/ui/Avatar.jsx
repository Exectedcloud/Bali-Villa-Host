'use client';

import { useState } from 'react';

/**
 * @param {{ name?: string, src?: string, size?: number, className?: string }} props
 */
export default function Avatar({ name, src, size = 40, className = '' }) {
  const [imgFailed, setImgFailed] = useState(false);

  const initials = (name || '?')
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

  const dim = { width: size, height: size };
  const fontSize = Math.round(size * 0.4);

  if (src && src.trim() && !imgFailed) {
    return (
      <img
        src={src}
        alt={name || ''}
        style={dim}
        className={`rounded-full object-cover shrink-0 ${className}`}
        onError={() => setImgFailed(true)}
      />
    );
  }

  return (
    <div
      style={{ ...dim, fontSize }}
      className={`rounded-full bg-jade-soft text-jade-deep font-semibold flex items-center justify-center shrink-0 select-none ${className}`}
    >
      {initials}
    </div>
  );
}
