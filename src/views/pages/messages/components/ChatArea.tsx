'use client';

import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { format, isValid } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import type {
  Message,
  OptimisticMessage,
  User,
  MessageGroup,
} from '@/views/pages/messages/types/message';
import { useChat } from '@/contexts/ChatContext';
import { MessageInput } from './MessageInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import CustomizableNoData from '@/components/shared/no-data';

interface MessageItemProps {
  message: Message | OptimisticMessage;
  currentUser: User;
  otherUser: User;
}

const MessageItem: React.FC<MessageItemProps> = React.memo(
  ({ message, currentUser, otherUser }) => {
    const isCurrentUserSender =
      Number(message.senderId) === Number(currentUser.id);
    const containerClass = isCurrentUserSender
      ? 'justify-end'
      : 'justify-start';
    const showAvatar = !isCurrentUserSender;
    const avatarSrc = showAvatar ? otherUser.profile_picture : null;
    const avatarLetter = showAvatar ? otherUser.full_name?.[0] : null;

    const messageDate = new Date(message.createdAt);
    const formattedTime = isValid(messageDate)
      ? format(messageDate, 'HH:mm')
      : '—';

    return (
      <div className={`flex ${containerClass} items-end mb-4`}>
        {showAvatar && (
          <div className="flex-shrink-0 mr-2">
            <Avatar className="h-6 w-6 rounded-full">
              {avatarSrc ? (
                <AvatarImage
                  src={avatarSrc}
                  alt={otherUser.full_name || 'User'}
                />
              ) : (
                <AvatarFallback className="bg-primary_1 text-white text-xs">
                  {avatarLetter?.toUpperCase() || '?'}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        )}
        <div
          className={`px-4 py-2 rounded-2xl max-w-[85%] ${
            isCurrentUserSender
              ? 'bg-primary_2 text-gray-900'
              : 'bg-gray-100 text-gray-900'
          } ${'status' in message && message.status === 'sending' ? 'opacity-70' : ''}`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.message}
          </p>
          <div className="flex items-center justify-end gap-1">
            <p className="text-[10px] text-gray-500">{formattedTime}</p>
            {'status' in message && message.status === 'sent' && (
              <Check size={12} className="text-green-500" />
            )}
            {'status' in message && message.status === 'error' && (
              <AlertCircle size={12} className="text-red-500" />
            )}
          </div>
        </div>
        {isCurrentUserSender && <div className="w-6 ml-2" />}
      </div>
    );
  },
);

MessageItem.displayName = 'MessageItem';

interface ChatAreaProps {
  onBack: () => void;
  className?: string;
}

export function ChatArea({ onBack, className }: ChatAreaProps) {
  const { messageGroups, selectedGroupId, currentUser, sendMessage } =
    useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const selectedGroup: MessageGroup | undefined = useMemo(
    () =>
      messageGroups.find((group) => group.id.toString() === selectedGroupId),
    [messageGroups, selectedGroupId],
  );

  const otherUser: User | null = useMemo(() => {
    if (!currentUser || !selectedGroup) return null;
    return (
      selectedGroup.participants.find(
        (p) => Number(p.id) !== Number(currentUser.id),
      ) || null
    );
  }, [selectedGroup, currentUser]);

  const scrollToBottom = useCallback(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]); // Removed selectedGroup from dependencies

  const handleSendMessage = useCallback(
    (content: string) => {
      if (content.trim() && selectedGroup && currentUser && otherUser) {
        sendMessage({
          receiver_id: otherUser.id,
          item_id: selectedGroup.subject.item_id,
          message: content,
        });
        // Scroll to bottom after sending a new message
        setTimeout(scrollToBottom, 100);
      }
    },
    [sendMessage, selectedGroup, currentUser, otherUser, scrollToBottom],
  );

  if (!selectedGroupId || !selectedGroup) {
    return (
      <CustomizableNoData
        illustration={<MessageSquare />}
        title="Your Messages"
        illustrationClassName="w-12 h-12"
        containerClassName="flex-1 hidden md:flex flex-col items-center justify-center bg-gray-50/50"
        description="Select a chat to view your messages"
      />
    );
  }

  if (!currentUser || !otherUser) {
    return (
      <CustomizableNoData
        illustration={<MessageSquare />}
        title="User Not Found"
        illustrationClassName="w-12 h-12"
        containerClassName="flex-1 flex flex-col items-center justify-center bg-gray-50/50"
        description="There was an error loading user info"
      />
    );
  }

  return (
    <div className={`flex flex-col bg-white ${className}`}>
      <div className="px-4 py-3 border-b border-gray-100 flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="md:hidden"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Avatar className="h-9 w-9 rounded-full">
          {otherUser.profile_picture ? (
            <AvatarImage
              src={otherUser.profile_picture}
              alt={otherUser.full_name || 'User'}
            />
          ) : (
            <AvatarFallback className="bg-primary_1 text-white">
              {otherUser.full_name?.[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-gray-900 truncate">
            {otherUser.full_name || 'Unknown User'}
          </h2>
          <p className="text-xs text-gray-500 truncate">
            {selectedGroup.subject.item_name}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" ref={scrollAreaRef}>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {selectedGroup.messages.map((message, index) => (
              <div
                key={message.id}
                ref={
                  index === selectedGroup.messages.length - 1
                    ? lastMessageRef
                    : null
                }
              >
                <MessageItem
                  message={message}
                  currentUser={currentUser}
                  otherUser={otherUser}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
