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
  onClose: () => void;
  summary: string;
}

export function SummaryModal({ isOpen, onClose, summary }: SummaryModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The summary has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-summary-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast({
      title: "Summary downloaded",
      description: "The summary has been downloaded as a text file.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Meeting Summary</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="rounded-md bg-muted p-4 whitespace-pre-wrap max-h-[400px] overflow-y-auto">
            {summary}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
