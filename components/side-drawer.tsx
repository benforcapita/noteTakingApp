'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Upload, Download, FileText, Trash2 } from 'lucide-react';

interface SideDrawerProps {
  onImport: () => void;
  onExport: () => void;
  onSummarize: () => void;
  onClear: () => void;
}

export function SideDrawer({ onImport, onExport, onSummarize, onClear }: SideDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Actions</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 pt-4">
          <Button variant="outline" onClick={onImport} className="justify-start">
            <Upload className="w-4 h-4 mr-2" />
            Import Notes
          </Button>
          <Button variant="outline" onClick={onExport} className="justify-start">
            <Download className="w-4 h-4 mr-2" />
            Export Notes
          </Button>
          <Button variant="outline" onClick={onSummarize} className="justify-start">
            <FileText className="w-4 h-4 mr-2" />
            Summarize Notes
          </Button>
          <Button variant="destructive" onClick={onClear} className="justify-start">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Notes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}