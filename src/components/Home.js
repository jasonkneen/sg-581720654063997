import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List, Eye, Pencil, Trash } from 'lucide-react';

export default function Home({ catches, onEdit, onDelete, onView }) {
  const [viewMode, setViewMode] = useState('gallery');

  const CatchItem = ({ catchItem, view }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{catchItem.location}</CardTitle>
        <CardDescription>{new Date(catchItem.date).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        {view === 'gallery' && (
          <img src={catchItem.image} alt={catchItem.description} className="w-full h-48 object-cover rounded-md mb-4" />
        )}
        <p className="text-sm text-muted-foreground">{catchItem.description}</p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => onView(catchItem)}>
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(catchItem)}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(catchItem.id)}>
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Tabs value={viewMode} onValueChange={setViewMode}>
          <TabsList>
            <TabsTrigger value="gallery">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="h-4 w-4 mr-2" />
              List
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className={viewMode === 'gallery' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : ''}>
        {catches.map(catchItem => (
          <CatchItem key={catchItem.id} catchItem={catchItem} view={viewMode} />
        ))}
      </div>
    </div>
  );
}