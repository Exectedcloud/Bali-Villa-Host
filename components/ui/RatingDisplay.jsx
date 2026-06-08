import { cn } from '@/lib/utils';

/**
 * @param {{
 *   rating: number,
 *   reviewCount?: number,
 *   size?: 'sm' | 'md',
 *   showCount?: boolean,
 *   className?: string
 * }} props
 */
export function RatingDisplay({ rating, reviewCount, size = 'md', showCount = true, className }) {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <span className={cn('text-gold leading-none', textSize)}>★</span>
      <span className={cn('font-medium text-ink', textSize)}>
        {rating.toFixed(1)}
      </span>
      {showCount && reviewCount != null && (
        <span className={cn('text-ink-mute', textSize)}>
          ({reviewCount} reviews)
        </span>
      )}
    </div>
  );
}
