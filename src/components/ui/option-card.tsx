import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { optionItemVariants, cardVariants } from '@/lib/animations';

interface OptionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
}

export function OptionCard({
  icon,
  title,
  description,
  onClick,
  className = '',
}: OptionCardProps) {
  return (
    <motion.button
      type="button"
      variants={optionItemVariants}
      whileHover={cardVariants.hover}
      whileTap={cardVariants.tap}
      onClick={onClick}
      className={`flex flex-col items-center justify-center h-28 bg-white/[0.03] backdrop-blur-sm rounded-lg border border-white/[0.08] hover:bg-white/[0.05] transition-colors p-3 ${className}`}
    >
      <div className="bg-gradient-to-r from-[#9333EA] to-[#D946EF] p-2 rounded-full mb-2">
        {icon}
      </div>
      <span className="font-medium text-sm text-white mb-1">{title}</span>
      <p className="text-[10px] text-neutral-200 text-center">{description}</p>
    </motion.button>
  );
}
