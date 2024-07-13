import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function MapView({ catches }) {
  const [activeMarker, setActiveMarker] = useState(null);

  const center = catches.length > 0
    ? [catches[0].latitude, catches[0].longitude]
    : [0, 0];

  return (
    <MapContainer center={center} zoom={13} style={{ height: '400px', width: '100%' }}>
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
  );
}