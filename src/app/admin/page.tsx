// Example: c:\Users\PC\Desktop\dawa\dawa\src\app\admin\dashboard\page.tsx

// No need to import AdminGuard or AdminNavbar here anymore,
// as they are handled by app/admin/layout.tsx

'use client';

import { AlertTriangle, BarChart3, Eye, Heart, List, Loader2, Mail, Share2, ShoppingBag, Star, User, UserCog, Users } from 'lucide-react';
import { useAdminDashboardStats } from '../server/admin/api';

export default function AdminDashboardPage() {
  const { stats, isLoading, isError } = useAdminDashboardStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2">Loading dashboard data...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>Error loading dashboard data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">
        Dashboard Overview
      </h1>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Users className="w-7 h-7 text-primary-500" />} label="Total Users" value={stats?.total_users || 0} accent="primary" />
        <StatCard icon={<UserCog className="w-7 h-7 text-blue-500" />} label="Admins" value={stats?.total_admins || 0} accent="blue" />
        <StatCard icon={<ShoppingBag className="w-7 h-7 text-green-500" />} label="Vendors" value={stats?.total_vendors || 0} accent="green" />
        <StatCard icon={<User className="w-7 h-7 text-amber-500" />} label="Clients" value={stats?.total_clients || 0} accent="amber" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<List className="w-7 h-7 text-primary-500" />} label="Total Items" value={stats?.total_items || 0} accent="primary" />
        <StatCard icon={<Star className="w-7 h-7 text-green-500" />} label="Approved Items" value={stats?.total_approved_items || 0} accent="green" />
        <StatCard icon={<AlertTriangle className="w-7 h-7 text-amber-500" />} label="Pending Approval" value={stats ? (stats.total_items - stats.total_approved_items) : 0} accent="amber" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Heart className="w-7 h-7 text-pink-500" />} label="Total Likes" value={stats?.total_likes || 0} accent="pink" />
        <StatCard icon={<Eye className="w-7 h-7 text-blue-500" />} label="Total Views" value={stats?.total_views || 0} accent="blue" />
        <StatCard icon={<Share2 className="w-7 h-7 text-indigo-500" />} label="Total Shares" value={stats?.total_shares || 0} accent="indigo" />
        <StatCard icon={<BarChart3 className="w-7 h-7 text-purple-500" />} label="Wishlist Actions" value={stats?.total_wishlist_actions || 0} accent="purple" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <StatCard icon={<AlertTriangle className="w-7 h-7 text-red-500" />} label="Reports" value={stats?.total_reports || 0} accent="red" />
        <StatCard icon={<Mail className="w-7 h-7 text-green-500" />} label="Newsletter Subscribers" value={stats?.total_subscribers || 0} accent="green" />
      </div>
    </div>
  );
}

// StatCard component for consistent card design
function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center min-h-[120px]">
      <div className="mb-2">{icon}</div>
      <div className="text-lg font-semibold text-slate-700">{label}</div>
      <div className={`text-2xl font-bold mt-1 text-${accent}-600`}>{value}</div>
    </div>
  );
}
