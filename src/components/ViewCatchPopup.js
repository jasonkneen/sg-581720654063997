import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function ViewCatchPopup({ isOpen, onClose, catch: catchItem }) {
  if (!catchItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{catchItem.location}</DialogTitle>
          <DialogDescription>
            Caught on {new Date(catchItem.date).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <img 
            src={catchItem.image} 
            alt={`Catch at ${catchItem.location}`} 
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <p className="text-sm text-muted-foreground">{catchItem.description}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>
            <X className="mr-2 h-4 w-4" /> Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}