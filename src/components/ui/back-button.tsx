import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { backButtonVariants, backButtonTransition } from '@/lib/animations';

interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

export function BackButton({ onClick, className = '' }: BackButtonProps) {
  return (
    <motion.div
      variants={backButtonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      transition={backButtonTransition}
      className={className}
    >
      <Button
        type="button"
        variant="ghost"
        onClick={onClick}
        className="h-8 w-8 p-0 text-white bg-transparent hover:bg-white/10 rounded-full transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
