import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { SocketContext } from '../context/SocketContext';
import { Users, AlertTriangle, Send, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
  const { socket } = useContext(SocketContext);
  
  const [stations, setStations] = useState([]);
  const [buses, setBuses] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [trains, setTrains] = useState([]);
  const [logs, setLogs] = useState([]);

  // Form selectors
  const [targetType, setTargetType] = useState('station');
  const [targetStation, setTargetStation] = useState('');
  const [targetBus, setTargetBus] = useState('');
  const [targetCoach, setTargetCoach] = useState('');
  const [occupancy, setOccupancy] = useState(50);
  const [notifMessage, setNotifMessage] = useState('');

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [stationRes, busRes, trainRes, coachRes, logRes] = await Promise.all([
        API.get('/transit/stations'),
        API.get('/transit/buses'),
        API.get('/transit/trains'),
        API.get('/transit/coaches'),
        API.get('/admin/logs'),
      ]);
      
      setStations(stationRes.data.stations || []);
      setBuses(busRes.data.buses || []);
      setTrains(trainRes.data.trains || []);
      setCoaches(coachRes.data.coaches || []);
      setLogs(logRes.data.logs || []);

      if (stationRes.data.stations?.length > 0) setTargetStation(stationRes.data.stations[0]._id);
      if (busRes.data.buses?.length > 0) setTargetBus(busRes.data.buses[0]._id);
      if (coachRes.data.coaches?.length > 0) setTargetCoach(coachRes.data.coaches[0]._id);

    } catch (err) {
      console.error('Error fetching admin data', err);
    }
  };

  useEffect(() => {
    fetchData();

    // Listen to real-time events to push to logs instantly
    if (socket) {
      socket.on('station:update', () => loadLogs());
      socket.on('coach:update', () => loadLogs());
      socket.on('bus:update', () => loadLogs());
    }

    return () => {
      if (socket) {
        socket.off('station:update');
        socket.off('coach:update');
        socket.off('bus:update');
      }
    };
  }, [socket]);

  const loadLogs = async () => {
    try {
      const res = await API.get('/admin/logs');
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Occupancy Overrides
  const handleOverrideSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (targetType === 'station') {
        await API.post('/admin/station/occupancy', { stationId: targetStation, occupancy, status: 'Normal' });
      } else if (targetType === 'bus') {
        await API.post('/admin/bus/occupancy', { busId: targetBus, occupancy, status: 'On Time' });
      } else if (targetType === 'coach') {
        await API.post('/admin/coach/occupancy', { coachId: targetCoach, occupancy });
      }
      alert('Override broadcasted successfully.');
      fetchData();
    } catch (err) {
      alert('Error updating occupancy');
    } finally {
      setLoading(false);
    }
  };

  // Broadcast warning notices
  const handleAlertSubmit = async (e) => {
    e.preventDefault();
    if (!notifMessage.trim()) return;
    setLoading(true);
    try {
      await API.post('/notifications', { type: 'Delay', message: notifMessage, city: 'Bangalore' });
      alert('Warning alert broadcasted successfully.');
      setNotifMessage('');
    } catch (err) {
      alert('Error broadcasting alert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Admin Operations Console</h1>
        <p className="text-slate-500 text-xs font-mono uppercase mt-1">MANUAL OVERRIDES & REAL-TIME INCIDENT ALERTS</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left column: Manual Override Control panel */}
        <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" /> Transit Occupancy Overrides
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">MANUALLY FORCE CROWD PERCENTAGES</p>
          </div>

          <form onSubmit={handleOverrideSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-slate-400">SELECT ENTITY TYPE</label>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                {['station', 'bus', 'coach'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTargetType(t)}
                    className={`flex-1 text-xs capitalize py-2 rounded-lg font-medium transition-colors ${
                      targetType === t ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub dropdown choices */}
            {targetType === 'station' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-slate-400">SELECT STATION</label>
                <select
                  value={targetStation}
                  onChange={(e) => setTargetStation(e.target.value)}
                  className="bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {stations.map(s => (
                    <option key={s._id} value={s._id} className="bg-slate-900 text-white">{s.stationName} ({s.city})</option>
                  ))}
                </select>
              </div>
            )}

            {targetType === 'bus' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-slate-400">SELECT BUS NUMBER</label>
                <select
                  value={targetBus}
                  onChange={(e) => setTargetBus(e.target.value)}
                  className="bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {buses.map(b => (
                    <option key={b._id} value={b._id} className="bg-slate-900 text-white">{b.busNumber} (Route {b.routeNumber})</option>
                  ))}
                </select>
              </div>
            )}

            {targetType === 'coach' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-slate-400">SELECT TRAIN COACH</label>
                <select
                  value={targetCoach}
                  onChange={(e) => setTargetCoach(e.target.value)}
                  className="bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {coaches.map(c => (
                    <option key={c._id} value={c._id} className="bg-slate-900 text-white">{c.trainNumber} - Coach {c.coachNumber}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>OCCUPANCY VALUE</span>
                <span className="text-white font-bold">{occupancy}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={occupancy}
                onChange={(e) => setOccupancy(Number(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 text-xs font-semibold transition-colors mt-2"
            >
              <RefreshCw className="w-4 h-4" /> Broadcast Override Updates
            </button>
          </form>

          {/* Broadcast Incident Warnings */}
          <div className="border-t border-white/5 pt-6 flex flex-col gap-4">
            <div>
              <h4 className="text-white font-bold text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Broadcast Service Interruption Notice
              </h4>
            </div>
            <form onSubmit={handleAlertSubmit} className="flex flex-col gap-3">
              <textarea
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                placeholder="Alert text, e.g. Route 500C experiencing delays due to road traffic..."
                className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 min-h-[60px]"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full bg-amber-600 hover:bg-amber-500 text-white rounded-xl py-3 text-xs font-semibold transition-colors"
              >
                <Send className="w-3.5 h-3.5" /> Post Service Delay Alert
              </button>
            </form>
          </div>
        </div>

        {/* Right column: Audit logs */}
        <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Console Audit Logs</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">HISTORICAL AUDIT STREAM OF OPERATIONAL ADJUSTMENTS</p>
          </div>

          <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-2">
            {logs.length === 0 ? (
              <p className="text-slate-500 text-xs font-mono text-center py-12">No operations logged.</p>
            ) : (
              logs.map(log => (
                <div key={log._id} className="bg-white/5 border border-white/5 p-3.5 rounded-xl flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-slate-300 font-medium">{log.action}</p>
                    <span className="text-[10px] text-slate-500 font-mono">Operator: {log.adminEmail}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
