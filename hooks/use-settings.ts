'use client';

import { useState, useEffect } from 'react';

interface Settings {
  apiKey: string;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({ apiKey: '' });

  useEffect(() => {
    // Load settings from the server
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.apiKey) {
          setSettings({ apiKey: data.apiKey });
        }
      })
      .catch(error => {
        console.error('Error loading settings:', error);
      });
  }, []);

  const updateApiKey = async (apiKey: string) => {
    if (!apiKey || !apiKey.startsWith('sk-')) {
      throw new Error('Invalid API key format');
    }
    
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save settings');
      }

      setSettings({ apiKey });
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  };

  return { settings, updateApiKey };
}