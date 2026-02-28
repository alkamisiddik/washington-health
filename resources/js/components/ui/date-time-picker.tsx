import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface DateTimePickerProps extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

/**
 * Styled datetime-local input using shadcn Input. Use value in format YYYY-MM-DDTHH:mm.
 */
function DateTimePicker({ value = '', onChange, className, ...props }: DateTimePickerProps) {
  return (
    <Input
      type="datetime-local"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn('min-h-9', className)}
      {...props}
    />
  );
}

export { DateTimePicker };
