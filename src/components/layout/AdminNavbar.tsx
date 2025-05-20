import Link from 'next/link';
// Consider adding an icon library if you use icons elsewhere, e.g., lucide-react
// import { Users, ShoppingBag, BarChart3 } from 'lucide-react';

const AdminNavbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto flex items-center justify-between">
        <div className="py-4">
          <Link
            href="/admin"
            className="text-xl font-semibold text-slate-800 hover:text-primary-600 transition-colors"
            // Replace text-primary-600 with your actual primary theme color if defined in tailwind.config.js
            // e.g., className="text-xl font-semibold text-primary hover:text-primary-dark"
          >
            Dawa Admin
          </Link>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {[
            { href: '/admin/users', label: 'Users' /* icon: <Users size={18} /> */ },
            { href: '/admin/items', label: 'Items' /* icon: <ShoppingBag size={18} /> */ },
            { href: '/admin/categories', label: 'Categories' /* icon: <Folder size={18} /> */ },
            { href: '/admin/reports', label: 'Reports' /* icon: <BarChart3 size={18} /> */ },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center space-x-2"
            >
              {/* {item.icon} */}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
