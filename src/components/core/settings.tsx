/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChevronLeft } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import ThemeToggle from '@/components/core/theme-toggle';

interface SettingsProps {
  setIsSettingsOpen: (isOpen: boolean) => void;
  keystoreFolder: string;
  setKeystoreFolder: (keystoreFolder: string) => void;
}

export const Settings = ({
  setIsSettingsOpen,
  keystoreFolder,
  setKeystoreFolder,
}: SettingsProps) => {
  const debouncedSetKeystoreFolder = useDebouncedCallback(
    (value: string) => setKeystoreFolder(value),
    300
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          onClick={() => setIsSettingsOpen(false)}
          className="p-2 dark:text-secondary"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
        </Button>
        <span className="text-md ml-1 dark:text-secondary">Settings</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="keystoreFolder">Keystore Folder</Label>
        <Input
          value={keystoreFolder}
          onChange={(e) => debouncedSetKeystoreFolder(e.target.value)}
          placeholder="~/.foundry/keystores"
        />
      </div>

      <Separator className="my-2" />
      <div className="flex items-center space-x-2">
        <ThemeToggle />
      </div>
    </div>
  );
};
