import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KeystoreSelectProps {
  onKeystoreSelect: (keystoreName: string) => void;
  existingAddresses: string[];
  loadAvailableKeystores: () => Promise<string[]>;
}

/**
 * Component for selecting a keystore from available keystores
 */
export function KeystoreSelect({
  onKeystoreSelect,
  existingAddresses,
  loadAvailableKeystores,
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
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-4">Loading keystores...</div>
      ) : (
        <ScrollArea className="max-h-[250px] h-auto rounded-md border border-zinc-200 dark:border-zinc-800 p-2">
          {filteredKeystores.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No new keystores available
            </div>
          ) : (
            <div className="space-y-2">
              {filteredKeystores.map((keystore) => (
                <Button
                  key={keystore}
                  variant="ghost"
                  className="w-full justify-between text-left font-normal dark:text-zinc-50"
                  onClick={() => onKeystoreSelect(keystore)}
                >
                  {keystore}
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
}
