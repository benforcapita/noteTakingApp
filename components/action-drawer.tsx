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
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ActionDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSummarize: () => void;
  isSummarizing: boolean;
  messages: Message[];
  onClear: () => void;
  onImportMessages: (messages: Message[]) => void;
  isDeleteMode: boolean;
  onToggleDeleteMode: () => void;
  mode: 'summarize' | 'organize';
  onModeChange: (mode: 'summarize' | 'organize') => void;
}

export function ActionDrawer({
  isOpen,
  onOpenChange,
  onSummarize,
  isSummarizing,
  messages,
  onClear,
  onImportMessages,
  isDeleteMode,
  onToggleDeleteMode,
  mode,
  onModeChange,
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
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Processing Mode</label>
            <Select value={mode} onValueChange={onModeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summarize">Summarize</SelectItem>
                <SelectItem value="organize">Organize</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={onSummarize}
            disabled={messages.length === 0 || isSummarizing}
            className="w-full"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {mode === 'summarize' ? 'Summarize Notes' : 'Organize Notes'}
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
            variant="outline"
            onClick={onToggleDeleteMode}
            className={cn(
              "w-full justify-center",
              isDeleteMode && "bg-red-100 hover:bg-red-200 text-red-600"
            )}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleteMode ? 'Exit Delete Mode' : 'Delete Messages'}
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
