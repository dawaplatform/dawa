'use client';
import Provider from '@/components/Provider';
import { AuthDialog } from '@/components/features/dialogs/auth-dialog';
import Loader from '@/components/features/loaders/MainLoader';
import { CompleteProfileModal } from '@/components/shared/CompleteProfileModal';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { ProfileProvider } from '@/contexts/profile-context';
import { Suspense } from 'react';
import { Toaster } from 'sonner';
import { ChatProvider } from '@/contexts/ChatContext';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Provider>
          <ChatProvider>
            <WishlistProvider>
              <ProfileProvider>
                <main className="min-h-screen flex flex-col">{children}</main>
                <CompleteProfileModal />
              </ProfileProvider>
            </WishlistProvider>
          </ChatProvider>
          <AuthDialog />
        </Provider>
      </Suspense>
      <Toaster position="bottom-right" expand={true} richColors />
      <SpeedInsights />
      <Analytics />
    </>
  );
}


