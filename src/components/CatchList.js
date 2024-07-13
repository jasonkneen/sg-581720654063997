import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

export default function CatchList({ catches }) {
  const handleShare = (catchItem) => {
    const shareText = `Check out my fishing catch!\nLocation: ${catchItem.location}\nDescription: ${catchItem.description}\nTags: ${catchItem.tags.join(', ')}`;
    if (navigator.share) {
      navigator.share({
        title: 'My Fishing Catch',
        text: shareText,
      }).catch(console.error);
    } else {
      alert(shareText);
    }
  };

  return (
    <div className="space-y-4">
      {catches.map((catchItem) => (
        <Card key={catchItem.id}>
          <CardHeader>
            <CardTitle>{catchItem.location}</CardTitle>
            <CardDescription>{new Date(catchItem.date).toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <img src={catchItem.image} alt="Catch" className="object-cover rounded-md" />
            </div>
            <p>{catchItem.description}</p>
            <div className="mt-2">
              {catchItem.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="mr-1 mb-1">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => handleShare(catchItem)}>
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}