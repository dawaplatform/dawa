// src/types/message.ts
export interface User {
  id: string | number;
  full_name: string;
  profile_picture: string | null;
}

export interface Subject {
  item_id: number;
  item_name: string;
}

export interface Message {
  id: number | string;
  senderId: string | number;
  receiverId: string | number;
  itemId: string | number;
  message: string;
  createdAt: string; // our internal name for API’s "created_at"
  read: boolean;
}

export interface OptimisticMessage extends Message {
  status: 'sending' | 'sent' | 'error';
}

export interface MessageGroup {
  id: string | number;
  subject: Subject; // e.g. { item_id: 25, item_name: 'Worlds Fastest Super cars' }
  participants: User[]; // e.g. [ {id: 10, ...}, {id: 25, ...} ]
  messages: Message[];
}

/**
 * API payload for sending a message.
 */
export interface SendMessagePayload {
  receiver_id: string | number;
  item_id: string | number;
  message: string;
}

export interface ChatContextType {
  messageGroups: MessageGroup[];
  selectedGroupId: string | number | null;
  currentUser: User | null;
  selectGroup: (groupId: string | number) => void;
  sendMessage: (payload: SendMessagePayload) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  newMessagesCount: number;
}
