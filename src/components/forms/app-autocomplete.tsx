
import { Autocomplete, Label, ListBox, ListBoxItem, SearchField, useFilter, EmptyState } from '@heroui/react';
import type { AutocompleteRootProps } from '@heroui/react';

type AppAutocompleteProps<T extends Record<string, any>> = Omit<
  AutocompleteRootProps<object>,
  'children' | 'items'
> & {
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  items: T[];
  itemLabel?: keyof T;
  itemValue?: keyof T;
};

export default function AppAutocomplete<T extends Record<string, any>>({
  label,
  placeholder,
  searchPlaceholder,
  items,
  itemLabel = 'label',
  itemValue = 'value',
  className,
  ...props
}: AppAutocompleteProps<T>) {
  const { contains } = useFilter({ sensitivity: 'base' });

  return (
    <Autocomplete variant='secondary' fullWidth className={`flex flex-col gap-1 ${className ?? ''}`} {...props}>
      {label && <Label>{label}</Label>}
      <Autocomplete.Trigger className="w-full">
        <Autocomplete.Value>
          {({ defaultChildren }) => defaultChildren ?? (
            <span className="text-gray-400">{placeholder ?? 'Select...'}</span>
          )}
        </Autocomplete.Value>
        <Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      <Autocomplete.Popover>
        <Autocomplete.Filter filter={contains}>
          <SearchField autoFocus name="search" variant="secondary">
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input
                {...(searchPlaceholder !== undefined ? { placeholder: searchPlaceholder } : { placeholder: 'Search...' })}
              />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <ListBox renderEmptyState={() => <EmptyState>No results found</EmptyState>}>
            {items.map((item) => (
              <ListBoxItem
                key={String(item[itemValue] ?? '')}
                id={String(item[itemValue] ?? '')}
                textValue={String(item[itemLabel] ?? '')}
              >
                {String(item[itemLabel] ?? '')}
              </ListBoxItem>
            ))}
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
    </Autocomplete>
  );
}