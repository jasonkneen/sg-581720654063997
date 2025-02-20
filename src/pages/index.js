import { useState } from 'react';
import { Button } from "@/components/ui/button";
import CatchForm from '@/components/CatchForm';
import CatchList from '@/components/CatchList';
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

  const handleEditCatch = (catchItem) => {
    setSelectedCatch(catchItem);
    setCurrentScreen('edit');
  };

  const handleShareCatch = (catchItem) => {
    // For now, we'll just show a toast. In a real app, this would open a share dialog.
    toast({
      title: "Share feature",
      description: `Sharing functionality for catch at ${catchItem.location} is not yet implemented.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Fishing Catch Logger</h1>
      
      {currentScreen === 'home' && (
        <>
          <Button onClick={() => setCurrentScreen('add')} className="mb-4">Add New Catch</Button>
          <CatchList 
            catches={catches} 
            onEdit={handleEditCatch}
            onDelete={handleDeleteCatch}
            onView={handleViewCatch}
            onShare={handleShareCatch}
          />
        </>
      )}

      {currentScreen === 'add' && (
        <CatchForm 
          onAddCatch={handleAddCatch}
          onCancel={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'edit' && selectedCatch && (
        <CatchForm 
          catch={selectedCatch}
          onUpdateCatch={handleUpdateCatch}
          onCancel={() => setCurrentScreen('home')}
        />
      )}

      <ViewCatchPopup 
        isOpen={isViewPopupOpen}
        onClose={() => setIsViewPopupOpen(false)}
        catch={selectedCatch}
        onEdit={handleEditCatch}
        onShare={handleShareCatch}
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