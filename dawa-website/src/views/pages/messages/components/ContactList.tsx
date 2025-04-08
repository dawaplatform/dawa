'use client';

import React, { useState, useMemo } from 'react';
import { format, isValid } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, X, AlertCircle } from 'lucide-react';
import type {
  MessageGroup,
  User,
  Message,
} from '@/views/pages/messages/types/message';
import { ScrollArea } from '@/components/ui/scroll-area';
import CustomizableNoData from '@/components/shared/no-data';

interface ContactListProps {
  messageGroups: MessageGroup[];
  selectedGroupId: string | number | null;
  currentUser: User | null;
  onSelectGroup: (groupId: string) => void;
  className?: string;
}

const ContactItem: React.FC<{
  group: MessageGroup;
  currentUser: User;
  selectedGroupId: string | number | null;
  onSelectGroup: (groupId: string) => void;
}> = React.memo(({ group, currentUser, selectedGroupId, onSelectGroup }) => {
  const receiver = group.participants.find(
    (p) => Number(p.id) !== Number(currentUser.id),
  );
  if (!receiver) return null;

  const lastMessage: Message = group.messages[group.messages.length - 1];
  const unreadCount = group.messages.filter(
    (msg) => Number(msg.receiverId) === Number(currentUser.id) && !msg.read,
  ).length;

  const subjectText = group.subject.item_name;
  const messageDate = new Date(lastMessage.createdAt);
  const formattedTime = isValid(messageDate)
    ? format(messageDate, 'HH:mm')
    : '—';

  return (
    <button
      onClick={() => onSelectGroup(group.id.toString())}
      className={`w-full px-4 py-3 flex items-start space-x-3 hover:bg-gray-50 transition-colors duration-150 ${
        selectedGroupId === group.id.toString() ? 'bg-primary_2/40' : ''
      }`}
    >
      <Avatar className="h-12 w-12 rounded-full flex-shrink-0">
        {receiver.profile_picture ? (
          <AvatarImage
            src={receiver.profile_picture}
            alt={receiver.full_name || 'User'}
          />
        ) : (
          <AvatarFallback className="bg-primary_1 text-white">
            {receiver.full_name?.[0]?.toUpperCase() || '?'}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1 min-w-0 text-left">
        <div className="flex justify-between items-start">
          <p className="text-sm font-medium text-gray-900 truncate">
            {receiver.full_name || 'Unknown User'}
          </p>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
            {formattedTime}
          </span>
        </div>
        <p className="text-sm text-gray-600 truncate mt-0.5">{subjectText}</p>
        <p className="text-sm text-gray-500 truncate mt-0.5">
          {lastMessage.message}
        </p>
      </div>
      {/* {unreadCount > 0 && (
        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-primary_1 text-white text-xs font-medium">
          {unreadCount}
        </span>
      )} */}
    </button>
  );
});

ContactItem.displayName = 'ContactItem';

export function ContactList({
  messageGroups,
  selectedGroupId,
  currentUser,
  onSelectGroup,
  className,
}: ContactListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = useMemo(() => {
    if (!currentUser) return [];
    return messageGroups.filter((group) => {
      const receiver = group.participants.find(
        (p) => Number(p.id) !== Number(currentUser.id),
      );
      if (!receiver) return false;

      const subjectText = group.subject.item_name;
      return (
        subjectText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        receiver.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [messageGroups, searchQuery, currentUser]);

  if (!currentUser) {
    return (
      <CustomizableNoData
        illustration={<AlertCircle />}
        title="Not Authenticated"
        illustrationClassName="w-12 h-12"
        containerClassName="flex-1 flex flex-col items-center justify-center"
        description="Please sign in to view messages."
      />
    );
  }

  return (
    <div
      className={`border-r border-gray-200 flex flex-col bg-white ${className}`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary_1 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1">
        {filteredGroups.length === 0 ? (
          <CustomizableNoData
            illustration={<AlertCircle />}
            title="No results found"
            illustrationClassName="w-12 h-12"
            containerClassName="flex-1 h-full flex flex-col items-center justify-center"
            description="Try adjusting your search terms."
          />
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredGroups.map((group) => (
              <ContactItem
                key={group.id}
                group={group}
                currentUser={currentUser}
                selectedGroupId={selectedGroupId}
                onSelectGroup={onSelectGroup}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
