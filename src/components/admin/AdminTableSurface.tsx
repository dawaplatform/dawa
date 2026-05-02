'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Rounded card + horizontal scroll for data tables on small screens.
 */
export function AdminTableSurface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200/80 bg-white shadow-sm overflow-hidden',
        className,
      )}
    >
      <div className="min-w-0 overflow-x-auto">{children}</div>
    </div>
  );
}
