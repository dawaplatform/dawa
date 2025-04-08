'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Subcategory {
  id: number;
  subcategory_name: string;
}

interface Category {
  id: number;
  category_name: string;
  subcategories: Subcategory[];
}

interface CategorySelectProps {
  categories: Category[];
  onChange: (subcategoryId: string) => void;
  value: string;
  errors?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  categories,
  onChange,
  value,
  errors,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (!selectedCategory) setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedCategory]);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    if (category.subcategories.length === 1) {
      handleSubcategorySelect(category.subcategories[0].id.toString());
    }
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    onChange(subcategoryId);
    setIsOpen(false);
    setSelectedCategory(null);
  };

  const getSelectedSubcategoryName = () => {
    for (const category of categories) {
      const subcategory = category.subcategories.find(
        (sub) => sub.id.toString() === value,
      );
      if (subcategory) return subcategory.subcategory_name;
    }
    return 'Select a category';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between h-14 border rounded-lg focus:border-primary_1 focus:outline-none"
        variant="outline"
      >
        {getSelectedSubcategoryName()}
        <ChevronDown
          className={`ml-2 h-4 w-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </Button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="max-h-60 overflow-auto">
            {selectedCategory ? (
              <div>
                <button
                  className="w-full p-2 text-left hover:bg-gray-100 flex items-center text-sm font-medium text-gray-500"
                  onClick={() => setSelectedCategory(null)}
                >
                  <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                  Back to categories
                </button>
                {selectedCategory.subcategories.map((subcategory) => (
                  <button
                    key={subcategory.id}
                    className="w-full p-2 text-left hover:bg-gray-100 text-sm"
                    onClick={() =>
                      handleSubcategorySelect(subcategory.id.toString())
                    }
                  >
                    {subcategory.subcategory_name}
                  </button>
                ))}
              </div>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat.id}
                  className="w-full p-2 text-left hover:bg-gray-100 flex items-center justify-between text-sm"
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat.category_name}
                  <ChevronRight className="h-4 w-4" />
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {errors && <p className="text-sm text-red-500 mt-1">{errors}</p>}
    </div>
  );
};

export default CategorySelect;
