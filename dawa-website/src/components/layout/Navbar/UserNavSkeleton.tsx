import { Skeleton } from '@/components/ui/skeleton';

export function UserNavSkeleton() {
  return (
    <div className="flex items-center gap-2">
      {/* Skeleton for Favorites (visible only on larger screens) */}
      <div className="relative hidden lg:block">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <Skeleton className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary_1/50" />
      </div>

      {/* Skeleton for Messages (visible only on larger screens) */}
      <Skeleton className="h-12 w-12 rounded-xl hidden md:block" />

      {/* Skeleton for Notifications (visible only on larger screens) */}
      <Skeleton className="h-12 w-12 rounded-xl hidden md:block" />

      {/* Skeleton for User Avatar */}
      <Skeleton className="h-12 w-12 rounded-xl" />
    </div>
  );
}
