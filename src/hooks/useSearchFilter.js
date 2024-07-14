import { useState, useCallback } from 'react';

export function useSearchFilter(initialCatches) {
  const [filters, setFilters] = useState({
    searchTerm: '',
    dateRange: { from: null, to: null },
    location: '',
    species: ''
  });

  const [filteredCatches, setFilteredCatches] = useState(initialCatches);

  const applyFilters = useCallback((catches) => {
    return catches.filter(catchItem => {
      const matchesSearchTerm = 
        catchItem.location.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        catchItem.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        catchItem.tags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase()));

      const matchesDateRange = 
        (!filters.dateRange.from || new Date(catchItem.date) >= filters.dateRange.from) &&
        (!filters.dateRange.to || new Date(catchItem.date) <= filters.dateRange.to);

      const matchesLocation = 
        !filters.location || catchItem.location.toLowerCase().includes(filters.location.toLowerCase());

      const matchesSpecies = 
        !filters.species || catchItem.tags.some(tag => tag.toLowerCase().includes(filters.species.toLowerCase()));

      return matchesSearchTerm && matchesDateRange && matchesLocation && matchesSpecies;
    });
  }, [filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    setFilteredCatches(applyFilters(initialCatches));
  }, [initialCatches, applyFilters]);

  return { filters, filteredCatches, updateFilters };
}