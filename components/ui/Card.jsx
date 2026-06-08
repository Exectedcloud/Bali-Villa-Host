import { cn } from '@/lib/utils';

/**
 * @param {{ className?: string, children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>} props
 */
export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn('bg-surface rounded-xl border border-rule shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * @param {{ className?: string, children: React.ReactNode }} props
 */
export function CardHeader({ className, children }) {
  return (
    <div className={cn('px-5 pt-5 pb-4', className)}>
      {children}
    </div>
  );
}

/**
 * @param {{ className?: string, children: React.ReactNode }} props
 */
export function CardContent({ className, children }) {
  return (
    <div className={cn('px-5 pb-5', className)}>
      {children}
    </div>
  );
}

/**
 * @param {{ className?: string, children: React.ReactNode }} props
 */
export function CardFooter({ className, children }) {
  return (
    <div className={cn('px-5 pb-5 pt-0 flex items-center', className)}>
      {children}
    </div>
  );
}
