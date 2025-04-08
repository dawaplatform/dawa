'use client';

import React, { useState, useEffect } from 'react';
import { FaStore } from 'react-icons/fa';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch } from '@/redux-store/hooks';
import { setSelectedUserId } from '@/redux-store/slices/myshop/selectedUserSlice';
import { Button } from '@/components/ui/button';
import CustomImage from '@/components/shared/CustomImage';
import { SellerType } from '@/views/pages/product/types/product';

// ShadCN AlertDialog components
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';

import { useSendMessage } from '@/@core/hooks/useProductData';
import { toast } from 'sonner';
import { useProfile } from '@/contexts/profile-context';
import { useAuth } from '@/@core/hooks/use-auth';
import { openAuthDialog } from '@/redux-store/slices/authDialog/authDialogSlice';

function getValidImageUrl(
  url: string | null | undefined,
  fallback: string,
): string {
  if (!url) return fallback;
  try {
    new URL(url);
    return url;
  } catch {
    return fallback;
  }
}

interface SellerInfoProps {
  seller: SellerType;
  reviews: any[];
  productName?: string;
  productId?: string | number;
}

export const SellerInfo: React.FC<SellerInfoProps> = ({
  seller,
  reviews,
  productName,
  productId,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  // Get user profile from useProfile.
  const { userProfile } = useProfile();
  const { sendMessage, isSending } = useSendMessage();

  // Local state to control the callback dialog.
  const [openCallbackDialog, setOpenCallbackDialog] = useState(false);

  // Compute initial image src.
  const initialSrc = getValidImageUrl(
    seller.seller_profile_picture,
    '/placeholder-avatar.png',
  );
  const [imgSrc, setImgSrc] = useState(initialSrc);

  useEffect(() => {
    setImgSrc(
      getValidImageUrl(
        seller.seller_profile_picture,
        '/placeholder-avatar.png',
      ),
    );
  }, [seller.seller_profile_picture]);

  const handleImageError = () => {
    if (imgSrc !== '/placeholder-avatar.png') {
      setImgSrc('/placeholder-avatar.png');
    }
  };

  const handleViewStore = () => {
    localStorage.setItem('selectedShopId', String(seller.seller_id));
    dispatch(setSelectedUserId(seller.seller_id as any));
    router.push('/shop');
  };

  // Handle callback confirmation.
  const handleConfirmCallback = async () => {
    try {
      const phoneNumber = userProfile?.contact || 'N/A';

      const productInfo = productName
        ? ` regarding your product "${productName}"`
        : '';
      const message = `Hi ${seller.seller_name},

I'm interested${productInfo} and would like to discuss further details. Could you please call me at ${phoneNumber} when you have a moment?

Thanks`;

      await sendMessage({
        receiver_id: Number(seller.seller_id),
        item_id: Number(productId),
        message,
      });

      toast.success('Your request for a callback has been sent successfully!');
    } catch (err) {
      console.error('Error requesting callback:', err);
      toast.error('Failed to request callback. Please try again.');
    } finally {
      setOpenCallbackDialog(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm flex items-start gap-4">
      {/* Seller Profile Picture */}
      <div className="relative w-20 h-20 rounded-full overflow-hidden">
        <CustomImage
          src={imgSrc}
          alt={seller.seller_name}
          fill
          style={{ objectFit: 'cover' }}
          onError={handleImageError}
        />
      </div>

      {/* Seller Details */}
      <div className="flex-1 space-y-2">
        <h3 className="text-lg font-bold text-gray-900">
          {seller.seller_name}
        </h3>
        <p className="text-sm text-gray-600">{seller.seller_address}</p>
        {productName && (
          <p className="text-sm text-gray-500 italic">
            Regarding product: {productName}
          </p>
        )}

        {/* Reviews */}
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium">
            {reviews.length} Review{reviews.length !== 1 && 's'}
          </span>
        </div>

        {/* Buttons: View Store + Request Callback */}
        <div className="flex items-center gap-2 mt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-primary_1 text-primary_1 hover:bg-primary_1/10"
            onClick={handleViewStore}
          >
            <FaStore className="mr-2" />
            View Store
          </Button>

          {/* ShadCN AlertDialog for Request Callback */}
          <AlertDialog
            open={openCallbackDialog}
            onOpenChange={setOpenCallbackDialog}
          >
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="default"
                size="sm"
                className="bg-primary_1 text-white hover:bg-primary_1/90"
                onClick={() => setOpenCallbackDialog(true)}
              >
                Request Callback
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                {user ? (
                  <>
                    <AlertDialogTitle>Request Callback</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to request a callback from{' '}
                      {seller.seller_name}?
                      {productName &&
                        ` regarding the product "${productName}"?`}
                    </AlertDialogDescription>
                  </>
                ) : (
                  <>
                    <AlertDialogTitle>Login Required</AlertDialogTitle>
                    <AlertDialogDescription>
                      You must be logged in to request a callback. Please login
                      to continue.
                    </AlertDialogDescription>
                  </>
                )}
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpenCallbackDialog(false)}
                >
                  Cancel
                </Button>
                {user ? (
                  <Button
                    variant="default"
                    onClick={handleConfirmCallback}
                    disabled={isSending}
                  >
                    {isSending ? 'Sending...' : 'Yes, Request Callback'}
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    onClick={() => {
                      dispatch(openAuthDialog());
                      setOpenCallbackDialog(false);
                    }}
                  >
                    Login
                  </Button>
                )}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};
