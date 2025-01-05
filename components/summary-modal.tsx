'use client';

import { useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface SummaryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  summary: string;
  mode: 'summarize' | 'organize';
}

export function SummaryModal({ isOpen, onOpenChange, summary, mode }: SummaryModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: `The ${mode === 'summarize' ? 'summary' : 'organized notes'} have been copied to your clipboard.`,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-${mode === 'summarize' ? 'summary' : 'notes'}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast({
      title: `${mode === 'summarize' ? 'Summary' : 'Organized notes'} downloaded`,
      description: `The ${mode === 'summarize' ? 'summary' : 'organized notes'} have been downloaded as a text file.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'summarize' ? 'Meeting Summary' : 'Organized Notes'}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="max-h-[400px] overflow-y-auto whitespace-pre-wrap rounded-md bg-muted p-4">
            {summary}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="ml-2">Copy</span>
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              <span className="ml-2">Download</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
