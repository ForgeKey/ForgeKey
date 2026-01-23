import { Button } from '@/components/ui/button';
import { Key, FolderOpen, ArrowLeft } from 'lucide-react';

interface ImportOptionsProps {
  onImportPrivateKey: () => void;
  onImportKeystore: () => void;
  handleBackClick?: () => void;
}

export function ImportOptions({
  onImportPrivateKey,
  onImportKeystore,
  handleBackClick,
}: ImportOptionsProps) {
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
        <h2 className="text-base font-semibold text-white mb-1">Import</h2>
        <p className="text-xs text-white/50">
          Choose how you want to import your wallet
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex flex-col items-center justify-center h-32 bg-white/[0.03] backdrop-blur-sm rounded-lg border border-white/[0.08] hover:bg-white/[0.05] transition-all p-3"
          onClick={onImportPrivateKey}
        >
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full mb-2">
            <Key className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium text-sm text-white mb-1">
            Private Key
          </span>
          <span className="text-[10px] text-white/50 text-center">
            Import with a raw private key
          </span>
        </button>

        <button
          type="button"
          className="flex flex-col items-center justify-center h-32 bg-white/[0.03] backdrop-blur-sm rounded-lg border border-white/[0.08] hover:bg-white/[0.05] transition-all p-3"
          onClick={onImportKeystore}
        >
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full mb-2">
            <FolderOpen className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium text-sm text-white mb-1">
            Keystore File
          </span>
          <span className="text-[10px] text-white/50 text-center">
            Import from an encrypted keystore file
          </span>
        </button>
      </div>
    </div>
  );
}
