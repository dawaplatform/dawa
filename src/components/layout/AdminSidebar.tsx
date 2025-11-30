'use client';

import { BarChart3, Folder, LayoutDashboard, ShoppingBag, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import Logo3 from '@public/assets/svgs/DAWA_VARIATION_04.svg';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'Users', icon: Users, exact: false },
  { href: '/admin/items', label: 'Items', icon: ShoppingBag, exact: false },
  { href: '/admin/categories', label: 'Categories', icon: Folder, exact: false },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3, exact: false },
];

const AdminSidebar: React.FC = () => {
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
    <aside className="sticky top-0 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo/Brand */}
      <div className="px-4 py-4 border-b border-gray-200">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Logo3 className="h-9 w-auto" />
          <div className="hidden xl:block">
            <div className="text-xs text-gray-500 font-medium">Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = isLinkActive(link.href, link.exact || false);
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group
                ${
                  isActive
                    ? 'bg-primary_1 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary_1'
                }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary_1'}`} />
              <span className="truncate">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <div className="font-medium hidden lg:block">Dawa Admin Panel</div>
          <div className="text-[10px]">v1.0.0</div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar; 