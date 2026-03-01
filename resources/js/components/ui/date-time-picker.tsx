import * as React from 'react';
import { format, parseISO, isValid, isToday } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

/** Normalize to datetime-local format YYYY-MM-DDTHH:mm (no seconds, no timezone) */
export function toDateTimeLocal(value: string | undefined): string {
  if (!value) return '';
  try {
    const d = typeof value === 'string' && value.includes('T') ? new Date(value) : parseISO(value.replace(' ', 'T'));
    if (!isValid(d)) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day}T${h}:${min}`;
  } catch {
    return '';
  }
}

/** Format for display in trigger button */
export function formatDateTimeDisplay(value: string | undefined): string {
  if (!value) return 'Select date and time';
  const local = toDateTimeLocal(value);
  if (!local) return 'Select date and time';
  const d = new Date(local);
  if (!isValid(d)) return 'Select date and time';
  const dateStr = isToday(d) ? 'Today' : format(d, 'MMM d, yyyy');
  return `${dateStr} at ${format(d, 'h:mm a')}`;
}

export interface DateTimePickerProps extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
}

/**
 * User-friendly date and time picker: calendar popover + time input.
 * Value format: ISO or "YYYY-MM-DD HH:mm:ss" or "YYYY-MM-DDTHH:mm" — always normalized to YYYY-MM-DDTHH:mm on change.
 */
function DateTimePicker({ value = '', onChange, className, placeholder, readOnly }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const normalized = toDateTimeLocal(value);
  const datePart = normalized ? normalized.slice(0, 10) : '';
  const timePart = normalized ? normalized.slice(11, 16) : '';

  const selectedDate = datePart ? new Date(datePart + 'T12:00:00') : undefined;
  const [timeInput, setTimeInput] = React.useState(timePart || '09:00');

  React.useEffect(() => {
    setTimeInput(normalized ? normalized.slice(11, 16) : '09:00');
  }, [normalized]);

  const emit = React.useCallback(
    (dateStr: string, timeStr: string) => {
      if (!dateStr) return;
      const t = timeStr || '09:00';
      const next = `${dateStr}T${t}`;
      onChange?.(next);
    },
    [onChange]
  );

  const onSelect = (date: Date | undefined) => {
    if (!date) return;
    const d = format(date, 'yyyy-MM-dd');
    emit(d, timeInput);
  };

  const onTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setTimeInput(v);
    if (datePart) emit(datePart, v);
  };

  const onClear = () => {
    onChange?.('');
    setOpen(false);
  };

  if (readOnly) {
    return (
      <div className={cn('min-h-9 rounded-md border border-input bg-muted/30 px-3 py-2 text-sm text-foreground', className)}>
        {value ? formatDateTimeDisplay(value) : '—'}
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full min-h-9 justify-start text-left font-normal bg-background border border-input hover:bg-accent/50',
            !value && 'text-muted-foreground',
            className
          )}
          type="button"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? formatDateTimeDisplay(value) : (placeholder ?? 'Select date and time')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 space-y-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelect}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            initialFocus
          />
          <div className="flex items-center gap-2 border-t pt-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Input
              type="time"
              value={timeInput}
              onChange={onTimeChange}
              className="flex-1"
              step="300"
            />
          </div>
          {value && (
            <Button type="button" variant="ghost" size="sm" className="w-full" onClick={onClear}>
              Clear
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { DateTimePicker };
