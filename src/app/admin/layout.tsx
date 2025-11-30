import AdminGuard from '@/@core/hocs/AdminGuard';
import AdminMobileNav from '@/components/layout/AdminMobileNav';
import AdminNavbar from '@/components/layout/AdminNavbar';
import AdminSidebar from '@/components/layout/AdminSidebar';
import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar - shown on medium and up, optimized width */}
        <aside className="hidden md:block md:w-60 lg:w-64 bg-white shadow-lg border-r border-gray-200">
          <AdminSidebar />
        </aside>

        {/* Main content area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Admin Top Navbar */}
          <AdminNavbar />

          {/* Content area with optimized padding */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-6 pb-20 md:pb-6">
              {children}
            </div>
          </div>

          {/* Mobile nav - only on small screens */}
          <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
            <AdminMobileNav />
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
