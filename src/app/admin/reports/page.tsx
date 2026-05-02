'use client';

import { useAdminDashboardStats, useAdminItems, useAdminUsers, useAdminCategories } from '@/app/server/admin/api';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle, TrendingUp, Users, ShoppingBag, BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
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

export default function AdminReportsPage() {
  const { stats, isLoading: statsLoading } = useAdminDashboardStats();
  const { items, isLoading: itemsLoading } = useAdminItems();
  const { users, isLoading: usersLoading } = useAdminUsers();
  const { categories, isLoading: categoriesLoading } = useAdminCategories();

  const isLoading = statsLoading || itemsLoading || usersLoading || categoriesLoading;

  // Process data for charts
  const userRoleData = useMemo(() => {
    if (!users) return [];
    const roleCounts = users.reduce((acc, user) => {
      const role = user.role || 'Client';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(roleCounts).map(([name, value]) => ({ name, value }));
  }, [users]);

  const itemsByStatus = useMemo(() => {
    if (!items) return [];
    const statusCounts = items.reduce((acc, item) => {
      const status = item.approval_status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [items]);

  const itemsByCategory = useMemo(() => {
    if (!items) return [];
    const categoryCounts = items.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 categories
  }, [items]);

  const engagementData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Likes', value: stats.total_likes || 0 },
      { name: 'Views', value: stats.total_views || 0 },
      { name: 'Shares', value: stats.total_shares || 0 },
      { name: 'Wishlist', value: stats.total_wishlist_actions || 0 },
    ];
  }, [stats]);

  const COLORS = ['#9333ea', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary_1" />
        <span className="text-gray-600">Loading reports data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Reports & analytics"
        description="Deeper cuts across users, listings, categories, and engagement."
      />

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.total_admins || 0} Admins, {stats?.total_vendors || 0} Vendors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_items || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.total_approved_items || 0} Approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((stats?.total_likes || 0) + (stats?.total_views || 0) + (stats?.total_shares || 0)).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all metrics
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_reports || 0}</div>
            <p className="text-xs text-muted-foreground">
              User reports
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* User Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">User Role Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Items by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Items by Approval Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={itemsByStatus}>
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

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top 10 Categories by Item Count</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={itemsByCategory} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Platform Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Newsletter Subscribers</span>
                <span className="text-lg font-semibold">{stats?.total_subscribers || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Categories</span>
                <span className="text-lg font-semibold">{categories?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Items</span>
                <span className="text-lg font-semibold">
                  {(stats?.total_items || 0) - (stats?.total_approved_items || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Approval Rate</span>
                <span className="text-lg font-semibold">
                  {stats?.total_items
                    ? (((stats?.total_approved_items || 0) / stats.total_items) * 100).toFixed(1)
                    : '0'}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-4">
                Common administrative tasks and insights
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Items Requiring Review</span>
                  <span className="text-sm font-semibold text-amber-600">
                    {(stats?.total_items || 0) - (stats?.total_approved_items || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">User Reports</span>
                  <span className="text-sm font-semibold text-red-600">
                    {stats?.total_reports || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Active Vendors</span>
                  <span className="text-sm font-semibold text-green-600">
                    {stats?.total_vendors || 0}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}