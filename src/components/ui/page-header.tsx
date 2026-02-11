import { motion } from 'motion/react';
import { fadeInVariants, fadeTransition } from '@/lib/animations';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ title, description, className = '' }: PageHeaderProps) {
  return (
    <motion.div
      variants={fadeInVariants}
      initial="initial"
      animate="animate"
      transition={fadeTransition}
      className={`mb-3 ${className}`}
    >
      <h2 className="text-base font-semibold text-white mb-1">{title}</h2>
      {description && (
        <p className="text-xs text-neutral-400 text-left">{description}</p>
      )}
    </motion.div>
  );
}
