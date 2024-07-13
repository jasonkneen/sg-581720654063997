import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PhotoGallery({ catches }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!catches || catches.length === 0) {
    return <div className="text-center py-8">No catches to display.</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {catches.map((catchItem) => (
          <motion.div
            key={catchItem.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedImage(catchItem)}
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
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ y: '-100vh' }}
              animate={{ y: 0 }}
              className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                className="absolute top-2 right-2"
                variant="ghost"
                size="icon"
                onClick={() => setSelectedImage(null)}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}