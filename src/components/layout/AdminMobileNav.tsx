'use client';

import {
  BarChart3,
  Folder,
  LayoutDashboard,
  ShoppingBag,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'Users', icon: Users, exact: false },
  { href: '/admin/items', label: 'Items', icon: ShoppingBag, exact: false },
  { href: '/admin/categories', label: 'Categories', icon: Folder, exact: false },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3, exact: false },
];

const AdminMobileNav: React.FC = () => {
  const pathname = usePathname();

  // Helper function to determine if a link is active
  const isLinkActive = (href: string, exact: boolean) => {
    if (exact) {
      // For dashboard (/admin), only match exactly
      return pathname === href;
    } else {
      // For other routes, match exactly or if pathname starts with route + '/'
      return pathname === href || pathname?.startsWith(href + '/');
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex justify-around items-center px-1 py-2 safe-area-bottom">
        {navLinks.map(({ href, label, icon: Icon, exact }) => {
          const isActive = isLinkActive(href, exact || false);

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 py-2 px-1 text-xs font-medium transition-all duration-200 min-w-0
                ${
                  isActive
                    ? 'text-primary_1 font-semibold'
                    : 'text-gray-500 hover:text-primary_1'
                }`}
            >
              <div
                className={`p-2 rounded-lg mb-1 transition-all ${
                  isActive ? 'bg-primary_2' : ''
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive
                      ? 'text-primary_1 stroke-[2.5]'
                      : 'text-gray-500 stroke-[1.5]'
                  }`}
                />
              </div>
              <span className="truncate w-full text-center">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default AdminMobileNav;
