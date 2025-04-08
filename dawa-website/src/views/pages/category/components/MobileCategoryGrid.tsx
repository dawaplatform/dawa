import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { slugify } from '@/@core/utils/slugify';
import { useRouter } from 'next/navigation';
import { categoryIconMap, UniversalFallbackIcon } from './icon-maps';
import { useAuth } from '@/@core/hooks/use-auth';
import { useDispatch } from '@/redux-store/hooks';
import { openAuthDialog } from '@/redux-store/slices/authDialog/authDialogSlice';

const MobileCategoryGrid: React.FC = React.memo(() => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch categories from the JSON file in the public folder.
  useEffect(() => {
    fetch('/categories.json')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSellClick = () => {
    if (!user) {
      dispatch(openAuthDialog());
    } else {
      router.push('/post-ad');
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-2">
        {/* Skeleton for Post Ad Button */}
        <div className="animate-pulse flex flex-col items-center justify-center p-4 bg-gray-300 text-white aspect-square rounded-lg">
          <div className="h-6 w-6 mb-2 bg-gray-400 rounded" />
          <span className="text-xs text-center bg-gray-400 h-3 w-full rounded" />
        </div>
        {/* Skeletons for Category Items */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse flex flex-col items-center justify-center p-4 bg-gray-300 border aspect-square rounded-lg"
          >
            <div className="h-6 w-6 mb-2 bg-gray-400 rounded" />
            <span className="text-xs text-center bg-gray-400 h-3 w-full rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {/* Post Ad Button */}
      <button
        onClick={handleSellClick}
        className="flex flex-col items-center justify-center p-4 bg-gray-700 text-white aspect-square rounded-lg"
      >
        <Plus className="h-6 w-6 mb-2" />
        <span className="text-xs text-center">Post ad</span>
      </button>

      {/* Category List */}
      {categories.map(({ category_name }: any) => {
        // Get the icon component for the category;
        // fallback to UniversalFallbackIcon if none is defined.
        const Icon = categoryIconMap[category_name] || UniversalFallbackIcon;
        const categorySlug = slugify(category_name);

        return (
          <Link key={category_name} href={`/subs/${categorySlug}`}>
            <div className="flex flex-col items-center justify-center p-4 bg-gray-100 border aspect-square rounded-lg">
              <Icon className="h-6 w-6 mb-2 text-primary" />
            </div>
            <span className="text-xs text-center line-clamp-2 mt-2 w-full">
              {category_name}
            </span>
          </Link>
        );
      })}
    </div>
  );
});

MobileCategoryGrid.displayName = 'MobileCategoryGrid';
export default MobileCategoryGrid;
