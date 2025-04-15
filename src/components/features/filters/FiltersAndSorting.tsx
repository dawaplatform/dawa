'use client';

import React, { useEffect, useCallback } from 'react';
import { FaTh, FaThList, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

import useEmblaCarousel from 'embla-carousel-react';
import AutoplayPlugin from 'embla-carousel-autoplay';

interface FiltersAndSortingProps {
  category: string[];
  /** Optional: the currently selected category */
  selectedCategory?: string;
  /** Optional: callback when a category is selected */
  onCategorySelect?: (category: string) => void;
  /**
   * Optional title to display above the category list.
   * Pass an empty string if you want to hide it.
   */
  categoryTitle?: string;
  viewType: 'grid' | 'list';
  setViewType: (viewType: 'grid' | 'list') => void;
  filterOption: any;
  handleFilterChange: (value: any) => void;
  /**
   * Optional prop to control the visibility of the navigation arrows.
   * Defaults to true.
   */
  arrowVisible?: boolean;
  /**
   * Optional prop to enable auto scrolling if categories are too many.
   * Defaults to false.
   */
  autoScroll?: boolean;
}

const FiltersAndSorting: React.FC<FiltersAndSortingProps> = React.memo(
  ({
    category,
    selectedCategory,
    onCategorySelect,
    categoryTitle = 'Browse Categories',
    viewType,
    setViewType,
    filterOption,
    handleFilterChange,
    arrowVisible = false,
    autoScroll = false,
  }) => {
    // Conditionally include the Autoplay plugin if autoScroll is enabled
    const plugins = autoScroll ? [AutoplayPlugin({ delay: 4000 })] : [];

    // Initialize Embla carousel with free dragging and optional autoplay
    const [emblaRef, emblaApi] = useEmblaCarousel(
      { dragFree: true, containScroll: 'trimSnaps' },
      plugins,
    );

    // Navigation handlers
    const scrollPrev = useCallback(() => {
      if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    useEffect(() => {
      if (emblaApi) {
        // Additional emblaApi setup can be done here if needed.
      }
    }, [emblaApi]);

    return (
      <div className="space-y-6">
        {/* Category section header with optional navigation arrows */}
        {categoryTitle !== '' && (
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {categoryTitle}
            </h2>
            {arrowVisible && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={scrollPrev}
                  aria-label="Scroll Left"
                  className="p-1 hover:bg-gray-200"
                >
                  <FaChevronLeft className="h-4 w-4 text-gray-600" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={scrollNext}
                  aria-label="Scroll Right"
                  className="p-1 hover:bg-gray-200"
                >
                  <FaChevronRight className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Embla carousel container for categories with increased padding */}
        <div className="bg-gradient-to-r from-primary_1/10 to-primary_1/5 p-6 rounded-lg">
          <div className="embla overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex gap-4">
              {category.length === 0 ? (
                <div className="embla__slide flex-shrink-0">
                  <Badge
                    variant="outline"
                    className="text-primary_1 border-primary_1 cursor-pointer whitespace-nowrap"
                    onClick={() => onCategorySelect && onCategorySelect('all')}
                  >
                    All Categories
                  </Badge>
                </div>
              ) : (
                category.map((cat) => {
                  const formattedCat = cat
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (char) => char.toUpperCase());
                  const isSelected = selectedCategory === cat;
                  return (
                    <div className="embla__slide flex-shrink-0" key={cat}>
                      <Badge
                        variant={isSelected ? 'default' : 'outline'}
                        className={`cursor-pointer hover:opacity-90 transition-opacity text-primary_1 border-primary_1 whitespace-nowrap ${
                          isSelected ? 'bg-gray-700 text-white' : ''
                        }`}
                        onClick={() =>
                          onCategorySelect && onCategorySelect(cat)
                        }
                      >
                        {formattedCat}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* View type buttons and filter selector */}
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant={viewType === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewType('grid')}
              aria-label="View as Grid"
              className={`transition-colors ${
                viewType === 'grid'
                  ? 'text-white bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaTh className="h-4 w-4" />
            </Button>
            <Button
              variant={viewType === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewType('list')}
              aria-label="View as List"
              className={`transition-colors ${
                viewType === 'list'
                  ? 'text-white bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaThList className="h-4 w-4" />
            </Button>
          </div>

          <Select value={filterOption} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Popularity</SelectItem>
              <SelectItem value="price_low_to_high">
                Price: Low to High
              </SelectItem>
              <SelectItem value="price_high_to_low">
                Price: High to Low
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  },
);

FiltersAndSorting.displayName = 'FiltersAndSorting';

export default FiltersAndSorting;
