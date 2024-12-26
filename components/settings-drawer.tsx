'use client';

import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useSettings } from '@/hooks/use-settings';
import { useToast } from '@/components/ui/use-toast';

export function SettingsDrawer() {
  const { settings, updateApiKey } = useSettings();
  const [apiKey, setApiKey] = useState('');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setApiKey(settings.apiKey);
  }, [settings.apiKey]);

  const handleSave = () => {
    if (!apiKey || !apiKey.startsWith('sk-')) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid OpenAI API key starting with 'sk-'",
        variant: "destructive",
      });
      return;
    }

    try {
      updateApiKey(apiKey);
      toast({
        title: "Settings saved",
        description: "Your API key has been saved successfully.",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Failed to save your API key. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            Save Settings
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}