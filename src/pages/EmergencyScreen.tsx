import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, AlertTriangle, Search, Loader2, Plus, Shield, Phone } from 'lucide-react';
import { getEmergencyInfo, TripData } from '../lib/gemini';

export default function EmergencyScreen() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [emergency, setEmergency] = useState<TripData['emergency'] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!location) return;

    setLoading(true);
    try {
      const data = await getEmergencyInfo(location);
      setEmergency(data);
    } catch (error) {
      console.error("Failed to fetch emergency info", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1E293B] text-white overflow-hidden">
      <div className="px-6 py-6 flex items-center gap-4 bg-[#1E293B] z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-800 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Emergency Info</h1>
      </div>

      <div className="px-6 pb-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city or location"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-400 rounded-lg text-slate-900 hover:bg-cyan-500 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24">
        {emergency && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Plus size={24} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-white">Nearest Hospital</h3>
                <p className="text-slate-400 text-sm">{emergency.hospital}</p>
              </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Shield size={24} className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-white">Police Station</h3>
                <p className="text-slate-400 text-sm">{emergency.police}</p>
              </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Phone size={24} className="text-green-500" />
              </div>
              <div>
                <h3 className="font-bold text-white">Emergency Helpline</h3>
                <p className="text-slate-400 text-sm">{emergency.helpline}</p>
              </div>
            </div>
          </motion.div>
        )}
        
        {!emergency && !loading && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <AlertTriangle size={48} className="mb-4 opacity-20" />
            <p>Search for a location to see emergency info</p>
          </div>
        )}
      </div>
    </div>
  );
}
