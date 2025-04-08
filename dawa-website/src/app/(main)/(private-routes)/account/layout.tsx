import Sidebar from '@/views/pages/account/components/Sidebar';
import type { ReactNode } from 'react';

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar className="hidden lg:block" />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 bg-gray-100">
          <div className="md:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
