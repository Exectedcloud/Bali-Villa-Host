'use client';

import { Dialog } from 'radix-ui';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

function DialogRoot({ children, ...props }) {
  return <Dialog.Root {...props}>{children}</Dialog.Root>;
}

function DialogTrigger({ children, asChild, ...props }) {
  return (
    <Dialog.Trigger asChild={asChild} {...props}>
      {children}
    </Dialog.Trigger>
  );
}

function DialogOverlay({ className, ...props }) {
  return (
    <Dialog.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
      {...props}
    />
  );
}

function DialogContent({ className, children, showClose = true, ...props }) {
  return (
    <Dialog.Portal>
      <DialogOverlay />
      <Dialog.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
          'bg-surface rounded-xl shadow-xl p-6',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          className
        )}
        {...props}
      >
        {children}
        {showClose && (
          <Dialog.Close className="absolute right-4 top-4 rounded-lg p-1.5 text-ink-mute hover:bg-surface-alt hover:text-ink transition-colors outline-none focus-visible:ring-2 focus-visible:ring-jade/50">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        )}
      </Dialog.Content>
    </Dialog.Portal>
  );
}

function DialogHeader({ className, children }) {
  return (
    <div className={cn('flex flex-col gap-1 mb-5', className)}>
      {children}
    </div>
  );
}

function DialogTitle({ className, children }) {
  return (
    <Dialog.Title className={cn('font-display text-xl text-ink', className)}>
      {children}
    </Dialog.Title>
  );
}

function DialogDescription({ className, children }) {
  return (
    <Dialog.Description className={cn('text-sm text-ink-mute', className)}>
      {children}
    </Dialog.Description>
  );
}

function DialogFooter({ className, children }) {
  return (
    <div className={cn('flex justify-end gap-3 mt-5', className)}>
      {children}
    </div>
  );
}

function DialogClose({ children, asChild, ...props }) {
  return (
    <Dialog.Close asChild={asChild} {...props}>
      {children}
    </Dialog.Close>
  );
}

export {
  DialogRoot as Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
};
