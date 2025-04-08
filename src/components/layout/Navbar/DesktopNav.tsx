'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid } from 'react-icons/fi';
import { Menu } from 'lucide-react';
import { useDispatch } from '@redux-store/hooks';

import Logo3 from '@public/assets/svgs/DAWA_VARIATION_04.svg';
import { UserNav } from './user-nav';
import { UserNavSkeleton } from './UserNavSkeleton';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Button from '@/components/shared/Button';
import Sidebar from '@/views/pages/category/components/Sidebar';
import MobileSheetContent from './MobileSheetContent';
import MainConfigs from '@/@core/configs/mainConfigs';
import SearchBar from '@/components/features/search/SearchBar';

interface DesktopNavProps {
  isSticky: boolean;
  user: any | null;
  loading: boolean;
  logout: () => void;
  handleSellClick: () => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({
  isSticky,
  user,
  loading,
  logout,
  handleSellClick,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleDesktopCategorySelect = () => {
    setShowDropdown(false);
  };

  return (
    <div className="bg-white hidden sm:block">
      <div
        className={`${MainConfigs.maxWidthClass} flex items-center justify-between ${
          isSticky ? 'py-2' : 'py-4'
        } transition-all duration-300 ease-in-out`}
      >
        <div className="lg:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                icon={Menu}
                className="rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 h-10 w-10"
              />
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <MobileSheetContent onClose={() => setIsSheetOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        <Link href={MainConfigs.homePageUrl} className="flex-shrink-0">
          <Logo3
            className={`w-auto transition-all duration-300 lg:-ml-8 ease-in-out ${
              isSticky ? 'h-24 -my-4' : 'h-28 -my-9'
            }`}
          />
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {pathname !== '/' && pathname !== '/cat' && pathname !== '/home' && (
            <div className="relative" ref={dropdownRef}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  icon={FiGrid}
                  className="flex items-center gap-2 text-gray-700 bg-transparent shadow-none hover:text-primary_1 rounded-xl"
                  onClick={() => setShowDropdown((prev) => !prev)}
                >
                  <span>Categories</span>
                </Button>
              </motion.div>
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 top-full mt-2 w-auto z-[9999]"
                  >
                    <Sidebar onSelect={handleDesktopCategorySelect} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center flex-grow mx-8">
          <SearchBar />
        </div>

        <div className="flex items-center gap-4">
          {loading ? (
            <UserNavSkeleton />
          ) : user ? (
            <>
              <UserNav user={user} onLogout={logout} />
              <Button
                className="text-white px-6 py-2 bg-gray-700 font-semibold h-10 text-sm transition-all duration-300"
                onClick={handleSellClick}
              >
                Sell
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary_1 font-medium transition-colors duration-300"
                >
                  Log in
                </Link>
                <span className="mx-2 text-gray-400">|</span>
                <Link
                  href="/register"
                  className="text-primary_1 font-semibold hover:text-primary_1/80 transition-colors duration-300"
                >
                  Sign up
                </Link>
              </div>
              <Button
                className="text-white px-6 py-2 bg-gray-700 font-semibold h-10 text-sm transition-all duration-300 hover:bg-gray-800"
                onClick={handleSellClick}
              >
                Sell
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopNav;
