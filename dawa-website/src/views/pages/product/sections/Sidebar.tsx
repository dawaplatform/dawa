import React from 'react';
import { FaPlus, FaShieldAlt, FaFlag } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWishlist } from '@/contexts/WishlistContext';
import { PostAdvertCTA } from '@/components/shared/post-advert-cta';

interface SidebarProps {
  productId: string;
  onPostAd: () => void;
  onSafetyTips: () => void;
  onReportAbuse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onSafetyTips,
  onReportAbuse,
}) => {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1">
      {/* Post Ad Card */}
      <PostAdvertCTA />

      {/* Safety & Reporting Card */}
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>Safety & Reporting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 flex-1 flex flex-col justify-center">
          <Button variant="outline" className="w-full" onClick={onSafetyTips}>
            <FaShieldAlt className="mr-2 h-4 w-4" /> Safety Tips
          </Button>
          <Button
            variant="outline"
            className="w-full text-red-600 hover:text-red-700"
            onClick={onReportAbuse}
          >
            <FaFlag className="mr-2 h-4 w-4" /> Report Abuse
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
