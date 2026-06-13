import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet default icon fixes
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

try {
  if (L && L.Icon && L.Icon.Default) {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });
  }
} catch (e) {
  console.warn("Could not patch Leaflet default icon paths", e);
}

// Component to dynamically pan/set map view when center changes
function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && typeof center[0] === 'number' && typeof center[1] === 'number' && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, map.getZoom() || 12);
    }
  }, [center, map]);
  return null;
}

// Custom Icons setup based on crowd intensity colors
const createCustomIcon = (emoji, color) => {
  return L.divIcon({
    html: `<div style="
      background-color: rgba(6, 6, 20, 0.9);
      border: 2px solid ${color};
      border-radius: 50%;
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      box-shadow: 0 0 10px ${color}88;
    ">${emoji}</div>`,
    className: 'custom-leaflet-marker',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
};

const mapColors = {
  Low: '#10b981', // green
  Medium: '#eab308', // yellow
  High: '#ef4444' // red
};

const InteractiveMap = ({ stations, buses, showHeatmap, zoomLevel = 12 }) => {
  // Compute dynamic center based on active stations and buses
  const center = useMemo(() => {
    const validPoints = [
      ...(stations || []).filter(s => s && typeof s.latitude === 'number' && typeof s.longitude === 'number'),
      ...(buses || []).filter(b => b && typeof b.latitude === 'number' && typeof b.longitude === 'number')
    ];
    if (validPoints.length > 0) {
      const avgLat = validPoints.reduce((sum, p) => sum + p.latitude, 0) / validPoints.length;
      const avgLng = validPoints.reduce((sum, p) => sum + p.longitude, 0) / validPoints.length;
      return [avgLat, avgLng];
    }
    return [12.9716, 77.5946]; // default Bangalore center
  }, [stations, buses]);

  return (
    <div className="w-full relative" style={{ height: '500px' }}>
      <MapContainer center={center} zoom={zoomLevel} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <ChangeMapView center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Map Stations */}
        {stations?.filter(s => s && typeof s.latitude === 'number' && typeof s.longitude === 'number' && !isNaN(s.latitude) && !isNaN(s.longitude)).map((station) => (
          <Marker
            key={station._id}
            position={[station.latitude, station.longitude]}
            icon={createCustomIcon('🚉', mapColors[station.crowdLevel] || '#6366f1')}
          >
            <Popup>
              <div className="text-slate-900 font-sans p-1">
                <h3 className="font-bold text-sm">{station.stationName}</h3>
                <p className="text-xs text-slate-500 mb-2">City: {station.city}</p>
                <div className="flex justify-between items-center text-xs gap-3">
                  <span>Occupancy:</span>
                  <span className="font-bold">{station.occupancy}% ({station.crowdLevel})</span>
                </div>
                <div className="flex justify-between items-center text-xs mt-1">
                  <span>Status:</span>
                  <span className="font-semibold text-indigo-600">{station.status}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Map Buses */}
        {buses?.filter(b => b && typeof b.latitude === 'number' && typeof b.longitude === 'number' && !isNaN(b.latitude) && !isNaN(b.longitude)).map((bus) => (
          <Marker
            key={bus._id}
            position={[bus.latitude, bus.longitude]}
            icon={createCustomIcon('🚌', mapColors[bus.crowdLevel] || '#3b82f6')}
          >
            <Popup>
              <div className="text-slate-900 font-sans p-1">
                <h3 className="font-bold text-sm">Bus {bus.busNumber}</h3>
                <p className="text-xs text-slate-500 mb-2">Route: {bus.routeNumber} ({bus.city})</p>
                <div className="flex justify-between items-center text-xs gap-3">
                  <span>Occupancy:</span>
                  <span className="font-bold">{bus.occupancy}% ({bus.crowdLevel})</span>
                </div>
                <div className="flex justify-between items-center text-xs mt-1">
                  <span>Current Stop:</span>
                  <span className="font-semibold text-indigo-600">{bus.currentStop}</span>
                </div>
                <div className="flex justify-between items-center text-xs mt-1">
                  <span>ETA:</span>
                  <span className="font-semibold text-indigo-600">{bus.eta}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Heatmap Layer - simulated overlay using leaf circles based on crowd levels */}
        {showHeatmap && stations?.filter(s => s && typeof s.latitude === 'number' && typeof s.longitude === 'number' && !isNaN(s.latitude) && !isNaN(s.longitude)).map((station) => (
          <Circle
            key={`heat-${station._id}`}
            center={[station.latitude, station.longitude]}
            radius={600}
            pathOptions={{
              fillColor: mapColors[station.crowdLevel] || '#6366f1',
              fillOpacity: 0.15 + ((station.occupancy || 0) / 200),
              stroke: false
            }}
          />
        ))}

        {showHeatmap && buses?.filter(b => b && typeof b.latitude === 'number' && typeof b.longitude === 'number' && !isNaN(b.latitude) && !isNaN(b.longitude)).map((bus) => (
          <Circle
            key={`heat-${bus._id}`}
            center={[bus.latitude, bus.longitude]}
            radius={500}
            pathOptions={{
              fillColor: mapColors[bus.crowdLevel] || '#3b82f6',
              fillOpacity: 0.12 + ((bus.occupancy || 0) / 200),
              stroke: false
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
