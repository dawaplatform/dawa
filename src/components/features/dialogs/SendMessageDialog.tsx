'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSendMessage } from '@core/hooks/useProductData';
import { toast } from 'sonner';
import useIsMobile from '@/@core/hooks/useIsMobile';

interface SendMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiverId: string;
  itemId: string;
}

interface SendMessageFormValues {
  message: string;
}

const schema = yup.object({
  message: yup.string().required('Message is required'),
});

const SendMessageDialog: React.FC<SendMessageDialogProps> = ({
  open,
  onOpenChange,
  receiverId,
  itemId,
}) => {
  const isMobile = useIsMobile();
  const { sendMessage, isSending, error } = useSendMessage();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendMessageFormValues>({
    resolver: yupResolver(schema),
  });

  // Create a ref for the Textarea so we can force blur on mobile when dialog opens.
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Destructure the register ref for 'message'
  const { ref: messageRef, ...messageRest } = register('message');

  // When the dialog/sheet opens on mobile, ensure the textarea is not auto-focused.
  useEffect(() => {
    if (isMobile && open && textareaRef.current) {
      textareaRef.current.blur();
    }
  }, [isMobile, open]);

  const onSubmit = async (data: SendMessageFormValues) => {
    try {
      await sendMessage({
        receiver_id: Number(receiverId),
        item_id: Number(itemId),
        message: data.message,
      });
      reset();
      onOpenChange(false);
      toast.success('Message sent successfully!');
    } catch (err: any) {
      console.error('Error submitting message:', err);
      toast.error(
        err.message || 'Failed to send the message. Please try again.',
      );
    }
  };

  // Shared form content. It conditionally renders the submit button.
  const FormContent = ({ includeFooter }: { includeFooter: boolean }) => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="message">Your Message</Label>
        <Textarea
          id="message"
          {...messageRest}
          rows={4}
          className="resize-none"
          ref={(e) => {
            messageRef(e);
            // Cast textareaRef to a mutable ref object
            (
              textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>
            ).current = e;
          }}
        />
        {errors.message && (
          <p className="text-red-500 text-sm">{errors.message.message}</p>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm">
          {typeof error === 'string' ? error : error.message}
        </p>
      )}
      {includeFooter && (
        <DialogFooter>
          <Button
            type="submit"
            className="bg-primary_1 hover:bg-primary_1/90"
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogFooter>
      )}
    </form>
  );

  if (isMobile) {
    // Mobile view: use bottom Sheet. Do not include footer in the form,
    // instead use the SheetFooter for the submit button.
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="flex flex-col rounded-t-3xl h-auto max-h-[90vh] overflow-y-auto pb-safe"
        >
          <SheetHeader>
            <SheetTitle>Send a Message</SheetTitle>
            <SheetDescription>
              Send a message to the seller about this product.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1">
            <FormContent includeFooter={false} />
          </div>
          <SheetFooter>
            <Button
              type="button"
              className="bg-primary_1 hover:bg-primary_1/90"
              onClick={handleSubmit(onSubmit)}
              disabled={isSending}
            >
              {isSending ? 'Sending...' : 'Send Message'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop view: use Dialog with form including footer.
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send a Message</DialogTitle>
          <DialogDescription>
            Send a message to the seller about this product.
          </DialogDescription>
        </DialogHeader>
        <FormContent includeFooter={true} />
      </DialogContent>
    </Dialog>
  );
};

export default SendMessageDialog;
