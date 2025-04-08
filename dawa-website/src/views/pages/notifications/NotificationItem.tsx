import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Trash2,
  MessageSquare,
  ShoppingCart,
  Settings,
  Bell,
} from 'lucide-react';
import { Notification } from '@/@core/types/notifications';

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'message':
      return <MessageSquare className="h-5 w-5 text-blue-500" />;
    case 'classified':
      return <ShoppingCart className="h-5 w-5 text-purple-500" />;
    case 'system':
      return <Settings className="h-5 w-5 text-orange-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  return (
    <li className="py-4">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">{getIcon(notification.type)}</div>
        <div className="flex-grow min-w-0">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-900">
              {notification.title}
            </span>
            {!notification.read && (
              <Badge variant="secondary" className="ml-2">
                New
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">
            {notification.description}
          </p>
          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
        </div>
        <div className="flex-shrink-0 flex space-x-2">
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
            >
              <CheckCircle className="h-4 w-4 text-primary_1" />
              <span className="sr-only">Mark as read</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(notification.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500 hover:text-red-600" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </li>
  );
}
