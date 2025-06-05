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
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/items', label: 'Items', icon: ShoppingBag },
  { href: '/admin/categories', label: 'Categories', icon: Folder },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
];

const AdminMobileNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-md md:hidden">
      <div className="flex justify-between items-center px-2">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 py-2 px-1 text-xs font-medium transition-colors duration-200
                ${isActive ? 'text-primary-600 font-semibold' : 'text-slate-500 hover:text-primary-600'}`}
            >
              <Icon className={`w-6 h-6 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default AdminMobileNav;
