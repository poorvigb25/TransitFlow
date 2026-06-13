import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { SocketContext } from '../context/SocketContext';
import { Search, MapPin, Clock } from 'lucide-react';

const MetroCrowdPage = () => {
  const { socket } = useContext(SocketContext);
  const [stations, setStations] = useState([]);
  const [search, setSearch] = useState('');

  const fetchStations = async () => {
    try {
      const res = await API.get('/transit/stations');
      setStations(res.data.stations || []);
    } catch (err) {
      console.error('Error fetching stations', err);
    }
  };

  useEffect(() => {
    fetchStations();

    if (socket) {
      socket.on('station:update', (updatedStation) => {
        setStations((prev) =>
          prev.map((s) => (s._id === updatedStation._id ? updatedStation : s))
        );
      });
    }

    return () => {
      if (socket) socket.off('station:update');
    };
  }, [socket]);

  const filteredStations = stations.filter(s =>
    s.stationName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Metro Station Congestion</h1>
          <p className="text-slate-500 text-xs font-mono uppercase mt-1">COMMUTER VOLUMES & STATUS OVERVIEW</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter stations..."
            className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Grid of Stations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredStations.map((s) => (
          <div key={s._id} className="glass p-6 rounded-2xl border border-white/5 flex flex-col justify-between gap-5 relative overflow-hidden">
            {/* Top Indicator border */}
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: s.lineColor }} />
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="text-white font-bold text-lg">{s.stationName}</span>
                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                  s.crowdLevel === 'Low' ? 'bg-green-500/10 text-green-400 border border-green-500/15' :
                  s.crowdLevel === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/15' :
                  'bg-red-500/10 text-red-400 border border-red-500/15'
                }`}>
                  {s.crowdLevel}
                </span>
              </div>
              <p className="text-slate-500 text-xs flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {s.city}</p>
            </div>

            {/* Occupancy Indicator Bar */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Congestion load</span>
                <span className="font-bold text-white">{s.occupancy}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${s.occupancy}%`,
                    backgroundColor: s.crowdLevel === 'Low' ? '#10b981' : s.crowdLevel === 'Medium' ? '#eab308' : '#ef4444'
                  }}
                />
              </div>
            </div>

            {/* Details Footer */}
            <div className="flex justify-between items-center text-xs font-mono pt-4 border-t border-white/5">
              <span className="text-slate-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Next Train</span>
              <span className="text-indigo-400 font-bold">{s.nextTrainArrival}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetroCrowdPage;
