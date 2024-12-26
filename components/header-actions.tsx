'use client';

import { Button } from '@/components/ui/button';
import { Upload, Download, FileText, Trash2 } from 'lucide-react';

interface HeaderActionsProps {
  onImport: () => void;
  onExport: () => void;
  onSummarize: () => void;
  onClear: () => void;
}

export function HeaderActions({ onImport, onExport, onSummarize, onClear }: HeaderActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onImport}>
        <Upload className="w-4 h-4 mr-2" />
        Import
      </Button>
      <Button variant="outline" onClick={onExport}>
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
      <Button variant="outline" onClick={onSummarize}>
        <FileText className="w-4 h-4 mr-2" />
        Summarize
      </Button>
      <Button variant="destructive" onClick={onClear}>
        <Trash2 className="w-4 h-4 mr-2" />
        Clear
      </Button>
    </div>
  );
}