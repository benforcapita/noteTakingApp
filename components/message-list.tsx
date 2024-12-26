'use client';

import { Message } from '@/types/chat';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className="p-4 rounded-lg bg-muted"
        >
          {message.content}
        </div>
      ))}
    </div>
  );
}