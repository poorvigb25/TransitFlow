import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { SocketContext } from '../context/SocketContext';
import { Bus, MapPin, Gauge, Clock } from 'lucide-react';

const BusCrowdPage = () => {
  const { socket } = useContext(SocketContext);
  const [buses, setBuses] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('all');

  const fetchBuses = async () => {
    try {
      const res = await API.get('/transit/buses');
      setBuses(res.data.buses || []);
    } catch (err) {
      console.error('Error fetching buses data', err);
    }
  };

  useEffect(() => {
    fetchBuses();

    if (socket) {
      socket.on('bus:update', (updatedBus) => {
        setBuses((prev) =>
          prev.map((b) => (b._id === updatedBus._id ? updatedBus : b))
        );
      });
    }

    return () => {
      if (socket) socket.off('bus:update');
    };
  }, [socket]);

  // Unique list of Route numbers for filtering
  const routeNumbers = ['all', ...new Set(buses.map(b => b.routeNumber))];

  const filteredBuses = selectedRoute === 'all'
    ? buses
    : buses.filter(b => b.routeNumber === selectedRoute);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Bus Fleet Crowd Monitor</h1>
          <p className="text-slate-500 text-xs font-mono uppercase mt-1">BMTC BUS ROUTE METRICS</p>
        </div>

        {/* Route Filter Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-mono">SELECT ROUTE:</span>
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="bg-white/5 border border-white/5 text-white text-xs font-semibold px-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {routeNumbers.map((rn) => (
              <option key={rn} value={rn} className="bg-slate-900 text-white">
                {rn === 'all' ? 'All Routes' : `Route ${rn}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Buses */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredBuses.map((b) => (
          <div key={b._id} className="glass p-6 rounded-2xl border border-white/5 flex flex-col justify-between gap-5 relative">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base">{b.busNumber}</h4>
                  <p className="text-slate-500 text-xs font-semibold font-mono">Route {b.routeNumber}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                b.crowdLevel === 'Low' ? 'bg-green-500/10 text-green-400 border border-green-500/15' :
                b.crowdLevel === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/15' :
                'bg-red-500/10 text-red-400 border border-red-500/15'
              }`}>
                {b.crowdLevel}
              </span>
            </div>

            {/* Occupancy info */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Occupancy percentage</span>
                <span className="font-bold text-white">{b.occupancy}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${b.occupancy}%`,
                    backgroundColor: b.crowdLevel === 'Low' ? '#10b981' : b.crowdLevel === 'Medium' ? '#eab308' : '#ef4444'
                  }}
                />
              </div>
            </div>

            {/* Map stop indicators */}
            <div className="flex flex-col gap-2 pt-2 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="flex items-center gap-1.5 font-mono text-[10px]"><MapPin className="w-3.5 h-3.5 text-slate-500" /> AT STOP</span>
                <span className="text-white truncate max-w-[120px] font-semibold">{b.currentStop}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span className="flex items-center gap-1.5 font-mono text-[10px]"><MapPin className="w-3.5 h-3.5 text-slate-500" /> NEXT STOP</span>
                <span className="text-white truncate max-w-[120px] font-semibold">{b.nextStop}</span>
              </div>
            </div>

            {/* Details speed / ETA footer */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-4 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Gauge className="w-4 h-4" /> <span>{b.speed} km/h</span>
              </div>
              <div className="flex items-center justify-end gap-1.5 text-indigo-400 font-bold">
                <Clock className="w-4 h-4" /> <span>ETA {b.eta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusCrowdPage;
