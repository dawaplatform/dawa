'use client';

import { getLocationById, LocationItem, LocationSearchResult, searchLocationsEnhanced } from '@/@core/utils/locationFilter';
import { ChevronDown, MapPin } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface LocationAutocompleteProps {
  value?: string;
  onChange: (location: LocationItem | null) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
}

export default function LocationAutocomplete({
  value = '',
  onChange,
  placeholder = 'Search for a location...',
  className = '',
  error,
  disabled = false
}: LocationAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Initialize with value if provided
  useEffect(() => {
    if (value && !selectedLocation) {
      const location = getLocationById(value);
      if (location) {
        setSelectedLocation(location);
        setSearchQuery(location.fullPath || location.name);
      }
    }
  }, [value, selectedLocation]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery.length >= 2) {
      debounceRef.current = setTimeout(() => {
        const results = searchLocationsEnhanced(searchQuery, 8);
        setSuggestions(results);
        setIsOpen(true);
        setHighlightedIndex(-1);
      }, 150);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear selection if user is typing
    if (selectedLocation && query !== selectedLocation.fullPath) {
      setSelectedLocation(null);
      onChange(null);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: LocationSearchResult) => {
    setSelectedLocation(suggestion.item);
    setSearchQuery(suggestion.item.fullPath || suggestion.item.name);
    setIsOpen(false);
    onChange(suggestion.item);
    inputRef.current?.blur();
  };

  // Handle input focus
  const handleFocus = () => {
    if (searchQuery.length >= 2 && suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  // Handle input blur
  const handleBlur = () => {
    // Delay to allow clicking on suggestions
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSuggestionSelect(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Clear selection
  const handleClear = () => {
    setSearchQuery('');
    setSelectedLocation(null);
    onChange(null);
    inputRef.current?.focus();
  };

  const getTypeColor = (type: LocationItem['type']) => {
    const colors = {
      district: 'bg-blue-100 text-blue-800',
      county: 'bg-green-100 text-green-800',
      subcounty: 'bg-yellow-100 text-yellow-800',
      parish: 'bg-purple-100 text-purple-800',
      village: 'bg-gray-100 text-gray-800'
    };
    return colors[type];
  };

  const getTypeIcon = (type: LocationItem['type']) => {
    const icons = {
      district: '🏛️',
      county: '🏘️',
      subcounty: '🏘️',
      parish: '⛪',
      village: '🏠'
    };
    return icons[type];
  };

  const getTypeLabel = (type: LocationItem['type']) => {
    const labels = {
      district: 'District',
      county: 'County',
      subcounty: 'Sub-county',
      parish: 'Parish',
      village: 'Village'
    };
    return labels[type];
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full h-14 pl-10 pr-10 border rounded-lg focus:border-primary_1 focus:outline-none ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {selectedLocation ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.item.id}
              onClick={() => handleSuggestionSelect(suggestion)}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                index === highlightedIndex
                  ? 'bg-primary_1/10 border-l-4 border-primary_1'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0 mt-0.5">
                  {getTypeIcon(suggestion.item.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 truncate">
                      {suggestion.item.name}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeColor(suggestion.item.type)}`}>
                      {getTypeLabel(suggestion.item.type)}
                    </span>
                  </div>
                  {suggestion.item.fullPath && suggestion.item.fullPath !== suggestion.item.name && (
                    <div className="text-sm text-gray-500 truncate">
                      {suggestion.item.fullPath}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}

      {/* Selected location display */}
      {selectedLocation && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getTypeIcon(selectedLocation.type)}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">{selectedLocation.name}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeColor(selectedLocation.type)}`}>
                  {getTypeLabel(selectedLocation.type)}
                </span>
              </div>
              {selectedLocation.fullPath && selectedLocation.fullPath !== selectedLocation.name && (
                <div className="text-sm text-gray-500">{selectedLocation.fullPath}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
