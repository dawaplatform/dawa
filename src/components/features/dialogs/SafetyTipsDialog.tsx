'use client';

import React from 'react';
import useIsMobile from '@/@core/hooks/useIsMobile';
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
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface SafetyTipsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  safetyTips: string[];
}

const SafetyTipsDialog: React.FC<SafetyTipsDialogProps> = ({
  open,
  onOpenChange,
  safetyTips,
}) => {
  const isMobile = useIsMobile();

  // --- MOBILE: Use bottom Sheet ---
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="flex flex-col rounded-t-3xl max-h-[90vh] overflow-y-auto pb-safe"
        >
          <SheetHeader>
            <SheetTitle>Safety Tips</SheetTitle>
            <SheetDescription>
              Follow these safety tips to ensure secure transactions:
            </SheetDescription>
          </SheetHeader>

          <ul className="list-disc pl-5 text-gray-700 mt-4">
            {safetyTips.map((tip, index) => (
              <li key={index} className="mb-2">
                {tip}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-end">
            <Button onClick={() => onOpenChange(false)}>Got It</Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // --- DESKTOP: Use Dialog ---
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Safety Tips</DialogTitle>
          <DialogDescription>
            Follow these safety tips to ensure secure transactions:
          </DialogDescription>
        </DialogHeader>
        <ul className="list-disc pl-5 text-gray-700 mt-4">
          {safetyTips.map((tip, index) => (
            <li key={index} className="mb-2">
              {tip}
            </li>
          ))}
        </ul>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Got It</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SafetyTipsDialog;
