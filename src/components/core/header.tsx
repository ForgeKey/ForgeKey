import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <div className="h-[60px] bg-muted flex justify-between items-center px-4">
      <h1 className="text-lg font-semibold">Cast Wallet</h1>
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
