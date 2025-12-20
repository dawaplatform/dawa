'use client';

import {
  AlertTriangle,
  BarChart3,
  Eye,
  Heart,
  List,
  Loader2,
  Mail,
  Share2,
  ShoppingBag,
  Star,
  TrendingUp,
  User,
  UserCog,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useAdminDashboardStats } from '../server/admin/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AdminDashboardPage() {
  const { stats, isLoading, isError } = useAdminDashboardStats();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary_1" />
        <span className="text-gray-600">Loading dashboard data...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <p className="text-red-700">Error loading dashboard data. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header - More compact */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* User Stats Cards - Optimized grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          href="/admin/users"
          icon={<Users className="w-5 h-5" />}
          label="Total Users"
          value={stats?.total_users || 0}
          trend={null}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          valueColor="text-blue-600"
        />
        <StatCard
          href="/admin/users?role=Admin"
          icon={<UserCog className="w-5 h-5" />}
          label="Admins"
          value={stats?.total_admins || 0}
          trend={null}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          valueColor="text-purple-600"
        />
        <StatCard
          href="/admin/users?role=Vendor"
          icon={<ShoppingBag className="w-5 h-5" />}
          label="Vendors"
          value={stats?.total_vendors || 0}
          trend={null}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          valueColor="text-green-600"
        />
        <StatCard
          href="/admin/users?role=Client"
          icon={<User className="w-5 h-5" />}
          label="Clients"
          value={stats?.total_clients || 0}
          trend={null}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          valueColor="text-amber-600"
        />
      </div>

      {/* Item Stats Cards - Better space usage */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          href="/admin/items"
          icon={<List className="w-5 h-5" />}
          label="Total Items"
          value={stats?.total_items || 0}
          trend={null}
          iconBg="bg-primary_2"
          iconColor="text-primary_1"
          valueColor="text-primary_1"
        />
        <StatCard
          href="/admin/items?status=approved"
          icon={<Star className="w-5 h-5" />}
          label="Approved Items"
          value={stats?.total_approved_items || 0}
          trend={null}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          valueColor="text-green-600"
        />
        <StatCard
          href="/admin/items?status=pending"
          icon={<AlertTriangle className="w-5 h-5" />}
          label="Pending Approval"
          value={stats ? stats.total_items - stats.total_approved_items : 0}
          trend={null}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          valueColor="text-amber-600"
        />
      </div>

      {/* Engagement Stats Cards - Optimized */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Heart className="w-5 h-5" />}
          label="Total Likes"
          value={stats?.total_likes || 0}
          trend={null}
          iconBg="bg-pink-100"
          iconColor="text-pink-600"
          valueColor="text-pink-600"
        />
        <StatCard
          icon={<Eye className="w-5 h-5" />}
          label="Total Views"
          value={stats?.total_views || 0}
          trend={null}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          valueColor="text-blue-600"
        />
        <StatCard
          icon={<Share2 className="w-5 h-5" />}
          label="Total Shares"
          value={stats?.total_shares || 0}
          trend={null}
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
          valueColor="text-indigo-600"
        />
        <StatCard
          icon={<BarChart3 className="w-5 h-5" />}
          label="Wishlist Actions"
          value={stats?.total_wishlist_actions || 0}
          trend={null}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          valueColor="text-purple-600"
        />
      </div>

      {/* Additional Stats - Compact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StatCard
          href="/admin/reports"
          icon={<AlertTriangle className="w-5 h-5" />}
          label="Reports"
          value={stats?.total_reports || 0}
          trend={null}
          iconBg="bg-red-100"
          iconColor="text-red-600"
          valueColor="text-red-600"
        />
        <StatCard
          href="/admin/reports"
          icon={<Mail className="w-5 h-5" />}
          label="Newsletter Subscribers"
          value={stats?.total_subscribers || 0}
          trend={null}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          valueColor="text-green-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        {/* User Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Admins', value: stats?.total_admins || 0 },
                    { name: 'Vendors', value: stats?.total_vendors || 0 },
                    { name: 'Clients', value: stats?.total_clients || 0 },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#9333ea" />
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Items Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Items Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: 'Total',
                    value: stats?.total_items || 0,
                  },
                  {
                    name: 'Approved',
                    value: stats?.total_approved_items || 0,
                  },
                  {
                    name: 'Pending',
                    value: (stats?.total_items || 0) - (stats?.total_approved_items || 0),
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#ffa200" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Metrics Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: 'Likes',
                    value: stats?.total_likes || 0,
                  },
                  {
                    name: 'Views',
                    value: stats?.total_views || 0,
                  },
                  {
                    name: 'Shares',
                    value: stats?.total_shares || 0,
                  },
                  {
                    name: 'Wishlist',
                    value: stats?.total_wishlist_actions || 0,
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Enhanced StatCard component with modern design - optimized for space
function StatCard({
  href,
  icon,
  label,
  value,
  trend,
  iconBg,
  iconColor,
  valueColor,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
  value: number;
  trend: number | null;
  iconBg: string;
  iconColor: string;
  valueColor: string;
}) {
  const cardContent = (
    <Card className={cn(
      "transition-all duration-200 border-gray-200",
      href && "hover:shadow-lg hover:scale-[1.02] cursor-pointer"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1.5 truncate">{label}</p>
            <p className={`text-2xl sm:text-3xl font-bold ${valueColor} mb-0`}>
              {value.toLocaleString()}
            </p>
            {trend !== null && (
              <div className="flex items-center gap-1 text-xs mt-1.5">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-green-600 font-medium">+{trend}%</span>
                <span className="text-gray-500">from last month</span>
              </div>
            )}
          </div>
          <div className={`${iconBg} p-2.5 rounded-lg flex-shrink-0`}>
            <div className={iconColor}>{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
