import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { SocketContext } from '../context/SocketContext';
import InteractiveMap from '../components/InteractiveMap';
import { Search, Eye } from 'lucide-react';

const LiveMapPage = () => {
  const { socket } = useContext(SocketContext);
  const [stations, setStations] = useState([]);
  const [buses, setBuses] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'metro', 'bus'
  const [showHeatmap, setShowHeatmap] = useState(false);

  const fetchTransitData = async () => {
    try {
      const [stationRes, busRes] = await Promise.all([
        API.get('/transit/stations'),
        API.get('/transit/buses'),
      ]);
      setStations(stationRes.data.stations || []);
      setBuses(busRes.data.buses || []);
    } catch (err) {
      console.error('Error fetching map positions', err);
    }
  };

  useEffect(() => {
    fetchTransitData();

    // Setup real-time listeners to shift positions dynamically
    if (socket) {
      socket.on('station:update', (updatedStation) => {
        setStations((prev) =>
          prev.map((s) => (s._id === updatedStation._id ? updatedStation : s))
        );
      });

      socket.on('bus:update', (updatedBus) => {
        setBuses((prev) =>
          prev.map((b) => (b._id === updatedBus._id ? updatedBus : b))
        );
      });
    }

    return () => {
      if (socket) {
        socket.off('station:update');
        socket.off('bus:update');
      }
    };
  }, [socket]);

  // Filtering and Searching logic
  const filteredStations = stations.filter((s) => {
    if (typeFilter === 'bus') return false;
    return s.stationName.toLowerCase().includes(search.toLowerCase());
  });

  const filteredBuses = buses.filter((b) => {
    if (typeFilter === 'metro') return false;
    return b.busNumber.toLowerCase().includes(search.toLowerCase()) || b.routeNumber.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex-1 flex flex-col gap-6 min-h-0">
      {/* Top Banner Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Live Transit Map</h1>
          <p className="text-slate-500 text-xs font-mono uppercase mt-1">REAL-TIME GPS VEHICLE TRACKER</p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search station or bus route..."
              className="w-full md:w-60 bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Toggle Type */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
            {['all', 'metro', 'bus'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`text-xs capitalize font-medium px-4 py-2 rounded-lg transition-colors ${
                  typeFilter === t ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Heatmap toggler */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-3 rounded-xl border transition-colors ${
              showHeatmap ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
          </button>
        </div>
      </div>

      {/* Map Layout View */}
      <div className="flex-1 min-h-[500px] glass rounded-3xl overflow-hidden border border-white/5 relative">
        <InteractiveMap stations={filteredStations} buses={filteredBuses} showHeatmap={showHeatmap} />
      </div>
    </div>
  );
};

export default LiveMapPage;
