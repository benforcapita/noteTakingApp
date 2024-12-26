'use client';

import { useState, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { SettingsDrawer } from './settings-drawer';
import { ActionDrawer } from './action-drawer';
import { SummaryModal } from './summary-modal';
import { toast } from '@/components/ui/use-toast';
import { Message } from '@/types/chat';

export function ChatInterface() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState('');
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const addMessage = (content: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
    setTimeout(() => {
      scrollAreaRef.current?.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      addMessage(input.trim());
      setInput('');
    }
  };

  const handleSummarize = async () => {
    if (messages.length === 0) {
      toast({
        title: "No messages to summarize",
        description: "Please add some meeting notes first.",
        variant: "destructive",
      });
      return;
    }

    setIsSummarizing(true);
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: messages.map(m => m.content) }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to summarize notes');
      }

      const data = await response.json();
      setSummary(data.summary);
      setIsSummaryModalOpen(true);
      setIsActionsOpen(false);
      toast({
        title: "Summary generated",
        description: "Your meeting notes have been successfully summarized.",
        variant: "default",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error('Error summarizing notes:', error);
      toast({
        title: "Error summarizing notes",
        description: error instanceof Error ? error.message : 'Failed to summarize notes',
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  const handleImportMessages = (importedMessages: Message[]) => {
    // Ensure imported messages have proper IDs and timestamp format
    const validatedMessages = importedMessages.map(msg => ({
      ...msg,
      id: msg.id || crypto.randomUUID(),
      timestamp: msg.timestamp || new Date().toISOString(),
    }));
    setMessages(validatedMessages);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(message => message.id !== id));
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              Meeting Notes
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <SettingsDrawer />
            <ActionDrawer
              isOpen={isActionsOpen}
              onOpenChange={setIsActionsOpen}
              onSummarize={handleSummarize}
              isSummarizing={isSummarizing}
              messages={messages}
              onClear={handleClear}
              onImportMessages={handleImportMessages}
              isDeleteMode={isDeleteMode}
              onToggleDeleteMode={toggleDeleteMode}
            />
          </div>
        </div>

        <ScrollArea className="flex-1 pr-4 border rounded-lg p-4 bg-background mb-4" ref={scrollAreaRef}>
          <MessageList 
            messages={messages} 
            onDeleteMessage={handleDeleteMessage}
            isDeleteMode={isDeleteMode}
          />
        </ScrollArea>

        <MessageInput input={input} setInput={setInput} onSubmit={handleSubmit} />

        <SummaryModal
          isOpen={isSummaryModalOpen}
          onClose={() => setIsSummaryModalOpen(false)}
          summary={summary}
        />
      </div>
    </div>
  );
}