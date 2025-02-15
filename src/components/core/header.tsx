import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  setIsSettingsOpen: (isSettingsOpen: boolean) => void;
  isSettingsOpen: boolean;
}

export const Header = ({ setIsSettingsOpen, isSettingsOpen }: HeaderProps) => {
  return (
    <div className="h-[60px] flex justify-between items-center px-4">
      <h1 className="text-lg dark:text-secondary font-semibold">KeyForge</h1>
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon">
          <Settings
            className="h-5 w-5 dark:text-secondary"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          />
        </Button>
      </div>
    </div>
  );
};
