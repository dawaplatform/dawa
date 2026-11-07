'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  /** Right-side content (filters, counts, buttons) */
  meta?: ReactNode;
  className?: string;
}

/**
 * Consistent title block for all admin routes (Dawa brand typography).
 */
export function AdminPageHeader({
  title,
  description,
  meta,
  className,
}: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 mb-6',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground md:text-base">{description}</p>
        ) : null}
      </div>
      {meta ? (
        <div className="flex shrink-0 flex-col items-stretch gap-2 text-sm sm:items-end sm:text-right">
          {meta}
        </div>
      ) : null}
    </div>
  );
}
