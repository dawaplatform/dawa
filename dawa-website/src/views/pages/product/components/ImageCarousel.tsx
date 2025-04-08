'use client';

import React, { useCallback, useState, memo } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';

interface ImageType {
  image_id: number;
  image_url: string;
}

interface ImageCarouselProps {
  images: ImageType[];
}

// Navigation buttons component for reuse.
interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  leftButtonClasses?: string;
  rightButtonClasses?: string;
  iconSize?: 'small' | 'large';
}

const NavigationButtons: React.FC<NavigationButtonsProps> = memo(
  ({
    onPrevious,
    onNext,
    leftButtonClasses = '',
    rightButtonClasses = '',
    iconSize = 'small',
  }) => {
    const iconClass = iconSize === 'small' ? 'h-4 w-4' : 'h-6 w-6';
    return (
      <>
        <Button
          variant="secondary"
          size="icon"
          className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg ${leftButtonClasses}`}
          onClick={onPrevious}
          aria-label="Previous image"
        >
          <ChevronLeft className={iconClass} />
          <VisuallyHidden>Previous image</VisuallyHidden>
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg ${rightButtonClasses}`}
          onClick={onNext}
          aria-label="Next image"
        >
          <ChevronRight className={iconClass} />
          <VisuallyHidden>Next image</VisuallyHidden>
        </Button>
      </>
    );
  },
);

NavigationButtons.displayName = 'NavigationButtons';

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Safely retrieve the current image.
  const currentImage = images[currentIndex] || images[0];

  // Memoize navigation callbacks.
  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const toggleZoom = useCallback(() => {
    setIsZoomed((prev) => !prev);
  }, []);

  if (!images || images.length === 0) {
    return (
      <Card className="relative aspect-[4/3] bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <Card className="relative overflow-hidden bg-gray-100">
        <div className="relative aspect-[4/3] md:aspect-[16/9]">
          <div
            className={`relative h-full w-full transition-transform duration-300 ${
              isZoomed ? 'cursor-zoom-out scale-150' : 'cursor-zoom-in'
            }`}
          >
            <Image
              src={currentImage.image_url || '/placeholder.svg'}
              alt={`Product image ${currentIndex + 1}`}
              fill
              priority
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
              onClick={toggleZoom}
            />
          </div>

          {/* Navigation Controls */}
          {images.length > 1 && (
            <NavigationButtons
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          )}

          {/* Action Controls */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/80 hover:bg-white shadow-lg"
              onClick={toggleZoom}
              aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
            >
              {isZoomed ? (
                <ZoomOut className="h-4 w-4" />
              ) : (
                <ZoomIn className="h-4 w-4" />
              )}
              <VisuallyHidden>
                {isZoomed ? 'Zoom out' : 'Zoom in'}
              </VisuallyHidden>
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/80 hover:bg-white shadow-lg"
              onClick={() => setShowFullscreen(true)}
              aria-label="View fullscreen"
            >
              <Expand className="h-4 w-4" />
              <VisuallyHidden>View fullscreen</VisuallyHidden>
            </Button>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1.5 rounded-full text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </Card>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 px-1">
          {images.map((image, index) => (
            <button
              key={image.image_id}
              onClick={() => setCurrentIndex(index)}
              className={`
                relative aspect-square rounded-lg overflow-hidden transition-all duration-200
                ${
                  currentIndex === index
                    ? 'ring-2 ring-primary ring-offset-2'
                    : 'hover:ring-2 hover:ring-primary/50 hover:ring-offset-1'
                }
              `}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.image_url || '/placeholder.svg'}
                alt={`Thumbnail ${index + 1}`}
                fill
                className={`
                  object-cover 
                  ${currentIndex === index ? 'opacity-100' : 'opacity-70 hover:opacity-100'}
                `}
                sizes="(max-width: 768px) 20vw, 10vw"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Dialog */}
      <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
          <DialogTitle className="sr-only">Fullscreen Image View</DialogTitle>
          <div className="relative w-full h-full">
            <Image
              src={currentImage.image_url || '/placeholder.svg'}
              alt={`Product image ${currentIndex + 1} fullscreen`}
              fill
              className="object-contain"
              priority
            />

            {images.length > 1 && (
              <NavigationButtons
                onPrevious={handlePrevious}
                onNext={handleNext}
                iconSize="large"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageCarousel;
