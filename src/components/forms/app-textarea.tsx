import { TextField, Label, TextArea, FieldError } from '@heroui/react';
import type { TextFieldRootProps } from '@heroui/react';
import type { ReactNode } from 'react';

interface AppTextareaProps extends Omit<TextFieldRootProps, 'children'> {
  label?: string;
  placeholder?: string;
  errorMessage?: ReactNode;
  minRows?: number;
}

export default function AppTextarea({
  label,
  placeholder,
  errorMessage,
  minRows,
  className,
  ...props
}: AppTextareaProps) {
  return (
    <TextField variant='secondary' className={`flex flex-col gap-1 w-full ${className ?? ''}`} {...props}>
      {label && <Label>{label}</Label>}
      <TextArea placeholder={placeholder} rows={minRows} />
      <FieldError>{errorMessage}</FieldError>
    </TextField>
  );
}
