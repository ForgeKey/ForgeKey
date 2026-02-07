import { ReactNode } from 'react';
import { BackButton } from '@/components/ui/back-button';
import { PageHeader } from '@/components/ui/page-header';
import { PAGE_MIN_HEIGHT, PAGE_PADDING, BACK_BUTTON_MARGIN } from '@/lib/constants';

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
    <div className={`${PAGE_PADDING} flex flex-col h-full ${PAGE_MIN_HEIGHT} ${className}`}>
      {onBack && (
        <div className={BACK_BUTTON_MARGIN}>
          <BackButton onClick={onBack} />
        </div>
      )}

      {title && <PageHeader title={title} description={description} />}

      <div className="flex-1">{children}</div>
    </div>
  );
}
