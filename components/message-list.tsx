'use client';

import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { isHebrewText } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isHebrew = isHebrewText(message.content);
        return (
          <div
            key={message.id}
            className={cn(
              "p-4 rounded-lg bg-muted",
              isHebrew ? "text-right" : "text-left"
            )}
            dir={isHebrew ? "rtl" : "ltr"}
          >
            <div className="text-sm text-muted-foreground mb-1">
              {new Date(message.timestamp).toLocaleString()}
            </div>
            <div className="whitespace-pre-wrap">
              {message.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}