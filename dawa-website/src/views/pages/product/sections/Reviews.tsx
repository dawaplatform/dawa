'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ProductType, Review } from '@/views/pages/product/types/product';
import { useSendReviews } from '@core/hooks/useProductData';
import { useAuth } from '@/@core/hooks/use-auth';
import { useDispatch } from '@redux-store/hooks';
import { openAuthDialog } from '@/redux-store/slices/authDialog/authDialogSlice';
import { format } from 'date-fns';
import { mutate } from 'swr';

interface ReviewsProps {
  product: ProductType;
}

const Reviews: React.FC<ReviewsProps> = ({ product }) => {
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState<Review[]>(product.reviews || []);
  const [newReview, setNewReview] = useState('');
  const [visibleReviews, setVisibleReviews] = useState(5);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'error' | 'success' | 'warning' | null;
    message: string;
  }>({ type: null, message: '' });
  const { user } = useAuth();

  const { sendReviews, isLoading, error } = useSendReviews();

  const getAvatarFallback = (name: string | undefined): string => {
    if (!name || name.trim() === '') return '?';
    return name.trim()[0].toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      dispatch(openAuthDialog());
      return;
    }

    // Reset previous status
    setSubmitStatus({ type: null, message: '' });

    const reviewData = {
      item_id: product.id,
      review: newReview,
    };

    const review: any = {
      name: user?.name || 'Anonymous',
      avatar: user?.image || '',
      review: newReview,
      created_at: new Date().toISOString(),
    };

    try {
      const res = await sendReviews(reviewData);

      if (res.status === 400) {
        setSubmitStatus({
          type: 'warning',
          message: res.error || 'You have already reviewed this item.',
        });
        return;
      }

      setReviews([...reviews, review]);

      // Trigger SWR to refetch product details for this specific product
      mutate(['/getitemdetails', product.id]);

      setNewReview('');
      setSubmitStatus({
        type: 'success',
        message: 'Your review has been submitted successfully!',
      });
    } catch (err) {
      setSubmitStatus({
        type: 'error',
        message:
          'There was an error submitting your review. Please try again later.',
      });

      console.error('Error submitting review:', err);
    }
  };

  const handleLoadMore = () => {
    setVisibleReviews((prev) => prev + 5);
  };

  const renderStatusMessage = () => {
    if (!submitStatus.type) return null;

    const icons = {
      error: <AlertCircle className="w-6 h-6 inline mr-2" />,
      warning: <AlertTriangle className="w-6 h-6 inline mr-2" />,
      success: <CheckCircle2 className="w-6 h-6 inline mr-2" />,
    };

    const colors = {
      error: 'text-red-500',
      warning: 'text-yellow-500',
      success: 'text-green-500',
    };

    return (
      <div className={`${colors[submitStatus.type]} text-center`}>
        {icons[submitStatus.type]}
        <span>{submitStatus.message}</span>
      </div>
    );
  };

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const formatReviewDate = (createdAt: string) => {
    if (isValidDate(createdAt)) {
      return format(new Date(createdAt), 'MMMM d, yyyy');
    }
    return 'Invalid date'; // Return a fallback if the date is invalid
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review here..."
            required
            style={{ minHeight: '100px' }}
          />
          <Button
            type="submit"
            className="bg-primary_1 hover:bg-gray-700"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>

        {renderStatusMessage()}

        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center">
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.slice(0, visibleReviews).map((review, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center space-x-2 mb-2">
                  <Avatar>
                    <AvatarImage
                      src={review.avatar || review.reviewer_profile_picture}
                      alt={review.name || review.reviewer_name}
                    />
                    <AvatarFallback>
                      {getAvatarFallback(review.name || review.reviewer_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="font-semibold">
                      {review.name || review.reviewer_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatReviewDate(review.created_at)}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600">{review.review}</p>
              </div>
            ))}
          </div>
        )}

        {visibleReviews < reviews.length && (
          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="w-full bg-primary_1 hover:bg-gray-700"
          >
            Load More Reviews
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Reviews;
