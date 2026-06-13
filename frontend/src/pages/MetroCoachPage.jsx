import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { SocketContext } from '../context/SocketContext';
import { Train } from 'lucide-react';

const MetroCoachPage = () => {
  const { socket } = useContext(SocketContext);
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const res = await API.get('/transit/trains');
        setTrains(res.data.trains || []);
        if (res.data.trains && res.data.trains.length > 0 && !selectedTrain) {
          setSelectedTrain(res.data.trains[0].trainNumber);
        }
      } catch (err) {
        console.error('Error fetching trains', err);
      }
    };
    fetchTrains();

    if (socket) {
      socket.on('train:update', (updatedTrain) => {
        setTrains((prev) =>
          prev.map((t) => (t._id === updatedTrain._id ? updatedTrain : t))
        );
      });
    }

    return () => {
      if (socket) socket.off('train:update');
    };
  }, [socket]);

  useEffect(() => {
    if (!selectedTrain) return;
    const fetchCoaches = async () => {
      try {
        const res = await API.get(`/transit/coaches?trainNumber=${selectedTrain}`);
        setCoaches(res.data.coaches || []);
      } catch (err) {
        console.error('Error fetching coaches', err);
      }
    };
    fetchCoaches();

    if (socket) {
      socket.on('coach:update', (updatedCoach) => {
        if (updatedCoach.trainNumber === selectedTrain) {
          setCoaches((prev) =>
            prev.map((c) => (c.coachNumber === updatedCoach.coachNumber ? updatedCoach : c))
          );
        }
      });
    }

    return () => {
      if (socket) socket.off('coach:update');
    };
  }, [selectedTrain, socket]);

  const trainDetails = trains.find(t => t.trainNumber === selectedTrain);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Metro Coach Occupancy</h1>
        <p className="text-slate-500 text-xs font-mono uppercase mt-1">VISUAL COMPARTMENT OVERCROWDING MAP</p>
      </div>

      {/* Train Selector */}
      <div className="flex gap-3 overflow-x-auto pb-2 border-b border-white/5">
        {trains.map((t) => (
          <button
            key={t._id}
            onClick={() => setSelectedTrain(t.trainNumber)}
            className={`flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-medium transition-all ${
              selectedTrain === t.trainNumber
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                : 'glass text-slate-400 hover:text-white'
            }`}
          >
            <Train className="w-4 h-4" />
            <span>{t.trainNumber} ({t.lineName})</span>
          </button>
        ))}
      </div>

      {trainDetails && (
        <div className="flex flex-col gap-6">
          {/* Active Train Meta Cards */}
          <div className="glass p-6 rounded-2xl border border-white/5 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: trainDetails.lineColor }} />
              <div>
                <h4 className="text-white font-bold text-lg">{trainDetails.trainNumber}</h4>
                <p className="text-slate-500 text-xs font-mono">{trainDetails.direction}</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex flex-col text-right">
                <span className="text-xs text-slate-500 font-mono">CURRENT STATION</span>
                <span className="text-white font-semibold text-sm">{trainDetails.currentStation}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs text-slate-500 font-mono">AVG TRAIN OCCUPANCY</span>
                <span className="text-white font-bold text-sm">{trainDetails.occupancy}% ({trainDetails.crowdLevel})</span>
              </div>
            </div>
          </div>

          {/* Visual Coaches View */}
          <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col gap-8">
            <h3 className="text-lg font-bold text-white">Visual Compartment Crowd Map</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
              {coaches.map((c) => (
                <div
                  key={c._id}
                  className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col items-center gap-4 relative overflow-hidden transition-all hover:bg-white/10"
                >
                  <span className="text-slate-500 font-mono text-xs">COACH {c.coachNumber}</span>
                  
                  {/* Visual occupancy bar graphic */}
                  <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-sm"
                    style={{
                      borderColor: c.crowdLevel === 'Low' ? '#10b981' : c.crowdLevel === 'Medium' ? '#eab308' : '#ef4444',
                      color: c.crowdLevel === 'Low' ? '#10b981' : c.crowdLevel === 'Medium' ? '#eab308' : '#ef4444'
                    }}
                  >
                    {c.occupancy}%
                  </div>

                  <span className="text-xs font-semibold text-white capitalize">{c.crowdLevel}</span>
                </div>
              ))}
            </div>

            {/* Platform legend info */}
            <div className="flex justify-center items-center gap-6 text-xs text-slate-500 border-t border-white/5 pt-6 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span>Low: 0-30%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span>Medium: 31-70%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>High: 71-100%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetroCoachPage;
