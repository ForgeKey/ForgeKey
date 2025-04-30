import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, FolderOpen } from 'lucide-react';

interface KeystoreSelectProps {
  onKeystoreSelect: (keystoreName: string) => void;
  existingAddresses: string[];
  loadAvailableKeystores: () => Promise<string[]>;
  handleBackClick?: () => void;
}

/**
 * Component for selecting a keystore from available keystores
 */
export function KeystoreSelect({
  onKeystoreSelect,
  existingAddresses,
  loadAvailableKeystores,
  handleBackClick,
}: KeystoreSelectProps) {
  const [availableKeystores, setAvailableKeystores] = useState<string[]>([]);
  const [filteredKeystores, setFilteredKeystores] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadKeystores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (availableKeystores.length > 0) {
      filterKeystores();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableKeystores, existingAddresses]);

  const loadKeystores = async () => {
    setLoading(true);
    let error = '';
    try {
      const keystores: string[] = await loadAvailableKeystores();
      setAvailableKeystores(keystores);
    } catch (err) {
      console.error('Failed to load keystores:', err);
      error = 'Failed to load keystores';
    } finally {
      setLoading(false);
    }

    if (error) {
      console.error(error);
    }
  };

  const filterKeystores = () => {
    // Filter out keystores that are already imported
    const filtered = availableKeystores.filter(
      (keystore) => !existingAddresses.includes(keystore)
    );
    setFilteredKeystores(filtered);
  };

  return (
    <div className="px-1 py-1">
      {handleBackClick && (
        <div className="relative mb-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBackClick}
            className="absolute left-0 top-0 p-2 text-white bg-white/5 backdrop-blur-sm rounded-full hover:bg-white/10 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="text-center mb-3">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-1">
          <FolderOpen className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-white">Select Keystore File</h2>
        <p className="text-sm text-gray-300 mt-0.5 mb-1">
          Choose from available keystore files on your system
        </p>
      </div>

      {loading ? (
        <div className="text-center py-4 text-gray-300">
          Loading keystores...
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-sm p-2 rounded-lg border border-white/5">
          <label className="block text-sm text-gray-300 mb-1">
            Available Keystores
          </label>
          <ScrollArea className="h-[180px] rounded-md border border-white/10 bg-white/10 p-2">
            {filteredKeystores.length === 0 ? (
              <div className="text-center text-gray-400 py-4">
                No new keystores available
              </div>
            ) : (
              <div className="space-y-2">
                {filteredKeystores.map((keystore) => (
                  <Button
                    key={keystore}
                    variant="ghost"
                    className="w-full justify-between text-left font-normal text-white hover:bg-white/10 transition-colors"
                    onClick={() => onKeystoreSelect(keystore)}
                  >
                    {keystore}
                  </Button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
