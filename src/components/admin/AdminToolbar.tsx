'use client';

import { useUrlParamSetter, useUrlSearchParam } from '@/@core/hooks/useUrlParams';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';

export interface AdminFilter {
  param: string;
  options: { value: string; label: string }[];
}

interface AdminToolbarProps {
  placeholder: string;
  filter?: AdminFilter;
  count?: { shown: number; total: number; noun: string };
  actions?: ReactNode;
  className?: string;
}

function FilterChips({ param, options }: AdminFilter) {
  const active = useSearchParams().get(param) ?? '';
  const setParam = useUrlParamSetter();
  const chips = [{ value: '', label: 'All' }, ...options];

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter">
      {chips.map((chip) => (
        <button
          key={chip.value}
          type="button"
          aria-pressed={active === chip.value}
          onClick={() => setParam(param, chip.value)}
          className={cn(
            'rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary_1',
            active === chip.value
              ? 'bg-primary_1 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-primary_2',
          )}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}

export function AdminToolbar({ placeholder, filter, count, actions, className }: AdminToolbarProps) {
  const [query, setQuery] = useUrlSearchParam('search');
  const inputRef = useRef<HTMLInputElement>(null);

  // "/" focuses search, unless the user is already typing somewhere.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing = target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      if (event.key !== '/' || typing) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div
      role="search"
      className={cn(
        'mb-4 flex flex-col gap-3 rounded-xl border border-gray-200/80 bg-white p-3 shadow-sm md:flex-row md:items-center',
        className,
      )}
    >
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          ref={inputRef}
          type="search"
          autoComplete="off"
          aria-label={placeholder}
          placeholder={placeholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-10 border-gray-200 bg-gray-50 pl-9 pr-10 focus-visible:border-primary_1 [&::-webkit-search-cancel-button]:hidden"
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-primary_2 hover:text-primary_1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary_1"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-gray-200 bg-white px-1.5 text-xs text-gray-400 md:block">
            /
          </kbd>
        )}
      </div>
      {filter && <FilterChips {...filter} />}
      {actions}
      {count && (
        <span className="whitespace-nowrap text-sm text-gray-500 md:ml-auto" aria-live="polite">
          Showing {count.shown} of {count.total} {count.noun}
        </span>
      )}
    </div>
  );
}
