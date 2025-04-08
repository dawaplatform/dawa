import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationSkeleton() {
  return (
    <li className="py-4">
      <div className="flex items-start space-x-4">
        <Skeleton className="h-5 w-5 rounded-full" />
        <div className="flex-grow min-w-0">
          <div className="flex items-center">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-12 ml-2" />
          </div>
          <Skeleton className="h-3 w-3/4 mt-1" />
          <Skeleton className="h-3 w-1/4 mt-1" />
        </div>
        <div className="flex-shrink-0 flex space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </li>
  );
}
