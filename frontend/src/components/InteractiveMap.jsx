import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
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
  console.warn('Could not patch Leaflet default icon paths', e);
}

// Custom Icons
const createCustomIcon = (emoji, color) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: rgba(6, 6, 20, 0.9);
        border: 2px solid ${color};
        border-radius: 50%;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 0 12px ${color}88;
      ">
        ${emoji}
      </div>
    `,
    className: 'custom-leaflet-marker',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
};

const mapColors = {
  Low: '#10b981',
  Medium: '#eab308',
  High: '#ef4444',
};

const InteractiveMap = ({
  stations,
  buses,
  showHeatmap,
}) => {

  // India Center
  const INDIA_CENTER = [20.5937, 78.9629];

  return (
    <div className="w-full relative" style={{ height: '500px' }}>
      <MapContainer
        center={INDIA_CENTER}
        zoom={5}
        minZoom={4}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Metro Stations */}
        {stations
          ?.filter(
            (station) =>
              station &&
              typeof station.latitude === 'number' &&
              typeof station.longitude === 'number'
          )
          .map((station) => (
            <Marker
              key={station._id}
              position={[station.latitude, station.longitude]}
              icon={createCustomIcon(
                '🚉',
                mapColors[station.crowdLevel] || '#6366f1'
              )}
            >
              <Popup>
                <div className="text-slate-900 p-1">
                  <h3 className="font-bold text-sm">
                    {station.stationName}
                  </h3>

                  <p className="text-xs text-slate-500 mb-2">
                    {station.city}
                  </p>

                  <div className="text-xs">
                    Occupancy:{' '}
                    <strong>
                      {station.occupancy}% ({station.crowdLevel})
                    </strong>
                  </div>

                  <div className="text-xs mt-1">
                    Status:{' '}
                    <strong>{station.status}</strong>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Buses */}
        {buses
          ?.filter(
            (bus) =>
              bus &&
              typeof bus.latitude === 'number' &&
              typeof bus.longitude === 'number'
          )
          .map((bus) => (
            <Marker
              key={bus._id}
              position={[bus.latitude, bus.longitude]}
              icon={createCustomIcon(
                '🚌',
                mapColors[bus.crowdLevel] || '#3b82f6'
              )}
            >
              <Popup>
                <div className="text-slate-900 p-1">
                  <h3 className="font-bold text-sm">
                    Bus {bus.busNumber}
                  </h3>

                  <p className="text-xs text-slate-500 mb-2">
                    Route {bus.routeNumber} ({bus.city})
                  </p>

                  <div className="text-xs">
                    Occupancy:{' '}
                    <strong>
                      {bus.occupancy}% ({bus.crowdLevel})
                    </strong>
                  </div>

                  <div className="text-xs mt-1">
                    Current Stop:{' '}
                    <strong>{bus.currentStop}</strong>
                  </div>

                  <div className="text-xs mt-1">
                    ETA:{' '}
                    <strong>{bus.eta}</strong>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Heatmap Stations */}
        {showHeatmap &&
          stations?.map((station) => (
            <Circle
              key={`station-heat-${station._id}`}
              center={[station.latitude, station.longitude]}
              radius={700}
              pathOptions={{
                fillColor:
                  mapColors[station.crowdLevel] || '#6366f1',
                fillOpacity:
                  0.15 + (station.occupancy || 0) / 200,
                stroke: false,
              }}
            />
          ))}

        {/* Heatmap Buses */}
        {showHeatmap &&
          buses?.map((bus) => (
            <Circle
              key={`bus-heat-${bus._id}`}
              center={[bus.latitude, bus.longitude]}
              radius={600}
              pathOptions={{
                fillColor:
                  mapColors[bus.crowdLevel] || '#3b82f6',
                fillOpacity:
                  0.12 + (bus.occupancy || 0) / 200,
                stroke: false,
              }}
            />
          ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;