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
import { processNotes } from '@/lib/openai';

export function ChatInterface() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState('');
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [mode, setMode] = useState<'summarize' | 'organize'>('summarize');

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
        title: "No messages to process",
        description: "Please add some notes first.",
        variant: "destructive",
      });
      return;
    }

    setIsSummarizing(true);
    setSummary('');

    try {
      const messageContents = messages.map(m => m.content);
      const result = await processNotes(messageContents, mode);
      setSummary(result);
      setIsSummaryModalOpen(true);
    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process notes",
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
              mode={mode}
              onModeChange={setMode}
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
          onOpenChange={setIsSummaryModalOpen}
          summary={summary}
          mode={mode}
        />
      </div>
    </div>
  );
}