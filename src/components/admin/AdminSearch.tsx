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
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const debounceRef = useRef<NodeJS.Timeout>();
  const isInitialMount = useRef(true);

  // Get contextual placeholder based on route
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    if (pathname?.startsWith('/admin/users')) return 'Search users...';
    if (pathname?.startsWith('/admin/items')) return 'Search items...';
    if (pathname?.startsWith('/admin/categories')) return 'Search categories...';
    if (pathname?.startsWith('/admin/reports')) return 'Search reports...';
    return 'Search admin...';
  };

  // Initialize from URL on mount
  useEffect(() => {
    if (isInitialMount.current) {
      const urlSearch = searchParams.get('search') || '';
      setSearchQuery(urlSearch);
      isInitialMount.current = false;
    }
  }, []);

  // Debounced search update
  useEffect(() => {
    // Skip on initial mount to avoid unnecessary URL updates
    if (isInitialMount.current) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim());
      } else {
        params.delete('search');
      }

      // Only update URL if the search param actually changed
      const newSearch = params.toString();
      const currentSearch = searchParams.toString();
      
      if (newSearch !== currentSearch) {
        router.push(`${pathname}${newSearch ? `?${newSearch}` : ''}`, { scroll: false });
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, pathname, router, searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // The debounced effect will handle the navigation
    }
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none z-10" />
      <Input
        type="text"
        placeholder={getPlaceholder()}
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        className="pl-12 pr-4 h-12 bg-white border-2 border-gray-300 focus:border-primary_1 focus:ring-2 focus:ring-primary_1/20 text-base shadow-sm hover:border-gray-400 transition-colors"
      />
    </div>
  );
}
