import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { iconSwapVariants, iconSwapTransition } from '@/lib/animations';
import { copyToClipboard } from '@/utils/copy-to-clipboard';

interface CopyButtonProps {
  value: string;
  className?: string;
}

export function CopyButton({ value, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className={`rounded-md bg-transparent hover:bg-white/5 transition-all p-1.5 h-8 w-8 ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.div
            key="check"
            variants={iconSwapVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={iconSwapTransition}
          >
            <Check className="h-4 w-4 text-green-400" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            variants={iconSwapVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={iconSwapTransition}
          >
            <Copy className="h-4 w-4 text-white/70" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
