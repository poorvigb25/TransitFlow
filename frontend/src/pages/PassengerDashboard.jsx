import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { SocketContext } from '../context/SocketContext';
import { Train, Bus, AlertTriangle, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PassengerDashboard = () => {
  const { socket } = useContext(SocketContext);
  const [stats, setStats] = useState({
    stationsCount: 0,
    busesCount: 0,
    alertsCount: 0,
    averageOccupancy: 0,
  });
  const [alerts, setAlerts] = useState([]);
  const [graphData, setGraphData] = useState([]);

  const fetchData = async () => {
    try {
      const [stationsRes, busesRes, notifRes, analyticsRes] = await Promise.all([
        API.get('/transit/stations'),
        API.get('/transit/buses'),
        API.get('/notifications'),
        API.get('/analytics'),
      ]);

      const stations = stationsRes.data.stations || [];
      const buses = busesRes.data.buses || [];
      const notifs = notifRes.data.notifications || [];

      // Calculate average occupancy
      const totalOcc = [...stations, ...buses].reduce((s, x) => s + (x.occupancy || 0), 0);
      const avgOcc = Math.round(totalOcc / (stations.length + buses.length || 1));

      setStats({
        stationsCount: stations.length,
        busesCount: buses.length,
        alertsCount: notifs.length,
        averageOccupancy: avgOcc,
      });

      setAlerts(notifs.slice(0, 4));
      setGraphData(analyticsRes.data.dailyTrend || []);
    } catch (err) {
      console.error('Error loading dashboard metrics', err);
    }
  };

  useEffect(() => {
    fetchData();

    // Listen to real-time events to update stats
    if (socket) {
      socket.on('station:update', () => fetchData());
      socket.on('bus:update', () => fetchData());
      socket.on('notification:new', (notif) => {
        setAlerts(prev => [notif, ...prev.slice(0, 3)]);
        setStats(prev => ({ ...prev, alertsCount: prev.alertsCount + 1 }));
      });
    }

    return () => {
      if (socket) {
        socket.off('station:update');
        socket.off('bus:update');
        socket.off('notification:new');
      }
    };
  }, [socket]);

  const cards = [
    { label: 'Metro Stations Active', value: stats.stationsCount, icon: Train, color: 'text-violet-400 bg-violet-500/10 border-violet-500/10' },
    { label: 'Active Buses Monitored', value: stats.busesCount, icon: Bus, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/10' },
    { label: 'Average Occupancy Load', value: `${stats.averageOccupancy}%`, icon: Users, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/10' },
    { label: 'Service Alerts Posted', value: stats.alertsCount, icon: AlertTriangle, color: 'text-red-400 bg-red-500/10 border-red-500/10' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Dashboard Overview</h1>
        <p className="text-slate-500 text-xs font-mono uppercase mt-1">COMMUTER COMMAND DECK & ANALYTICS</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <span className="text-slate-400 text-sm font-medium">{c.label}</span>
              <span className="text-3xl font-bold text-white tracking-tight">{c.value}</span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${c.color}`}>
              <c.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recharts Daily Trends */}
        <div className="glass p-6 rounded-3xl border border-white/5 lg:col-span-2 flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">System Capacity Peak Trends</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">DAILY AVERAGE COMMUTER CONGESTION LEVELS</p>
          </div>
          <div className="h-64 mt-4">
            {graphData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOcc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="occupancy" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOcc)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500 text-xs font-mono py-16 text-center">Loading trend charts...</p>
            )}
          </div>
        </div>

        {/* Right: Live Updates Feed */}
        <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Service Disruption Bulletins</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">REAL-TIME TRANSIT UPDATES</p>
          </div>

          <div className="flex flex-col gap-3.5 mt-2">
            {alerts.length === 0 ? (
              <p className="text-slate-500 text-sm py-8 text-center font-mono">No warnings reported.</p>
            ) : (
              alerts.map((a) => (
                <div key={a._id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      a.type === 'Delay' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15' : 'bg-red-500/10 text-red-400 border border-red-500/15'
                    }`}>
                      {a.type}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-normal">{a.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDashboard;
