'use client';

import {
  AlertTriangle,
  BarChart3,
  Eye,
  Heart,
  List,
  Loader2,
  Mail,
  MessageSquare,
  Share2,
  ShoppingBag,
  Star,
  TrendingUp,
  User,
  UserCog,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useAdminAnalytics, useAdminDashboardStats } from '../server/admin/api';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
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
  LineChart,
  Line,
} from 'recharts';
import { useMemo } from 'react';

export default function AdminDashboardPage() {
  const { stats, isLoading, isError } = useAdminDashboardStats();
  const { analytics, isLoading: analyticsLoading } = useAdminAnalytics();

  const trendData = useMemo(() => {
    const users = analytics?.trends.user_registrations || [];
    const products = analytics?.trends.product_posts || [];
    const chats = analytics?.trends.chats_created || [];
    const messages = analytics?.trends.messages_sent || [];

    return users.map((point, index) => ({
      date: new Date(point.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      users: point.count,
      products: products[index]?.count || 0,
      chats: chats[index]?.count || 0,
      messages: messages[index]?.count || 0,
    }));
  }, [analytics]);

  if (isLoading || analyticsLoading) {
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
      <AdminPageHeader
        title="Dashboard"
        description="Overview of users, listings, engagement, and trends."
      />

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
          href="/admin/reports"
          icon={<Heart className="w-5 h-5" />}
          label="Total Likes"
          value={stats?.total_likes || 0}
          trend={null}
          iconBg="bg-pink-100"
          iconColor="text-pink-600"
          valueColor="text-pink-600"
        />
        <StatCard
          href="/admin/reports"
          icon={<Eye className="w-5 h-5" />}
          label="Total Views"
          value={stats?.total_views || 0}
          trend={null}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          valueColor="text-blue-600"
        />
        <StatCard
          href="/admin/reports"
          icon={<Share2 className="w-5 h-5" />}
          label="Total Shares"
          value={stats?.total_shares || 0}
          trend={null}
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
          valueColor="text-indigo-600"
        />
        <StatCard
          href="/admin/reports"
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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
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
        <StatCard
          href="/admin/reports"
          icon={<MessageSquare className="w-5 h-5" />}
          label="Chats"
          value={analytics?.summary.total_chats || 0}
          trend={null}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          valueColor="text-blue-600"
        />
        <StatCard
          href="/admin/reports"
          icon={<Mail className="w-5 h-5" />}
          label="Messages"
          value={analytics?.summary.total_messages || 0}
          trend={null}
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
          valueColor="text-indigo-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Platform Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={2} name="Users" />
                <Line type="monotone" dataKey="products" stroke="#f59e0b" strokeWidth={2} name="Products" />
                <Line type="monotone" dataKey="chats" stroke="#10b981" strokeWidth={2} name="Chats" />
                <Line type="monotone" dataKey="messages" stroke="#8b5cf6" strokeWidth={2} name="Messages" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.category_performance || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category_name" type="category" width={140} />
                <Tooltip />
                <Legend />
                <Bar dataKey="approved_items" fill="#10b981" name="Approved" />
                <Bar dataKey="sold_items" fill="#2563eb" name="Sold" />
                <Bar dataKey="out_of_stock_items" fill="#f59e0b" name="Out of Stock" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Needs Attention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Pending products', value: analytics?.summary.pending_items || 0, tone: 'text-amber-600', href: '/admin/items?status=pending' },
              { label: 'Open reports', value: analytics?.summary.reports_pending || 0, tone: 'text-red-600', href: '/admin/reports' },
              { label: 'Unread messages', value: analytics?.summary.unread_messages || 0, tone: 'text-blue-600' },
            ].map((item) => (
              <ListRow
                key={item.label}
                href={item.href}
                label={item.label}
                value={item.value}
                valueClassName={cn('text-lg font-semibold', item.tone)}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Products With Most Chats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(analytics?.top_chatted_products || []).slice(0, 5).map((item) => (
              <ListRow
                key={item.id}
                href={`/admin/items?search=${encodeURIComponent(item.item_name)}`}
                label={item.item_name}
                value={`${item.message_count} messages`}
                valueClassName="text-sm text-gray-500"
              />
            ))}
            {(analytics?.top_chatted_products || []).length === 0 && (
              <p className="text-sm text-gray-500">No product chat activity yet.</p>
            )}
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
      <Link href={href} className={linkClassName}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

const linkClassName =
  'block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary_1 focus-visible:ring-offset-2';

function ListRow({
  href,
  label,
  value,
  valueClassName,
}: {
  href?: string;
  label: string;
  value: React.ReactNode;
  valueClassName: string;
}) {
  const row = (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-lg bg-gray-50 p-3',
        href && 'transition-colors hover:bg-primary_2',
      )}
    >
      <span className="truncate text-sm font-medium text-gray-700">{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );

  return href ? (
    <Link href={href} className={linkClassName}>
      {row}
    </Link>
  ) : (
    row
  );
}
