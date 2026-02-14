import { useState } from 'react';
import { MultiSelect, MultiSelectProps } from '@mantine/core';

interface CreatableMultiSelectProps extends MultiSelectProps {
  onCreate?: (query: string) => string | void;
  getCreateLabel?: (query: string) => React.ReactNode;
}

export function CreatableMultiSelect({
  data = [],
  onCreate,
  getCreateLabel,
  onSearchChange,
  searchValue: controlledSearchValue,
  ...others
}: CreatableMultiSelectProps) {
  const [internalSearchValue, setInternalSearchValue] = useState('');
  const searchValue = controlledSearchValue ?? internalSearchValue;

  // Handle data including the "Create" option
  const isValueInOptions = (data as any[]).some((item) => {
    const itemValue = typeof item === 'string' ? item : item.value;
    return itemValue.toLowerCase() === searchValue.trim().toLowerCase();
  });

  const displayData = [...(data as any[])];

  if (searchValue.trim().length > 0 && !isValueInOptions && getCreateLabel) {
    displayData.push({
      value: searchValue,
      label: getCreateLabel(searchValue),
    });
  }

  const handleSearchChange = (val: string) => {
    setInternalSearchValue(val);
    onSearchChange?.(val);
  };

  const handleChange = (values: string[]) => {
    const lastValue = values[values.length - 1];
    const isNew =
      lastValue &&
      !(data as any[]).some(
        (item) => (typeof item === 'string' ? item : item.value) === lastValue,
      );

    if (isNew && onCreate) {
      const result = onCreate(lastValue);
      // If onCreate returns a new ID (e.g. from a database), we use that,
      // otherwise we use the string value itself.
      if (result && typeof result === 'string') {
        const newValues = [...values];
        newValues[newValues.length - 1] = result;
        others.onChange?.(newValues);
        setInternalSearchValue('');
        return;
      }
    }

    others.onChange?.(values);
    if (isNew) {
      setInternalSearchValue('');
    }
  };

  return (
    <MultiSelect
      {...others}
      data={displayData}
      searchable
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
      onChange={handleChange}
    />
  );
}
