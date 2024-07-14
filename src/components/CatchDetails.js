import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Plus, Minus, HelpCircle, Edit, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  // ... (KeyboardControls component remains unchanged)
}

export default function CatchDetails({ catchItem, onEdit, onShare }) {
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
          <div className="flex justify-between items-center">
            <CardTitle>{catchItem.location}</CardTitle>
            <div className="space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => onEdit(catchItem)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit this catch</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => onShare(catchItem)}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share this catch</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <CardDescription className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {new Date(catchItem.date).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* ... (rest of the CardContent remains unchanged) */}
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