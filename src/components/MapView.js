import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronUp, ChevronDown } from "lucide-react";

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

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function MapView({ catches }) {
  const [activeMarker, setActiveMarker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [mapZoom, setMapZoom] = useState(3);
  const [isListOpen, setIsListOpen] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    if (catches.length > 0) {
      setMapCenter([catches[0].latitude, catches[0].longitude]);
      setMapZoom(10);
    }
  }, [catches]);

  const handleMarkerClick = useCallback((catch) => {
    setActiveMarker(catch);
    setMapCenter([catch.latitude, catch.longitude]);
    setMapZoom(13);
  }, []);

  if (typeof window === 'undefined') {
    return null; // Return null on server-side
  }

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <div className="relative">
      <div style={{ height: '400px', width: '100%' }}>
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
          <ChangeView center={mapCenter} zoom={mapZoom} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {catches.map((catchItem) => (
            <Marker
              key={catchItem.id}
              position={[catchItem.latitude, catchItem.longitude]}
              eventHandlers={{
                click: () => handleMarkerClick(catchItem),
              }}
            >
              <Popup>
                <div>
                  <h3>{catchItem.location}</h3>
                  <p>{catchItem.description}</p>
                  <img src={catchItem.image} alt="Catch" style={{ width: '100px', height: 'auto' }} />
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <Card className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Catch List</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsListOpen(!isListOpen)}>
              {isListOpen ? <ChevronDown /> : <ChevronUp />}
            </Button>
          </div>
          {isListOpen && (
            <div className="max-h-40 overflow-y-auto">
              {catches.map((catchItem) => (
                <Button
                  key={catchItem.id}
                  variant="ghost"
                  className="w-full text-left mb-2"
                  onClick={() => handleMarkerClick(catchItem)}
                >
                  {catchItem.location}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}