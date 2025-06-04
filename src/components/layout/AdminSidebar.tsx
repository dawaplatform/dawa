import { BarChart3, Folder, LayoutDashboard, ShoppingBag, Users } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { href: '/admin/users', label: 'Users', icon: <Users className="w-5 h-5" /> },
  { href: '/admin/items', label: 'Items', icon: <ShoppingBag className="w-5 h-5" /> },
  { href: '/admin/categories', label: 'Categories', icon: <Folder className="w-5 h-5" /> },
  { href: '/admin/reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
];

const AdminSidebar: React.FC = () => {
  const router = typeof window !== 'undefined' ? require('next/router').useRouter() : { pathname: '' };
  const currentPath = router.pathname;

  return (
    <aside className="h-full bg-white border-r border-slate-200 flex flex-col py-6 px-4">
      <div className="mb-8">
        <Link href="/admin" className="text-2xl font-bold text-primary-600 tracking-tight">
          Dawa Admin
        </Link>
      </div>
      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => {
          const isActive = currentPath === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors
                ${isActive ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="flex-1" />
      {/* Optionally add a footer or version info here */}
    </aside>
  );
};

export default AdminSidebar; 