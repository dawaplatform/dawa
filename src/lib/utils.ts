import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number): string => {
  if (price >= 1_000_000_000) {
    return `UGX ${(price / 1_000_000_000).toFixed(1)}B`;
  } else if (price >= 1_000_000) {
    return `UGX ${(price / 1_000_000).toFixed(1)}M`;
  } else if (price >= 1_000) {
    return `UGX ${(price / 1_000).toFixed(0)}K`;
  } else {
    return `UGX ${price.toLocaleString()}`;
  }
};
