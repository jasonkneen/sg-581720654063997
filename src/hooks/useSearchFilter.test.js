import { renderHook, act } from '@testing-library/react-hooks';
import { useSearchFilter } from './useSearchFilter';

describe('useSearchFilter', () => {
  const mockCatches = [
    { id: 1, location: 'Lake A', description: 'Big catch', tags: ['Bass'], date: '2023-01-01' },
    { id: 2, location: 'River B', description: 'Small catch', tags: ['Trout'], date: '2023-02-01' },
    { id: 3, location: 'Ocean C', description: 'Medium catch', tags: ['Salmon'], date: '2023-03-01' },
  ];

  it('should initialize with all catches', () => {
    const { result } = renderHook(() => useSearchFilter(mockCatches));
    expect(result.current.filteredCatches).toEqual(mockCatches);
  });

  it('should filter catches by search term', () => {
    const { result } = renderHook(() => useSearchFilter(mockCatches));
    act(() => {
      result.current.updateFilters({ searchTerm: 'Big' });
    });
    expect(result.current.filteredCatches).toHaveLength(1);
    expect(result.current.filteredCatches[0].description).toBe('Big catch');
  });

  it('should filter catches by location', () => {
    const { result } = renderHook(() => useSearchFilter(mockCatches));
    act(() => {
      result.current.updateFilters({ location: 'River' });
    });
    expect(result.current.filteredCatches).toHaveLength(1);
    expect(result.current.filteredCatches[0].location).toBe('River B');
  });

  it('should filter catches by species (tag)', () => {
    const { result } = renderHook(() => useSearchFilter(mockCatches));
    act(() => {
      result.current.updateFilters({ species: 'Salmon' });
    });
    expect(result.current.filteredCatches).toHaveLength(1);
    expect(result.current.filteredCatches[0].tags).toContain('Salmon');
  });

  it('should filter catches by date range', () => {
    const { result } = renderHook(() => useSearchFilter(mockCatches));
    act(() => {
      result.current.updateFilters({
        dateRange: {
          from: new Date('2023-01-15'),
          to: new Date('2023-02-15')
        }
      });
    });
    expect(result.current.filteredCatches).toHaveLength(1);
    expect(result.current.filteredCatches[0].date).toBe('2023-02-01');
  });

  it('should combine multiple filters', () => {
    const { result } = renderHook(() => useSearchFilter(mockCatches));
    act(() => {
      result.current.updateFilters({
        searchTerm: 'catch',
        location: 'Lake',
        dateRange: {
          from: new Date('2023-01-01'),
          to: new Date('2023-01-31')
        }
      });
    });
    expect(result.current.filteredCatches).toHaveLength(1);
    expect(result.current.filteredCatches[0].location).toBe('Lake A');
  });
});