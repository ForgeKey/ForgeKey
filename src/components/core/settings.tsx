import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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
  return (
    <div className="p-4 space-y-4">
      <Button
        variant="ghost"
        onClick={() => setIsSettingsOpen(false)}
        className="mb-4 pl-0"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        <span className="text-sm">Back</span>
      </Button>
      <div className="space-y-2">
        <Label htmlFor="keystoreFolder">Keystore Folder</Label>
        <Input
          value={keystoreFolder}
          onChange={(e) => setKeystoreFolder(e.target.value)}
          placeholder="~/.foundry/keystores"
        />
      </div>
      <div className="flex items-center space-x-2">
        <ThemeToggle />
      </div>
    </div>
  );
};
