import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatedPage } from '@/components/layout/animated-page';
import { ChevronRight } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadKeystores(): Promise<void> {
      setLoading(true);
      try {
        const keystores = await loadAvailableKeystores();
        setAvailableKeystores(keystores);
      } catch (err) {
        console.error('Failed to load keystores:', err);
      } finally {
        setLoading(false);
      }
    }
    loadKeystores();
  }, [loadAvailableKeystores]);

  // Filter out keystores that are already imported
  const filteredKeystores = useMemo(
    () => availableKeystores.filter((keystore) => !existingAddresses.includes(keystore)),
    [availableKeystores, existingAddresses]
  );

  return (
    <AnimatedPage
      title="Keystore File"
      description="Choose from available keystore files on your system"
      onBack={handleBackClick}
    >
      {loading ? (
        <div className="text-center py-3 text-neutral-200 text-sm">
          Loading keystores...
        </div>
      ) : (
        <ScrollArea className="h-[200px]">
          {filteredKeystores.length === 0 ? (
            <div className="text-center text-neutral-200 py-3 text-sm">
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
      )}
    </AnimatedPage>
  );
}
