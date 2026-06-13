import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const CrowdAnalyticsPage = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [stationPie, setStationPie] = useState([]);
  const [busPie, setBusPie] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get('/analytics');
        setWeeklyData(res.data.weeklyTrend || []);
        setStationPie(res.data.stationOccupancy || []);
        setBusPie(res.data.busOccupancy || []);
      } catch (err) {
        console.error('Error fetching analytics details', err);
      }
    };
    fetchAnalytics();
  }, []);

  const COLORS = ['#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#a78bfa'];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Crowd Analytics</h1>
        <p className="text-slate-500 text-xs font-mono uppercase mt-1">HISTORICAL AND WEEKLY DENSITY CHARTS</p>
      </div>

      {/* Weekly Trends BarChart */}
      <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Weekly Transit Mode Contrast</h3>
          <p className="text-xs text-slate-500 font-mono mt-0.5">COMPARING AVERAGE LOAD OF METRO VS BUS ROUTES</p>
        </div>
        <div className="h-72 mt-4">
          {weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }} />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar dataKey="metro" fill="#6366f1" radius={[4, 4, 0, 0]} name="Metro Occupancy" />
                <Bar dataKey="bus" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Bus Occupancy" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-xs font-mono py-16 text-center">Loading analytics data...</p>
          )}
        </div>
      </div>

      {/* Pie Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most crowded Metro Stations */}
        <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Overcrowded Stations Breakdown</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">TOP 5 BUSIEST HUBS</p>
          </div>
          <div className="h-64 mt-4 flex items-center justify-center">
            {stationPie.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stationPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={(props) => (props && props.name) ? `${props.name} (${((props.percent || 0) * 100).toFixed(0)}%)` : ''}
                  >
                    {stationPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500 text-xs font-mono text-center">No station metrics available.</p>
            )}
          </div>
        </div>

        {/* Most crowded Bus lines */}
        <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Overcrowded Bus Routes</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">TOP 5 CONGESTED BUS NUMBERS</p>
          </div>
          <div className="h-64 mt-4 flex items-center justify-center">
            {busPie.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={busPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={(props) => (props && props.name) ? `Bus ${props.name} (${((props.percent || 0) * 100).toFixed(0)}%)` : ''}
                  >
                    {busPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500 text-xs font-mono text-center">No bus metrics available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrowdAnalyticsPage;
