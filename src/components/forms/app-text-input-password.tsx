import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button, InputGroup, Label, TextField, FieldError } from '@heroui/react';
import type { TextFieldRootProps } from '@heroui/react';
import type { ReactNode } from 'react';

interface AppTextInputPasswordProps extends Omit<TextFieldRootProps, 'children'> {
  label?: string;
  placeholder?: string;
  errorMessage?: ReactNode;
}

export default function AppTextInputPassword({
  label,
  placeholder,
  errorMessage,
  className,
  ...props
}: AppTextInputPasswordProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TextField variant='secondary' className={`flex flex-col gap-1 w-full ${className ?? ''}`} {...props}>
      {label && <Label>{label}</Label>}
      <InputGroup>
        <InputGroup.Input
          type={isVisible ? 'text' : 'password'}
          {...(placeholder !== undefined ? { placeholder } : {})}
        />
        <InputGroup.Suffix className="pr-0">
          <Button
            isIconOnly
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            size="sm"
            variant="secondary"
            onPress={() => setIsVisible((v) => !v)}
          >
            {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </InputGroup.Suffix>
      </InputGroup>
      <FieldError>{errorMessage}</FieldError>
    </TextField>
  );
}
