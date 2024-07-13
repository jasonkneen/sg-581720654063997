import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function CatchForm({ onAddCatch }) {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
      const newCatch = {
        id: Date.now(),
        image,
        location,
        description,
        tags,
        date: new Date().toISOString(),
      };
      onAddCatch(newCatch);
      setImage(null);
      setLocation('');
      setDescription('');
      setTags([]);
      setCurrentTag('');
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="image">Image</Label>
        <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
        {image && <img src={image} alt="Selected catch" className="mt-2 max-w-full h-auto rounded-md" />}
        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your catch"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
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
        {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
      </div>
      <Button type="submit" className="w-full">Log Catch</Button>
    </form>
  );
}