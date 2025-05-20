// Example: c:\Users\PC\Desktop\dawa\dawa\src\app\admin\dashboard\page.tsx

// No need to import AdminGuard or AdminNavbar here anymore,
// as they are handled by app/admin/layout.tsx

'use client';

import { Loader2 } from 'lucide-react';
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Users Stats */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-slate-700">Total Users</h2>
          <p className="text-3xl font-bold text-primary-600 mt-2">{stats?.total_users || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-slate-700">Admins</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats?.total_admins || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-slate-700">Vendors</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats?.total_vendors || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-slate-700">Clients</h2>
          <p className="text-3xl font-bold text-amber-600 mt-2">{stats?.total_clients || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Items Stats */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-slate-700">Total Items</h2>
          <p className="text-3xl font-bold text-primary-600 mt-2">{stats?.total_items || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-slate-700">Approved Items</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats?.total_approved_items || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-slate-700">Pending Approval</h2>
          <p className="text-3xl font-bold text-amber-600 mt-2">
            {stats ? (stats.total_items - stats.total_approved_items) : 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Engagement Stats */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-slate-700">Total Likes</h2>
          <p className="text-3xl font-bold text-pink-600 mt-2">{stats?.total_likes || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-slate-700">Total Views</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats?.total_views || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-slate-700">Total Shares</h2>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{stats?.total_shares || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-slate-700">Wishlist Actions</h2>
          <p className="text-3xl font-bold text-purple-600 mt-2">{stats?.total_wishlist_actions || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Other Stats */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-slate-700">Reports</h2>
          <p className="text-3xl font-bold text-red-500 mt-2">{stats?.total_reports || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-slate-700">Newsletter Subscribers</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats?.total_subscribers || 0}</p>
        </div>
      </div>
    </div>
  );
}
