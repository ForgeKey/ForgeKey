import { Button } from '@/components/ui/button';
import { Key, Sparkles, Download, ArrowLeft } from 'lucide-react';

type SelectAddressTypeProps = {
  setAddAddressStep: (step: 'select' | 'new' | 'vanity' | 'import-options') => void;
  handleBackClick?: () => void;
};

export function SelectAddressType({
  setAddAddressStep,
  handleBackClick,
}: SelectAddressTypeProps) {

  return (
    <div className="p-3 flex flex-col h-full min-h-[340px]">
      {/* Back Button */}
      {handleBackClick && (
        <div className="mb-1">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBackClick}
            className="h-8 w-8 p-0 text-white bg-transparent hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="mb-3">
        <h2 className="text-base font-semibold text-white mb-1">
          Add New Keystore
        </h2>
        <p className="text-xs text-white/50">
          Choose how you want to create or import your keystore
        </p>
      </div>

      {/* Options Grid */}
      <div className="space-y-3 flex-1">
        {/* First row with Vanity and Import */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center h-28 bg-white/[0.03] backdrop-blur-sm rounded-lg border border-white/[0.08] hover:bg-white/[0.05] transition-all p-3"
            onClick={() => setAddAddressStep('vanity')}
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full mb-2">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-sm text-white mb-1">Vanity Address</span>
            <p className="text-[10px] text-white/50">
              Generate custom patterns
            </p>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center h-28 bg-white/[0.03] backdrop-blur-sm rounded-lg border border-white/[0.08] hover:bg-white/[0.05] transition-all p-3"
            onClick={() => setAddAddressStep('import-options')}
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full mb-2">
              <Download className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-sm text-white mb-1">Import</span>
            <p className="text-[10px] text-white/50">
              Import existing address
            </p>
          </Button>
        </div>

        {/* Second row with Generate New */}
        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center h-28 w-full bg-white/[0.03] backdrop-blur-sm rounded-lg border border-white/[0.08] hover:bg-white/[0.05] transition-all p-3"
          onClick={() => setAddAddressStep('new')}
        >
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full mb-2">
            <Key className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium text-sm text-white mb-1">Generate New</span>
          <p className="text-[10px] text-white/50">
            Create a new Ethereum address
          </p>
        </Button>
      </div>
    </div>
  );
}
