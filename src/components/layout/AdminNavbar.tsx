'use client';

import { useAuth } from '@/@core/hooks/use-auth';
import { Home, LogOut, Menu, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import AdminSidebar from './AdminSidebar';
import { adminNavLinks, isAdminLinkActive } from './adminNav';

interface AdminNavbarProps {
  onMobileMenuOpen?: (open: boolean) => void;
}

const AdminNavbar = ({ onMobileMenuOpen }: AdminNavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleMobileMenuChange = (open: boolean) => {
    setMobileMenuOpen(open);
    onMobileMenuOpen?.(open);
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/90">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-0">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile menu button and Search bar */}
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={handleMobileMenuChange}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden hover:bg-muted"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <AdminSidebar />
              </SheetContent>
            </Sheet>

            <h2 className="truncate text-base font-semibold text-foreground">
              {adminNavLinks.find((link) => isAdminLinkActive(pathname, link.href, link.exact))?.label ?? 'Admin'}
            </h2>
          </div>

          {/* Right: User menu and actions */}
          <div className="flex items-center gap-4">
            {/* Home link */}
            <Link
              href="/home"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted hover:text-primary_1 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>View Site</span>
            </Link>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-muted"
                >
                  <div className="h-8 w-8 rounded-full bg-primary_1 flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-foreground">
                      {user?.name || 'Admin'}
                    </div>
                    <div className="text-xs text-muted-foreground">Administrator</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 md:hidden">
                  <div className="text-sm font-medium text-foreground">
                    {user?.name || 'Admin'}
                  </div>
                  <div className="text-xs text-muted-foreground">{user?.email}</div>
                </div>
                <DropdownMenuSeparator className="md:hidden" />
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="md:hidden">
                  <Link
                    href="/home"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Home className="h-4 w-4" />
                    View Site
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
