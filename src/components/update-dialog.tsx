import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUpdater, UpdateStatus } from '@/hooks/use-updater';


function getStatusMessage(status: UpdateStatus, progress: number): string {
  switch (status) {
    case 'checking':
      return 'Checking for updates...';
    case 'downloading':
      return `Downloading... ${progress}%`;
    case 'ready':
      return 'Update ready! Restarting...';
    case 'error':
      return 'Update failed';
    default:
      return '';
  }
}

export function UpdateDialog() {
  const {
    status,
    version,
    currentVersion,
    progress,
    error,
    downloadAndInstall,
    dismissUpdate,
  } = useUpdater();

  const isOpen = status === 'available' || status === 'downloading' || status === 'ready';
  const isDownloading = status === 'downloading' || status === 'ready';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && dismissUpdate()}>
      <DialogContent className="max-w-xs" hideCloseButton>
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-center text-sm">
            {isDownloading ? 'Updating...' : 'Update Available'}
          </DialogTitle>
          <DialogDescription className="text-center text-xs">
            {isDownloading ? (
              getStatusMessage(status, progress)
            ) : (
              <>
                A new version of ForgeKey is available.
                <br />
                <br />
                <span className="text-gray-500">{currentVersion}</span>
                {' → '}
                <span className="text-purple-400 font-medium">{version}</span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {isDownloading && (
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#9333EA] to-[#D946EF] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {error && (
          <p className="text-xs text-red-400 text-center">{error}</p>
        )}

        {!isDownloading && (
          <DialogFooter className="flex flex-row gap-2 mt-2">
            <Button
              variant="outline"
              className="flex-1 h-8 text-xs border border-purple-500/50 bg-transparent text-purple-300 hover:bg-purple-500/10 hover:border-purple-500 transition-all"
              onClick={dismissUpdate}
            >
              Later
            </Button>
            <Button
              className="flex-1 h-8 text-xs"
              onClick={downloadAndInstall}
            >
              Update Now
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
