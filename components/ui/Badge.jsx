import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium leading-none',
  {
    variants: {
      variant: {
        gold:    'bg-[#F5EDD6] text-[#8B6914]',
        jade:    'bg-jade-soft text-jade',
        mist:    'bg-[#E8F0EE] text-mist-deep',
        green:   'bg-[#E5F2E7] text-success',
        warn:    'bg-[#FEF3E2] text-warn',
        danger:  'bg-[#FDEAEB] text-danger',
        outline: 'border border-rule text-ink-soft bg-transparent',
      },
    },
    defaultVariants: { variant: 'outline' },
  }
);

const STATUS_MAP = {
  confirmed:        { label: 'Confirmed',        variant: 'green' },
  pending_approval: { label: 'Pending Approval', variant: 'warn' },
  pending_payment:  { label: 'Pending Payment',  variant: 'warn' },
  in_house:         { label: 'In House',         variant: 'jade' },
  completed:        { label: 'Completed',        variant: 'outline' },
  cancelled:        { label: 'Cancelled',        variant: 'danger' },
  draft:            { label: 'Draft',            variant: 'mist' },
  published:        { label: 'Published',        variant: 'green' },
  paused:           { label: 'Paused',           variant: 'warn' },
};

/**
 * @param {{ status?: string, variant?: string, className?: string, children?: React.ReactNode }} props
 */
export function Badge({ status, variant, className, children, ...props }) {
  if (status && STATUS_MAP[status]) {
    const mapped = STATUS_MAP[status];
    return (
      <span className={cn(badgeVariants({ variant: mapped.variant }), className)} {...props}>
        {mapped.label}
      </span>
    );
  }
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}
