'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { adminNavLinks, isAdminLinkActive } from './adminNav';

const AdminMobileNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] md:hidden">
      <div className="flex justify-around items-center px-1 py-2 safe-area-bottom">
        {adminNavLinks.map(({ href, label, icon: Icon, exact }) => {
          const isActive = isAdminLinkActive(pathname, href, exact);

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
