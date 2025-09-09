'use client';

import React, { useState, useCallback } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = React.memo(
  ({ onSendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
          onSendMessage(message);
          setMessage('');
        }
      },
      [message, onSendMessage],
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
      },
      [],
    );

    return (
      <div className="p-4 border-t border-gray-100 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            type="text"
            value={message}
            onChange={handleChange}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!message.trim()}
            size="icon"
            className="rounded-full"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    );
  },
);

MessageInput.displayName = 'MessageInput';
