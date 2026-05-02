'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface AdminSearchProps {
  placeholder?: string;
}

export default function AdminSearch({ placeholder }: AdminSearchProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get('search') || '',
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const skipNextUrlSync = useRef(false);

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    if (pathname?.startsWith('/admin/users')) return 'Search users…';
    if (pathname?.startsWith('/admin/items')) return 'Search items…';
    if (pathname?.startsWith('/admin/categories')) return 'Search categories…';
    if (pathname?.startsWith('/admin/reports')) return 'Search reports…';
    return 'Search admin…';
  };

  // Sync from URL on back/forward and external navigation — not after our own debounced push
  useEffect(() => {
    if (skipNextUrlSync.current) {
      skipNextUrlSync.current = false;
      return;
    }
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = searchQuery.trim();

      if (trimmed) {
        params.set('search', trimmed);
      } else {
        params.delete('search');
      }

      const newSearch = params.toString();
      const currentSearch = searchParams.toString();

      if (newSearch !== currentSearch) {
        skipNextUrlSync.current = true;
        router.push(`${pathname}${newSearch ? `?${newSearch}` : ''}`, {
          scroll: false,
        });
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, pathname, router, searchParams]);

  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <Input
        type="search"
        autoComplete="off"
        placeholder={getPlaceholder()}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="h-12 border-2 border-gray-200 bg-white pl-12 pr-4 text-base shadow-sm transition-colors placeholder:text-gray-400 hover:border-gray-300 focus-visible:border-primary_1 focus-visible:ring-2 focus-visible:ring-primary_1/25"
      />
    </div>
  );
}
