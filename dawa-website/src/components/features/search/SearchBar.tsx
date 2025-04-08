'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import Button from '@/components/shared/Button';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface SearchBarProps {
  onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      router.push(`/search?query=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSearch}
      className="relative w-full"
      aria-label="Search form"
    >
      <Input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-12 pl-5 pr-12 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-primary_1 transition-all duration-300"
        aria-label="Search products"
      />
      <div className="flex gap-2 absolute right-2 top-1/2 transform -translate-y-1/2">
        <Button
          type="submit"
          icon={FaSearch}
          className="bg-primary_1 text-white hover:bg-primary_1/90 rounded-lg h-8 w-8 transition-all duration-300"
          aria-label="Submit search"
        />
        <Button
          type="button"
          onClick={onClose}
          icon={FaTimes}
          className="block sm:hidden bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg h-8 w-8 transition-all duration-300"
          aria-label="Close search"
        />
      </div>
    </form>
  );
};

export default SearchBar;
