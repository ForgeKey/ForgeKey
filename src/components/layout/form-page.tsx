import { ReactNode } from 'react';
import { BackButton } from '@/components/ui/back-button';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';

interface FormPageProps {
  title: string;
  description?: string;
  onBack?: () => void;
  onSubmit?: (e: React.FormEvent) => void;
  submitLabel?: string;
  submitDisabled?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormPage({
  title,
  description,
  onBack,
  onSubmit,
  submitLabel,
  submitDisabled = false,
  children,
  className = '',
}: FormPageProps) {
  const content = (
    <div className={`p-3 flex flex-col h-full min-h-[340px] ${className}`}>
      {onBack && (
        <div className="mb-1">
          <BackButton onClick={onBack} />
        </div>
      )}

      <PageHeader title={title} description={description} />

      <div className="space-y-3 flex-1">{children}</div>

      {submitLabel && (
        <div className="pt-3">
          <Button
            type="submit"
            className="w-full h-9 text-sm font-medium rounded-md"
            disabled={submitDisabled}
          >
            {submitLabel}
          </Button>
        </div>
      )}
    </div>
  );

  if (onSubmit) {
    return <form onSubmit={onSubmit}>{content}</form>;
  }

  return content;
}
