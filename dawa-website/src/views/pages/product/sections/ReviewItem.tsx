// components/shared/ReviewItem.tsx
'use client';
import React from 'react';
import CustomImage from '@/components/shared/CustomImage';
import { FaUser, FaCheckCircle } from 'react-icons/fa';
// import StarRating from '../../../components/shared/StarRating';

export interface Review {
  name: string;
  image?: string;
  isVerified: boolean;
  rating?: number; // Made optional
  review: string;
}

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  return (
    <div className="border-t border-gray-200 py-8 flex flex-wrap gap-3 justify-between items-center">
      {/* Reviewer Info */}
      <div className="flex flex-col gap-2 items-start">
        <div className="flex items-center space-x-4">
          {review.image ? (
            <div className="w-12 h-12 overflow-hidden">
              <CustomImage
                src={review.image}
                alt={review.name}
                fill
                style={{
                  objectFit: 'cover',
                  borderRadius: '100%',
                }}
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl-full bg-gray-300 flex items-center justify-center">
              <FaUser className="text-gray-500 text-xl" />
            </div>
          )}

          {/* Reviewer Details */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <h4 className="text-lg font-bold text-gray-800">{review.name}</h4>
            </div>
            {review.isVerified && (
              <div className="flex items-center space-x-3">
                <FaCheckCircle
                  className="text-primary_1 text-sm"
                  title="Verified Buyer"
                />
                <span className="text-sm text-primary_1">Verified Buyer</span>
              </div>
            )}
          </div>
        </div>

        {/* Review Text */}
        <p className="text-sm text-gray-600 mt-2">{review.review}</p>
      </div>

      {/* Optional Rating */}
      {/* {typeof review.rating === 'number' && (
        <div className="flex flex-col items-start gap-2">
          <h4 className="text-3xl font-bold text-primary_1">
            {review.rating.toFixed(1)}
          </h4>
          <StarRating initialRating={review.rating} maxRating={5} readOnly />
        </div>
      )} */}
    </div>
  );
};

export default ReviewItem;
