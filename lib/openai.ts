import { cookies } from 'next/headers';

export async function processNotes(notes: string[], mode: 'summarize' | 'organize'): Promise<string> {
  const response = await fetch('/api/process-notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ notes, mode }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to process notes');
  }

  return data.result;
}