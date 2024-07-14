import { useState } from 'react';
import { Button } from "@/components/ui/button";
import Home from '@/components/Home';
import AddCatch from '@/components/AddCatch';
import EditCatch from '@/components/EditCatch';
import ViewCatchPopup from '@/components/ViewCatchPopup';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import { useCatches } from '@/hooks/useCatches';
import { useToast } from "@/components/ui/use-toast";

export default function App() {
  const { catches, addCatch, updateCatch, deleteCatch } = useCatches();
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedCatch, setSelectedCatch] = useState(null);
  const [isViewPopupOpen, setIsViewPopupOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const { toast } = useToast();

  const handleAddCatch = (newCatch) => {
    addCatch(newCatch);
    toast({
      title: "Catch added",
      description: "Your catch has been successfully logged.",
    });
    setCurrentScreen('home');
  };

  const handleUpdateCatch = (updatedCatch) => {
    updateCatch(updatedCatch);
    toast({
      title: "Catch updated",
      description: "Your catch has been successfully updated.",
    });
    setCurrentScreen('home');
  };

  const handleDeleteCatch = (id) => {
    setSelectedCatch(catches.find(c => c.id === id));
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    deleteCatch(selectedCatch.id);
    setIsDeleteConfirmOpen(false);
    toast({
      title: "Catch deleted",
      description: "Your catch has been successfully deleted.",
    });
  };

  const handleViewCatch = (catchItem) => {
    setSelectedCatch(catchItem);
    setIsViewPopupOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Fishing Catch Logger</h1>
      
      {currentScreen === 'home' && (
        <>
          <Button onClick={() => setCurrentScreen('add')} className="mb-4">Add New Catch</Button>
          <Home 
            catches={catches} 
            onEdit={(catchItem) => {
              setSelectedCatch(catchItem);
              setCurrentScreen('edit');
            }}
            onDelete={handleDeleteCatch}
            onView={handleViewCatch}
          />
        </>
      )}

      {currentScreen === 'add' && (
        <AddCatch 
          onAddCatch={handleAddCatch}
          onCancel={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'edit' && selectedCatch && (
        <EditCatch 
          catch={selectedCatch}
          onUpdateCatch={handleUpdateCatch}
          onCancel={() => setCurrentScreen('home')}
        />
      )}

      <ViewCatchPopup 
        isOpen={isViewPopupOpen}
        onClose={() => setIsViewPopupOpen(false)}
        catch={selectedCatch}
      />

      <DeleteConfirmation
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        catchItem={selectedCatch}
      />
    </div>
  );
}