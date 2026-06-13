import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Star, Mail, ShieldAlert, Award } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await API.get('/transit/favorites');
        setFavorites(res.data.favorites || []);
      } catch (err) {
        console.error('Error fetching favorites list', err);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">My Profile</h1>
        <p className="text-slate-500 text-xs font-mono uppercase mt-1">USER CARD & FAVORITES PREFERENCES</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col gap-6 items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-extrabold text-white text-4xl shadow-xl shadow-indigo-500/20 uppercase">
            {user?.name?.substring(0, 2)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{user?.name}</h3>
            <p className="text-slate-500 text-xs font-mono capitalize mt-1 flex items-center justify-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" /> {user?.role} Account
            </p>
          </div>

          <div className="w-full flex flex-col gap-3 border-t border-white/5 pt-6 text-left">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-mono uppercase">EMAIL ADDRESS</span>
              <span className="text-white font-medium flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {user?.email}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-mono uppercase">MEMBER LEVEL</span>
              <span className="text-white font-medium flex items-center gap-1"><Award className="w-3.5 h-3.5 text-cyan-400" /> Gold Commuter</span>
            </div>
          </div>
        </div>

        {/* Favorites list */}
        <div className="glass p-8 rounded-3xl border border-white/5 lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /> Saved Favorites
          </h3>
          <p className="text-xs text-slate-500 font-mono uppercase mt-0.5">QUICK ACCESS TRANSIT SHORTCUTS</p>

          <div className="flex flex-col gap-3 mt-4">
            {favorites.length === 0 ? (
              <p className="text-slate-500 text-xs font-mono py-12 text-center">No favorited routes or stations saved.</p>
            ) : (
              favorites.map((fav) => (
                <div key={fav._id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{fav.type === 'station' ? '🚉' : '🚌'}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{fav.name}</p>
                      <p className="text-xs text-slate-500 font-mono capitalize">{fav.type}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
