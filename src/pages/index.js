import { useState } from 'react';
import { Button } from "@/components/ui/button";
import CatchForm from '@/components/CatchForm';
import CatchList from '@/components/CatchList';
import ErrorBoundary from '@/components/ErrorBoundary';
import ThemeToggle from '@/components/ThemeToggle';
import InteractiveStatistics from '@/components/InteractiveStatistics';
import SearchFilter from '@/components/SearchFilter';
import DateRangeFilter from '@/components/DateRangeFilter';
import ExportButton from '@/components/ExportButton';
import RecentCatchesSummary from '@/components/RecentCatchesSummary';
import dynamic from 'next/dynamic';
import PhotoGallery from '@/components/PhotoGallery';
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCatches } from '@/hooks/useCatches';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { logError, handleApiError } from '@/utils/errorHandler';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

function MapViewErrorBoundary(props) {
  return (
    <ErrorBoundary fallback={<div>There was an error loading the map. Please try again later.</div>}>
      {props.children}
    </ErrorBoundary>
  );
}

export default function Home() {
  const { catches, isLoading, addCatch, updateCatch, deleteCatch } = useCatches();
  const { filters, filteredCatches, updateFilters } = useSearchFilter(catches);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCatch, setEditingCatch] = useState(null);
  const { toast } = useToast();
  const catchesPerPage = 5;

  const indexOfLastCatch = currentPage * catchesPerPage;
  const indexOfFirstCatch = indexOfLastCatch - catchesPerPage;
  const currentCatches = filteredCatches.slice(indexOfFirstCatch, indexOfLastCatch);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddCatch = (newCatch) => {
    try {
      addCatch(newCatch);
      toast({
        title: "Catch added",
        description: "Your catch has been successfully logged.",
      });
    } catch (error) {
      logError(error);
      toast({
        title: "Error",
        description: handleApiError(error),
        variant: "destructive",
      });
    }
  };

  const handleUpdateCatch = (updatedCatch) => {
    try {
      updateCatch(updatedCatch);
      setEditingCatch(null);
      toast({
        title: "Catch updated",
        description: "Your catch has been successfully updated.",
      });
    } catch (error) {
      logError(error);
      toast({
        title: "Error",
        description: handleApiError(error),
        variant: "destructive",
      });
    }
  };

  const handleDeleteCatch = (id) => {
    try {
      deleteCatch(id);
      toast({
        title: "Catch deleted",
        description: "Your catch has been successfully deleted.",
        variant: "destructive",
      });
    } catch (error) {
      logError(error);
      toast({
        title: "Error",
        description: handleApiError(error),
        variant: "destructive",
      });
    }
  };

  return (
    <ErrorBoundary>
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
          <InteractiveStatistics catches={catches} />
        </ErrorBoundary>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <ErrorBoundary>
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 bg-card p-6 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-semibold mb-4">{editingCatch ? 'Edit Catch' : 'Log a New Catch'}</h2>
              <CatchForm 
                onAddCatch={handleAddCatch} 
                onUpdateCatch={handleUpdateCatch}
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
              <RecentCatchesSummary catches={catches} />
            </motion.div>
          </ErrorBoundary>
        </div>
        <ErrorBoundary>
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-card p-6 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-semibold mb-4">Your Catches</h2>
            <SearchFilter filters={filters} onUpdateFilters={updateFilters} />
            <DateRangeFilter dateRange={filters.dateRange} setDateRange={(newDateRange) => updateFilters({ dateRange: newDateRange })} />
            <Tabs defaultValue="list" className="mt-4">
              <TabsList>
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="map">Map</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
              </TabsList>
              <TabsContent value="list">
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
                      onDelete={handleDeleteCatch}
                      onEdit={setEditingCatch}
                    />
                  )}
                </AnimatePresence>
              </TabsContent>
              <TabsContent value="map">
                <MapViewErrorBoundary>
                  <MapView catches={filteredCatches} />
                </MapViewErrorBoundary>
              </TabsContent>
              <TabsContent value="gallery">
                <PhotoGallery catches={filteredCatches} />
              </TabsContent>
            </Tabs>
          </motion.div>
        </ErrorBoundary>
      </motion.div>
    </ErrorBoundary>
  );
}