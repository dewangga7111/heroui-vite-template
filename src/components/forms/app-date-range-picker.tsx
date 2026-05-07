import { useState, useEffect } from 'react';
import { DateField, DateRangePicker, RangeCalendar, Label } from '@heroui/react';
import { parseDate, getLocalTimeZone } from '@internationalized/date';
import { format } from 'date-fns';
import type { DateValue } from '@internationalized/date';
import type { RangeValue } from 'react-aria-components';

type DateRangeValue = {
  start: string | null;
  end: string | null;
};

type AppDateRangePickerProps = {
  label?: string;
  value?: DateRangeValue | null;
  onChange?: (val: DateRangeValue | null) => void;
  isRequired?: boolean;
  isDisabled?: boolean;
};

export default function AppDateRangePicker({
  label,
  value,
  onChange,
  isRequired,
  isDisabled,
}: AppDateRangePickerProps) {
  const toRangeValue = (v: DateRangeValue | null | undefined): RangeValue<DateValue> | null => {
    if (!v?.start || !v?.end) return null;
    try {
      return {
        start: parseDate(v.start.split('-').reverse().join('-')),
        end: parseDate(v.end.split('-').reverse().join('-')),
      };
    } catch {
      return null;
    }
  };

  const [rangeValue, setRangeValue] = useState<RangeValue<DateValue> | null>(toRangeValue(value));

  useEffect(() => {
    setRangeValue(toRangeValue(value));
  }, [value]);

  const handleChange = (val: RangeValue<DateValue> | null) => {
    setRangeValue(val);
    if (val?.start && val?.end) {
      onChange?.({
        start: format(val.start.toDate(getLocalTimeZone()), 'dd-MM-yyyy'),
        end: format(val.end.toDate(getLocalTimeZone()), 'dd-MM-yyyy'),
      });
    } else {
      onChange?.(null);
    }
  };

  return (
    <DateRangePicker
      className="flex flex-col gap-1 w-full"
      value={rangeValue}
      onChange={handleChange}
      {...(isRequired !== undefined ? { isRequired } : {})}
      {...(isDisabled !== undefined ? { isDisabled } : {})}
    >
      {label && <Label>{label}</Label>}
      <DateField.Group fullWidth variant="secondary">
        <DateField.InputContainer>
          <DateField.Input slot="start">
            {(segment) => <DateField.Segment segment={segment} />}
          </DateField.Input>
          <DateRangePicker.RangeSeparator />
          <DateField.Input slot="end">
            {(segment) => <DateField.Segment segment={segment} />}
          </DateField.Input>
        </DateField.InputContainer>
        <DateField.Suffix>
          <DateRangePicker.Trigger>
            <DateRangePicker.TriggerIndicator />
          </DateRangePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>
      <DateRangePicker.Popover>
        <RangeCalendar>
          <RangeCalendar.Header>
            <RangeCalendar.YearPickerTrigger>
              <RangeCalendar.YearPickerTriggerHeading />
              <RangeCalendar.YearPickerTriggerIndicator />
            </RangeCalendar.YearPickerTrigger>
            <RangeCalendar.NavButton slot="previous" />
            <RangeCalendar.NavButton slot="next" />
          </RangeCalendar.Header>
          <RangeCalendar.Grid>
            <RangeCalendar.GridHeader>
              {(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
            </RangeCalendar.GridHeader>
            <RangeCalendar.GridBody>
              {(date) => <RangeCalendar.Cell date={date} />}
            </RangeCalendar.GridBody>
          </RangeCalendar.Grid>
          <RangeCalendar.YearPickerGrid>
            <RangeCalendar.YearPickerGridBody>
              {({ year }) => <RangeCalendar.YearPickerCell year={year} />}
            </RangeCalendar.YearPickerGridBody>
          </RangeCalendar.YearPickerGrid>
        </RangeCalendar>
      </DateRangePicker.Popover>
    </DateRangePicker>
  );
}
