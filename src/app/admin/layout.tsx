import AdminGuard from '@/@core/hocs/AdminGuard';
import AdminNavbar from '@/components/layout/AdminNavbar';
import React from 'react';


interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (

 <AdminGuard>
      <div className="flex flex-col min-h-screen bg-slate-50">
        {/*
          Replace bg-slate-50 with your desired admin area background color.
          This could be the same as your main site or a slightly different shade
          to visually distinguish the admin area while maintaining theme consistency.
        */}
        <AdminNavbar />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
          {/* This is where the content of your individual admin pages will go */}
          {children}
        </main>
        {/* You could add an AdminFooter here if needed */}
      </div>
    </AdminGuard>
  );
}