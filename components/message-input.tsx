'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { isHebrewText } from '@/lib/utils';

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function MessageInput({ input, setInput, onSubmit }: MessageInputProps) {
  const [isHebrew, setIsHebrew] = useState(false);

  useEffect(() => {
    setIsHebrew(isHebrewText(input));
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        onSubmit(e);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your note... (Press Enter to send, Shift+Enter for new line)"
        className="min-h-[60px] flex-grow"
        dir={isHebrew ? "rtl" : "ltr"}
        style={{ textAlign: isHebrew ? 'right' : 'left' }}
      />
      <Button type="submit" disabled={!input.trim()}>
        Send
      </Button>
    </form>
  );
}