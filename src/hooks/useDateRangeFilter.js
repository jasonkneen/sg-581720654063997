import { useState, useCallback } from 'react';

export function useDateRangeFilter(initialCatches) {
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [filteredCatches, setFilteredCatches] = useState(initialCatches);

  const filterCatches = useCallback((catches) => {
    return catches.filter(c => 
      (!dateRange.from || new Date(c.date) >= dateRange.from) &&
      (!dateRange.to || new Date(c.date) <= dateRange.to)
    );
  }, [dateRange]);

  const updateDateRange = useCallback((newDateRange) => {
    setDateRange(newDateRange);
    setFilteredCatches(filterCatches(initialCatches));
  }, [initialCatches, filterCatches]);

  return { dateRange, filteredCatches, updateDateRange };
}