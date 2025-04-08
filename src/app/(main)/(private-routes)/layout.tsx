'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout';
import mainConfig from '@/@core/configs/mainConfigs';
import { useAuth } from '@core/hooks/use-auth';
import type React from 'react';
import Loader from '@/components/features/loaders/SubLoader';

export default function WishListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading) {
      if (user) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        router.push('/unauthorized');
      }
    }
  }, [user, loading, router]);

  if (loading || isAuthorized === null) {
    return (
      <Layout addFooter={false}>
        <div className="flex items-center justify-center h-[400px]">
          <Loader />
        </div>
      </Layout>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <Layout addFooter={false}>
      <main className={`${mainConfig.maxWidthClass} min-h-dvh`}>
        {children}
      </main>
    </Layout>
  );
}
