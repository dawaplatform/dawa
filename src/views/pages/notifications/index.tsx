'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { Notification, FilterType } from '@/@core/types/notifications';
import NotificationItem from './NotificationItem';
import NotificationSkeleton from './NotificationSkeleton';
import FilterDropdown from './FilterDropdown';

const fetchNotifications = () =>
  new Promise<Notification[]>((resolve) => setTimeout(() => {}, 500)).then(
    () => [],
  );

export default function NotificationsPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const queryClient = useQueryClient();

  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  });

  const updateNotificationMutation = useMutation({
    mutationFn: async (updatedNotification: Notification) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return updatedNotification;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const markAsRead = (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    if (notification) {
      updateNotificationMutation.mutate({ ...notification, read: true });
    }
  };

  const deleteNotification = (id: string) => {
    updateNotificationMutation.mutate({
      ...notifications.find((n) => n.id === id)!,
      id: 'deleted',
    });
  };

  return (
    <div className="space-y-6 my-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Notifications</h2>
          <p className="text-gray-600">
            Stay updated with your latest activities
          </p>
        </div>
        <FilterDropdown filter={filter} setFilter={setFilter} />
      </div>

      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <ul className="divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <NotificationSkeleton key={index} />
              ))}
            </ul>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">
              Error loading notifications. Please try again later.
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No notifications
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You&#39;re all caught up!
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
