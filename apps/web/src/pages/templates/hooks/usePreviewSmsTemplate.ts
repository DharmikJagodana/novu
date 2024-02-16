import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { usePreviewSms } from '../../../api/hooks';
import { IForm } from '../components/formTypes';
import { useStepFormCombinedErrors } from './useStepFormCombinedErrors';
import { useStepFormPath } from './useStepFormPath';

export const usePreviewSmsTemplate = (locale?: string) => {
  const { watch } = useFormContext<IForm>();
  const path = useStepFormPath();
  const templateContent = watch(`${path}.template.content`);
  const [previewContent, setPreviewContent] = useState(templateContent as string);
  const templateError = useStepFormCombinedErrors();

  const { isLoading, getSmsPreview } = usePreviewSms({
    onSuccess: (result) => {
      setPreviewContent(result.content);
    },
  });

  useEffect(() => {
    if (!locale) return;

    getSmsPreview({
      content: templateContent,
      payload: '',
      locale,
    });
  }, [locale, templateContent, getSmsPreview]);

  const isPreviewContentLoading = !templateError && isLoading;

  return { previewContent, isPreviewContentLoading, templateError };
};
