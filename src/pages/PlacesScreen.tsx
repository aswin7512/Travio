import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Star, Search, Loader2 } from 'lucide-react';

export default function PlacesScreen() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [places, setPlaces] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!location) return;

    setLoading(true);
    try {
      const { getPlaces } = await import('../lib/gemini');
      const data = await getPlaces(location);
      
      // 🛡️ SMART MAPPING: Ensure we always have an array
      const placesArray = Array.isArray(data) ? data : (data?.places || data?.places_to_visit || []);
      setPlaces(placesArray);
    } catch (error) {
      console.error("Failed to fetch places", error);
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
        <h1 className="text-xl font-bold">Explore Places</h1>
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
        {places && places.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {places.map((place: any, index: number) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4">
                  <div className="w-8 h-8 bg-cyan-400/10 rounded-full flex items-center justify-center">
                    <MapPin size={16} className="text-cyan-400" />
                  </div>
                </div>
                
                <h3 className="font-bold text-lg mb-1 pr-10">{place?.name || "Location"}</h3>
                <div className="flex items-center gap-1 mb-3">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-slate-300 text-xs">{place?.rating || "N/A"} / 5</span>
                </div>
                
                <p className="text-slate-400 text-sm leading-relaxed">
                  {place?.description || "No description available."}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {places && places.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <p>No places found for this location. Please try again.</p>
          </div>
        )}
        
        {!places && !loading && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <MapPin size={48} className="mb-4 opacity-20" />
            <p>Search for a location to explore</p>
          </div>
        )}
      </div>
    </div>
  );
}