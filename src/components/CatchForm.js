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

export default function CatchForm({ initialCatch, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    location: '',
    date: new Date(),
    description: '',
    image: '',
    latitude: '',
    longitude: '',
    tags: [],
  });
  const [errors, setErrors] = useState({});
  const [openTagsPopover, setOpenTagsPopover] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialCatch) {
      setFormData({
        location: initialCatch.location || '',
        date: new Date(initialCatch.date) || new Date(),
        description: initialCatch.description || '',
        image: initialCatch.image || '',
        latitude: initialCatch.latitude || '',
        longitude: initialCatch.longitude || '',
        tags: initialCatch.tags || [],
      });
    }
  }, [initialCatch]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*', multiple: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addTag = (tag) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag.trim()] }));
    }
    setOpenTagsPopover(false);
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.image) newErrors.image = 'Image is required';
    if (!formData.latitude.trim()) newErrors.latitude = 'Latitude is required';
    if (!formData.longitude.trim()) newErrors.longitude = 'Longitude is required';
    if (formData.tags.length === 0) newErrors.tags = 'At least one tag is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const fetchCoordinates = async () => {
    if (!formData.location) {
      toast({
        title: "Error",
        description: "Please enter a location first.",
        variant: "destructive",
      });
      return;
    }
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.location)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setFormData(prev => ({
          ...prev,
          latitude: data[0].lat,
          longitude: data[0].lon
        }));
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="location">Location</Label>
        <div className="flex space-x-2">
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter catch location"
            className="flex-grow"
          />
          <Button type="button" onClick={fetchCoordinates} variant="outline">
            <MapPin className="h-4 w-4 mr-2" />
            Get Coordinates
          </Button>
        </div>
        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            placeholder="Enter latitude"
            type="number"
            step="any"
          />
          {errors.latitude && <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>}
        </div>
        <div>
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            placeholder="Enter longitude"
            type="number"
            step="any"
          />
          {errors.longitude && <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your catch"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div>
        <Label htmlFor="image">Image</Label>
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${isDragActive ? 'border-primary' : 'border-muted'}`}
        >
          <input {...getInputProps()} id="image" />
          {formData.image ? (
            <img src={formData.image} alt="Selected catch" className="mt-2 max-w-full h-auto rounded-md" />
          ) : (
            <div>
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2">Drag 'n' drop an image here, or click to select one</p>
            </div>
          )}
        </div>
        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <Popover open={openTagsPopover} onOpenChange={setOpenTagsPopover}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {formData.tags.length > 0 ? `${formData.tags.length} tags selected` : "Select tags..."}
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
            {formData.tags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Badge variant="secondary" className="flex items-center">
                  {tag}
                  <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialCatch ? 'Update Catch' : 'Add Catch'}
        </Button>
      </div>
    </form>
  );
}