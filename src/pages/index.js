import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import CatchForm from '@/components/CatchForm';
import CatchList from '@/components/CatchList';
import ErrorBoundary from '@/components/ErrorBoundary';
import ThemeToggle from '@/components/ThemeToggle';
import Statistics from '@/components/Statistics';
import SearchBar from '@/components/SearchBar';
import { motion } from "framer-motion";

export default function Home() {
  const [catches, setCatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
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

  const deleteCatch = (id) => {
    const updatedCatches = catches.filter(c => c.id !== id);
    setCatches(updatedCatches);
    localStorage.setItem('fishingCatches', JSON.stringify(updatedCatches));
  };

  const filteredCatches = catches.filter(c => 
    c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastCatch = currentPage * catchesPerPage;
  const indexOfFirstCatch = indexOfLastCatch - catchesPerPage;
  const currentCatches = filteredCatches.slice(indexOfFirstCatch, indexOfLastCatch);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-center">Fishing Catch Logger</h1>
        <ThemeToggle />
      </div>
      <ErrorBoundary>
        <Statistics catches={catches} />
      </ErrorBoundary>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ErrorBoundary>
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card p-6 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-semibold mb-4">Log a New Catch</h2>
            <CatchForm onAddCatch={addCatch} />
          </motion.div>
        </ErrorBoundary>
        <ErrorBoundary>
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-card p-6 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-semibold mb-4">Your Catches</h2>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <CatchList 
              catches={currentCatches} 
              currentPage={currentPage}
              catchesPerPage={catchesPerPage}
              totalCatches={filteredCatches.length}
              paginate={paginate}
              onDelete={deleteCatch}
            />
          </motion.div>
        </ErrorBoundary>
      </div>
    </motion.div>
  );
}