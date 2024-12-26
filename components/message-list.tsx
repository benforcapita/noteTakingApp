'use client';

import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { isHebrewText } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  onDeleteMessage: (id: string) => void;
  isDeleteMode: boolean;
}

export function MessageList({ messages, onDeleteMessage, isDeleteMode }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isHebrew = isHebrewText(message.content);
        
        return (
          <div key={message.id} className="relative">
            <div
              className={cn(
                "p-4 rounded-lg bg-muted transition-transform",
                isHebrew ? "text-right" : "text-left",
                isDeleteMode && "translate-x-[-48px]"
              )}
              dir={isHebrew ? "rtl" : "ltr"}
            >
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
              <time className="text-xs text-muted-foreground mt-2 block">
                {new Date(message.timestamp).toLocaleString()}
              </time>
            </div>
            
            {isDeleteMode && (
              <button
                onClick={() => onDeleteMessage(message.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                title="Delete message"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}