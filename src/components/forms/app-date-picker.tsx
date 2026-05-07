import { useState, useEffect } from 'react';
import { DatePicker, DateField, Calendar, Label } from '@heroui/react';
import { parseDate, getLocalTimeZone } from '@internationalized/date';
import { format } from 'date-fns';
import type { DateValue } from '@internationalized/date';

type AppDatePickerProps = {
  label?: string;
  value?: string | null;
  onChange?: (val: string) => void;
  isRequired?: boolean;
  isDisabled?: boolean;
};

export default function AppDatePicker({
  label,
  value,
  onChange,
  isRequired,
  isDisabled,
}: AppDatePickerProps) {
  const toDateValue = (v: string | null | undefined): DateValue | null => {
    if (!v) return null;
    try {
      return parseDate(v.split('-').reverse().join('-'));
    } catch {
      return null;
    }
  };

  const [dateValue, setDateValue] = useState<DateValue | null>(toDateValue(value));

  useEffect(() => {
    setDateValue(toDateValue(value));
  }, [value]);

  const handleChange = (val: DateValue | null) => {
    setDateValue(val);
    if (val) {
      const jsDate = val.toDate(getLocalTimeZone());
      onChange?.(format(jsDate, 'dd-MM-yyyy'));
    } else {
      onChange?.('');
    }
  };

  return (
    <DatePicker
      className="flex flex-col gap-1 w-full"
      value={dateValue}
      onChange={handleChange}
      {...(isRequired !== undefined ? { isRequired } : {})}
      {...(isDisabled !== undefined ? { isDisabled } : {})}
    >
      {label && <Label>{label}</Label>}
      <DateField.Group fullWidth variant="secondary">
        <DateField.Input>
          {(segment) => <DateField.Segment segment={segment} />}
        </DateField.Input>
        <DateField.Suffix>
          <DatePicker.Trigger>
            <DatePicker.TriggerIndicator />
          </DatePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>
      <DatePicker.Popover>
        <Calendar>
          <Calendar.Header>
            <Calendar.YearPickerTrigger>
              <Calendar.YearPickerTriggerHeading />
              <Calendar.YearPickerTriggerIndicator />
            </Calendar.YearPickerTrigger>
            <Calendar.NavButton slot="previous" />
            <Calendar.NavButton slot="next" />
          </Calendar.Header>
          <Calendar.Grid>
            <Calendar.GridHeader>
              {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
            </Calendar.GridHeader>
            <Calendar.GridBody>
              {(date) => <Calendar.Cell date={date} />}
            </Calendar.GridBody>
          </Calendar.Grid>
          <Calendar.YearPickerGrid>
            <Calendar.YearPickerGridBody>
              {({ year }) => <Calendar.YearPickerCell year={year} />}
            </Calendar.YearPickerGridBody>
          </Calendar.YearPickerGrid>
        </Calendar>
      </DatePicker.Popover>
    </DatePicker>
  );
}
