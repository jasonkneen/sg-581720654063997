import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, Trash2, Edit, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CatchDetails from './CatchDetails';

export default function CatchList({ catches, currentPage, catchesPerPage, totalCatches, paginate, onDelete, onEdit }) {
  const [deleteId, setDeleteId] = useState(null);
  const [expandedCatch, setExpandedCatch] = useState(null);

  const handleShare = (catchItem) => {
    const shareText = `Check out my fishing catch!\nLocation: ${catchItem.location}\nDescription: ${catchItem.description}\nTags: ${catchItem.tags.join(', ')}`;
    if (navigator.share) {
      navigator.share({
        title: 'My Fishing Catch',
        text: shareText,
      }).catch(console.error);
    } else {
      alert(shareText);
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    onDelete(deleteId);
    setDeleteId(null);
  };

  const toggleExpand = (id) => {
    setExpandedCatch(expandedCatch === id ? null : id);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalCatches / catchesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <AnimatePresence>
        {catches.map((catchItem) => (
          <motion.div
            key={catchItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-4">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{catchItem.location}</CardTitle>
                  <Button 
                    variant="ghost" 
                    onClick={() => toggleExpand(catchItem.id)}
                    aria-expanded={expandedCatch === catchItem.id}
                    aria-controls={`catch-details-${catchItem.id}`}
                  >
                    {expandedCatch === catchItem.id ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </div>
                <CardDescription>{new Date(catchItem.date).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <img src={catchItem.image} alt={`Catch at ${catchItem.location}`} className="object-cover rounded-md w-full h-48" />
                </div>
                <p className="text-sm text-muted-foreground">{catchItem.description}</p>
                <div className="mt-2">
                  {catchItem.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="mr-1 mb-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => handleShare(catchItem)}>
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
                <div>
                  <Button variant="outline" className="mr-2" onClick={() => onEdit(catchItem)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(catchItem.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </CardFooter>
              <AnimatePresence>
                {expandedCatch === catchItem.id && (
                  <motion.div
                    id={`catch-details-${catchItem.id}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CatchDetails catchItem={catchItem} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
      <nav aria-label="Catch list pagination">
        <ul className="flex justify-center mt-4">
          {pageNumbers.map(number => (
            <li key={number}>
              <Button
                onClick={() => paginate(number)}
                variant={currentPage === number ? "default" : "outline"}
                className="mx-1"
                aria-current={currentPage === number ? "page" : undefined}
              >
                {number}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this catch?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your catch record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}