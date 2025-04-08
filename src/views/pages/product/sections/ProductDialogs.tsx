import React from 'react';
import ReportAbuseDialog from '@/components/features/dialogs/ReportAbuseDialog';
import SendMessageDialog from '@/components/features/dialogs/SendMessageDialog';
import ContactSellerDialog from '@/components/features/dialogs/ContactSellerDialog';
import SafetyTipsDialog from '@/components/features/dialogs/SafetyTipsDialog';
import MakeOfferDialog from '@/components/features/dialogs/MakeOfferDialog';
import { ProductType } from '@/views/pages/product/types/product';

const safetyTips = [
  'Always inspect the item before purchasing.',
  'Meet in a public, well-lit place for transactions.',
  'Verify the authenticity of the product before paying.',
  'Avoid sharing personal or financial details with strangers.',
  'Report suspicious activity immediately.',
];

type DialogType = 'safety' | 'report' | 'message' | 'contact' | 'makeOffer';

interface ProductDialogsProps {
  product: ProductType;
  dialogStates: Record<DialogType, boolean>;
  toggleDialog: (dialog: DialogType) => void;
}

export const ProductDialogs: React.FC<ProductDialogsProps> = ({
  product,
  dialogStates,
  toggleDialog,
}) => (
  <>
    <ReportAbuseDialog
      open={dialogStates.report}
      onOpenChange={() => toggleDialog('report')}
      itemId={product.id}
    />
    <SendMessageDialog
      open={dialogStates.message}
      onOpenChange={() => toggleDialog('message')}
      receiverId={product.seller.seller_id}
      itemId={product.id}
    />
    <ContactSellerDialog
      open={dialogStates.contact}
      onOpenChange={() => toggleDialog('contact')}
      sellerContact={{
        phone: product.seller.seller_contact,
        email: product.seller.seller_email,
      }}
    />
    <SafetyTipsDialog
      open={dialogStates.safety}
      onOpenChange={() => toggleDialog('safety')}
      safetyTips={safetyTips}
    />

    <MakeOfferDialog
      open={dialogStates.makeOffer}
      onOpenChange={() => toggleDialog('makeOffer')}
      receiverId={product.seller.seller_id}
      itemId={product.id}
      currentPrice={product.price}
    />
  </>
);
