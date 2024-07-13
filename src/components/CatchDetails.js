import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";

export default function CatchDetails({ catchItem }) {
  if (!catchItem) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{catchItem.location}</CardTitle>
          <CardDescription className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {new Date(catchItem.date).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-w-16 aspect-h-9 mb-4">
            <img src={catchItem.image} alt="Catch" className="object-cover rounded-md w-full h-64" />
          </div>
          <p className="text-sm text-muted-foreground mb-4">{catchItem.description}</p>
          <div className="flex items-center mb-4">
            <MapPin className="mr-2 h-4 w-4" />
            <span>
              Latitude: {catchItem.latitude.toFixed(6)}, Longitude: {catchItem.longitude.toFixed(6)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {catchItem.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Logged on: {new Date(catchItem.date).toLocaleString()}
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}