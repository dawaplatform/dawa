import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWishlist } from '@/contexts/WishlistContext';
import { useDispatch } from '@/redux-store/hooks';
import { setSelectedUserId } from '@/redux-store/slices/myshop/selectedUserSlice';
import { motion } from 'framer-motion';
import {
  LogOut,
  MessageSquare,
  Settings,
  ShoppingCart,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';

import { useAuth } from '@/@core/hooks/use-auth';

const formatCount = (count: number) => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
};

export function UserNav({
  user,
  onLogout,
}: {
  user: any;
  onLogout: () => void;
}) {
  const { user: currentUser } = useAuth();
  const dispatch = useDispatch();
  // Use the wishlist context to get the count.
  const { wishlistCount } = useWishlist();

  // Assert that wishlistCount is a number, or provide a default value.
  const safeWishlistCount =
    typeof wishlistCount === 'number' ? wishlistCount : 0;

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/wishlist"
        className="relative hidden lg:flex items-center justify-center"
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 bg-gray-100 hover:bg-gray-200"
          >
            <FaHeart className="h-5 w-5 text-gray-700" />
            {safeWishlistCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-primary_1 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {formatCount(safeWishlistCount)}
              </motion.span>
            )}
          </Button>
        </motion.div>
      </Link>

      <Link
        href="/messages"
        className="relative hidden lg:flex items-center justify-center"
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 bg-gray-100 hover:bg-gray-200"
          >
            <MessageSquare className="h-5 w-5 text-gray-700" />
          </Button>
        </motion.div>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              className="relative rounded-full h-12 w-12 p-1 hidden lg:block overflow-hidden"
            >
              <Avatar className="h-full w-full">
                <AvatarImage
                  src={user.user_profile_picture}
                  alt={`${user.first_name} ${user.last_name}`}
                />
                <AvatarFallback>{user.first_name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </motion.div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{`${user.first_name} ${user.last_name}`}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link
                href="/account"
                className="cursor-pointer flex items-center"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/my-shop">
                <button
                  type="button"
                  className="cursor-pointer flex items-center"
                  onClick={() => {
                    // Store the selected seller ID in localStorage
                    localStorage.setItem(
                      'selectedShopId',
                      String(currentUser?.id),
                    );
                    dispatch(setSelectedUserId(currentUser?.id as any));
                  }}
                >
                  <ShoppingCart className="mr-4 h-4 w-4" />
                  <span>My Shop</span>
                </button>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/account/settings"
                className="cursor-pointer flex items-center"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onLogout}
            className="text-red-600 flex items-center"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
