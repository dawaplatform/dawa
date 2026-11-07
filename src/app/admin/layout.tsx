import AdminGuard from '@/@core/hocs/AdminGuard';
import AdminThemeSync from '@/components/admin/AdminThemeSync';
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
      <AdminThemeSync />
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Sidebar - shown on medium and up, optimized width */}
        <aside className="hidden md:block md:w-64 bg-background border-r border-border">
          <AdminSidebar />
        </aside>

        {/* Main content area */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <AdminNavbar />

          <div className="flex-1 overflow-y-auto bg-background">
            <div className="mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-6">
              {children}
            </div>
          </div>

          <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 md:hidden">
            <div className="pointer-events-auto">
              <AdminMobileNav />
            </div>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
