import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Bed, Star, Search, Loader2 } from 'lucide-react';
import { getHotels, TripData } from '../lib/gemini';

export default function HotelsScreen() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [hotels, setHotels] = useState<TripData['hotels'] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!location) return;

    setLoading(true);
    try {
      const data = await getHotels(location);
      setHotels(data);
    } catch (error) {
      console.error("Failed to fetch hotels", error);
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
        <h1 className="text-xl font-bold">Find Hotels</h1>
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
        {hotels && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {hotels.map((hotel, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center shrink-0">
                      <Bed size={20} className="text-cyan-400" />
                    </div>
                    <h3 className="font-bold text-lg leading-tight">{hotel.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-md shrink-0">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 text-xs font-bold">{hotel.rating}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4 pl-13">
                  {hotel.amenities.slice(0, 3).map((amenity, i) => (
                    <span key={i} className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded-md">
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-700/50 pl-13">
                  <span className="text-slate-400 text-xs">per night</span>
                  <span className="text-xl font-bold">₹{hotel.pricePerNight.toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {!hotels && !loading && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Bed size={48} className="mb-4 opacity-20" />
            <p>Search for a location to see hotels</p>
          </div>
        )}
      </div>
    </div>
  );
}
