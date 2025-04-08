'use client';

import { useAuth } from '@/@core/hooks/use-auth';
import { useUserProfile } from '@/@core/hooks/useProductData';
import { createContext, useContext, type ReactNode } from 'react';

interface UserProfile {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    date_joined: string;
    last_login: string;
  };
  contact: string | null;
  address: string | null;
  profile_picture: string | null;
  national_id_or_passport_number: string | null;
  national_id_or_passport_document: string | null;
}

interface ProfileContextType {
  userProfile: UserProfile | null;
  items: any;
  isLoading: boolean;
  isError: any;
  mutate: () => void;
}

// Create the context with an undefined default value.
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

/**
 * This component is rendered when a user is logged in.
 * It calls `useUserProfile` and provides its values via context.
 */
function ProfileProviderWithUser({ children }: { children: ReactNode }) {
  const { userProfile, items, isLoading, isError, mutate } = useUserProfile();

  return (
    <ProfileContext.Provider
      value={{ userProfile, items, isLoading, isError, mutate }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

/**
 * The main ProfileProvider checks if the user is logged in.
 * - If not, it provides default values without calling `useUserProfile`.
 * - If a user exists, it renders the child provider that calls the hook.
 */
export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    const defaultValue: ProfileContextType = {
      userProfile: null,
      items: [],
      isLoading: false,
      isError: null,
      mutate: () => {
        /* no-op */
      },
    };

    return (
      <ProfileContext.Provider value={defaultValue}>
        {children}
      </ProfileContext.Provider>
    );
  }

  return <ProfileProviderWithUser>{children}</ProfileProviderWithUser>;
}

/**
 * Custom hook to access the ProfileContext.
 */
export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
