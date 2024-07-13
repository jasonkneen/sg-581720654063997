import { useState } from 'react';
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

export default function MapView({ catches }) {
  const [activeMarker, setActiveMarker] = useState(null);

  if (typeof window === 'undefined') {
    return null; // Return null on server-side
  }

  const center = catches.length > 0
    ? [catches[0].latitude, catches[0].longitude]
    : [0, 0];

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {catches.map((catchItem) => (
          <Marker
            key={catchItem.id}
            position={[catchItem.latitude, catchItem.longitude]}
            eventHandlers={{
              click: () => {
                setActiveMarker(catchItem);
              },
            }}
          >
            {activeMarker === catchItem && (
              <Popup>
                <div>
                  <h3>{catchItem.location}</h3>
                  <p>{catchItem.description}</p>
                  <img src={catchItem.image} alt="Catch" style={{ width: '100px', height: 'auto' }} />
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}