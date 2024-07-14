import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Plus, Minus, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
const useMap = dynamic(
  () => import('react-leaflet').then((mod) => mod.useMap),
  { ssr: false }
);

function KeyboardControls() {
  const map = useMap();
  const [isActive, setIsActive] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      const panAmount = 50; // pixels
      const zoomAmount = 1;
      
      setIsActive(true);
      setTimeout(() => setIsActive(false), 200); // Reset after 200ms

      switch(e.key) {
        case 'ArrowUp':
          map.panBy([0, -panAmount]);
          break;
        case 'ArrowDown':
          map.panBy([0, panAmount]);
          break;
        case 'ArrowLeft':
          map.panBy([-panAmount, 0]);
          break;
        case 'ArrowRight':
          map.panBy([panAmount, 0]);
          break;
        case '+':
          map.zoomIn(zoomAmount);
          break;
        case '-':
          map.zoomOut(zoomAmount);
          break;
      }
    };

    map.getContainer().focus();
    map.getContainer().addEventListener('keydown', handleKeyDown);

    return () => {
      map.getContainer().removeEventListener('keydown', handleKeyDown);
    };
  }, [map]);

  return (
    <div className="absolute top-2 left-2 z-[1000]">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowLegend(!showLegend)}
        aria-label={showLegend ? "Hide keyboard controls" : "Show keyboard controls"}
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
      {showLegend && (
        <div className={`mt-2 bg-white p-2 rounded shadow ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
          <p className="text-sm font-bold mb-1">Keyboard Controls:</p>
          <div className="grid grid-cols-3 gap-1">
            <ArrowUp className="w-4 h-4" />
            <ArrowDown className="w-4 h-4" />
            <ArrowLeft className="w-4 h-4" />
            <ArrowRight className="w-4 h-4" />
            <Plus className="w-4 h-4" />
            <Minus className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function CatchDetails({ catchItem }) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isMapLoaded) {
        setMapError("Map is taking longer than expected to load. Please check your internet connection.");
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isMapLoaded]);

  if (!catchItem) return null;

  const handleMapLoad = (map) => {
    setIsMapLoaded(true);
    mapRef.current = map;
    map.getContainer().focus();
  };

  const handleMapError = (error) => {
    console.error("Map loading error:", error);
    setMapError("Failed to load the map. Please try again later.");
  };

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
          <div className="h-64 mb-4 rounded-md overflow-hidden relative">
            {!isMapLoaded && !mapError && (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <p>Loading map...</p>
              </div>
            )}
            {mapError && (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <p className="text-red-500">{mapError}</p>
              </div>
            )}
            <MapContainer 
              center={[catchItem.latitude, catchItem.longitude]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
              whenCreated={handleMapLoad}
              attributionControl={false}
              tabIndex="0"
              className="focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <KeyboardControls />
            </MapContainer>
          </div>
          <div className="sr-only">
            This catch was made at {catchItem.location}, with coordinates: latitude {catchItem.latitude.toFixed(6)} and longitude {catchItem.longitude.toFixed(6)}.
            Use arrow keys to pan the map, and plus/minus keys to zoom in and out. Press the help button to toggle keyboard control instructions.
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