import { motion } from 'motion/react';
import { Key, Sparkles, Download } from 'lucide-react';
import { AnimatedPage } from '@/components/layout/animated-page';
import { OptionCard } from '@/components/ui/option-card';
import { optionGridVariants } from '@/lib/animations';

type SelectAddressTypeProps = {
  setAddAddressStep: (step: 'select' | 'new' | 'vanity' | 'import-options') => void;
  handleBackClick?: () => void;
};

export function SelectAddressType({
  setAddAddressStep,
  handleBackClick,
}: SelectAddressTypeProps) {
  return (
    <AnimatedPage
      title="Add New Keystore"
      description="Choose how you want to create or import your keystore"
      onBack={handleBackClick}
    >
      <motion.div
        variants={optionGridVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-3"
      >
        <div className="grid grid-cols-2 gap-3">
          <OptionCard
            icon={<Sparkles className="h-4 w-4 text-white" />}
            title="Vanity Address"
            description="Generate custom patterns"
            onClick={() => setAddAddressStep('vanity')}
          />

          <OptionCard
            icon={<Download className="h-4 w-4 text-white" />}
            title="Import"
            description="Import existing address"
            onClick={() => setAddAddressStep('import-options')}
          />
        </div>

        <OptionCard
          icon={<Key className="h-4 w-4 text-white" />}
          title="Generate New"
          description="Create a new Ethereum address"
          onClick={() => setAddAddressStep('new')}
          className="w-full"
        />
      </motion.div>
    </AnimatedPage>
  );
}
