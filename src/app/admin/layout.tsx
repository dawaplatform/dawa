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
      <div className="flex min-h-screen bg-slate-50">
        {/* Sidebar for desktop */}
        <div className="hidden md:block w-64 flex-shrink-0 h-full">
          <AdminSidebar />
        </div>
        <div className="flex-1 flex flex-col min-h-screen">
          <AdminNavbar />
          <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 md:pl-0">
            {/* This is where the content of your individual admin pages will go */}
            {children}
          </main>
          {/* Mobile nav only on mobile */}
          <div className="md:hidden">
            <AdminMobileNav />
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}