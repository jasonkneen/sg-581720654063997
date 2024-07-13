import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import CatchForm from '@/components/CatchForm';
import CatchList from '@/components/CatchList';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Home() {
  const [catches, setCatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const catchesPerPage = 5;

  useEffect(() => {
    const savedCatches = localStorage.getItem('fishingCatches');
    if (savedCatches) {
      setCatches(JSON.parse(savedCatches));
    }
  }, []);

  const addCatch = (newCatch) => {
    const updatedCatches = [newCatch, ...catches];
    setCatches(updatedCatches);
    localStorage.setItem('fishingCatches', JSON.stringify(updatedCatches));
  };

  const indexOfLastCatch = currentPage * catchesPerPage;
  const indexOfFirstCatch = indexOfLastCatch - catchesPerPage;
  const currentCatches = catches.slice(indexOfFirstCatch, indexOfLastCatch);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Fishing Catch Logger</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ErrorBoundary>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Log a New Catch</h2>
            <CatchForm onAddCatch={addCatch} />
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Your Catches</h2>
            <CatchList 
              catches={currentCatches} 
              currentPage={currentPage}
              catchesPerPage={catchesPerPage}
              totalCatches={catches.length}
              paginate={paginate}
            />
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}