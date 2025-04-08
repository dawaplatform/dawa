import type React from 'react';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

interface NoDataProps {
  illustration?: React.ReactNode;
  title: string;
  description?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  customButton?: React.ReactNode;
  containerClassName?: string;
  illustrationClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  ctaClassName?: string;
}

const DefaultIllustration = () => (
  <div className="w-full h-full flex items-center justify-center">
    <FileQuestion className="w-20 h-20 text-gray-400" />
  </div>
);

export default function CustomizableNoData({
  illustration,
  title,
  description,
  ctaText,
  onCtaClick,
  customButton,
  containerClassName = 'flex flex-col items-center justify-center p-8 text-center w-full',
  illustrationClassName = 'w-full h-28 mb-2',
  titleClassName = 'text-2xl font-semibold text-gray-900',
  descriptionClassName = 'text-sm text-gray-500 mt-2 max-w-md',
  ctaClassName = 'mt-4',
}: NoDataProps) {
  return (
    <div className={containerClassName}>
      <div className={illustrationClassName}>
        {illustration || <DefaultIllustration />}
      </div>
      <h2 className={titleClassName}>{title}</h2>
      {description && <p className={descriptionClassName}>{description}</p>}
      {customButton
        ? customButton
        : ctaText &&
          onCtaClick && (
            <Button onClick={onCtaClick} className={ctaClassName}>
              {ctaText}
            </Button>
          )}
    </div>
  );
}
