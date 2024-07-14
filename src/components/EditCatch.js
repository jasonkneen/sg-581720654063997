import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CatchForm from './CatchForm';
import { useToast } from "@/components/ui/use-toast";

export default function EditCatch({ catch: initialCatch, onUpdateCatch, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the updated data to your backend
      // For now, we'll just simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedCatch = {
        ...initialCatch,
        ...formData
      };
      
      onUpdateCatch(updatedCatch);
      toast({
        title: "Catch updated successfully",
        description: "Your catch has been updated.",
        status: "success"
      });
    } catch (error) {
      console.error('Error updating catch:', error);
      toast({
        title: "Error updating catch",
        description: "There was a problem updating your catch. Please try again.",
        status: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Catch</CardTitle>
      </CardHeader>
      <CardContent>
        <CatchForm
          initialCatch={initialCatch}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  );
}