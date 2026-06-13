import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Navigation, Activity, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#060713] text-slate-100 flex flex-col font-sans">
      {/* Top Banner Navbar */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 text-lg">
            M
          </div>
          <span className="text-xl font-bold tracking-tight text-white">MetroConnect</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
            Sign In
          </Link>
          <Link to="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-indigo-600/20">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Module */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex-1 grid md:grid-cols-2 gap-12 items-center z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-indigo-400 text-xs font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Hackathon Winner - Public Crowd Intelligence
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Commute Smarter, <br />
            <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Avoid the Crowd.
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-lg">
            MetroConnect is a real-time transit crowd intelligence platform. View metro coach occupancy, bus load levels, and station congestion before you leave your doorstep.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Link to="/register" className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-7 py-4 rounded-xl font-medium transition-all duration-200 shadow-xl shadow-indigo-600/20">
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Feature Visual Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative glass rounded-3xl p-8 border border-white/5 shadow-2xl overflow-hidden"
        >
          {/* Card Overlays */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
            <Activity className="w-5 h-5 text-indigo-400 animate-pulse" /> Live Crowd Feeds
          </h3>

          <div className="flex flex-col gap-4">
            {/* Station row card */}
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚉</span>
                <div>
                  <p className="text-sm font-semibold text-white">Majestic Metro Station</p>
                  <p className="text-xs text-slate-500 font-mono">Platform 1 & 2</p>
                </div>
              </div>
              <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-2.5 py-1 rounded-full">
                85% (High Crowd)
              </span>
            </div>

            {/* Coach row card */}
            <div className="flex flex-col bg-white/5 p-4 rounded-2xl border border-white/5 gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚇</span>
                  <div>
                    <p className="text-sm font-semibold text-white">MTR-BLR-P01 Train</p>
                    <p className="text-xs text-slate-500 font-mono">Purple Line</p>
                  </div>
                </div>
                <span className="text-xs text-indigo-400 font-mono font-medium">Coach Load Map</span>
              </div>
              <div className="grid grid-cols-6 gap-1.5 h-6">
                <div className="bg-green-500/30 border border-green-500/40 rounded flex items-center justify-center text-[9px] text-green-300 font-mono font-bold">L</div>
                <div className="bg-green-500/30 border border-green-500/40 rounded flex items-center justify-center text-[9px] text-green-300 font-mono font-bold">L</div>
                <div className="bg-yellow-500/30 border border-yellow-500/40 rounded flex items-center justify-center text-[9px] text-yellow-300 font-mono font-bold">M</div>
                <div className="bg-yellow-500/30 border border-yellow-500/40 rounded flex items-center justify-center text-[9px] text-yellow-300 font-mono font-bold">M</div>
                <div className="bg-red-500/30 border border-red-500/40 rounded flex items-center justify-center text-[9px] text-red-300 font-mono font-bold">H</div>
                <div className="bg-red-500/30 border border-red-500/40 rounded flex items-center justify-center text-[9px] text-red-300 font-mono font-bold">H</div>
              </div>
            </div>

            {/* Bus row card */}
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚌</span>
                <div>
                  <p className="text-sm font-semibold text-white">Bus 500C Express</p>
                  <p className="text-xs text-slate-500 font-mono">ETA 4 Mins</p>
                </div>
              </div>
              <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold px-2.5 py-1 rounded-full">
                22% (Low Crowd)
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Grid Features */}
      <section className="bg-white/3 border-y border-white/5 py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Enterprise Grade Crowd Intel Features
            </h2>
            <p className="text-slate-400 mt-2 max-w-xl mx-auto text-sm">
              We go beyond navigation. We analyze occupancy and distribute commuter loads efficiently.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Coach-Level Density', desc: 'See which specific metro compartment is empty before boarding. Get direct indicators on the platform.', icon: ShieldCheck },
              { title: 'Heatmap Overlay Layers', desc: 'Review the high-load bottlenecks in your city live on our interactive transit dashboard.', icon: Navigation },
              { title: 'Real-time WebSocket Push', desc: 'No refreshes required. Commuter boards and exits adjust metrics instantly across dashboards.', icon: Activity }
            ].map((f, i) => (
              <div key={i} className="glass p-8 rounded-2xl border border-white/5 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <f.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">{f.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#060713] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">M</div>
            <span>MetroConnect &copy; 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
