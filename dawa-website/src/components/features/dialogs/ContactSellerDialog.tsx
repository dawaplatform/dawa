'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import useIsMobile from '@/@core/hooks/useIsMobile';

interface ContactSellerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sellerContact: {
    phone: string;
    email: string;
  };
}

const ContactSellerDialog: React.FC<ContactSellerDialogProps> = ({
  open,
  onOpenChange,
  sellerContact,
}) => {
  const isMobile = useIsMobile();

  // Content shared between Dialog and Sheet.
  const content = (
    <>
      <header>
        <h2 className="text-lg font-bold">Contact Seller</h2>
        <p className="text-sm text-gray-600">
          Here are the contact details for the seller.
        </p>
      </header>
      <div className="mt-4 space-y-2">
        <p>
          <strong>Phone:</strong> {sellerContact.phone}
        </p>
        <p>
          <strong>Email:</strong> {sellerContact.email}
        </p>
      </div>
      <div className="mt-4">
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Contact Seller</SheetTitle>
            <SheetDescription>
              Here are the contact details for the seller.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">{content}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Seller</DialogTitle>
          <DialogDescription>
            Here are the contact details for the seller.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          <p>
            <strong>Phone:</strong> {sellerContact.phone}
          </p>
          <p>
            <strong>Email:</strong> {sellerContact.email}
          </p>
        </div>
        <div className="mt-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactSellerDialog;
