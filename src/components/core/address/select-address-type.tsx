import { Button } from '@/components/ui/button';
import { Key, Sparkles, Download, PlusCircle, ChevronLeft } from 'lucide-react';

type SelectAddressTypeProps = {
  setAddAddressStep: (step: 'select' | 'new' | 'vanity' | 'import') => void;
  onImportClick?: () => void;
  handleBackClick?: () => void;
};

export function SelectAddressType({
  setAddAddressStep,
  onImportClick,
  handleBackClick,
}: SelectAddressTypeProps) {
  const handleImportClick = () => {
    if (onImportClick) {
      onImportClick();
    } else {
      setAddAddressStep('import');
    }
  };

  return (
    <div className="space-y-3 px-1 py-2">
      <div className="relative text-center mb-2">
        {handleBackClick && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleBackClick}
            className="absolute left-0 top-0 p-2 text-white bg-white/5 backdrop-blur-sm rounded-full hover:bg-white/10 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-1">
          <PlusCircle className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-white">Add New Keystore</h2>
        <p className="text-sm text-gray-300 mt-0.5 mb-1">
          Choose how you want to create or import your keystore
        </p>
      </div>

      <div className="space-y-2">
        {/* First row with Vanity and Import */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/5 p-2 hover:border-purple-500/20 transition-colors">
            <Button
              variant="ghost"
              className="flex flex-col items-center justify-center h-16 w-full space-y-1 text-white bg-transparent hover:bg-white/10 hover:text-white transition-all rounded-lg group"
              onClick={() => setAddAddressStep('vanity')}
            >
              <div className="bg-pink-500/20 p-1.5 rounded-full group-hover:bg-pink-500/30 transition-colors">
                <Sparkles className="h-4 w-4 text-pink-400" />
              </div>
              <span className="font-medium">Vanity Address</span>
            </Button>
            <p className="text-sm text-gray-400 text-center mt-0.5 px-1 leading-tight">
              Generate custom patterns
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/5 p-2 hover:border-blue-500/20 transition-colors">
            <Button
              variant="ghost"
              className="flex flex-col items-center justify-center h-16 w-full space-y-1 text-white bg-transparent hover:bg-white/10 hover:text-white transition-all rounded-lg group"
              onClick={handleImportClick}
            >
              <div className="bg-blue-500/20 p-1.5 rounded-full group-hover:bg-blue-500/30 transition-colors">
                <Download className="h-4 w-4 text-blue-400" />
              </div>
              <span className="font-medium">Import</span>
            </Button>
            <p className="text-sm text-gray-400 text-center mt-0.5 px-1 leading-tight">
              Import existing address
            </p>
          </div>
        </div>

        {/* Second row with Generate New */}
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/5 p-2 hover:border-purple-500/20 transition-colors">
            <Button
              variant="ghost"
              className="flex flex-col items-center justify-center h-16 w-full space-y-1 text-white bg-transparent hover:bg-white/10 hover:text-white transition-all rounded-lg group"
              onClick={() => setAddAddressStep('new')}
            >
              <div className="bg-purple-500/20 p-1.5 rounded-full group-hover:bg-purple-500/30 transition-colors">
                <Key className="h-4 w-4 text-purple-400" />
              </div>
              <span className="font-medium">Generate New</span>
            </Button>
            <p className="text-sm text-gray-400 text-center mt-0.5 px-1 leading-tight">
              Create a new Ethereum address
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
