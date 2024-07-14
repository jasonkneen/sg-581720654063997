import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export default function CatchForm({ initialCatch, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    location: '',
    date: new Date(),
    description: '',
    image: '',
    imageAlt: '',
    latitude: '',
    longitude: '',
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (initialCatch) {
      setFormData({
        location: initialCatch.location || '',
        date: new Date(initialCatch.date) || new Date(),
        description: initialCatch.description || '',
        image: initialCatch.image || '',
        imageAlt: initialCatch.imageAlt || '',
        latitude: initialCatch.latitude || '',
        longitude: initialCatch.longitude || '',
      });
      setImagePreview(initialCatch.image || '');
    }
  }, [initialCatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear the error for this field when the user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Update image preview if the image URL changes
    if (name === 'image') {
      setImagePreview(value);
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    if (!formData.imageAlt.trim()) newErrors.imageAlt = 'Image alt text is required';
    if (!formData.latitude.trim()) newErrors.latitude = 'Latitude is required';
    if (!formData.longitude.trim()) newErrors.longitude = 'Longitude is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter catch location"
        />
        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-full justify-start text-left font-normal ${
                !formData.date && "text-muted-foreground"
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.date}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
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
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Enter image URL"
        />
        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
        {imagePreview && (
          <div className="mt-2">
            <img src={imagePreview} alt="Preview" className="max-w-full h-auto rounded-md" />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="imageAlt">Image Alt Text</Label>
        <Input
          id="imageAlt"
          name="imageAlt"
          value={formData.imageAlt}
          onChange={handleChange}
          placeholder="Describe the image for accessibility"
        />
        {errors.imageAlt && <p className="text-red-500 text-sm mt-1">{errors.imageAlt}</p>}
      </div>

      <div>
        <Label htmlFor="latitude">Latitude</Label>
        <Input
          id="latitude"
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
          placeholder="Enter latitude"
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
        />
        {errors.longitude && <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>}
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