import { TextField, Label, Input, FieldError } from '@heroui/react';
import type { TextFieldRootProps } from '@heroui/react';
import type { ReactNode } from 'react';

interface AppTextInputProps extends Omit<TextFieldRootProps, 'children'> {
  label?: string;
  placeholder?: string;
  type?: string;
  errorMessage?: ReactNode;
}

export default function AppTextInput({
  label,
  placeholder,
  type = 'text',
  errorMessage,
  className,
  ...props
}: AppTextInputProps) {
  return (
    <TextField variant='secondary' className={`flex flex-col gap-1 w-full ${className ?? ''}`} {...props}>
      {label && <Label>{label}</Label>}
      <Input type={type} {...(placeholder !== undefined ? { placeholder } : {})} />
      <FieldError>{errorMessage}</FieldError>
    </TextField>
  );
}