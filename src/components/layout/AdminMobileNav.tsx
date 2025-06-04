import { BarChart3, Folder, LayoutDashboard, ShoppingBag, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-6 h-6" /> },
  { href: '/admin/users', label: 'Users', icon: <Users className="w-6 h-6" /> },
  { href: '/admin/items', label: 'Items', icon: <ShoppingBag className="w-6 h-6" /> },
  { href: '/admin/categories', label: 'Categories', icon: <Folder className="w-6 h-6" /> },
  { href: '/admin/reports', label: 'Reports', icon: <BarChart3 className="w-6 h-6" /> },
];

const AdminMobileNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow md:hidden">
      <div className="flex justify-between items-center px-2 py-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center flex-1 py-2 px-1 text-xs font-medium transition-colors
                ${isActive ? 'text-primary-600' : 'text-slate-500 hover:text-primary-600'}`}
            >
              {link.icon}
              <span className="mt-1">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default AdminMobileNav; 