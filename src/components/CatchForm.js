import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Upload, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";

const commonTags = ['Bass', 'Trout', 'Salmon', 'Catfish', 'Pike', 'Perch', 'Carp', 'Sunny', 'Rainy', 'Lakeshore', 'River', 'Ocean'];

export default function CatchForm({ onAddCatch, onUpdateCatch, editingCatch, setEditingCatch }) {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [openTagsPopover, setOpenTagsPopover] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (editingCatch) {
      setImage(editingCatch.image);
      setLocation(editingCatch.location);
      setDescription(editingCatch.description);
      setTags(editingCatch.tags);
      setLatitude(editingCatch.latitude || '');
      setLongitude(editingCatch.longitude || '');
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

  const addTag = (tag) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setCurrentTag('');
      setOpenTagsPopover(false);
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
    if (!latitude.trim()) newErrors.latitude = 'Latitude is required';
    if (!longitude.trim()) newErrors.longitude = 'Longitude is required';
    setFormErrors(newErrors);
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
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        date: editingCatch ? editingCatch.date : new Date().toISOString(),
      };
      if (editingCatch) {
        onUpdateCatch(catchData);
        toast({
          title: "Catch updated",
          description: "Your catch has been successfully updated.",
        });
      } else {
        onAddCatch(catchData);
        toast({
          title: "Catch added",
          description: "Your catch has been successfully logged.",
        });
      }
      resetForm();
    }
  };

  const resetForm = () => {
    setImage(null);
    setLocation('');
    setDescription('');
    setTags([]);
    setLatitude('');
    setLongitude('');
    setCurrentTag('');
    setFormErrors({});
    setEditingCatch(null);
  };

  const fetchCoordinates = async () => {
    if (!location) {
      toast({
        title: "Error",
        description: "Please enter a location first.",
        variant: "destructive",
      });
      return;
    }
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setLatitude(data[0].lat);
        setLongitude(data[0].lon);
        toast({
          title: "Coordinates fetched",
          description: "Latitude and longitude have been automatically filled.",
        });
      } else {
        toast({
          title: "Location not found",
          description: "Unable to find coordinates for the given location.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      toast({
        title: "Error",
        description: "Failed to fetch coordinates. Please try again.",
        variant: "destructive",
      });
    }
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
          <input {...getInputProps()} id="image" aria-label="Upload image" />
          {image ? (
            <img src={image} alt="Selected catch" className="mt-2 max-w-full h-auto rounded-md" />
          ) : (
            <div>
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2">Drag 'n' drop an image here, or click to select one</p>
            </div>
          )}
        </div>
        {formErrors.image && <p className="text-destructive text-sm mt-1" role="alert">{formErrors.image}</p>}
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <div className="flex space-x-2">
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            className="flex-grow"
            aria-label="Enter location"
          />
          <Button type="button" onClick={fetchCoordinates} variant="outline" aria-label="Get coordinates">
            <MapPin className="h-4 w-4 mr-2" />
            Get Coordinates
          </Button>
        </div>
        {formErrors.location && <p className="text-destructive text-sm mt-1" role="alert">{formErrors.location}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="Enter latitude"
            type="number"
            step="any"
            aria-label="Enter latitude"
          />
          {formErrors.latitude && <p className="text-destructive text-sm mt-1" role="alert">{formErrors.latitude}</p>}
        </div>
        <div>
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="Enter longitude"
            type="number"
            step="any"
            aria-label="Enter longitude"
          />
          {formErrors.longitude && <p className="text-destructive text-sm mt-1" role="alert">{formErrors.longitude}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your catch"
          aria-label="Enter catch description"
        />
        {formErrors.description && <p className="text-destructive text-sm mt-1" role="alert">{formErrors.description}</p>}
      </div>
      <div>
        <Label htmlFor="tags">Tags</Label>
        <Popover open={openTagsPopover} onOpenChange={setOpenTagsPopover}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start" aria-label="Select tags">
              {tags.length > 0 ? `${tags.length} tags selected` : "Select tags..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search tags..." />
              <CommandEmpty>No tag found.</CommandEmpty>
              <CommandGroup>
                {commonTags.map((tag) => (
                  <CommandItem
                    key={tag}
                    onSelect={() => addTag(tag)}
                  >
                    {tag}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="mt-2 flex flex-wrap gap-2">
          <AnimatePresence>
            {tags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Badge variant="secondary" className="flex items-center">
                  {tag}
                  <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} aria-label={`Remove ${tag} tag`} />
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {formErrors.tags && <p className="text-destructive text-sm mt-1" role="alert">{formErrors.tags}</p>}
      </div>
      <div className="flex justify-between">
        <Button type="submit" className="w-1/2" aria-label={editingCatch ? 'Update Catch' : 'Log Catch'}>
          {editingCatch ? 'Update Catch' : 'Log Catch'}
        </Button>
        {editingCatch && (
          <Button type="button" variant="outline" className="w-1/3" onClick={resetForm} aria-label="Cancel Edit">
            Cancel Edit
          </Button>
        )}
      </div>
    </motion.form>
  );
}