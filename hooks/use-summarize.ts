'use client';

import { useToast } from '@/hooks/use-toast';

export function useSummarize(onSummaryComplete: (summary: string) => void) {
  const { toast } = useToast();

  const summarizeNotes = async (notes: string[]) => {
    if (notes.length === 0) {
      toast({
        title: 'Error',
        description: 'No notes to summarize',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) throw new Error('Failed to summarize notes');

      const { summary } = await response.json();
      onSummaryComplete(summary);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate summary',
        variant: 'destructive',
      });
    }
  };

  return { summarizeNotes };
}