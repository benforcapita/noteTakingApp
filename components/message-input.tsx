'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function MessageInput({ input, setInput, onSubmit }: MessageInputProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your notes here..."
        className="flex-grow"
      />
      <Button type="submit">Send</Button>
    </form>
  );
}