'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@core/hooks/use-auth';
import { useWishlist } from '@/contexts/WishlistContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import type { Product } from '@/views/pages/wishlist/types/wishList';
import { openAuthDialog } from '@/redux-store/slices/authDialog/authDialogSlice';
import { useDispatch } from '@/redux-store/hooks';

interface LikeButtonProps {
  productId: string;
  product?: Product;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'floating';
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  productId,
  product,
  className = '',
  size = 'md',
  variant = 'default',
}) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { isInWishlist, toggle } = useWishlist();
  const [hasClicked, setHasClicked] = React.useState(false);

  const isLiked = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setHasClicked(true);
    setTimeout(() => setHasClicked(false), 1000);

    if (!user) {
      dispatch(openAuthDialog());
      return;
    }
    toggle(productId, product);
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const heartSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const variantsClasses = {
    default: 'bg-white shadow-lg hover:shadow-xl',
    minimal: 'bg-transparent hover:bg-black/5',
    floating: 'bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl',
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClick}
            className={cn(
              'relative rounded-full transition-all duration-300',
              variantsClasses[variant],
              sizeClasses[size],
              className,
              isLiked && 'bg-red-50',
            )}
          >
            <AnimatePresence>
              {hasClicked && isLiked && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute inset-0 rounded-full bg-red-500/20"
                />
              )}
            </AnimatePresence>
            <motion.div
              animate={{
                scale: isLiked ? 1 : [1, 1.2, 1],
                rotate: hasClicked ? [0, -20, 20, 0] : 0,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <Heart
                className={cn(
                  heartSizes[size],
                  'transition-colors duration-300',
                  isLiked
                    ? 'fill-red-500 stroke-red-500'
                    : 'stroke-gray-600 group-hover:stroke-gray-900',
                )}
              />
            </motion.div>
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="left"
          align="center"
          className="bg-gray-900 text-white text-xs px-2 py-1"
        >
          {isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
