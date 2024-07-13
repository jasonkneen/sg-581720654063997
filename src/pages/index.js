import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import CatchForm from '@/components/CatchForm';
import CatchList from '@/components/CatchList';
import ErrorBoundary from '@/components/ErrorBoundary';
import ThemeToggle from '@/components/ThemeToggle';
import Statistics from '@/components/Statistics';
import SearchBar from '@/components/SearchBar';
import DateRangeFilter from '@/components/DateRangeFilter';
import ExportButton from '@/components/ExportButton';
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const [catches, setCatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [editingCatch, setEditingCatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const catchesPerPage = 5;

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
    toast({
      title: "Catch added",
      description: "Your catch has been successfully logged.",
    });
  };

  const updateCatch = (updatedCatch) => {
    const updatedCatches = catches.map(c => c.id === updatedCatch.id ? updatedCatch : c);
    setCatches(updatedCatches);
    localStorage.setItem('fishingCatches', JSON.stringify(updatedCatches));
    setEditingCatch(null);
    toast({
      title: "Catch updated",
      description: "Your catch has been successfully updated.",
    });
  };

  const deleteCatch = (id) => {
    const updatedCatches = catches.filter(c => c.id !== id);
    setCatches(updatedCatches);
    localStorage.setItem('fishingCatches', JSON.stringify(updatedCatches));
    toast({
      title: "Catch deleted",
      description: "Your catch has been successfully deleted.",
      variant: "destructive",
    });
  };

  const filteredCatches = catches.filter(c => 
    (c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (!dateRange.from || new Date(c.date) >= dateRange.from) &&
    (!dateRange.to || new Date(c.date) <= dateRange.to)
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
        <div className="flex items-center space-x-4">
          <ExportButton catches={catches} />
          <ThemeToggle />
        </div>
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
            <h2 className="text-2xl font-semibold mb-4">{editingCatch ? 'Edit Catch' : 'Log a New Catch'}</h2>
            <CatchForm 
              onAddCatch={addCatch} 
              onUpdateCatch={updateCatch}
              editingCatch={editingCatch}
              setEditingCatch={setEditingCatch}
            />
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
            <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
            <AnimatePresence>
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center h-64"
                >
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                </motion.div>
              ) : (
                <CatchList 
                  catches={currentCatches} 
                  currentPage={currentPage}
                  catchesPerPage={catchesPerPage}
                  totalCatches={filteredCatches.length}
                  paginate={paginate}
                  onDelete={deleteCatch}
                  onEdit={setEditingCatch}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </ErrorBoundary>
      </div>
    </motion.div>
  );
}