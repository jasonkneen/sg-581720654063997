import { useState, useEffect } from 'react';

export function useCatches() {
  const [catches, setCatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedCatches = localStorage.getItem('fishingCatches');
    if (savedCatches) {
      setCatches(JSON.parse(savedCatches));
    }
    setIsLoading(false);
  }, []);

  const addCatch = (newCatch) => {
    const updatedCatches = [newCatch, ...catches];
    setCatches(updatedCatches);
    localStorage.setItem('fishingCatches', JSON.stringify(updatedCatches));
  };

  const updateCatch = (updatedCatch) => {
    const updatedCatches = catches.map(c => c.id === updatedCatch.id ? updatedCatch : c);
    setCatches(updatedCatches);
    localStorage.setItem('fishingCatches', JSON.stringify(updatedCatches));
  };

  const deleteCatch = (id) => {
    const updatedCatches = catches.filter(c => c.id !== id);
    setCatches(updatedCatches);
    localStorage.setItem('fishingCatches', JSON.stringify(updatedCatches));
  };

  return { catches, isLoading, addCatch, updateCatch, deleteCatch };
}