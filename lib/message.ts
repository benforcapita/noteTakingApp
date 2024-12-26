import { Message } from '@/types/chat';

export function createMessage(content: string): Message {
  return {
    id: crypto.randomUUID(),
    content,
    timestamp: new Date().toISOString(),
  };
}

export function exportMessagesToJson(messages: Message[]): string {
  const dataStr = JSON.stringify(messages, null, 2);
  return `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
}

export function getExportFileName(): string {
  return `meeting-notes-${new Date().toISOString()}.json`;
}