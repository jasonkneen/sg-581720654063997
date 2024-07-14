import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

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
            <img 
              src={catchItem.image} 
              alt={catchItem.imageAlt || `Catch at ${catchItem.location}`} 
              className="object-cover rounded-md w-full h-64" 
            />
          </div>
          {catchItem.imageAlt && (
            <p className="text-sm text-muted-foreground mb-4 italic">
              Image description: {catchItem.imageAlt}
            </p>
          )}
          <p className="text-sm text-muted-foreground mb-4">{catchItem.description}</p>
          <div className="flex items-center mb-4">
            <MapPin className="mr-2 h-4 w-4" />
            <span>
              Latitude: {catchItem.latitude.toFixed(6)}, Longitude: {catchItem.longitude.toFixed(6)}
            </span>
          </div>
          <div className="h-64 mb-4 rounded-md overflow-hidden">
            <MapContainer 
              center={[catchItem.latitude, catchItem.longitude]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[catchItem.latitude, catchItem.longitude]}>
                <Popup>
                  {catchItem.location}
                </Popup>
              </Marker>
            </MapContainer>
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