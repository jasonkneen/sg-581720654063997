import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Upload } from "lucide-react";
import { motion } from "framer-motion";

export default function CatchForm({ onAddCatch, onUpdateCatch, editingCatch, setEditingCatch }) {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingCatch) {
      setImage(editingCatch.image);
      setLocation(editingCatch.location);
      setDescription(editingCatch.description);
      setTags(editingCatch.tags);
    }
  }, [editingCatch]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*', multiple: false });

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!image) newErrors.image = 'Please upload an image';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (tags.length === 0) newErrors.tags = 'At least one tag is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const catchData = {
        id: editingCatch ? editingCatch.id : Date.now(),
        image,
        location,
        description,
        tags,
        date: editingCatch ? editingCatch.date : new Date().toISOString(),
      };
      if (editingCatch) {
        onUpdateCatch(catchData);
      } else {
        onAddCatch(catchData);
      }
      resetForm();
    }
  };

  const resetForm = () => {
    setImage(null);
    setLocation('');
    setDescription('');
    setTags([]);
    setCurrentTag('');
    setErrors({});
    setEditingCatch(null);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <Label htmlFor="image">Image</Label>
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${isDragActive ? 'border-primary' : 'border-muted'}`}
        >
          <input {...getInputProps()} />
          {image ? (
            <img src={image} alt="Selected catch" className="mt-2 max-w-full h-auto rounded-md" />
          ) : (
            <div>
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2">Drag 'n' drop an image here, or click to select one</p>
            </div>
          )}
        </div>
        {errors.image && <p className="text-destructive text-sm mt-1">{errors.image}</p>}
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
        {errors.location && <p className="text-destructive text-sm mt-1">{errors.location}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your catch"
        />
        {errors.description && <p className="text-destructive text-sm mt-1">{errors.description}</p>}
      </div>
      <div>
        <Label htmlFor="tags">Tags</Label>
        <div className="flex items-center">
          <Input
            id="tags"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            placeholder="Add a tag"
            className="flex-grow"
          />
          <Button type="button" onClick={addTag} className="ml-2">Add Tag</Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center">
              {tag}
              <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
            </Badge>
          ))}
        </div>
        {errors.tags && <p className="text-destructive text-sm mt-1">{errors.tags}</p>}
      </div>
      <div className="flex justify-between">
        <Button type="submit" className="w-1/2">
          {editingCatch ? 'Update Catch' : 'Log Catch'}
        </Button>
        {editingCatch && (
          <Button type="button" variant="outline" className="w-1/3" onClick={resetForm}>
            Cancel Edit
          </Button>
        )}
      </div>
    </motion.form>
  );
}