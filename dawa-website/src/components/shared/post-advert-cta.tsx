'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@core/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useDispatch } from '@redux-store/hooks';
import { openAuthDialog } from '@redux-store/slices/authDialog/authDialogSlice';
import { FaPlus } from 'react-icons/fa';

export function PostAdvertCTA() {
  const router = useRouter();
  const { user } = useAuth();
  const dispatch = useDispatch();

  const handlePostAd = () => {
    if (!user) {
      dispatch(openAuthDialog());
    } else {
      router.push('/post-ad');
    }
  };

  return (
    <Card
      className="cursor-pointer hover:bg-gray-800 transition-colors duration-200 bg-gray-700 text-white flex flex-col h-full"
      onClick={handlePostAd}
    >
      <CardContent className="p-6 flex flex-col items-center text-center space-y-4 flex-1">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
          <FaPlus className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">Got something to sell?</h3>
          <p className="text-white/90">Post an advert for free!</p>
        </div>
      </CardContent>
    </Card>
  );
}
