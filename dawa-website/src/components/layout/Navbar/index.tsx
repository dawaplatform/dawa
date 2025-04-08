'use client';

import { useProfile } from '@/contexts/profile-context';
import { useAuth } from '@core/hooks/use-auth';
import { useDispatch } from '@redux-store/hooks';
import { openAuthDialog } from '@redux-store/slices/authDialog/authDialogSlice';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

export const DEFAULT_AVATAR = '/assets/default-avatar.png';

export const normalizeUserProfile = (userProfile: any): any | null => {
  if (!userProfile) return null;
  return {
    first_name: userProfile.user.first_name,
    last_name: userProfile.user.last_name,
    email: userProfile.user.email,
    user_profile_picture: userProfile.profile_picture || DEFAULT_AVATAR,
  };
};

export const normalizeUserFromAuth = (user: any): any | null => {
  if (!user) return null;
  return {
    first_name: user.name.split(' ')[0],
    last_name: user.name.split(' ')[1],
    email: user.email,
    user_profile_picture: user.image,
  };
};

const NavBar: React.FC<any> = ({ closeOnSelect = true }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter(); // Added router import and declaration
  const isHomePage = pathname === '/' || pathname === '/home';

  const [isSticky, setIsSticky] = useState(false);

  const { user, loading, logout } = useAuth();
  const { userProfile } = useProfile();

  const normalizedUserProfile = normalizeUserProfile(userProfile);
  const normalizedUserFromAuth = normalizeUserFromAuth(user);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSellClick = () => {
    if (!user) {
      dispatch(openAuthDialog());
    } else {
      router.push('/post-ad');
    }
  };

  return (
    <div className="relative z-50">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: 'tween', ease: 'anticipate' }}
        className="fixed top-0 left-0 right-0 z-50 shadow"
      >
        <DesktopNav
          isSticky={isSticky}
          user={normalizedUserProfile || normalizedUserFromAuth}
          loading={loading}
          logout={logout}
          handleSellClick={handleSellClick}
        />
        <MobileNav
          isHomePage={isHomePage}
          user={user}
          normalizedUserProfile={normalizedUserProfile}
          normalizedUserFromAuth={normalizedUserFromAuth}
        />
      </motion.nav>
    </div>
  );
};

export default NavBar;
