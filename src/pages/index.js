import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CatchForm from '@/components/CatchForm';
import CatchList from '@/components/CatchList';

export default function Home() {
  const [catches, setCatches] = useState([]);

  useEffect(() => {
    const savedCatches = localStorage.getItem('fishingCatches');
    if (savedCatches) {
      setCatches(JSON.parse(savedCatches));
    }
  }, []);

  const addCatch = (newCatch) => {
    const updatedCatches = [...catches, newCatch];
    setCatches(updatedCatches);
    localStorage.setItem('fishingCatches', JSON.stringify(updatedCatches));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Fishing Catch Logger</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Log a New Catch</h2>
          <CatchForm onAddCatch={addCatch} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Catches</h2>
          <CatchList catches={catches} />
        </div>
      </div>
    </div>
  );
}