'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import Logo3 from '@public/assets/svgs/DAWA_VARIATION_04.svg';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { adminNavLinks, isAdminLinkActive } from './adminNav';

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 h-screen bg-background border-r border-border flex flex-col">
      {/* Logo/Brand */}
      <div className="px-4 py-5 border-b border-border flex-shrink-0">
        <Link href="/admin" className="flex items-center justify-center hover:opacity-90 transition-opacity">
          <Logo3 className="h-14 w-auto fill-foreground" />
        </Link>
      </div>

      {/* Navigation with ScrollArea */}
      <ScrollArea className="flex-1 px-2.5 py-3">
        <nav className="space-y-1">
          {adminNavLinks.map((link) => {
            const isActive = isAdminLinkActive(pathname, link.href, link.exact);
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-primary_1 text-white shadow-sm'
                    : 'text-foreground/80 hover:bg-muted hover:text-primary_1'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5 flex-shrink-0 transition-colors',
                  isActive 
                    ? 'text-white' 
                    : 'text-muted-foreground group-hover:text-primary_1'
                )} />
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border flex-shrink-0">
        <div className="text-xs text-muted-foreground text-center">
          <div className="text-[10px]">v1.0.0</div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar; 