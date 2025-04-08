'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

import { useSendMessage } from '@core/hooks/useProductData';
import { formatCurrency } from '@/@core/utils/CurrencyFormatter';
import { toast } from 'sonner';
import useIsMobile from '@/@core/hooks/useIsMobile';

interface MakeOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiverId: string;
  itemId: string;
  currentPrice: string | number;
}

interface MakeOfferFormValues {
  price: number;
}

// Validation schema for offer price
const schema = yup
  .object({
    price: yup
      .number()
      .typeError('Price must be a valid number')
      .positive('Price must be greater than zero')
      .required('Price is required'),
  })
  .required();

const MakeOfferDialog: React.FC<MakeOfferDialogProps> = ({
  open,
  onOpenChange,
  receiverId,
  itemId,
  currentPrice,
}) => {
  // Detect if we're on a mobile device
  const isMobile = useIsMobile();

  // Ensure `currentPrice` is a number and fallback to 0 if invalid
  const basePrice =
    typeof currentPrice === 'string'
      ? parseInt(currentPrice.replace(/[^0-9]/g, '')) || 0
      : typeof currentPrice === 'number'
        ? currentPrice
        : 0;

  const { sendMessage, isSending, error } = useSendMessage();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MakeOfferFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      price: 0,
    },
  });

  // Example suggested prices (5%, 10%, 15%, 20% below current price)
  const [suggestedPrices] = useState<number[]>([
    Math.round(basePrice * 0.95),
    Math.round(basePrice * 0.9),
    Math.round(basePrice * 0.85),
    Math.round(basePrice * 0.8),
  ]);

  // Handle form submission
  const onSubmit = async (data: MakeOfferFormValues) => {
    const { price } = data;
    const formattedPrice = formatCurrency(price);

    // Construct a professional offer message
    const message = `Hello,

I am interested in your product and would like to offer ${formattedPrice}. Please let me know if this offer is acceptable to you.

Thank you`;

    try {
      await sendMessage({
        receiver_id: Number(receiverId),
        item_id: Number(itemId),
        message,
      });
      reset();
      onOpenChange(false);
      toast.success('Your offer has been sent successfully!');
    } catch (err: any) {
      console.error('Error sending offer:', err);
      toast.error('Failed to send your offer. Please try again.');
    }
  };

  // Handle suggested price button clicks
  const handleSuggestedPriceClick = (price: number) => {
    reset({ price });
  };

  // Shared form content (used by both Dialog and Sheet)
  const FormContent = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      {/* Current Price Display */}
      <p className="text-center text-sm text-gray-500">
        Current Price: {formatCurrency(basePrice)}
      </p>

      {/* Suggested Offers */}
      {suggestedPrices.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {suggestedPrices.map((price, index) => (
            <Button
              key={index}
              variant="outline"
              type="button" // Prevent immediate form submission
              onClick={() => handleSuggestedPriceClick(price)}
              className="w-full"
            >
              {formatCurrency(price)}
            </Button>
          ))}
        </div>
      )}

      {/* Custom Price Input */}
      <div className="space-y-2">
        <Label htmlFor="price">Your Offer Price (UGX)</Label>
        <div className="flex items-center">
          <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-l-md">
            UGX
          </span>
          <Input
            id="price"
            type="number"
            placeholder="Enter your offer price"
            {...register('price')}
            className="flex-1 border-t-0 border-b-0 border-l-0 rounded-none focus:border-primary_1"
            min={1}
          />
        </div>
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price.message}</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center text-red-500 text-sm">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{typeof error === 'string' ? error : error.message}</span>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-primary_1 hover:bg-primary_1/90 flex items-center justify-center"
        disabled={isSending}
      >
        {isSending ? 'Sending Offer...' : 'Send Offer'}
      </Button>
    </form>
  );

  // MOBILE VIEW: Use bottom Sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="flex flex-col rounded-t-3xl h-auto max-h-[90vh] overflow-y-auto pb-safe"
        >
          <SheetHeader>
            <SheetTitle className="text-center">Make an Offer</SheetTitle>
            <SheetDescription className="text-center mb-4">
              Submit your offer for the product.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1">
            <FormContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // DESKTOP VIEW: Use Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Make an Offer</DialogTitle>
          <DialogDescription className="text-center mb-4">
            Submit your offer for the product.
          </DialogDescription>
        </DialogHeader>
        <FormContent />
      </DialogContent>
    </Dialog>
  );
};

export default MakeOfferDialog;
