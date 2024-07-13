import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function CatchForm({ onAddCatch }) {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCatch = {
      id: Date.now(),
      image,
      location,
      description,
      tags: tags.split(',').map(tag => tag.trim()),
      date: new Date().toISOString(),
    };
    onAddCatch(newCatch);
    setImage(null);
    setLocation('');
    setDescription('');
    setTags('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="image">Image</Label>
        <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
        {image && <img src={image} alt="Selected catch" className="mt-2 max-w-full h-auto" />}
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your catch"
        />
      </div>
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., bass, sunny, lakeshore"
        />
      </div>
      <Button type="submit">Log Catch</Button>
    </form>
  );
}