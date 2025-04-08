import { Star } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';

interface StarRatingProps {
  initialRating?: number;
  maxRating?: number;
  onRate?: (rating: number) => void;
  starSize?: number;
  className?: string;
  readOnly?: boolean;
  filledColor?: string;
  emptyColor?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  initialRating = 0,
  maxRating = 5,
  onRate,
  starSize = 24,
  className = '',
  readOnly = false,
  filledColor = 'fill-primary_1 text-primary_1', // Tailwind class for filled stars
  emptyColor = 'text-gray-300', // Tailwind class for empty stars
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const getFillPercentage = useCallback(
    (starIndex: number) => {
      const effectiveRating = hoverRating !== null ? hoverRating : rating;
      if (effectiveRating >= starIndex + 1) {
        return 100;
      }
      if (effectiveRating > starIndex && effectiveRating < starIndex + 1) {
        return (effectiveRating - starIndex) * 100;
      }
      return 0;
    },
    [rating, hoverRating],
  );

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    starIndex: number,
  ) => {
    if (readOnly) return;

    const { left, width } = event.currentTarget.getBoundingClientRect();
    const clickPosition = event.clientX - left;
    const isHalf = clickPosition < width / 2;
    const newRating = isHalf ? starIndex + 0.5 : starIndex + 1;

    setRating(newRating);
    if (onRate) {
      onRate(newRating);
    }
  };

  const handleMouseMove = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    starIndex: number,
  ) => {
    if (readOnly) return;

    const { left, width } = event.currentTarget.getBoundingClientRect();
    const hoverPosition = event.clientX - left;
    const isHalf = hoverPosition < width / 2;
    const newHoverRating = isHalf ? starIndex + 0.5 : starIndex + 1;

    setHoverRating(newHoverRating);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(null);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    starIndex: number,
  ) => {
    if (readOnly) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setRating(starIndex + 1);
      if (onRate) {
        onRate(starIndex + 1);
      }
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(maxRating)].map((_, index) => {
        const fillPercentage = getFillPercentage(index);

        return (
          <button
            key={index}
            type="button"
            onClick={(e) => handleClick(e, index)}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={handleMouseLeave}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={readOnly}
            aria-label={`Rate ${index + 1} star${index + 1 > 1 ? 's' : ''}`}
            className={`relative focus:outline-none ${
              !readOnly ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            {/* Empty Star */}
            <Star
              size={starSize}
              className={`${emptyColor} transition-colors`}
            />
            {/* Filled Star */}
            <div
              className={`absolute top-0 left-0 h-full overflow-hidden`}
              style={{
                width: `${fillPercentage}%`,
              }}
            >
              <Star
                size={starSize}
                className={`${filledColor} transition-colors`}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
