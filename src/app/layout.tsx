'use client';
import Provider from '@/components/Provider';
import { AuthDialog } from '@/components/features/dialogs/auth-dialog';
import Loader from '@/components/features/loaders/MainLoader';
import { CompleteProfileModal } from '@/components/shared/CompleteProfileModal';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { ProfileProvider } from '@/contexts/profile-context';
import { Poppins } from 'next/font/google';
import { Suspense } from 'react';
import { Toaster } from 'sonner';
import './globals.css';


// TODO: Remove this once SpeedInsights is ready
import { ChatProvider } from '@/contexts/ChatContext';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
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

        {/* TODO: Remove this once SpeedInsights is ready */}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
