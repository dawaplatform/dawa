'use client';

// Example: If you have a themed loader component
// import ThemedLoader from '@/components/ui/ThemedLoader';

import { useProfile } from '@/contexts/profile-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { userProfile, isLoading } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!userProfile || userProfile?.role !== 'Admin') {
        router.push('/unauthorized');
      }
    }
  }, [userProfile, isLoading, router]);

  if (isLoading) {
    // Option 1: Use a themed loader component if you have one
    // return <ThemedLoader />;

    // Option 2: Apply some basic themed styling (example)
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-primary-color, #333)' }}>Loading admin area...</div>;
  }

  return <>{children}</>;
};

export default AdminGuard;
