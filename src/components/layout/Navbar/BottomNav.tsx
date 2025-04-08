'use client';

import { motion } from 'framer-motion';
import { Home, PlusCircle, MessageSquare, User } from 'lucide-react';
import { useScrollDirection } from '@core/hooks/useScrollDirection';
import { useAuth } from '@core/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useDispatch } from '@redux-store/hooks';
import { Heart } from 'lucide-react';
import { openAuthDialog } from '@redux-store/slices/authDialog/authDialogSlice';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Heart, label: 'Wishlist', href: '/wishlist' },
  { icon: PlusCircle, label: 'Sell', href: '/post-ad' },
  { icon: MessageSquare, label: 'Messages', href: '/messages' },
  { icon: User, label: 'Profile', href: '/account' },
];

export function BottomNav() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { scrollDirection, pathname } = useScrollDirection();
  const { user } = useAuth();

  const handleSelect = (url: string) => {
    if (!user && url !== '/') {
      dispatch(openAuthDialog());
      return;
    }

    switch (url) {
      case '/messages':
        // Handle Messages-specific logic here if needed
        break;
      case '/favorites':
        // Handle Favorites-specific logic here if needed
        break;
      case '/profile':
        // Handle Profile-specific logic here if needed
        break;
      case '/sell':
        // Handle Sell-specific logic here if needed
        break;
      default:
        break;
    }

    router.push(url);
  };

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden"
      initial={{ y: 0 }}
      animate={{ y: scrollDirection === 'down' ? '100%' : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto">
        <div className="flex justify-around items-center h-16 bg-white bg-opacity-80 backdrop-blur-md border-t border-gray-200 rounded-t-lg shadow-lg">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.label}
                onClick={() => handleSelect(item.href)}
                className="flex flex-col items-center w-16 py-1"
              >
                <motion.div
                  className={`p-2 rounded-full ${isActive ? 'bg-orange-100' : ''}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <item.icon
                    className={`w-6 h-6 ${isActive ? 'text-orange-500' : 'text-gray-700'}`}
                  />
                </motion.div>
                <span
                  className={`text-xs mt-1 ${isActive ? 'text-orange-500 font-medium' : 'text-gray-700'}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
