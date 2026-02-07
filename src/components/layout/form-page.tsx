import { ReactNode } from 'react';
import { BackButton } from '@/components/ui/back-button';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { PAGE_PADDING, BACK_BUTTON_MARGIN, FORM_FIELD_GAP, SUBMIT_TOP_PADDING } from '@/lib/constants';

export interface FormPageProps {
  title: string;
  description?: string;
  onBack?: () => void;
  onSubmit?: (e: React.FormEvent) => void;
  formId?: string;
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
  formId,
  submitLabel,
  submitDisabled = false,
  children,
  className = '',
}: FormPageProps) {
  const content = (
    <div className={`${PAGE_PADDING} flex flex-col h-full ${className}`}>
      {onBack && (
        <div className={BACK_BUTTON_MARGIN}>
          <BackButton onClick={onBack} />
        </div>
      )}

      <PageHeader title={title} description={description} />

      <div className={`${FORM_FIELD_GAP} flex-1`}>{children}</div>

      {submitLabel && (
        <div className={SUBMIT_TOP_PADDING}>
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
    return <form id={formId} onSubmit={onSubmit}>{content}</form>;
  }

  return content;
}
