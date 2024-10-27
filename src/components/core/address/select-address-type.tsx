import { Button } from '@/components/ui/button';
import { Key, Sparkles, Download } from 'lucide-react';

type SelectAddressTypeProps = {
  setAddAddressStep: (step: 'select' | 'new' | 'vanity' | 'import') => void;
  setIsAddingAddress: (isAdding: boolean) => void;
};

export function SelectAddressType({
  setAddAddressStep,
  setIsAddingAddress,
}: SelectAddressTypeProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center h-24 space-y-2"
          onClick={() => setAddAddressStep('new')}
        >
          <Key className="h-6 w-6" />
          <span>New</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center h-24 space-y-2"
          onClick={() => setAddAddressStep('vanity')}
        >
          <Sparkles className="h-6 w-6" />
          <span>Vanity</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center h-24 space-y-2"
          onClick={() => setAddAddressStep('import')}
        >
          <Download className="h-6 w-6" />
          <span>Import</span>
        </Button>
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setIsAddingAddress(false)}
      >
        Cancel
      </Button>
    </div>
  );
}
