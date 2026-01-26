import { motion } from 'motion/react';
import { Key, FolderOpen } from 'lucide-react';
import { AnimatedPage } from '@/components/layout/animated-page';
import { OptionCard } from '@/components/ui/option-card';
import { optionGridVariants } from '@/lib/animations';

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
    <AnimatedPage
      title="Import"
      description="Choose how you want to import your wallet"
      onBack={handleBackClick}
    >
      <motion.div
        variants={optionGridVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="grid grid-cols-2 gap-3"
      >
        <OptionCard
          icon={<Key className="h-4 w-4 text-white" />}
          title="Private Key"
          description="Import with a raw private key"
          onClick={onImportPrivateKey}
          className="h-32"
        />

        <OptionCard
          icon={<FolderOpen className="h-4 w-4 text-white" />}
          title="Keystore File"
          description="Import from an encrypted keystore file"
          onClick={onImportKeystore}
          className="h-32"
        />
      </motion.div>
    </AnimatedPage>
  );
}
