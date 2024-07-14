import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PhotoGallery({ catches }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!catches || catches.length === 0) {
    return <div className="text-center py-8">No catches to display.</div>;
  }

  const openLightbox = (catchItem, index) => {
    setSelectedImage(catchItem);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? catches.length - 1 : prevIndex - 1
    );
    setSelectedImage(catches[currentIndex === 0 ? catches.length - 1 : currentIndex - 1]);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === catches.length - 1 ? 0 : prevIndex + 1
    );
    setSelectedImage(catches[currentIndex === catches.length - 1 ? 0 : currentIndex + 1]);
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {catches.map((catchItem, index) => (
          <motion.div
            key={catchItem.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openLightbox(catchItem, index)}
            className="cursor-pointer"
          >
            <img
              src={catchItem.image}
              alt={catchItem.description}
              className="w-full h-40 object-cover rounded-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder-image.jpg"; // Replace with an actual placeholder image path
              }}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ y: '-100vh' }}
              animate={{ y: 0 }}
              className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                className="absolute top-2 right-2"
                variant="ghost"
                size="icon"
                onClick={closeLightbox}
              >
                <X className="h-6 w-6" />
              </Button>
              <img
                src={selectedImage.image}
                alt={selectedImage.description}
                className="w-full max-h-[70vh] object-contain mb-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-image.jpg"; // Replace with an actual placeholder image path
                }}
              />
              <h3 className="text-xl font-bold mb-2">{selectedImage.location}</h3>
              <p className="text-gray-600 mb-2">{selectedImage.description}</p>
              <p className="text-sm text-gray-500">
                Date: {new Date(selectedImage.date).toLocaleDateString()}
              </p>
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                <Button variant="ghost" size="icon" onClick={goToPrevious}>
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              </div>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                <Button variant="ghost" size="icon" onClick={goToNext}>
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}