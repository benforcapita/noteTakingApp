'use client';

import { useRef } from 'react';
import { Wand2, Download, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { toast } from '@/components/ui/use-toast';
import { Message } from '@/types/chat';

interface ActionDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSummarize: () => void;
  isSummarizing: boolean;
  messages: Message[];
  onClear: () => void;
  onImportMessages: (messages: Message[]) => void;
}

export function ActionDrawer({
  isOpen,
  onOpenChange,
  onSummarize,
  isSummarizing,
  messages,
  onClear,
  onImportMessages,
}: ActionDrawerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const data = JSON.stringify(messages, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meeting-notes-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast({
        title: "Notes exported",
        description: "Your meeting notes have been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export meeting notes.",
        variant: "destructive",
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            const importedMessages = JSON.parse(content);
            if (Array.isArray(importedMessages)) {
              onImportMessages(importedMessages);
              toast({
                title: "Notes imported",
                description: "Your meeting notes have been imported successfully.",
              });
              onOpenChange(false);
            } else {
              throw new Error('Invalid file format');
            }
          }
        } catch (error) {
          toast({
            title: "Import failed",
            description: "Failed to import meeting notes. Please check the file format.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    if (messages.length === 0) {
      toast({
        title: "No messages",
        description: "There are no messages to clear.",
        variant: "destructive",
      });
      return;
    }
    onClear();
    toast({
      title: "Messages cleared",
      description: "All messages have been cleared.",
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Wand2 className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Actions</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Available Actions</h3>
            <Button
              onClick={onSummarize}
              disabled={isSummarizing || messages.length === 0}
              className="w-full"
            >
              {isSummarizing ? 'Generating Summary...' : 'Summarize Notes'}
            </Button>
            <Button
              onClick={handleExport}
              disabled={messages.length === 0}
              variant="outline"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Notes
            </Button>
            <Button
              onClick={handleImportClick}
              variant="outline"
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Notes
            </Button>
            <Button
              onClick={handleClear}
              disabled={messages.length === 0}
              variant="outline"
              className="w-full text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Notes
            </Button>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileImport}
          accept=".json"
          className="hidden"
        />
      </SheetContent>
    </Sheet>
  );
}
