import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, ChevronRight } from 'lucide-react';

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
    <div className="p-3 flex flex-col h-full">
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
        <h2 className="text-base font-semibold text-white mb-1">Keystore File</h2>
        <p className="text-xs text-white/50">
          Choose from available keystore files on your system
        </p>
      </div>

      {/* Keystore List */}
      {loading ? (
        <div className="text-center py-3 text-white/50 text-sm flex-1">
          Loading keystores...
        </div>
      ) : (
        <div className="flex-1">
          <ScrollArea className="h-[200px]">
            {filteredKeystores.length === 0 ? (
              <div className="text-center text-white/50 py-3 text-sm">
                No new keystores available
              </div>
            ) : (
              <div className="space-y-1.5">
                {filteredKeystores.map((keystore) => (
                  <Button
                    key={keystore}
                    variant="ghost"
                    className="w-full justify-between text-left font-normal bg-white/[0.03] border border-white/[0.08] text-white hover:bg-white/[0.05] rounded-md h-10 px-3 text-sm"
                    onClick={() => onKeystoreSelect(keystore)}
                  >
                    <span className="truncate">{keystore}</span>
                    <ChevronRight className="h-4 w-4 text-white/40 flex-shrink-0" />
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
