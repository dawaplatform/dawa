'use client';

import MainConfigs from '@/@core/configs/mainConfigs';
import BackButton from '@/components/shared/BackButton';
import Button from '@/components/shared/Button';
import SearchBar from '@/components/features/search/SearchBar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDispatch } from '@/redux-store/hooks';
import { openAuthDialog } from '@/redux-store/slices/authDialog/authDialogSlice';

import Logo3 from '@public/assets/svgs/DAWA_VARIATION_04.svg';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { LogOut, Settings, ShoppingCart, User } from 'lucide-react';

import { useAuth } from '@/@core/hooks/use-auth';
import { setSelectedUserId } from '@/redux-store/slices/myshop/selectedUserSlice';

const MobileNav: React.FC<any> = ({
  isHomePage,
  user,
  normalizedUserProfile,
  normalizedUserFromAuth,
}) => {
  const { logout } = useAuth();
  const dispatch = useDispatch();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => setIsSearchOpen((prev) => !prev);

  return (
    <motion.div
      className="md:hidden bg-white shadow-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {!isHomePage && <BackButton />}
          <Link href={MainConfigs.homePageUrl} className="flex-shrink-0">
            <Logo3 className="h-20 -m-6 w-auto" />
          </Link>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary_1"
              onClick={toggleSearch}
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" />
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      className="relative rounded-full h-10 w-10 p-1 overflow-hidden"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            normalizedUserProfile?.user_profile_picture ||
                            normalizedUserFromAuth?.user_profile_picture
                          }
                          alt={`${normalizedUserProfile?.first_name || normalizedUserFromAuth?.first_name} ${
                            normalizedUserProfile?.last_name ||
                            normalizedUserFromAuth?.last_name
                          }`}
                        />
                        <AvatarFallback className="bg-primary_1 text-white">
                          {(
                            normalizedUserProfile?.first_name ||
                            normalizedUserFromAuth?.first_name
                          )?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 mt-2"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {`${normalizedUserProfile?.first_name || normalizedUserFromAuth?.first_name} ${
                          normalizedUserProfile?.last_name ||
                          normalizedUserFromAuth?.last_name
                        }`}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/account">
                        <div className="flex items-center cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Account</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-shop">
                        <button
                          type="button"
                          className="flex items-center cursor-pointer"
                          onClick={() => {
                            localStorage.setItem(
                              'selectedShopId',
                              String(user.id),
                            );
                            dispatch(setSelectedUserId(user.id as any));
                          }}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          <span>My Shop</span>
                        </button>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/settings">
                        <div className="flex items-center cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="text-primary_1"
                onClick={() => dispatch(openAuthDialog())}
              >
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-200"
          >
            <div className="container mx-auto px-4 py-3">
              <SearchBar onClose={() => setIsSearchOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MobileNav;
