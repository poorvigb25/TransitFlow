import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { SocketContext } from '../context/SocketContext';
import { Bell, AlertTriangle } from 'lucide-react';

const NotificationsPage = () => {
  const { socket } = useContext(SocketContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get('/notifications');
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error('Error fetching notifications list', err);
      }
    };
    fetchNotifications();

    if (socket) {
      socket.on('notification:new', (newNotif) => {
        setNotifications((prev) => [newNotif, ...prev]);
      });
    }

    return () => {
      if (socket) socket.off('notification:new');
    };
  }, [socket]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Alerts Feed</h1>
        <p className="text-slate-500 text-xs font-mono uppercase mt-1">REAL-TIME SERVICE WARNINGS & NOTICES</p>
      </div>

      <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col gap-4">
        {notifications.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center justify-center gap-3 text-slate-500 font-mono">
            <Bell className="w-10 h-10 text-slate-600 animate-bounce" />
            <p>No active service announcements reported.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {notifications.map((n) => (
              <div
                key={n._id}
                className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-start gap-4 transition-all hover:bg-white/10"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-400">{n.city} Transit Authority</span>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-white text-sm leading-relaxed mt-1 font-medium">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
