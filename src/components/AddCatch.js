import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CatchForm from './CatchForm';
import { useToast } from "@/components/ui/use-toast";

export default function AddCatch({ onAddCatch, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the data to your backend
      // For now, we'll just simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCatch = {
        id: Date.now(), // This should be generated on the server in a real app
        ...formData
      };
      
      onAddCatch(newCatch);
      toast({
        title: "Catch added successfully",
        description: "Your new catch has been logged.",
        status: "success"
      });
    } catch (error) {
      console.error('Error adding catch:', error);
      toast({
        title: "Error adding catch",
        description: "There was a problem adding your catch. Please try again.",
        status: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Catch</CardTitle>
      </CardHeader>
      <CardContent>
        <CatchForm
          onSubmit={handleSubmit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  );
}