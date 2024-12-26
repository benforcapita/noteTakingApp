'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/types/chat';
import { createMessage } from '@/lib/message';

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const addMessage = (content: string) => {
    const newMessage = createMessage(content);
    setMessages((prev) => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
    toast({
      title: 'Success',
      description: 'All notes cleared',
    });
  };

  const importMessages = (jsonString: string) => {
    try {
      const importedMessages = JSON.parse(jsonString);
      setMessages(importedMessages);
      toast({
        title: 'Success',
        description: 'Notes imported successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to import notes. Invalid file format.',
        variant: 'destructive',
      });
    }
  };

  return {
    messages,
    addMessage,
    clearMessages,
    importMessages,
  };
}