import { cn } from '@/lib/utils';

/**
 * @param {{
 *   label?: string,
 *   error?: string,
 *   hint?: string,
 *   className?: string,
 * } & React.InputHTMLAttributes<HTMLInputElement>} props
 */
export function Input({ label, error, hint, className, id, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink leading-none">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'h-11 w-full rounded-md border border-rule bg-surface px-3.5 text-sm text-ink',
          'placeholder:text-ink-mute',
          'outline-none transition-colors duration-150',
          'focus:border-jade focus:ring-2 focus:ring-jade/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-danger focus:border-danger focus:ring-danger/20',
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-ink-mute">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

/**
 * @param {{
 *   label?: string,
 *   error?: string,
 *   hint?: string,
 *   className?: string,
 * } & React.TextareaHTMLAttributes<HTMLTextAreaElement>} props
 */
export function Textarea({ label, error, hint, className, id, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink leading-none">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          'w-full rounded-md border border-rule bg-surface px-3.5 py-3 text-sm text-ink',
          'placeholder:text-ink-mute resize-none',
          'outline-none transition-colors duration-150',
          'focus:border-jade focus:ring-2 focus:ring-jade/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-danger focus:border-danger focus:ring-danger/20',
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-ink-mute">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
