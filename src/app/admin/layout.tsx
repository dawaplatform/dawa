import AdminGuard from '@/@core/hocs/AdminGuard';
import AdminMobileNav from '@/components/layout/AdminMobileNav';
import AdminSidebar from '@/components/layout/AdminSidebar';
import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar - shown on medium and up */}
        <aside className="hidden md:block md:w-64 bg-white shadow-lg">
          <AdminSidebar />
        </aside>

        {/* Main content area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            {children}
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
