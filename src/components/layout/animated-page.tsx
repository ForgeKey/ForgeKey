import { ReactNode } from 'react';
import { BackButton } from '@/components/ui/back-button';
import { PageHeader } from '@/components/ui/page-header';
import { PAGE_MIN_HEIGHT } from '@/lib/constants';

export interface AnimatedPageProps {
  title?: string;
  description?: string;
  onBack?: () => void;
  children: ReactNode;
  className?: string;
}

export function AnimatedPage({
  title,
  description,
  onBack,
  children,
  className = '',
}: AnimatedPageProps) {
  return (
    <div className={`p-3 flex flex-col h-full ${PAGE_MIN_HEIGHT} ${className}`}>
      {onBack && (
        <div className="mb-1">
          <BackButton onClick={onBack} />
        </div>
      )}

      {title && <PageHeader title={title} description={description} />}

      <div className="flex-1">{children}</div>
    </div>
  );
}
