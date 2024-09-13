import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LiveMap = ({ criminals }) => {
  const [markers, setMarkers] = useState(criminals);

  // Update markers whenever the criminals prop changes
  useEffect(() => {
    setMarkers(criminals);
  }, [criminals]);

  // Provide a default center if no criminals are available
  const defaultCenter = [20.5937, 78.9629]; // Center of India, adjust as needed

  // Guard to ensure we don't pass undefined lat/lng to the MapContainer
  const validMarkers = markers.filter((criminal) => criminal.latitude && criminal.longitude);

  return (
    <MapContainer 
      center={validMarkers.length > 0 ? [validMarkers[0].latitude, validMarkers[0].longitude] : defaultCenter} 
      zoom={5} 
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Only render markers with valid lat/lng */}
      {validMarkers.map((criminal, index) => (
        <Marker 
          key={index} 
          position={[criminal.latitude, criminal.longitude]}
        >
          <Popup>
            {criminal.name}: {criminal.latitude.toFixed(4)}, {criminal.longitude.toFixed(4)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LiveMap;
