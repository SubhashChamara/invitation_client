"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

// Fix standard marker icons for Leaflet in Next.js
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function VenueMap({ 
  position = [51.505, -0.09], 
  name = "Luxury Hotel Venue" 
}: { 
  position?: [number, number];
  name?: string;
}) {
  useEffect(() => {
    // Only access window on client
  }, []);

  return (
    <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden glass-card relative z-10 border border-white/10">
      <MapContainer 
        center={position as [number, number]} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position as [number, number]} icon={customIcon}>
          <Popup>
            <span className="font-serif text-navy font-bold">{name}</span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
