import { cn } from '@/lib/utils';

/**
 * Host site: IDR-primary, CNY secondary.
 * @param {{
 *   idr: number,
 *   cny?: number,
 *   usd?: number,
 *   size?: 'sm' | 'md' | 'lg',
 *   perNight?: boolean,
 *   className?: string
 * }} props
 */
export function PriceDisplay({ idr, cny, usd, size = 'md', perNight = false, className }) {
  const idrFormatted = `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(idr)}`;

  const cnyFormatted = cny
    ? `≈ ¥${new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 }).format(cny)}`
    : null;

  const usdFormatted = usd
    ? `≈ $${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(usd)}`
    : null;

  const idrSize = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' }[size];
  const secondarySize = { sm: 'text-xs', md: 'text-sm', lg: 'text-sm' }[size];

  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <div className="flex items-baseline gap-1.5">
        <span className={cn('font-mono font-medium text-ink', idrSize)}>
          {idrFormatted}
        </span>
        {perNight && (
          <span className="text-xs text-ink-mute">/ night</span>
        )}
      </div>
      {(cnyFormatted || usdFormatted) && (
        <div className={cn('flex items-center gap-2 font-mono text-mist', secondarySize)}>
          {cnyFormatted && <span>{cnyFormatted}</span>}
          {cnyFormatted && usdFormatted && <span className="text-rule">·</span>}
          {usdFormatted && <span>{usdFormatted}</span>}
        </div>
      )}
    </div>
  );
}
