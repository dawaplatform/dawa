export interface Notification {
  id: string;
  type: 'message' | 'classified' | 'system';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export type FilterType = 'all' | 'unread' | 'message' | 'classified' | 'system';
