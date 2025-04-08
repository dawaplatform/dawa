'use client';

import { useState } from 'react';
import { ChatProvider, useChat } from '@/contexts/ChatContext';
import { ContactList } from './components/ContactList';
import { ChatArea } from './components/ChatArea';
import { Card, CardContent } from '@/components/ui/card';
import Loader from '@/components/features/loaders/SubLoader';

function ChatAppContent() {
  const {
    messageGroups,
    selectedGroupId,
    currentUser,
    selectGroup,
    isLoading,
  } = useChat();
  const [isMobileChat, setIsMobileChat] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <div className="rounded-xl overflow-hidden h-[80vh] flex">
          <ContactList
            messageGroups={messageGroups}
            selectedGroupId={selectedGroupId}
            currentUser={currentUser}
            onSelectGroup={(groupId) => {
              selectGroup(groupId);
              setIsMobileChat(true);
            }}
            className={`w-full md:w-[350px] ${isMobileChat ? 'hidden md:block' : 'block'}`}
          />
          <ChatArea
            onBack={() => setIsMobileChat(false)}
            className={`flex-1 ${isMobileChat ? 'block' : 'hidden md:block'}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function ChatApp() {
  return (
    <ChatProvider>
      <ChatAppContent />
    </ChatProvider>
  );
}
