'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Message } from '@/types/chat';

interface MessageListProps {
  messages: Message[];
  scrollAreaRef: React.RefObject<HTMLDivElement>;
}

export function MessageList({ messages, scrollAreaRef }: MessageListProps) {
  return (
    <Card className="flex-grow mb-4 p-4">
      <ScrollArea className="h-[calc(100vh-12rem)]" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="bg-secondary p-3 rounded-lg"
            >
              <p className="text-sm text-muted-foreground mb-1">
                {new Date(message.timestamp).toLocaleString()}
              </p>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}