import type React from 'react';
import { Button } from '@/components/ui/button';
import { AlertOctagon, RefreshCw } from 'lucide-react';

interface OopsComponentProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  containerClassName?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionClassName?: string;
}

export function OopsComponent({
  icon,
  title = 'Oops! Something went wrong',
  description = "We're having trouble loading the data. Please try again.",
  actionText = 'Try Again',
  onAction,
  // Reduced container padding and centered content.
  containerClassName = 'flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 w-full',
  // Smaller icon with reduced margin.
  iconClassName = 'text-yellow-600 mb-2 sm:mb-3 md:mb-4',
  // Smaller title sizes.
  titleClassName = 'text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 text-center mb-1 sm:mb-2',
  // Smaller description text.
  descriptionClassName = 'text-xs sm:text-sm md:text-base text-gray-600 text-center mb-3 sm:mb-4 max-w-md',
  // Smaller button styling.
  actionClassName = 'flex items-center px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm',
}: OopsComponentProps) {
  return (
    <div className={containerClassName}>
      <div className="flex flex-col items-center w-full">
        <div className={iconClassName}>
          {icon || (
            <AlertOctagon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" />
          )}
        </div>
        <h2 className={titleClassName}>{title}</h2>
        <p className={descriptionClassName}>{description}</p>
        {onAction && (
          <Button onClick={onAction} className={actionClassName}>
            <RefreshCw className="w-3 h-3 mr-1" />
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
}
