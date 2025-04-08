import React from 'react';
import { PhoneCall, MessageCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onContact: () => void;
  onMessage: () => void;
  onMakeOffer: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onContact,
  onMessage,
  onMakeOffer,
}) => (
  <div className="grid grid-cols-3 gap-4">
    <Button variant="outline" size="lg" className="w-full" onClick={onContact}>
      <PhoneCall className="mr-2 h-4 w-4" /> Contact
    </Button>
    <Button
      size="lg"
      className="w-full bg-primary_1 hover:bg-gray-700"
      onClick={onMessage}
    >
      <MessageCircle className="mr-2 h-4 w-4" /> Message
    </Button>
    <Button
      variant="secondary"
      size="lg"
      className="w-full"
      onClick={onMakeOffer}
    >
      <DollarSign className="mr-2 h-4 w-4" /> Make Offer
    </Button>
  </div>
);
